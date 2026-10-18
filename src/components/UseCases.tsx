import React, { useState } from 'react';
import { ArrowRight, X, Info, Check } from 'lucide-react';
import { USE_CASES_DATA, UseCaseItem } from '../data/iotData';

export const UseCases: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<UseCaseItem | null>(null);

  return (
    <section id="use-cases" className="py-20 md:py-28 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#737373] mb-2">
              <span>Studi Kasus & Portofolio Contoh</span>
              <span aria-hidden="true" className="text-[#E5E5E5]">·</span>
              <span>Use Cases</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] tracking-tight leading-tight">
              Contoh Skenario Penerapan IoT di Lapangan.
            </h2>
            <p className="mt-3 text-sm text-[#737373] leading-relaxed">
              Ilustrasi bagaimana integrasi simpul sensor dan pengawasan terpusat menjawab tantangan operasional di sektor industri nyata.
            </p>
          </div>

          <div className="p-2.5 rounded bg-[#F7F7F7] border border-[#E5E5E5] text-xs text-[#737373] flex items-center gap-2 self-start md:self-auto">
            <Info className="w-4 h-4 text-[#242424] shrink-0" />
            <span>Label: Seluruh proyek ditandai sebagai Contoh Use Case</span>
          </div>
        </div>

        {/* 4 Use Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {USE_CASES_DATA.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-[#E5E5E5] bg-white overflow-hidden flex flex-col justify-between hover:border-[#737373] hover:shadow-xs transition-all"
            >
              <div>
                <div className="h-48 bg-[#F7F7F7] relative overflow-hidden">
                  <img
                    src={item.imagePlaceholder}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale contrast-115"
                  />
                  <div className="absolute top-3 left-3 bg-[#111111]/85 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded font-mono font-medium">
                    {item.tag}
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <div className="text-[11px] font-mono text-[#737373] uppercase mb-1">
                    {item.category}
                  </div>
                  <h3 className="text-lg font-bold text-[#111111] mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-[#737373] leading-relaxed mb-6">
                    {item.challenge}
                  </p>

                  <div className="p-3 bg-[#F7F7F7] rounded border border-[#E5E5E5] flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold font-mono text-[#111111] tabular-nums">
                        {item.measuredResult}
                      </span>
                      <span className="block text-[11px] text-[#737373]">{item.metricLabel}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7 pt-0 border-t border-[#E5E5E5] mt-4">
                <button
                  type="button"
                  onClick={() => setSelectedCase(item)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#111111] hover:text-[#737373] transition-colors cursor-pointer py-1"
                >
                  <span>Lihat Pendekatan Teknis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Use Case Detail */}
      {selectedCase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedCase(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-lg border border-[#E5E5E5] max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3 mb-4">
              <span className="font-mono text-xs text-[#737373] uppercase">
                {selectedCase.category} · {selectedCase.tag}
              </span>
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="text-[#737373] hover:text-[#111111] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-[#111111] mb-3">{selectedCase.title}</h3>

            <div className="space-y-4 mb-6 text-xs sm:text-sm text-[#242424]">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Tantangan Operasional:
                </h4>
                <p className="text-[#737373] leading-relaxed">{selectedCase.challenge}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Solusi & Pendekatan IoT:
                </h4>
                <p className="text-[#737373] leading-relaxed">{selectedCase.solution}</p>
              </div>

              <div className="p-3 bg-[#F7F7F7] rounded border border-[#E5E5E5]">
                <div className="text-xl font-bold font-mono text-[#111111]">{selectedCase.measuredResult}</div>
                <div className="text-xs text-[#737373]">{selectedCase.metricLabel}</div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E5E5E5]">
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#242424] rounded cursor-pointer"
              >
                Tutup Contoh Use Case
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
