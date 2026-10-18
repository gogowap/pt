import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Cpu } from 'lucide-react';
import { IOT_COMPANY_INFO } from '../data/iotData';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Technology', href: '#technology' },
    { label: 'About Us', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCtaClick = () => {
    setMobileMenuOpen(false);
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] shadow-xs'
          : 'bg-white border-b border-[#E5E5E5]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Wordmark PT Innodesk */}
          <a
            href="#home"
            onClick={(e) => handleScrollTo(e, '#home')}
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-[#111111] whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity"
          >
            <div className="w-7 h-7 rounded bg-[#111111] text-white flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <span>{IOT_COMPANY_INFO.name}</span>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#737373]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="whitespace-nowrap shrink-0 hover:text-[#111111] transition-colors py-1 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#111111] transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleCtaClick}
              className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] rounded hover:bg-[#242424] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Konsultasi Solusi</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#242424] hover:text-[#111111] rounded cursor-pointer"
              aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E5E5] bg-white px-4 pt-3 pb-6 shadow-lg">
          <nav className="flex flex-col space-y-2.5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="px-3 py-2 text-sm font-medium text-[#242424] hover:text-[#111111] hover:bg-[#F7F7F7] rounded transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-[#E5E5E5]">
              <button
                type="button"
                onClick={handleCtaClick}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] rounded hover:bg-[#242424] transition-colors cursor-pointer"
              >
                <span>Konsultasi Solusi</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
