// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';

import { SnackbarProvider } from 'notistack';

// Import Pages
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/Dashboard';
import SosPage from './pages/SOS';
import ReportPage from './pages/ReportPage';

// Import Layouts and Protected Route
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Optional: MUI ThemeProvider setup
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a consistent theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize as needed
    },
    secondary: {
      main: '#dc004e',
    },
    error: {
      main: '#d32f2f',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <BrowserRouter>
          <AuthProvider>
            <LocationProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/sos" element={<SosPage />} />
                  <Route path="/report" element={<ReportPage />} />
                </Route>
              </Routes>
            </LocationProvider>
          </AuthProvider>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
