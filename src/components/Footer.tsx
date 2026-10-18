import React from 'react';
import { ArrowUp, Cpu } from 'lucide-react';
import { IOT_COMPANY_INFO } from '../data/iotData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Technology', href: '#technology' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'About Us', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-[#111111] text-[#737373] py-16 border-t border-[#242424]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#242424]">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <a href="#home" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white">
              <div className="w-7 h-7 rounded bg-white text-[#111111] flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <span>{IOT_COMPANY_INFO.name}</span>
            </a>
            <p className="text-xs sm:text-sm text-[#737373] max-w-sm leading-relaxed">
              Solusi Internet of Things untuk membantu bisnis menghubungkan perangkat fisik, memantau operasional kontinu, dan mengoptimalkan keputusan berbasis data telemetri presisi.
            </p>
            <div className="text-[11px] font-mono text-[#737373] pt-1">
              INDUSTRI: {IOT_COMPANY_INFO.industry.toUpperCase()}
            </div>
          </div>

          {/* Navigation (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
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

          {/* Solutions Column (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Pilar Solusi IoT
            </h4>
            <ul className="space-y-2 text-xs text-[#737373]">
              <li>01. Smart Monitoring</li>
              <li>02. Industrial IoT (IIoT)</li>
              <li>03. Asset Tracking</li>
              <li>04. Smart Automation</li>
              <li>05. IoT Dashboard</li>
              <li>06. Connected Systems</li>
            </ul>
            <div className="pt-2 text-[11px] text-[#737373]">
              * Seluruh kategori dirancang dengan standar arsitektur terbuka.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373]">
          <div>
            &copy; {new Date().getFullYear()} {IOT_COMPANY_INFO.name}. Hak Cipta Dilindungi Undang-Undang.
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[11px] font-mono text-[#737373]">
              FRONTEND VITE + REACT
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-[#737373] hover:text-white transition-colors cursor-pointer"
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
