import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Box, Container, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const MainLayout = () => {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                        <Outlet />
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default MainLayout;
