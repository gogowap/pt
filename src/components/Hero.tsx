import React, { useState } from 'react';
import { ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import { COMPANY_PROFILE, COMPANY_METRICS } from '../data/companyData';

interface HeroProps {
  onExploreServices: () => void;
  onContactClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreServices, onContactClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <section id="beranda" className="pt-26 pb-16 md:pt-32 md:pb-24 bg-[#FAFAFA] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Column 1: Editorial Value Proposition (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Meta indicator without static pill badges */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-4">
              <span>{COMPANY_PROFILE.name}</span>
              <span aria-hidden="true" className="text-zinc-300">·</span>
              <span>{COMPANY_PROFILE.sector}</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-zinc-950 tracking-tight leading-[1.15] mb-6"
              style={{ textWrap: 'balance' }}
            >
              {COMPANY_PROFILE.heroHeading}
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl mb-8">
              {COMPANY_PROFILE.heroDescription}
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
              <button
                onClick={onContactClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold tracking-wide text-white bg-zinc-950 rounded-md hover:bg-zinc-800 active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Konsultasi Proyek</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreServices}
                className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-zinc-800 bg-white border border-zinc-300 rounded-md hover:bg-zinc-100 hover:border-zinc-400 active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Jelajahi Solusi Layanan</span>
              </button>
            </div>

            {/* Quick trust proofs */}
            <div className="pt-6 border-t border-zinc-200/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-zinc-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-zinc-700" />
                <span>Tata Kelola Berstandar Korporasi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-zinc-700" />
                <span>Simulasi Transparan & Teruji</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-zinc-700" />
                <span>Tanpa Redundansi Alur Kerja</span>
              </div>
            </div>
          </div>

          {/* Column 2: Monochromatic Visual Asset (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-lg overflow-hidden border border-zinc-300 bg-zinc-100 shadow-sm aspect-[16/10] sm:aspect-[16/11]">
              {!imageError ? (
                <img
                  src="/src/assets/images/innodesk_hero_architecture_1791787843185.jpg"
                  alt="Arsitektur Fasilitas Operasional Modern PT Innodesk"
                  referrerPolicy="no-referrer"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  className={`w-full h-full object-cover grayscale contrast-110 transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ) : null}

              {/* Styled Fallback Container if image fails or before load */}
              {(!imageLoaded || imageError) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-zinc-100 text-zinc-700">
                  <Building2 className="w-12 h-12 text-zinc-400 mb-3" />
                  <p className="text-sm font-semibold text-zinc-800">Fasilitas Infrastruktur Terpadu</p>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                    Pusat koordinasi dan integrasi operasional teknologi PT Innodesk.
                  </p>
                </div>
              )}

              {/* Minimal caption badge */}
              <div className="absolute bottom-3 left-3 right-3 px-3 py-2 bg-zinc-950/85 backdrop-blur-xs text-white text-[11px] rounded border border-white/10 flex items-center justify-between">
                <span className="font-medium tracking-wide">Fasilitas & Infrastruktur Terpadu</span>
                <span className="font-mono text-zinc-400">ID-HQ // 01</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-Column Metric Strip below Hero Split */}
        <div className="mt-14 pt-10 border-t border-zinc-200 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {COMPANY_METRICS.map((metric, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-950 tracking-tight tabular-nums">
                {metric.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-800 mt-1">
                {metric.label}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">
                {metric.context}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
