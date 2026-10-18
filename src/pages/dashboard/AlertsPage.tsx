import React, { useState, useEffect } from 'react';
import { ApiClient } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Check,
  Clock,
  User,
  RefreshCw,
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('open');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [resolvingId, setResolvingId] = useState<number | null>(null);

  const fetchAlerts = async () => {
    setLoading(true);
    let url = `/api/alerts?status=${encodeURIComponent(statusFilter)}&severity=${encodeURIComponent(severityFilter)}`;
    const res = await ApiClient.get<any[]>(url);
    if (res.success && res.data) {
      setAlerts(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 8000);
    return () => clearInterval(interval);
  }, [statusFilter, severityFilter]);

  const handleResolve = async (id: number) => {
    setResolvingId(id);
    const res = await ApiClient.put(`/api/alerts/${id}/resolve`);
    setResolvingId(null);
    if (res.success) {
      fetchAlerts();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Pusat Peringatan & Insiden Sistem
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Penanganan peristiwa pembacaan sensor yang melanggar parameter ambang batas aman.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAlerts}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 hover:border-zinc-300 rounded text-xs font-semibold text-zinc-700 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Perbarui Data</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-lg border border-zinc-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-700">Status Peringatan:</span>
          {['all', 'open', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-semibold rounded uppercase tracking-wider transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-zinc-950 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {st === 'open' ? 'Terbuka / Aktif' : st === 'resolved' ? 'Terselesaikan' : 'Semua'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-600">Tingkat Keparahan:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1 text-xs rounded border border-zinc-300 bg-white"
          >
            <option value="all">Semua Severity</option>
            <option value="critical">Critical (Kritis)</option>
            <option value="warning">Warning (Peringatan)</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-16 text-center text-xs font-mono text-zinc-400">
            Mengambil log peringatan sistem...
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-lg border border-zinc-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-zinc-900">Tidak ada peringatan pada kriteria ini</h3>
            <p className="text-xs text-zinc-500 mt-1">Seluruh sensor bekerja dalam batas toleransi normal.</p>
          </div>
        ) : (
          alerts.map((a) => (
            <div
              key={a.id}
              className={`p-4 sm:p-5 rounded-lg border transition-all ${
                a.status === 'open'
                  ? a.severity === 'critical'
                    ? 'bg-red-50/40 border-red-200'
                    : 'bg-amber-50/40 border-amber-200'
                  : 'bg-white border-zinc-200 opacity-80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase ${
                        a.severity === 'critical'
                          ? 'bg-red-600 text-white'
                          : a.severity === 'warning'
                          ? 'bg-amber-500 text-white'
                          : 'bg-zinc-600 text-white'
                      }`}
                    >
                      {a.severity}
                    </span>

                    <span className="font-mono text-zinc-500 text-[11px]">
                      ID-ALERT #{a.id} · {a.sensor_name} ({a.device_name})
                    </span>

                    <span className="text-zinc-300">·</span>
                    <span
                      className={`font-mono font-bold text-[10px] uppercase ${
                        a.status === 'open' ? 'text-red-700' : 'text-emerald-700'
                      }`}
                    >
                      STATUS: {a.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-950 leading-snug">
                    {a.message}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-500 pt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      Terdeteksi: {a.triggered_at}
                    </span>

                    {a.resolved_at && (
                      <span className="flex items-center gap-1 font-mono text-emerald-700">
                        <Check className="w-3.5 h-3.5" />
                        Diselesaikan: {a.resolved_at} oleh {a.resolved_by}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action button */}
                {a.status === 'open' && hasRole('admin', 'operator') && (
                  <button
                    type="button"
                    onClick={() => handleResolve(a.id)}
                    disabled={resolvingId === a.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-zinc-950 rounded hover:bg-zinc-800 transition-colors cursor-pointer self-start shrink-0"
                  >
                    {resolvingId === a.id ? (
                      <span>Memproses...</span>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Selesaikan Insiden</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
