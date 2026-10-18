import React from 'react';
import { Target, Compass, Shield, Zap, Cpu, Users, Award, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2">
            <span>Profil Perusahaan</span>
            <span aria-hidden="true">·</span>
            <span>PT Innodesk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-950 tracking-tight leading-tight">
            Pelopor Solusi Internet of Things & Telemetri Industri Indonesia.
          </h1>
          <p className="mt-4 text-base text-zinc-600 leading-relaxed">
            PT Innodesk berdiri dengan misi menghubungkan batas fisik mesin industri dengan kecerdasan komputasi awan. Kami mengkhususkan diri dalam pengembangan sistem IoT terukur untuk sektor manufaktur, logistik rantai dingin, utilitas, dan infrastruktur pintar.
          </p>
        </div>

        {/* 2-Column Split: Image & Visi-Misi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20 pb-16 border-b border-zinc-200">
          <div className="lg:col-span-5">
            <div className="rounded-lg overflow-hidden border border-zinc-300 aspect-[4/3] bg-zinc-100">
              <img
                src="/src/assets/images/innodesk_workspace_minimal_1791787856954.jpg"
                alt="Laboratorium Inovasi IoT PT Innodesk"
                className="w-full h-full object-cover grayscale contrast-110"
              />
            </div>
            <div className="mt-3 text-xs text-zinc-500 font-mono">
              FASILITAS EVALUASI PROTOKOL EDGE GATEWAY
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="border-b border-zinc-200 pb-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                <Compass className="w-4 h-4 text-zinc-900" />
                <span>Visi Perusahaan</span>
              </div>
              <p className="text-lg font-medium text-zinc-900 leading-relaxed">
                "Menjadi penyedia infrastruktur Internet of Things (IoT) terdepan di Asia Tenggara yang menjamin kedaulatan data operasional, keandalan transmisi tanpa henti, dan efisiensi industri berkelanjutan."
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">
                <Target className="w-4 h-4 text-zinc-900" />
                <span>Misi Strategis</span>
              </div>
              <ul className="space-y-3.5">
                {[
                  'Mengembangkan hardware edge gateway mandiri yang tahan terhadap kondisi ekstrem lingkungan industri.',
                  'Menyediakan pipeline data ingestion berlatensi rendah dengan perlindungan enkripsi berlapis.',
                  'Mendukung digitalisasi operasional nasional melalui solusi IoT yang modular dan mudah diintegrasikan.',
                ].map((m, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-zinc-700">
                    <span className="font-mono text-xs font-bold text-zinc-400 mt-0.5">0{idx + 1}.</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 4 Core Values */}
        <div className="mb-20">
          <h2 className="text-xl font-bold text-zinc-950 mb-8">Nilai-Nilai Dasar Rekayasa PT Innodesk</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: 'Determinisme Data',
                desc: 'Setiap titik pengukuran diverifikasi keasliannya dan dicatat dengan timestamp presisi tinggi.',
                icon: Shield,
              },
              {
                title: 'Ketahanan Fisik (Ruggedness)',
                desc: 'Perangkat keras dirancang untuk beroperasi 24/7 di bawah getaran, debu, dan fluktuasi voltase.',
                icon: Zap,
              },
              {
                title: 'Interoperabilitas Terbuka',
                desc: 'Mendukung standar industri universal seperti MQTT, Modbus RTU/TCP, REST API, dan OPC-UA.',
                icon: Cpu,
              },
              {
                title: 'Tanggung Jawab Rekayasa',
                desc: 'Keterbukaan penuh atas batas toleransi sensor dan prosedur tanggap darurat saat terjadi anomali.',
                icon: Award,
              },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="p-6 rounded-lg border border-zinc-200 bg-zinc-50">
                  <div className="w-9 h-9 rounded bg-zinc-950 text-white flex items-center justify-center mb-4">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-950 mb-2">{v.title}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Organizational Structure & Notice */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
            <Users className="w-4 h-4 text-zinc-900" />
            <span>Struktur Organisasi & Legalitas</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-950 mb-3">Divisi Riset & Pengembangan Perangkat</h3>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6">
            Tim PT Innodesk terdiri dari insinyur sistem embedded, arsitek cloud database, spesialis jaringan RF/LoRa, serta praktisi instrumentasi industri.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-zinc-50 rounded border border-zinc-200">
              <span className="text-zinc-400 block mb-1">DIVISI 01</span>
              <span className="font-bold text-zinc-900">Embedded Firmware & Hardware</span>
            </div>
            <div className="p-3 bg-zinc-50 rounded border border-zinc-200">
              <span className="text-zinc-400 block mb-1">DIVISI 02</span>
              <span className="font-bold text-zinc-900">Cloud Data Ingestion & Security</span>
            </div>
            <div className="p-3 bg-zinc-50 rounded border border-zinc-200">
              <span className="text-zinc-400 block mb-1">DIVISI 03</span>
              <span className="font-bold text-zinc-900">Field Deployment & Maintenance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
