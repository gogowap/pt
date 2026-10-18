import React from 'react';
import { ArrowUp } from 'lucide-react';
import { COMPANY_PROFILE } from '../data/companyData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Tentang Kami', href: '#tentang' },
    { label: 'Layanan LOT', href: '#layanan' },
    { label: 'Portofolio Proyek', href: '#portofolio' },
    { label: 'Konsultasi', href: '#kontak' },
  ];

  return (
    <footer className="bg-zinc-950 text-zinc-400 py-16 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-zinc-800">
          {/* Kolom 1: Wordmark & Identitas (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <span className="text-xl font-bold tracking-tight text-white block">
              {COMPANY_PROFILE.name}
            </span>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
              Penyedia arsitektur layanan operasional dan integrasi teknologi presisi. Membangun keandalan sistem tanpa kompromi untuk kebutuhan industri modern.
            </p>
            <div className="text-[11px] font-mono text-zinc-500 pt-2">
              SEKTOR: {COMPANY_PROFILE.sector}
            </div>
          </div>

          {/* Kolom 2: Navigasi Cepat (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-xs">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Layanan Ringkas (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Fokus Layanan
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>01. Manajemen Infrastruktur LOT</li>
              <li>02. Integrasi Sistem & Monitoring Sentral</li>
              <li>03. Optimasi Alur Kerja & Otomasi Proses</li>
              <li>04. Kepatuhan & Keamanan Operasional</li>
            </ul>
            <div className="pt-2 text-[11px] text-zinc-500">
              * Seluruh data operasional dikelola secara aman sesuai SLA organisasi.
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} {COMPANY_PROFILE.name}. Hak Cipta Dilindungi Undang-Undang.
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[11px] font-mono">
              STATUS: FRONTEND PRODUKSI v1.0
            </span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Kembali ke atas halaman"
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
