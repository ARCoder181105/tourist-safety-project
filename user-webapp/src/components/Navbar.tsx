import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Button, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { account, logout, connectWallet, loading } = useAuth();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navLinks = [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/sos', label: 'SOS' },
        { to: '/report', label: 'Report' }
    ];

    const toggleDrawer = () => {
        setDrawerOpen(prev => !prev);
    };

    return (
        <AppBar position="static" sx={{ bgcolor: 'primary.dark' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
                    🛡️ Sentinel
                </Typography>

                {account && (
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                        {navLinks.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                style={({ isActive }) => ({
                                    textDecoration: 'none',
                                    color: isActive ? '#fff' : '#ccc',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    backgroundColor: isActive ? '#1976d2' : 'transparent'
                                })}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {account ? (
                        <>
                            <Typography variant="body2" sx={{ bgcolor: 'primary.main', px: 2, py: 0.5, borderRadius: 5 }}>
                                {account.substring(0, 6)}...{account.substring(account.length - 4)}
                            </Typography>
                            <Button variant="contained" color="error" onClick={logout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button variant="contained" color="secondary" onClick={connectWallet} disabled={loading}>
                            {loading ? "Connecting..." : "Connect Wallet"}
                        </Button>
                    )}

                    {/* Custom Hamburger Icon for mobile */}
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        <div onClick={toggleDrawer} style={{ cursor: 'pointer', width: '30px', height: '24px', position: 'relative' }}>
                            <span style={{
                                position: 'absolute',
                                height: '4px',
                                width: '100%',
                                backgroundColor: '#fff',
                                borderRadius: '2px',
                                top: drawerOpen ? '10px' : '4px',
                                transform: drawerOpen ? 'rotate(45deg)' : 'rotate(0)',
                                transition: '0.3s ease'
                            }} />
                            <span style={{
                                position: 'absolute',
                                height: '4px',
                                width: '100%',
                                backgroundColor: '#fff',
                                borderRadius: '2px',
                                top: '10px',
                                opacity: drawerOpen ? 0 : 1,
                                transition: '0.3s ease'
                            }} />
                            <span style={{
                                position: 'absolute',
                                height: '4px',
                                width: '100%',
                                backgroundColor: '#fff',
                                borderRadius: '2px',
                                top: drawerOpen ? '10px' : '16px',
                                transform: drawerOpen ? 'rotate(-45deg)' : 'rotate(0)',
                                transition: '0.3s ease'
                            }} />
                        </div>
                    </Box>
                </Box>

                {/* Custom Drawer for Mobile */}
                <AnimatePresence>
                    {drawerOpen && (
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                right: 0,
                                height: '100%',
                                width: '250px',
                                backgroundColor: '#1976d2',
                                color: '#fff',
                                boxShadow: '-2px 0 8px rgba(0,0,0,0.3)',
                                zIndex: 1300
                            }}
                        >
                            <List>
                                {navLinks.map(link => (
                                    <ListItem button key={link.to} component={NavLink} to={link.to} onClick={toggleDrawer}>
                                        <ListItemText primary={link.label} />
                                    </ListItem>
                                ))}
                                <ListItem button onClick={() => { logout(); toggleDrawer(); }}>
                                    <ListItemText primary="Logout" />
                                </ListItem>
                            </List>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
