import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public Components & Pages
import { PublicNavbar } from './components/public/PublicNavbar';
import { PublicFooter } from './components/public/PublicFooter';
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { SolutionsPage } from './pages/public/SolutionsPage';
import { ProjectsPage } from './pages/public/ProjectsPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/auth/LoginPage';

// Dashboard Components & Pages
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { DevicesPage } from './pages/dashboard/DevicesPage';
import { SensorsPage } from './pages/dashboard/SensorsPage';
import { MonitoringPage } from './pages/dashboard/MonitoringPage';
import { AlertsPage } from './pages/dashboard/AlertsPage';
import { MessagesPage } from './pages/dashboard/MessagesPage';
import { UsersPage } from './pages/dashboard/UsersPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';

// Public Layout Container
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

// Protected Route Guard
const ProtectedRoute: React.FC<{ allowedRoles?: ('admin' | 'operator' | 'viewer')[] }> = ({
  allowedRoles,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-zinc-500">Memverifikasi sesi terotentikasi...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <DashboardLayout />;
};

const AdminOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />

          {/* Internal IoT Management Dashboard (Protected) */}
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route index element={<OverviewPage />} />
            <Route path="devices" element={<DevicesPage />} />
            <Route path="sensors" element={<SensorsPage />} />
            <Route path="monitoring" element={<MonitoringPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route
              path="users"
              element={
                <AdminOnly>
                  <UsersPage />
                </AdminOnly>
              }
            />
          </Route>

          {/* Catch-all redirect to homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
