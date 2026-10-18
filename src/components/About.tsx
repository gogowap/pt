import React from 'react';
import { Target, Compass, Shield, Zap, Cpu, Award, Info } from 'lucide-react';
import { IOT_COMPANY_INFO } from '../data/iotData';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#737373] mb-2">
            <span>Profil Perusahaan</span>
            <span aria-hidden="true" className="text-[#E5E5E5]">·</span>
            <span>About Innodesk</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] tracking-tight leading-tight">
            Menghubungkan Lapangan Fisik dengan Kecerdasan Operasional Digital.
          </h2>
          <p className="mt-4 text-base text-[#737373] leading-relaxed">
            {IOT_COMPANY_INFO.aboutSummary}
          </p>
        </div>

        {/* 2-Column Split: Image & Visi-Misi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          <div className="lg:col-span-5">
            <div className="rounded-lg overflow-hidden border border-[#E5E5E5] bg-[#F7F7F7] aspect-[4/3] shadow-xs">
              <img
                src="/src/assets/images/innodesk_workspace_minimal_1791787856954.jpg"
                alt="Fasilitas Riset & Rekayasa IoT PT Innodesk"
                className="w-full h-full object-cover grayscale contrast-115"
              />
            </div>
            <div className="mt-3 p-3 rounded bg-[#F7F7F7] border border-[#E5E5E5] text-xs text-[#737373] flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#242424] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#111111]">Catatan Profil Resmi: </span>
                Informasi dan ruang lingkup operasional disusun dengan standar industri IoT profesional. Detail legalitas dan sertifikasi formal akan dimutakhirkan setelah konfirmasi manajemen PT Innodesk.
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="border-b border-[#E5E5E5] pb-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#737373] mb-2">
                <Compass className="w-4 h-4 text-[#111111]" />
                <span>Visi Perusahaan</span>
              </div>
              <p className="text-lg font-medium text-[#111111] leading-relaxed">
                "{IOT_COMPANY_INFO.vision}"
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#737373] mb-4">
                <Target className="w-4 h-4 text-[#111111]" />
                <span>Misi Strategis</span>
              </div>
              <ul className="space-y-3.5">
                {IOT_COMPANY_INFO.mission.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 text-sm text-[#242424]">
                    <span className="font-mono text-xs font-bold text-[#737373] mt-0.5">0{idx + 1}.</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 4 Core Values */}
        <div>
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#111111]">Prinsip & Nilai Dasar Rekayasa</h3>
            <p className="text-xs sm:text-sm text-[#737373] mt-1">
              Pondasi yang kami terapkan dalam setiap perancangan simpul perangkat dan arsitektur data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {IOT_COMPANY_INFO.coreValues.map((val, idx) => {
              const icons = [Shield, Zap, Cpu, Award];
              const IconComp = icons[idx % icons.length];
              return (
                <div
                  key={idx}
                  className="p-6 rounded-lg border border-[#E5E5E5] bg-[#F7F7F7] hover:bg-white hover:border-[#737373] transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 rounded bg-[#111111] text-white flex items-center justify-center mb-4">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-[#111111] mb-2">{val.title}</h4>
                    <p className="text-xs text-[#737373] leading-relaxed">{val.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-[11px] font-mono text-[#737373]">
                    NILAI · 0{idx + 1}
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
