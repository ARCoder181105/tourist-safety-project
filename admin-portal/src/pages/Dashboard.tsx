import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, FileText, TriangleAlert } from 'lucide-react';
import { getDashboardStats } from '../services/dashboardService';
import { getAllUsers } from '../services/userService';
import { useSocket } from '../context/SocketContext';
import MapView from '../components/MapView';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const StatCard = ({ title, value, icon: Icon }: {title: string, value: number, icon: React.ElementType}) => (
    <MotionCard
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        sx={{ display: 'flex', alignItems: 'center', p: 3, borderRadius: 3, boxShadow: 3 }}
    >
        <Box sx={{ mr: 2, p: 2, bgcolor: 'primary.light', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon className="w-6 h-6 text-primary.main" />
        </Box>
        <Box>
            <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
            <Typography variant="h5" fontWeight="bold">{value}</Typography>
        </Box>
    </MotionCard>
);

const DashboardPage = () => {
  const [stats, setStats] = useState({ activeUsers: 0, activeSOS: 0, hazardReports: 0, dangerZones: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const socket = useSocket();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
        setStats(prevStats => ({ ...prevStats, activeUsers: usersData.length }));
      } catch (error) {
        console.error("Failed to refresh user locations:", error);
      }
    };

    fetchAllUsers();
    getDashboardStats().then(statsData => setStats(prevStats => ({...prevStats, ...statsData})));

    const intervalId = setInterval(fetchAllUsers, 30000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (socket) {
      const handleLocationUpdate = (update: any) => {
        setUsers(prevUsers => prevUsers.map(user => user._id === update._id ? { ...user, lastLocation: update.lastLocation } : user));
      };
      
      const handleNewSOS = (newSos: any) => {
        setStats(prevStats => ({ ...prevStats, activeSOS: prevStats.activeSOS + 1 }));
      };
      
      socket.on('locationUpdate', handleLocationUpdate);
      socket.on('newSOS', handleNewSOS);

      return () => {
        socket.off('locationUpdate', handleLocationUpdate);
        socket.off('newSOS', handleNewSOS);
      };
    }
  }, [socket]);

  return (
    <Box sx={{ p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Live Dashboard</Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Tourists" value={stats.activeUsers} icon={Users} /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Active SOS Alerts" value={stats.activeSOS} icon={ShieldAlert} /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Hazard Reports" value={stats.hazardReports} icon={FileText} /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Danger Zones" value={stats.dangerZones} icon={TriangleAlert} /></Grid>
      </Grid>

      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #e0e0e0', fontWeight: 'bold' }}>
            Live Tourist Activity Map (Refreshes every 30s)
          </Typography>
          <Box sx={{ height: '60vh', width: '100%' }}>
            <MapView users={users} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardPage;
