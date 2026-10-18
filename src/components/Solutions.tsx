import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Radio,
  Layers,
  BarChart3,
  Server,
  ArrowRight,
  CheckCircle2,
  X,
  Check,
} from 'lucide-react';
import { IOT_SOLUTIONS, SolutionItem } from '../data/iotData';

interface SolutionsProps {
  onConsultSolution: (solutionTitle: string) => void;
}

export const Solutions: React.FC<SolutionsProps> = ({ onConsultSolution }) => {
  const [selectedSolution, setSelectedSolution] = useState<SolutionItem | null>(null);

  const getIcon = (name: SolutionItem['iconName']) => {
    switch (name) {
      case 'Activity':
        return <Activity className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'Radio':
        return <Radio className="w-5 h-5" />;
      case 'Layers':
        return <Layers className="w-5 h-5" />;
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5" />;
      case 'Server':
        return <Server className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <section id="solutions" className="py-20 md:py-28 bg-[#F7F7F7] border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#737373] mb-2">
              <span>Layanan & Portofolio Rekayasa</span>
              <span aria-hidden="true" className="text-[#E5E5E5]">·</span>
              <span>IoT Solutions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] tracking-tight leading-tight">
              Solusi Internet of Things Terpadu untuk Kebutuhan Operasional Bisnis.
            </h2>
            <p className="mt-3 text-sm text-[#737373] leading-relaxed">
              Kategori solusi di bawah ini merupakan representasi kapabilitas rekayasa IoT PT Innodesk yang siap dikustomisasi sesuai parameter spesifik organisasi Anda.
            </p>
          </div>

          <div className="text-xs font-mono text-[#737373] bg-white px-3 py-1.5 rounded border border-[#E5E5E5] self-start md:self-auto">
            06 PILAR SOLUSI UTAMA
          </div>
        </div>

        {/* 6 Solution Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {IOT_SOLUTIONS.map((sol) => (
            <div
              key={sol.id}
              className="rounded-lg border border-[#E5E5E5] bg-white p-6 sm:p-7 flex flex-col justify-between hover:border-[#737373] hover:shadow-xs transition-all group"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded bg-[#111111] text-white flex items-center justify-center">
                    {getIcon(sol.iconName)}
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#737373] group-hover:text-[#111111] transition-colors">
                    SOLUSI · {sol.number}
                  </span>
                </div>

                <div className="mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] bg-[#F7F7F7] px-2 py-0.5 rounded border border-[#E5E5E5]">
                    {sol.categoryTag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#111111] mb-2 group-hover:text-[#242424] transition-colors">
                  {sol.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#737373] leading-relaxed mb-6">
                  {sol.description}
                </p>

                {/* Features Checklist */}
                <div className="space-y-2 mb-6">
                  {sol.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#242424]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedSolution(sol)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#111111] hover:text-[#737373] transition-colors cursor-pointer py-1"
                >
                  <span>Spesifikasi Teknis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono text-[#737373]">{sol.sampleProtocols.split(',')[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Solution Detail */}
      {selectedSolution && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedSolution(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-lg border border-[#E5E5E5] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3 mb-4">
              <span className="font-mono text-xs text-[#737373]">
                SPESIFIKASI SOLUSI · {selectedSolution.number}
              </span>
              <button
                type="button"
                onClick={() => setSelectedSolution(null)}
                className="text-[#737373] hover:text-[#111111] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-[#111111] mb-2">{selectedSolution.title}</h3>
            <p className="text-xs sm:text-sm text-[#737373] leading-relaxed mb-6">
              {selectedSolution.description}
            </p>

            <div className="p-3.5 bg-[#F7F7F7] rounded border border-[#E5E5E5] text-xs font-mono text-[#242424] mb-6">
              <span className="text-[#737373] block text-[10px] uppercase">Rekomendasi Protokol Jaringan:</span>
              <span className="font-bold">{selectedSolution.sampleProtocols}</span>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-3">
                Cakupan Deliverables & Output Implementasi:
              </h4>
              <ul className="space-y-2">
                {selectedSolution.features.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#242424]">
                    <Check className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#E5E5E5] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedSolution(null)}
                className="px-4 py-2 text-xs font-semibold text-[#737373] hover:text-[#111111] cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  onConsultSolution(selectedSolution.title);
                  setSelectedSolution(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#242424] rounded cursor-pointer"
              >
                <span>Pilih Solusi Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
