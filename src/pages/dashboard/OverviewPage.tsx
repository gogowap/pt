import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ApiClient } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import {
  Server,
  Activity,
  ShieldAlert,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const OverviewPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOverviewData = async () => {
    setRefreshing(true);
    const [sumRes, chartRes] = await Promise.all([
      ApiClient.get('/api/dashboard/summary'),
      ApiClient.get('/api/measurements/chart?range=24h'),
    ]);

    if (sumRes.success && sumRes.data) {
      setSummary(sumRes.data);
    }
    if (chartRes.success && chartRes.data) {
      setChartData(chartRes.data);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOverviewData();
    // Poll every 8s for live dashboard updates
    const interval = setInterval(fetchOverviewData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleResolveAlert = async (alertId: number) => {
    const res = await ApiClient.put(`/api/alerts/${alertId}/resolve`);
    if (res.success) {
      fetchOverviewData();
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono text-zinc-500">Memuat telemetri operasional real-time...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Pusat Komando Telemetri IoT
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Status agregat perangkat, metrik kesehatan sensor, dan insiden operasional aktif.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchOverviewData}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 hover:border-zinc-300 rounded text-xs font-semibold text-zinc-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sinkronisasi Data</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Devices */}
        <div className="p-5 rounded-lg border border-zinc-200 bg-white">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Perangkat IoT</span>
            <Server className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-950 tabular-nums">
            {summary?.devices?.total || 0}
          </div>
          <div className="mt-2 text-xs flex items-center gap-2">
            <span className="text-emerald-700 font-semibold">{summary?.devices?.online || 0} Online</span>
            <span className="text-zinc-300">·</span>
            <span className="text-zinc-500">{summary?.devices?.offline || 0} Offline</span>
          </div>
        </div>

        {/* Total Sensors */}
        <div className="p-5 rounded-lg border border-zinc-200 bg-white">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sensor Transduser</span>
            <Activity className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-950 tabular-nums">
            {summary?.sensors?.total || 0}
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            <span className="text-zinc-900 font-semibold">{summary?.sensors?.active || 0} sensor</span> aktif beroperasi
          </div>
        </div>

        {/* Total Measurements */}
        <div className="p-5 rounded-lg border border-zinc-200 bg-white">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Telemetri</span>
            <BarChart3 className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-950 tabular-nums">
            {summary?.measurements?.total?.toLocaleString('id-ID') || 0}
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            Data tersimpan pada database relasional
          </div>
        </div>

        {/* Open Alerts */}
        <div className="p-5 rounded-lg border border-zinc-200 bg-white">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Peringatan Aktif</span>
            <ShieldAlert className={`w-4 h-4 ${summary?.alerts?.openTotal > 0 ? 'text-red-600' : 'text-zinc-400'}`} />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-950 tabular-nums">
            {summary?.alerts?.openTotal || 0}
          </div>
          <div className="mt-2 text-xs flex items-center gap-2">
            <span className="text-red-600 font-semibold">{summary?.alerts?.critical || 0} Kritis</span>
            <span className="text-zinc-300">·</span>
            <span className="text-amber-600 font-semibold">{summary?.alerts?.warning || 0} Waspada</span>
          </div>
        </div>
      </div>

      {/* Main Chart Section: Telemetry Trend (Recharts) */}
      <div className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-zinc-700" />
              <span>Dinamika Tren Telemetri Sensor (24 Jam Terakhir)</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Representasi visual pengukuran sensor terakumulasi dari tabel measurements.
            </p>
          </div>
          <Link
            to="/dashboard/monitoring"
            className="text-xs font-semibold text-zinc-950 hover:text-zinc-600 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Buka Monitoring Lengkap</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="h-64 w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-zinc-400 font-mono">
              Belum ada data grafik time-series.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="telemetryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181B" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#18181B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
                <XAxis
                  dataKey="timestamp"
                  stroke="#71717A"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#E4E4E7' }}
                />
                <YAxis
                  stroke="#71717A"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#E4E4E7' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-zinc-950 text-white p-2.5 rounded shadow-lg text-xs font-mono">
                          <p className="font-bold">{data.sensorName}</p>
                          <p className="text-zinc-300">
                            Nilai: <span className="text-white font-bold">{data.value} {data.unit}</span>
                          </p>
                          <p className="text-[10px] text-zinc-400 mt-1">Waktu: {data.fullTime}</p>
                          {data.isBreached && (
                            <p className="text-[10px] text-red-400 font-bold mt-0.5">⚠️ MELEWATI AMBANG BATAS</p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#18181B"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#telemetryGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 2-Column Split: Recent Live Readings & Active Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Measurements Stream (7 cols) */}
        <div className="lg:col-span-7 rounded-lg border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              Aliran Pengukuran Terbaru (Live Feed)
            </h3>
            <span className="text-[11px] font-mono text-zinc-400">POLLING AKTIF</span>
          </div>

          <div className="divide-y divide-zinc-100">
            {summary?.recentMeasurements?.map((m: any) => {
              const isBreached = m.value < m.min_threshold || m.value > m.max_threshold;
              return (
                <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-zinc-900 block">{m.sensor_name}</span>
                    <span className="text-[11px] text-zinc-500 font-mono">{m.device_name}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-mono font-bold text-sm tabular-nums block ${
                        isBreached ? 'text-red-600' : 'text-zinc-950'
                      }`}
                    >
                      {m.value} {m.unit}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {m.recorded_at?.split(' ')[1] || m.recorded_at}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Alerts (5 cols) */}
        <div className="lg:col-span-5 rounded-lg border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              Peringatan Sistem Terbuka
            </h3>
            <Link to="/dashboard/alerts" className="text-xs text-zinc-500 hover:text-zinc-950">
              Semua &rarr;
            </Link>
          </div>

          {summary?.recentAlerts?.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <span>Semua sensor dalam kondisi aman dan normal.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {summary?.recentAlerts?.map((a: any) => (
                <div
                  key={a.id}
                  className={`p-3 rounded border text-xs ${
                    a.severity === 'critical'
                      ? 'bg-red-50/60 border-red-200 text-red-900'
                      : 'bg-amber-50/60 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase font-bold mb-1">
                    <span>{a.severity}</span>
                    <span>{a.triggered_at?.split(' ')[1] || a.triggered_at}</span>
                  </div>
                  <p className="font-medium text-xs mb-2 leading-snug">{a.message}</p>
                  
                  {hasRole('admin', 'operator') && (
                    <button
                      type="button"
                      onClick={() => handleResolveAlert(a.id)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-white rounded border border-zinc-300 hover:bg-zinc-100 text-zinc-800 transition-colors cursor-pointer"
                    >
                      Tandai Selesai
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
