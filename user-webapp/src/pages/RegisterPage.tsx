import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { createWallet } from '../lib/blockchain';
import { saveItem } from '../lib/storage';
import { getPolicePublicKey, encryptHybrid } from '../lib/encryption';

import { Box, Button, Paper, TextField, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [passport, setPassport] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { location } = useLocation();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!location) {
                return alert("Could not get your current location. Please enable location services and try again.");
            }

            const credentials = { name, passport };
            const policePublicKey = getPolicePublicKey();
            const encryptedCredentials = encryptHybrid(credentials, policePublicKey);

            const wallet = createWallet();

            await api.post('/auth/register', {
                walletAddress: wallet.address,
                encryptedCredentials,
                location: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                },
            });

            alert("Registration successful! Logging you in...");

            await saveItem('privateKey', wallet.privateKey);

            const nonceRes = await api.get(`/auth/nonce/${wallet.address}`);
            const { nonce } = nonceRes.data;
            const signature = await wallet.instance.signMessage(nonce);
            const loginRes = await api.post('/auth/login', { walletAddress: wallet.address, signature });

            await login(loginRes.data.token, credentials);

            navigate('/dashboard', { replace: true });

        } catch (error) {
            alert("Registration Failed: " + (error.response?.data?.msg || error.message));
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
                backgroundColor: '#ffffff',
                p: 2,
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Paper elevation={8} sx={{ p: 4, borderRadius: 3, width: 400 }}>
                    <Typography variant="h4" align="center" gutterBottom color="primary">
                        Complete Registration
                    </Typography>
                    <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
                        Create your secure, decentralized ID to access the platform.
                    </Typography>
                    <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Full Name"
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Passport Number"
                            variant="outlined"
                            value={passport}
                            onChange={(e) => setPassport(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            sx={{ py: 1.5 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
                        </Button>
                    </Box>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default RegisterPage;
