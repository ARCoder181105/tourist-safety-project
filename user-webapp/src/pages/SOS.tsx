import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { triggerSOSOnChain } from '../lib/blockchain';
import { sendSOSPacket } from '../lib/api';
import { getPolicePublicKey, encryptHybrid } from '../lib/encryption';

import { Box, Button, CircularProgress, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';

const SosPage = () => {
    const [loading, setLoading] = useState(false);
    const { signer, account, credentials } = useAuth();
    const { location, startSharing } = useLocation();
    const { enqueueSnackbar } = useSnackbar();

    const handleSOS = async () => {
        if (!window.confirm("Are you sure you want to send an SOS? This will share your location and registered credentials with authorities and create a permanent record on the blockchain.")) {
            return;
        }

        if (!signer || !account) return enqueueSnackbar("Wallet not connected properly.", { variant: "error" });
        if (!location) return enqueueSnackbar("Could not get your current location.", { variant: "error" });
        if (!credentials) return enqueueSnackbar("User credentials not found.", { variant: "error" });

        setLoading(true);
        try {
            const incident = {
                type: 'SOS Activation',
                description: 'User triggered SOS from the web application.',
            };

            const efirDataToEncrypt = {
                credentials,
                location: { latitude: location.latitude, longitude: location.longitude },
                incidentType: incident.type,
                description: incident.description,
                timestamp: Date.now(),
            };

            const policePublicKey = getPolicePublicKey();
            const encryptedData = encryptHybrid(efirDataToEncrypt, policePublicKey);
            const reportHash = ethers.keccak256(ethers.toUtf8Bytes(encryptedData));

            const txHash = await triggerSOSOnChain(signer, reportHash);

            await sendSOSPacket({
                txHash,
                reportHash,
                location: { latitude: location.latitude, longitude: location.longitude },
                incidentType: incident.type,
                description: incident.description,
                encryptedData,
            });

            startSharing();

            enqueueSnackbar("SOS Alert Sent! Your location is now being shared live.", { variant: "success" });
        } catch (error) {
            console.error("SOS Workflow failed:", error);
            enqueueSnackbar("SOS Failed: " + error.message, { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9f9f9',
                p: 2,
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <Paper elevation={6} sx={{ p: 4, borderRadius: 3, maxWidth: 400, textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography variant="h5" color="primary" gutterBottom fontWeight="medium">
                            Our personal information is in safer hands
                        </Typography>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Typography variant="h4" color="error" gutterBottom fontWeight="bold">
                            Emergency SOS
                        </Typography>

                        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                            Press the button below ONLY in a real, life-threatening emergency. This action will be recorded on the blockchain and will share your location and registered credentials with authorities.
                        </Typography>

                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleSOS}
                                disabled={loading}
                                sx={{
                                    width: 150,
                                    height: 150,
                                    borderRadius: '50%',
                                    fontSize: '1.5rem',
                                    boxShadow: 3,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {loading ? <CircularProgress size={32} color="inherit" /> : "SOS"}
                            </Button>
                        </motion.div>

                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Typography variant="body2" color="primary" sx={{ mt: 2, fontWeight: 'medium' }}>
                                    Processing... Please check MetaMask and confirm the transaction.
                                </Typography>
                            </motion.div>
                        )}
                    </motion.div>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default SosPage;
