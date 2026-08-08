import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage         from './pages/LoginPage';
import DashboardPage     from './pages/DashboardPage';
import AppointmentsPage  from './pages/AppointmentsPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import ReportsPage       from './pages/ReportsPage';
import StaffPage         from './pages/StaffPage';
import AuditPage         from './pages/AuditPage';
import Layout            from './components/Layout';
import SessionModal      from './components/SessionModal';

const RANK = { receptionist:0, nurse:1, doctor:2, admin:3, cmo:4 };

function Guard({ children, minRole }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg0)', flexDirection:'column', gap:14 }}>
      <div style={{ width:36, height:36, border:'3px solid var(--bg3)', borderTopColor:'var(--teal-mid)', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
      <p style={{ color:'var(--text2)', fontSize:13 }}>Loading Crescent Medical Portal...</p>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (minRole && RANK[user.role] < RANK[minRole]) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <SessionModal />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard"/> : <LoginPage />} />
        <Route path="/"      element={<Navigate to={user?'/dashboard':'/login'} />} />
        <Route element={<Guard><Layout /></Guard>}>
          <Route path="/dashboard"     element={<DashboardPage />} />
          <Route path="/appointments"  element={<AppointmentsPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/reports"       element={<Guard minRole="doctor"><ReportsPage /></Guard>} />
          <Route path="/staff"         element={<Guard minRole="admin"><StaffPage /></Guard>} />
          <Route path="/audit"         element={<Guard minRole="cmo"><AuditPage /></Guard>} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter><AppRoutes /></BrowserRouter>
    </AuthProvider>
  );
}
