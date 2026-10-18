import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Cpu } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111111] text-[#737373] py-16 border-t border-[#242424]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#242424]">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white group">
              <div className="w-7 h-7 rounded bg-white text-[#111111] flex items-center justify-center transition-transform group-hover:scale-105">
                <Cpu className="w-4 h-4" />
              </div>
              <span>PT Innodesk</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#242424] text-[#E5E5E5]">
                IoT
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-[#737373] max-w-sm leading-relaxed">
              Penyedia solusi Internet of Things (IoT) terintegrasi untuk membantu bisnis menghubungkan perangkat, memantau operasional, dan mengoptimalkan pengambilan keputusan berbasis data.
            </p>
            <div className="text-[11px] font-mono text-[#737373] pt-1">
              INDUSTRI: INTERNET OF THINGS (IoT) · TELEMETRI INDUSTRI
            </div>
          </div>

          {/* Navigasi Cepat (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/solutions" className="hover:text-white transition-colors">Solutions</Link></li>
              <li><a href="/#technology" className="hover:text-white transition-colors">Technology & Architecture</a></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">Portofolio Proyek</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Hubungi Kami</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors font-mono text-emerald-400">Portal Dashboard Demo</Link></li>
            </ul>
          </div>

          {/* Kontak & Representasi (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Informasi Operasional
            </h4>
            <div className="space-y-2 text-xs text-[#737373]">
              <div>
                <span className="text-white block font-medium">Kantor Pusat PT Innodesk</span>
                <span>Gedung Pusat Bisnis Terpadu, Jakarta, Indonesia [Placeholder Resmi]</span>
              </div>
              <div>
                <span className="text-white block font-medium">Email Korespondensi</span>
                <span className="font-mono">info@innodesk.id [Placeholder Kontak]</span>
              </div>
              <div>
                <span className="text-white block font-medium">Jam Layanan Rekayasa</span>
                <span>Senin – Jumat: 08:30 – 17:30 WIB</span>
              </div>
            </div>
            <div className="pt-2 text-[11px] text-[#737373] border-t border-[#242424]">
              * Website ini dirancang dengan gaya Monochrome Technology — Minimalist Corporate.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373]">
          <div>
            &copy; {new Date().getFullYear()} PT Innodesk. Hak Cipta Dilindungi Undang-Undang.
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[11px] font-mono text-[#737373]">
              MONOCHROME TECHNOLOGY CORP
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
