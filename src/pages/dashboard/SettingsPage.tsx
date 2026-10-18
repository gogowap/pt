import React, { useState, useEffect } from 'react';
import { ApiClient } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import {
  Settings,
  Cpu,
  Database,
  Play,
  Pause,
  RefreshCw,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [simStatus, setSimStatus] = useState<any>({ isRunning: false, generatedCount: 0 });
  const [dbStatus, setDbStatus] = useState<any>({ database: 'Memuat...' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const fetchSettingsData = async () => {
    const [simRes, healthRes] = await Promise.all([
      ApiClient.get('/api/simulator/status'),
      ApiClient.get('/api/health'),
    ]);

    if (simRes.success && simRes.data) {
      setSimStatus(simRes.data);
    }
    if (healthRes.database) {
      setDbStatus(healthRes);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const handleToggleSimulator = async () => {
    const res = await ApiClient.post('/api/simulator/toggle');
    if (res.success) {
      setMessage(res.message || 'Simulator diubah.');
      fetchSettingsData();
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleManualPulse = async () => {
    const res = await ApiClient.post('/api/simulator/tick');
    if (res.success) {
      setMessage('Siklus telemetri berhasil dikirim dan dicatat ke database.');
      fetchSettingsData();
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
          Pengaturan Sistem & Telemetri Simulator
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Konfigurasi pipeline ingestion, parameter simulator IoT, dan informasi basis data relasional.
        </p>
      </div>

      {message && (
        <div className="p-3 bg-zinc-900 text-white rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Simulator Control Card */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-zinc-950 text-white flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-950">
                IoT Telemetry Ingestion Simulator
              </h2>
              <p className="text-xs text-zinc-500">
                Simulator terintegrasi di sisi backend Express yang secara teratur menyuntikkan data sensor ke database.
              </p>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase ${
              simStatus.isRunning
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {simStatus.isRunning ? 'STATUS: AKTIF (8s)' : 'STATUS: DIJEDA'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono mb-6">
          <div className="p-3 bg-zinc-50 rounded border border-zinc-200">
            <span className="text-zinc-400 block text-[11px]">INTERVAL POLLING SIKLUS:</span>
            <span className="font-bold text-zinc-900">{simStatus.intervalSeconds || 8} Detik</span>
          </div>
          <div className="p-3 bg-zinc-50 rounded border border-zinc-200">
            <span className="text-zinc-400 block text-[11px]">TELEMETRI TERTULIS KE DB:</span>
            <span className="font-bold text-zinc-900">{simStatus.generatedCount || 0} Pengukuran</span>
          </div>
          <div className="p-3 bg-zinc-50 rounded border border-zinc-200">
            <span className="text-zinc-400 block text-[11px]">SIKLUS TERAKHIR:</span>
            <span className="font-bold text-zinc-900 truncate block">
              {simStatus.lastSimulationRun ? simStatus.lastSimulationRun.split('T')[1]?.substring(0, 8) : 'Baru dimulai'}
            </span>
          </div>
        </div>

        {hasRole('admin', 'operator') ? (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleToggleSimulator}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer ${
                simStatus.isRunning
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-zinc-950 hover:bg-zinc-800 text-white'
              }`}
            >
              {simStatus.isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Jeda Simulator</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Jalankan Simulator</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleManualPulse}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Kirim 1 Siklus Telemetri Seketika</span>
            </button>
          </div>
        ) : (
          <p className="text-xs text-zinc-500 italic">
            * Kontrol simulator dibatasi untuk role Administrator dan Operator.
          </p>
        )}
      </div>

      {/* Database Engine Info */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-3 mb-4">
          <Database className="w-4 h-4 text-zinc-700" />
          <h2 className="text-base font-bold text-zinc-950">Arsitektur & Status Basis Data</h2>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-zinc-600">
          <p>
            Sistem PT Innodesk dirancang dengan arsitektur relasional standar industri. Menggunakan skrip <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-zinc-900 font-bold">schema.sql</code> (MySQL InnoDB) lengkap dengan relasi primary key, foreign key cascade, dan indeks pencarian waktu.
          </p>

          <div className="p-3 bg-zinc-50 rounded border border-zinc-200 font-mono text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-700">
            <div>Engine Aktif: <span className="font-bold text-zinc-950 uppercase">{dbStatus.database}</span></div>
            <div>Integrasi Driver: <span className="font-bold text-zinc-950">mysql2/promise & SQLite WAL</span></div>
            <div>Total Tabel: <span className="font-bold text-zinc-950">8 Tabel Relasional</span></div>
            <div>File Migrasi: <span className="font-bold text-zinc-950">/schema.sql</span></div>
          </div>
        </div>
      </div>

      {/* Account Info Card */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-3 mb-4">
          <Shield className="w-4 h-4 text-zinc-700" />
          <h2 className="text-base font-bold text-zinc-950">Informasi Sesi Pengguna</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <span className="text-zinc-400 block text-[11px]">NAMA LENGKAP:</span>
            <span className="font-bold text-zinc-900">{user?.name}</span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[11px]">EMAIL TERDAFTAR:</span>
            <span className="font-bold text-zinc-900">{user?.email}</span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[11px]">HAK AKSES (ROLE):</span>
            <span className="font-bold uppercase text-zinc-900">{user?.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
