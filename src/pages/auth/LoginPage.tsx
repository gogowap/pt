import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Cpu, ArrowRight, Lock, Mail, ShieldAlert, KeyRound } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    setError(null);
    setIsLoggingIn(true);
    const result = await login(email, password);
    setIsLoggingIn(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login gagal.');
    }
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col justify-center items-center px-4 bg-[#FAFAFA]">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight text-zinc-950 mb-2">
            <div className="w-8 h-8 rounded bg-zinc-950 text-white flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <span>PT Innodesk</span>
          </Link>
          <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            PORTAL MANAJEMEN IoT SENTRAL
          </div>
          <p className="text-xs text-zinc-600 mt-2">
            Masuk dengan kredensial staf internal terotorisasi untuk mengelola perangkat, sensor, dan peringatan telemetri.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg border border-zinc-200 p-6 sm:p-8 shadow-xs">
          {error && (
            <div className="mb-5 p-3 rounded bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-600">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-1.5">
                Email Akun Perusahaan
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@innodesk.co.id"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded border border-zinc-300 focus:border-zinc-950 focus:outline-none"
                  autoComplete="username"
                />
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded border border-zinc-300 focus:border-zinc-950 focus:outline-none"
                  autoComplete="current-password"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-zinc-950 rounded hover:bg-zinc-800 disabled:opacity-50 cursor-pointer"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memverifikasi Kredensial...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Panel */}
          <div className="mt-8 pt-6 border-t border-zinc-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-3">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Akses Cepat Akun Demo (Local Testing):</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleFillDemo('admin@innodesk.co.id', 'InnodeskAdmin2026!')}
                className="w-full text-left p-2.5 rounded border border-zinc-200 hover:border-zinc-400 bg-zinc-50 hover:bg-white text-xs transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="font-bold text-zinc-900 block">Akun Administrator</span>
                  <span className="text-[11px] text-zinc-500 font-mono">admin@innodesk.co.id · Hak penuh (User, Device, CRUD)</span>
                </div>
                <span className="text-[10px] font-mono bg-zinc-900 text-white px-1.5 py-0.5 rounded">ADMIN</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('operator@innodesk.co.id', 'InnodeskOperator2026!')}
                className="w-full text-left p-2.5 rounded border border-zinc-200 hover:border-zinc-400 bg-zinc-50 hover:bg-white text-xs transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="font-bold text-zinc-900 block">Akun Operator Lapangan</span>
                  <span className="text-[11px] text-zinc-500 font-mono">operator@innodesk.co.id · Kelola perangkat & alert</span>
                </div>
                <span className="text-[10px] font-mono bg-zinc-700 text-white px-1.5 py-0.5 rounded">OPERATOR</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('viewer@innodesk.co.id', 'InnodeskViewer2026!')}
                className="w-full text-left p-2.5 rounded border border-zinc-200 hover:border-zinc-400 bg-zinc-50 hover:bg-white text-xs transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="font-bold text-zinc-900 block">Akun Viewer / Auditor</span>
                  <span className="text-[11px] text-zinc-500 font-mono">viewer@innodesk.co.id · Akses baca telemetri</span>
                </div>
                <span className="text-[10px] font-mono bg-zinc-500 text-white px-1.5 py-0.5 rounded">VIEWER</span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-zinc-500 hover:text-zinc-950 transition-colors">
            &larr; Kembali ke Website Publik PT Innodesk
          </Link>
        </div>
      </div>
    </div>
  );
};
