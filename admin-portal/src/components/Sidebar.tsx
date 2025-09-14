import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, FileText, TriangleAlert, FileJson ,Users} from 'lucide-react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/sos', label: 'SOS Alerts', icon: ShieldAlert },
  { href: '/reports', label: 'Hazard Reports', icon: FileText },
  { href: '/danger-zones', label: 'Danger Zones', icon: TriangleAlert },
  { href: '/efir', label: 'E-FIRs', icon: FileJson },
   { href: '/members', label: 'Active Members', icon: Users },

];

const Sidebar = () => (
  <Box sx={{ width: 250, bgcolor: 'background.paper', p: 3, height: '100vh', borderRight: '1px solid #e0e0e0' }}>
    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4 }}>
      🛡️ Sentinel
    </Typography>
    <nav>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {navItems.map((item) => (
          <motion.li
            key={item.label}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <NavLink
              to={item.href}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: isActive ? '#1976d2' : '#555',
                backgroundColor: isActive ? '#e3f2fd' : 'transparent',
                padding: '10px 15px',
                borderRadius: '8px',
                marginBottom: '8px',
                fontWeight: isActive ? 'bold' : 'normal',
                transition: 'background-color 0.3s, color 0.3s'
              })}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          </motion.li>
        ))}
      </ul>
    </nav>
  </Box>
);

export default Sidebar;
