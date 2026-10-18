import React from 'react';
import { ArrowRight, Radio, Activity, Cpu, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { IOT_COMPANY_INFO } from '../data/iotData';

export const Hero: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="pt-26 pb-20 md:pt-32 md:pb-28 bg-[#F7F7F7] border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Headlines & CTAs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Tagline Indicator */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#737373] mb-4">
              <span>{IOT_COMPANY_INFO.name}</span>
              <span aria-hidden="true" className="text-[#E5E5E5]">·</span>
              <span>{IOT_COMPANY_INFO.industry}</span>
            </div>

            {/* Main Headline */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.35rem] font-bold text-[#111111] tracking-tight leading-[1.15] mb-6"
              style={{ textWrap: 'balance' }}
            >
              {IOT_COMPANY_INFO.heroHeadline}
            </h1>

            {/* Main Description */}
            <p className="text-base sm:text-lg text-[#737373] leading-relaxed max-w-2xl mb-8">
              {IOT_COMPANY_INFO.heroDescription}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
              <button
                type="button"
                onClick={() => scrollTo('#solutions')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] rounded hover:bg-[#242424] active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Jelajahi Solusi</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollTo('#contact')}
                className="inline-flex items-center justify-center px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#111111] bg-white border border-[#E5E5E5] rounded hover:bg-[#F7F7F7] hover:border-[#737373] active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Hubungi Kami</span>
              </button>
            </div>

            {/* Trust Proofs */}
            <div className="pt-6 border-t border-[#E5E5E5] flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#737373]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#242424]" />
                <span>Konektivitas Multi-Protokol Teruji</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#242424]" />
                <span>Akuisisi Data Sensor Presisi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#242424]" />
                <span>Dashboard Telemetri Terpusat</span>
              </div>
            </div>
          </div>

          {/* Right Column: Monochromatic IoT Visualization Widget (5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-lg border border-[#E5E5E5] bg-white p-5 shadow-xs relative overflow-hidden">
              {/* Header Box */}
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3 mb-4 text-xs font-mono">
                <span className="font-bold text-[#111111] flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#242424]" />
                  IoT NODE TELEMETRY SIMULATOR
                </span>
                <span className="text-[10px] text-[#737373] uppercase">MONOKROM · REAL-TIME</span>
              </div>

              {/* Node Network Topology Representation */}
              <div className="p-4 rounded border border-[#E5E5E5] bg-[#F7F7F7] mb-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#737373]">TOPOLOGI JARINGAN SIMPUL:</span>
                  <span className="text-[#111111] font-bold">4 SIMPUL TERHUBUNG</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-white border border-[#E5E5E5]">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#737373]">
                      <span>NODE-01 HQ</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                    </div>
                    <div className="mt-1 text-sm font-bold font-mono text-[#111111]">24.8 °C</div>
                    <span className="text-[10px] text-[#737373]">Suhu Kamar Server</span>
                  </div>

                  <div className="p-2.5 rounded bg-white border border-[#E5E5E5]">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#737373]">
                      <span>NODE-02 CKR</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                    </div>
                    <div className="mt-1 text-sm font-bold font-mono text-[#111111]">52.4 %RH</div>
                    <span className="text-[10px] text-[#737373]">Kelembaban Gudang</span>
                  </div>

                  <div className="p-2.5 rounded bg-white border border-[#E5E5E5]">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#737373]">
                      <span>NODE-03 SBY</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                    </div>
                    <div className="mt-1 text-sm font-bold font-mono text-[#111111]">1.8 mm/s</div>
                    <span className="text-[10px] text-[#737373]">Vibrasi Motor Lini 3</span>
                  </div>

                  <div className="p-2.5 rounded bg-white border border-[#E5E5E5]">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#737373]">
                      <span>NODE-04 SMG</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#737373]" />
                    </div>
                    <div className="mt-1 text-sm font-bold font-mono text-[#111111]">-18.2 °C</div>
                    <span className="text-[10px] text-[#737373]">Cold Chain Vault</span>
                  </div>
                </div>
              </div>

              {/* Data stream footer */}
              <div className="flex items-center justify-between text-[11px] font-mono text-[#737373] pt-2 border-t border-[#E5E5E5]">
                <span>ENKRIPSI: MQTTS / TLS 1.3</span>
                <span>STATUS: SISTEM NORMAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Quantitative Impact Bar */}
        <div className="mt-14 pt-10 border-t border-[#E5E5E5] grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-[#111111] tabular-nums">99.85%</span>
            <span className="text-xs sm:text-sm font-semibold text-[#242424] mt-1">Uptime Transmisi Telemetri</span>
            <span className="text-xs text-[#737373] mt-0.5">Reliabilitas koneksi gateway IoT</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-[#111111] tabular-nums">&lt;500 ms</span>
            <span className="text-xs sm:text-sm font-semibold text-[#242424] mt-1">Latensi Penerimaan Data</span>
            <span className="text-xs text-[#737373] mt-0.5">Kecepatan data sensor ke dashboard</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-[#111111] tabular-nums">100%</span>
            <span className="text-xs sm:text-sm font-semibold text-[#242424] mt-1">Integritas Audit Trail</span>
            <span className="text-xs text-[#737373] mt-0.5">Pencatatan riwayat setiap pembacaan</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-[#111111] tabular-nums">24/7</span>
            <span className="text-xs sm:text-sm font-semibold text-[#242424] mt-1">Deteksi Anomali Ambang Batas</span>
            <span className="text-xs text-[#737373] mt-0.5">Peringatan dini multi-parameter</span>
          </div>
        </div>
      </div>
    </section>
  );
};
