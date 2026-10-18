import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ApiClient } from '../../lib/api';
import {
  Cpu,
  LayoutDashboard,
  Server,
  Activity,
  Sliders,
  ShieldAlert,
  Inbox,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Play,
  Pause,
  RefreshCw,
  Bell,
  Menu,
  X,
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [simStatus, setSimStatus] = useState<any>({ isRunning: true });
  const [openAlertsCount, setOpenAlertsCount] = useState<number>(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Poll simulator and alert count
  useEffect(() => {
    const fetchStatus = async () => {
      const res = await ApiClient.get('/api/simulator/status');
      if (res.success && res.data) {
        setSimStatus(res.data);
      }

      const summaryRes = await ApiClient.get('/api/dashboard/summary');
      if (summaryRes.success && summaryRes.data) {
        setOpenAlertsCount(summaryRes.data.alerts?.openTotal || 0);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSimulator = async () => {
    const res = await ApiClient.post('/api/simulator/toggle');
    if (res.success && res.data) {
      setSimStatus((prev: any) => ({ ...prev, isRunning: res.data.isRunning }));
    }
  };

  const handleManualTick = async () => {
    await ApiClient.post('/api/simulator/tick');
  };

  const navItems = [
    { label: 'Ringkasan Sistem', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Manajemen Perangkat', path: '/dashboard/devices', icon: Server },
    { label: 'Manajemen Sensor', path: '/dashboard/sensors', icon: Activity },
    { label: 'Monitoring Telemetri', path: '/dashboard/monitoring', icon: Sliders },
    {
      label: 'Peringatan & Alert',
      path: '/dashboard/alerts',
      icon: ShieldAlert,
      badge: openAlertsCount > 0 ? openAlertsCount : null,
    },
    { label: 'Pesan Masuk Klien', path: '/dashboard/messages', icon: Inbox },
    ...(hasRole('admin')
      ? [{ label: 'Manajemen Pengguna', path: '/dashboard/users', icon: Users }]
      : []),
    { label: 'Pengaturan & Simulator', path: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-zinc-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-zinc-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-1.5 text-zinc-700 hover:bg-zinc-100 rounded"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5 font-bold tracking-tight text-zinc-950">
            <div className="w-7 h-7 rounded bg-zinc-950 text-white flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-sm sm:text-base font-bold">PT Innodesk</span>
            <span className="text-zinc-400 font-normal">/</span>
            <span className="text-xs font-mono font-medium text-zinc-600 hidden sm:inline">IoT Platform</span>
          </Link>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Simulator Quick Status & Trigger */}
          <div className="hidden lg:flex items-center gap-2 p-1.5 px-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs font-mono">
            <span className="text-zinc-500">SIMULATOR:</span>
            <span
              className={`inline-flex items-center gap-1 font-semibold ${
                simStatus.isRunning ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  simStatus.isRunning ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              {simStatus.isRunning ? 'AKTIF (8s)' : 'DIJEDA'}
            </span>

            {hasRole('admin', 'operator') && (
              <>
                <button
                  type="button"
                  onClick={handleToggleSimulator}
                  title={simStatus.isRunning ? 'Jeda Simulator' : 'Aktifkan Simulator'}
                  className="p-1 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200 rounded cursor-pointer ml-1"
                >
                  {simStatus.isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
                <button
                  type="button"
                  onClick={handleManualTick}
                  title="Kirim Siklus Telemetri Seketika"
                  className="p-1 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200 rounded cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </>
            )}
          </div>

          {/* User Badge */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
              <div className="text-right hidden sm:block">
                <span className="block text-xs font-bold text-zinc-900 leading-tight">{user.name}</span>
                <span className="text-[10px] font-mono uppercase text-zinc-500">{user.email}</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-zinc-900 text-white">
                {user.role}
              </span>
            </div>
          )}

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            title="Keluar Akun"
            className="p-2 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 rounded transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Desktop */}
        <aside
          className={`w-64 bg-white border-r border-zinc-200 flex flex-col justify-between shrink-0 z-20 md:static fixed inset-y-16 left-0 transition-transform duration-200 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="p-4 space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 px-3 py-1">
              MENU PENGELOLAAN
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                    active
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                        active ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Sidebar Footer Link */}
          <div className="p-4 border-t border-zinc-200">
            <Link
              to="/"
              className="flex items-center justify-between p-2.5 rounded bg-zinc-50 hover:bg-zinc-100 text-xs font-medium text-zinc-700 border border-zinc-200 transition-colors"
            >
              <span>Website Publik PT Innodesk</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </Link>
          </div>
        </aside>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
