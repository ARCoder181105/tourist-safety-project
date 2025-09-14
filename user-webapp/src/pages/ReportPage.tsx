import React, { useState, useRef } from 'react';
import { submitHazardReport } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';

const ReportPage = () => {
    const [incidentType, setIncidentType] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!incidentType || !description) {
            enqueueSnackbar("Please fill out all fields.", { variant: "warning" });
            return;
        }
        
        setLoading(true);
        try {
            const location = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => resolve(position.coords),
                    (error) => reject(error)
                );
            });

            const reportData = {
                incidentType,
                description,
                location: {
                    latitude: location.latitude,
                    longitude: location.longitude
                },
                file,
            };

            await submitHazardReport(reportData);

            enqueueSnackbar("Report submitted successfully. Thank you!", { variant: "success" });
            navigate('/dashboard');
        } catch (error) {
            enqueueSnackbar("Failed to submit report: " + error.message, { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const openCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            setStream(mediaStream);
            setCameraOpen(true);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            enqueueSnackbar("Camera access denied or not available.", { variant: "error" });
        }
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                const imageFile = new File([blob], "captured_photo.png", { type: "image/png" });
                setFile(imageFile);
                enqueueSnackbar("Photo captured successfully.", { variant: "success" });
            }, 'image/png');
            stopCamera();
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setCameraOpen(false);
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9', p: 2 }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 500, width: '100%' }} elevation={6}>
                    <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" textAlign="center">
                        Report a Hazard
                    </Typography>
                    <Typography variant="body1" color="textSecondary" textAlign="center" sx={{ mb: 3 }}>
                        Help us by reporting incidents in your area. Your input makes communities safer.
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Type of Incident"
                            placeholder="e.g., Roadblock, Flood, Protest"
                            value={incidentType}
                            onChange={(e) => setIncidentType(e.target.value)}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Description"
                            placeholder="Describe what you see..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                            required
                        />

                        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mb: 3 }}>
                            <Button
                                variant="contained"
                                component="label"
                                fullWidth
                            >
                                Upload from Files
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={openCamera}
                                fullWidth
                            >
                                Use Camera
                            </Button>
                        </Box>

                        {file && (
                            <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
                                Selected file: {file.name}
                            </Typography>
                        )}

                        {cameraOpen && (
                            <Box sx={{ textAlign: 'center', mb: 3 }}>
                                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '8px' }} />
                                <Button variant="contained" onClick={capturePhoto} sx={{ mt: 2 }}>
                                    Capture Photo
                                </Button>
                                <Button variant="text" onClick={stopCamera} sx={{ mt: 1 }}>
                                    Cancel
                                </Button>
                                <canvas ref={canvasRef} style={{ display: 'none' }} />
                            </Box>
                        )}

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                                size="large"
                                sx={{ py: 1.5 }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Report"}
                            </Button>
                        </motion.div>
                    </form>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default ReportPage;
