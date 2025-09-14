import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { Box, Button, Typography, AppBar, Toolbar, CircularProgress, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const containerStyle = { width: '100%', height: '100%' };

const DashboardPage = () => {
    const { account, logout } = useAuth();
    const { location, isSharing, startSharing, stopSharing, errorMsg } = useLocation();

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    });

    if (!isLoaded || !location) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f9f9f9' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>
                    {errorMsg || "Loading map and location..."}
                </Typography>
            </Box>
        );
    }

    const center = {
        lat: location.latitude,
        lng: location.longitude
    };

    const handleToggleSharing = () => {
        if (isSharing) {
            stopSharing();
        } else {
            if (window.confirm("This will continuously share your location with authorities. Proceed?")) {
                startSharing();
            }
        }
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static" sx={{ bgcolor: 'white', color: 'black', boxShadow: 1 }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="bold">
                        Sentinel Dashboard
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant={isSharing ? "contained" : "outlined"}
                                color={isSharing ? "warning" : "success"}
                                onClick={handleToggleSharing}
                                size="small"
                            >
                                {isSharing ? 'Stop Live Sharing' : 'Share Location Live'}
                            </Button>
                        </motion.div>
                        <Typography variant="body2" sx={{ minWidth: '100px' }}>
                            Connected: {account ? `${account.substring(0, 6)}...` : 'N/A'}
                        </Typography>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="contained" color="error" onClick={logout} size="small">
                                Logout
                            </Button>
                        </motion.div>
                    </Box>
                </Toolbar>
            </AppBar>
            <Paper sx={{ flexGrow: 1, m: 2, borderRadius: 3, overflow: 'hidden' }} elevation={3}>
                <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
                    <Marker position={center} />
                </GoogleMap>
            </Paper>
        </Box>
    );
};

export default DashboardPage;
