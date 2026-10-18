import React from 'react';
import { Cpu, Radio, Server, BarChart3, CheckCircle2 } from 'lucide-react';
import { TECHNOLOGY_DOMAINS } from '../data/iotData';

export const Technology: React.FC = () => {
  const getIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Cpu className="w-5 h-5" />;
      case 1:
        return <Radio className="w-5 h-5" />;
      case 2:
        return <Server className="w-5 h-5" />;
      case 3:
        return <BarChart3 className="w-5 h-5" />;
      default:
        return <Cpu className="w-5 h-5" />;
    }
  };

  return (
    <section id="technology" className="py-20 md:py-28 bg-[#F7F7F7] border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#737373] mb-2">
            <span>Teknologi & Standar Industri</span>
            <span aria-hidden="true" className="text-[#E5E5E5]">·</span>
            <span>IoT Technology</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] tracking-tight leading-tight">
            Fondasi Teknologi & Arsitektur Terbuka.
          </h2>
          <p className="mt-3 text-sm text-[#737373] leading-relaxed">
            Penjelasan umum mengenai tumpukan teknologi (technology stack) yang mendasari ekosistem Internet of Things modern: mulai dari instrumentasi fisik hingga komputasi visual.
          </p>
        </div>

        {/* 4 Technology Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {TECHNOLOGY_DOMAINS.map((domain, idx) => (
            <div
              key={domain.title}
              className="rounded-lg border border-[#E5E5E5] bg-white p-7 sm:p-8 flex flex-col justify-between hover:border-[#737373] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded bg-[#111111] text-white flex items-center justify-center">
                    {getIcon(idx)}
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#737373]">
                    DOMAIN · 0{idx + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#111111] mb-2">{domain.title}</h3>
                <p className="text-xs sm:text-sm text-[#737373] leading-relaxed mb-6">
                  {domain.desc}
                </p>

                <div className="space-y-2.5">
                  <span className="text-[11px] font-mono uppercase font-bold text-[#111111] block mb-1">
                    Komponen & Standar Penerapan:
                  </span>
                  {domain.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#242424]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5E5E5] text-[11px] font-mono text-[#737373]">
                STANDARISASI: KOMPATIBILITAS INDUSTRI TERBUKA
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
