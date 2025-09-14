import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import LoginPage from './pages/Login';
import MainLayout from './components/MainLayout';
import DashboardPage from './pages/Dashboard';
import SosPage from './pages/SOS';
import ReportsPage from './pages/Reports';
import DangerZonesPage from './pages/DangerZones';
import EFIRPage from './pages/EFIR';
import MembersPage from './pages/Members';
function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="sos" element={<SosPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="danger-zones" element={<DangerZonesPage />} />
              <Route path="efir" element={<EFIRPage />} />
                <Route path="members" element={<MembersPage />}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}
export default App;