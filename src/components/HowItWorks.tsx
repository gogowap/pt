import React from 'react';
import { Activity, Radio, Cpu, BarChart3, ArrowRight } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../data/iotData';

export const HowItWorks: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Activity':
        return <Activity className="w-5 h-5" />;
      case 'Radio':
        return <Radio className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#737373] mb-2">
            <span>Arsitektur & Diagram Alur</span>
            <span aria-hidden="true" className="text-[#E5E5E5]">·</span>
            <span>How It Works</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] tracking-tight leading-tight">
            Bagaimana Ekosistem IoT PT Innodesk Mengalirkan Data.
          </h2>
          <p className="mt-3 text-sm text-[#737373] leading-relaxed">
            Dari pembacaan transduser di lapangan fisik hingga aksi manajerial berbasis dashboard, seluruh proses terhubung dalam siklus empat tahap yang deterministik.
          </p>
        </div>

        {/* 4-Step Diagram Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {HOW_IT_WORKS_STEPS.map((s, idx) => (
            <div key={s.step} className="relative flex flex-col justify-between p-6 rounded-lg border border-[#E5E5E5] bg-[#F7F7F7] hover:border-[#111111] transition-colors">
              <div>
                {/* Node Step Marker */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded bg-[#111111] text-white flex items-center justify-center">
                    {getIcon(s.iconName)}
                  </div>
                  <span className="font-mono text-xs font-bold text-[#737373]">
                    TAHAP · {s.step}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-[#737373] uppercase mb-1">
                  {s.subtitle}
                </div>
                <h3 className="text-base font-bold text-[#111111] mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-[#737373] leading-relaxed">
                  {s.desc}
                </p>
              </div>

              {/* Step indicator footer */}
              <div className="mt-6 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-[11px] font-mono text-[#737373]">
                <span>NODE 0{idx + 1}</span>
                {idx < 3 && <span className="hidden md:inline text-[#111111]">&rarr;</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Visual Connectivity Pipeline Diagram */}
        <div className="mt-12 p-6 rounded-lg border border-[#E5E5E5] bg-white">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#111111] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#111111]" />
            <span>Diagram Konektivitas & Alur Integritas Data Monokrom</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#F7F7F7] rounded border border-[#E5E5E5]">
              <span className="text-[#737373] block text-[10px]">SUMBER SENSOR</span>
              <span className="font-bold text-[#111111]">Analog / I2C / SPI / 4-20mA</span>
            </div>
            <div className="p-3 bg-[#F7F7F7] rounded border border-[#E5E5E5]">
              <span className="text-[#737373] block text-[10px]">JARINGAN TRANSMISI</span>
              <span className="font-bold text-[#111111]">Modbus RS485 / MQTT / LTE-M</span>
            </div>
            <div className="p-3 bg-[#F7F7F7] rounded border border-[#E5E5E5]">
              <span className="text-[#737373] block text-[10px]">ANALISIS & PIPELINE</span>
              <span className="font-bold text-[#111111]">Noise Filtering & Threshold Check</span>
            </div>
            <div className="p-3 bg-[#F7F7F7] rounded border border-[#E5E5E5]">
              <span className="text-[#737373] block text-[10px]">AKSI & MONITORING</span>
              <span className="font-bold text-[#111111]">Relay Trigger / Web Dashboard</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
