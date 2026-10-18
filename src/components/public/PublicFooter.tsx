import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Cpu } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 py-16 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-zinc-800">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white">
              <div className="w-7 h-7 rounded-sm bg-white text-zinc-950 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <span>PT Innodesk</span>
            </Link>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
              Arsitektur terintegrasi Internet of Things (IoT), perangkat telemetry edge gateway, dan sistem pengawasan operasional presisi untuk korporasi industri modern.
            </p>
            <div className="text-[11px] font-mono text-zinc-500 pt-2">
              SEKTOR: INTERNET OF THINGS (IoT) & ENTERPRISE TELEMETRY
            </div>
          </div>

          {/* Navigasi (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-white transition-colors">Beranda</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Tentang Perusahaan</Link></li>
              <li><Link to="/solutions" className="hover:text-white transition-colors">Solusi & Layanan IoT</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">Portofolio & Studi Kasus</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Konsultasi Teknis</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Portal Dashboard Staff</Link></li>
            </ul>
          </div>

          {/* Solusi Utama (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Pilar Solusi IoT
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>01. Smart Environmental Monitoring</li>
              <li>02. Industrial IoT (IIoT) & Predictive Maintenance</li>
              <li>03. Enterprise Asset Tracking & Fleet Telematics</li>
              <li>04. Centralized Telemetry Dashboard & Alerting</li>
            </ul>
            <div className="pt-2 text-[11px] text-zinc-500">
              * Seluruh data operasional dienkripsi dan diproses melalui REST Ingestion Gateway.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} PT Innodesk. Hak Cipta Dilindungi Undang-Undang.
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[11px] font-mono">
              SISTEM: FULL-STACK REST API v2.0
            </span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Kembali ke Atas</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
