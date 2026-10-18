import React, { useState } from 'react';
import { Target, Compass, Shield, Zap, Sparkles, Building, Info } from 'lucide-react';
import { COMPANY_PROFILE } from '../data/companyData';

export const About: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <section id="tentang" className="py-20 md:py-28 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2">
            <span>Profil Korporasi</span>
            <span aria-hidden="true" className="text-zinc-300">·</span>
            <span>Tentang Perusahaan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-950 tracking-tight leading-tight">
            Menghubungkan Perangkat, Prosedur, dan Manusia dalam Harmoni Operasional.
          </h2>
          <p className="mt-4 text-base text-zinc-600 leading-relaxed">
            PT Innodesk memfokuskan kapabilitasnya dalam mengelola dan menyelaraskan aspek Layanan Operasional dan Teknologi (LOT). Pendekatan kami bertumpu pada disiplin rekayasa sistem yang memprioritaskan ketahanan, keteraturan alur kerja, dan kontrol data yang transparan.
          </p>
        </div>

        {/* 2-Column Split: Visual & Visi-Misi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          {/* Workspace Image (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100 aspect-[4/3] shadow-xs">
              {!imageError ? (
                <img
                  src="/src/assets/images/innodesk_workspace_minimal_1791787856954.jpg"
                  alt="Ruang Kerja dan Koordinasi Eksekutif PT Innodesk"
                  referrerPolicy="no-referrer"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  className={`w-full h-full object-cover grayscale contrast-115 transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ) : null}

              {(!imageLoaded || imageError) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-zinc-100 text-zinc-700">
                  <Building className="w-10 h-10 text-zinc-400 mb-2" />
                  <p className="text-sm font-semibold text-zinc-800">Ruang Kolaborasi Eksekutif</p>
                  <p className="text-xs text-zinc-500 mt-1">Standar koordinasi operasional terarah.</p>
                </div>
              )}

              <div className="absolute bottom-3 left-3 right-3 px-3 py-2 bg-zinc-950/85 backdrop-blur-xs text-white text-[11px] rounded border border-white/10 flex items-center justify-between">
                <span>Ruang Rapat & Analisis Kebijakan</span>
                <span className="font-mono text-zinc-400">ID-EXEC</span>
              </div>
            </div>

            {/* Note placeholder verification */}
            <div className="mt-4 p-4 rounded-md border border-zinc-200 bg-zinc-50 flex items-start gap-3">
              <Info className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-600 leading-normal">
                <span className="font-semibold text-zinc-800">Status Data Korporasi: </span>
                Informasi profil dan spesifikasi bidang LOT dirancang dengan standar profesional. Detail legalitas dan sertifikasi final akan dimutakhirkan setelah konfirmasi data resmi perusahaan.
              </div>
            </div>
          </div>

          {/* Visi & Misi (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-10">
            {/* Visi */}
            <div className="border-b border-zinc-200 pb-8">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                <Compass className="w-4 h-4 text-zinc-800" />
                <span>Visi Perusahaan</span>
              </div>
              <p className="text-lg sm:text-xl font-medium text-zinc-900 leading-relaxed">
                "{COMPANY_PROFILE.vision}"
              </p>
            </div>

            {/* Misi */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">
                <Target className="w-4 h-4 text-zinc-800" />
                <span>Misi Strategis</span>
              </div>
              <ul className="space-y-4">
                {COMPANY_PROFILE.mission.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="font-mono text-xs font-bold text-zinc-400 mt-0.5">
                      0{idx + 1}.
                    </span>
                    <span className="text-sm sm:text-base text-zinc-700 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 4 Nilai Utama Perusahaan (Asymmetric or Grid) */}
        <div className="pt-12 border-t border-zinc-200">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-zinc-950">Prinsip & Nilai Dasar Kerja</h3>
            <p className="text-sm text-zinc-500 mt-1">Pedoman operasional yang diterapkan di setiap solusi PT Innodesk.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMPANY_PROFILE.coreValues.map((val, idx) => {
              const icons = [Shield, Zap, Sparkles, Target];
              const IconComp = icons[idx % icons.length];
              return (
                <div
                  key={idx}
                  className="p-6 rounded-lg border border-zinc-200 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 rounded-md bg-zinc-900 text-white flex items-center justify-center mb-4">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <h4 className="text-base font-semibold text-zinc-950 mb-2">{val.title}</h4>
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">{val.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-200/60 text-[11px] font-mono text-zinc-400">
                    PRINSIP · 0{idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
