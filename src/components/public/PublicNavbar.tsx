import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Cpu, Radio } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Solutions', path: '/solutions' },
    { label: 'Technology', path: '/#technology' },
    { label: 'About Us', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' && !location.hash;
    if (path.startsWith('/#')) return location.hash === path.substring(1);
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-18">
          {/* Wordmark PT Innodesk */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-lg sm:text-xl font-bold tracking-tight text-[#111111] whitespace-nowrap shrink-0 group"
          >
            <div className="w-7 h-7 rounded bg-[#111111] text-white flex items-center justify-center transition-transform group-hover:scale-105">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="font-semibold tracking-tight">PT Innodesk</span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#F7F7F7] text-[#737373] border border-[#E5E5E5] hidden sm:inline-block">
              IoT
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#737373]">
            {navLinks.map((link) => {
              const isAnchor = link.path.startsWith('/#');
              if (isAnchor) {
                return (
                  <a
                    key={link.label}
                    href={link.path}
                    className="hover:text-[#111111] transition-colors py-1 relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#111111] transition-all duration-200 group-hover:w-full" />
                  </a>
                );
              }
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`hover:text-[#111111] transition-colors py-1 relative group ${
                    isActive(link.path) ? 'text-[#111111] font-semibold' : ''
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-[#111111] transition-all duration-200 ${
                      isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs: Konsultasi Solusi & Live IoT Portal Demo */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium text-[#242424] bg-[#F7F7F7] border border-[#E5E5E5] rounded hover:border-[#737373] transition-all"
              title="Akses prototipe dashboard pengawasan IoT terpusat"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Live Portal</span>
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-4.5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] rounded hover:bg-[#242424] active:scale-[0.99] transition-all shadow-xs"
            >
              <span>Konsultasi Solusi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/contact"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#111111] rounded"
            >
              Konsultasi
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#242424] hover:text-[#111111] rounded"
              aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E5E5] bg-[#FFFFFF] px-4 pt-3 pb-6 shadow-md">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isAnchor = link.path.startsWith('/#');
              if (isAnchor) {
                return (
                  <a
                    key={link.label}
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm font-medium text-[#242424] hover:bg-[#F7F7F7] rounded"
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                    isActive(link.path)
                      ? 'bg-[#F7F7F7] text-[#111111] font-semibold'
                      : 'text-[#737373] hover:text-[#111111] hover:bg-[#F7F7F7]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-[#E5E5E5] space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-mono font-medium text-[#242424] bg-[#F7F7F7] border border-[#E5E5E5] rounded"
              >
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Buka Dashboard Telemetri IoT</span>
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] rounded hover:bg-[#242424]"
              >
                <span>Konsultasi Solusi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
