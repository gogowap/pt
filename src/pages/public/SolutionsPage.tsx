import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Cpu,
  Radio,
  Layers,
  BarChart3,
  Server,
  ArrowRight,
  CheckCircle2,
  Sliders,
  ShieldCheck,
} from 'lucide-react';

export const SolutionsPage: React.FC = () => {
  const solutions = [
    {
      id: 'smart-monitoring',
      title: 'Smart Monitoring Systems',
      subtitle: 'Pengawasan Kontinu Parameter Lingkungan & Kritis',
      desc: 'Solusi monitoring lingkungan terintegrasi untuk fasilitas ruang bersih farmasi, pusat data, dan gudang berpendingin. Menggunakan sensor digital bersertifikasi dengan kalibrasi presisi.',
      features: [
        'Akurasi termal ±0.2°C dan kelembaban ±2% RH',
        'Notifikasi instan via SMS, Email, dan Webhook bila melanggar batas aman',
        'Dukungan sensor kualitas udara CO2, Particulate Matter (PM2.5/PM10), dan VOC',
        'Cadangan data lokal (SD card logging) jika konektivitas jaringan terputus',
      ],
      protocols: 'MQTT / HTTPS / LoRaWAN',
      icon: Activity,
    },
    {
      id: 'industrial-iot',
      title: 'Industrial IoT (IIoT) & Predictive Maintenance',
      subtitle: 'Telemetri Mesin Pabrik & Deteksi Keausan Dinamis',
      desc: 'Menghubungkan lini produksi dan turbin mekanis ke sistem monitoring terpusat untuk mendeteksi getaran abnormal, fluktuasi torsi, dan panas berlebih sebelum terjadi kegagalan sistemik.',
      features: [
        'Akselerometer frekuensi tinggi untuk analisis spektrum Fourier (FFT)',
        'Antarmuka langsung ke PLC Siemens, Omron, Mitsubishi via Modbus',
        'Kalkulasi metrik Overall Equipment Effectiveness (OEE) secara real-time',
        'Isolasi galvanik 2.5kV untuk perlindungan dari lonjakan daya industri',
      ],
      protocols: 'Modbus RTU/TCP / OPC-UA / MQTT',
      icon: Cpu,
    },
    {
      id: 'asset-tracking',
      title: 'Asset Tracking & Telematika Armada',
      subtitle: 'Visibilitas Geospasial & Logistik Rantai Pasok',
      desc: 'Pelacakan aset berharga kontainer dan armada distribusi berpendingin di seluruh wilayah Indonesia dengan pelaporan posisi berkala dan deteksi pembukaan pintu kargo.',
      features: [
        'Multi-konstelasi GNSS (GPS, GLONASS, Galileo, BeiDou)',
        'Jaringan seluler global 4G Cat-M1 dan fallback 2G untuk daerah terpencil',
        'Sensor akselerometer terintegrasi untuk deteksi guncangan keras dan tabrakan',
        'Manajemen daya cerdas dengan masa pakai baterai hingga 3 tahun',
      ],
      protocols: 'Cellular NB-IoT / LTE-M / BLE Beacon',
      icon: Radio,
    },
    {
      id: 'smart-automation',
      title: 'Smart Automation & Closed-Loop Control',
      subtitle: 'Otomasi Aksi Berbasis Aturan Sensor Terpadu',
      desc: 'Mengurangi ketergantungan pada intervensi manusia melalui eksekusi aktuator otomatis (katup solenoid, pendingin cadangan, pompa darurat) saat ambang batas sensor tercapai.',
      features: [
        'Relay output berkapasitas tinggi 10A 250VAC',
        'Aturan logika IF-THIS-THEN-THAT yang dapat dikonfigurasi melalui web',
        'Pencegahan kondisi bouncing dengan parameter histeresis terintegrasi',
        'Pencatatan riwayat setiap pemicuan aktuator ke database audit',
      ],
      protocols: 'MQTT / Modbus / GPIO Dry Contact',
      icon: Layers,
    },
    {
      id: 'iot-dashboard',
      title: 'Enterprise IoT Telemetry Dashboard',
      subtitle: 'Visualisasi Interaktif & Analitik Operasional Sentral',
      desc: 'Dashboard berbasis web dengan render grafik time-series berkinerja tinggi, visualisasi status node daring/luring, serta manajemen hak akses pengguna berdasarkan tingkatan otorisasi.',
      features: [
        'Pembaruan visual otomatis tanpa reload halaman',
        'Penyaringan data berdasarkan rentang waktu, lokasi, dan jenis sensor',
        'Dukungan ekspor riwayat pengukuran ke format CSV dan JSON',
        'Autentikasi aman JWT dengan peran Admin, Operator, dan Viewer',
      ],
      protocols: 'REST API / WebSockets / JSON Web Token',
      icon: BarChart3,
    },
    {
      id: 'connected-devices',
      title: 'Custom Connected Devices & Hardware Engineering',
      subtitle: 'Perancangan Node IoT Sesuai Kebutuhan Lapangan',
      desc: 'Layanan rancang bangun perangkat keras kustom untuk skenario di mana perangkat komersial umum tidak memenuhi spesifikasi dimensi, daya, atau ketahanan lingkungan.',
      features: [
        'Desain skematik dan layout PCB multi-layer dengan komponen industri',
        'Enclosure tahan air dan debu dengan standar proteksi IP65/IP67/IP68',
        'Firmware efisien berbasis FreeRTOS atau bare-metal C/C++',
        'Dukungan bootloader Over-The-Air (OTA) untuk pembaruan jarak jauh',
      ],
      protocols: 'RS485 / SPI / I2C / CAN-Bus',
      icon: Server,
    },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2">
            <span>Solusi Terpadu</span>
            <span aria-hidden="true">·</span>
            <span>PT Innodesk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-950 tracking-tight leading-tight">
            Katalog Solusi Internet of Things Berstandar Korporasi.
          </h1>
          <p className="mt-4 text-base text-zinc-600 leading-relaxed">
            Setiap pilar solusi IoT PT Innodesk dirancang untuk memberikan transparansi penuh, mengurangi potensi downtime mekanis, dan mempermudah pengambilan keputusan manajerial.
          </p>
        </div>

        {/* 6 Solutions Grid */}
        <div className="space-y-12 mb-20">
          {solutions.map((sol, index) => {
            const Icon = sol.icon;
            return (
              <div
                key={sol.id}
                id={sol.id}
                className="rounded-lg border border-zinc-200 bg-white p-6 sm:p-8 flex flex-col lg:flex-row items-start justify-between gap-8 hover:border-zinc-400 transition-colors"
              >
                <div className="lg:max-w-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-zinc-950 text-white flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-zinc-400">PILAR · 0{index + 1}</span>
                      <h2 className="text-xl font-bold text-zinc-950">{sol.title}</h2>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{sol.subtitle}</p>
                  <p className="text-sm text-zinc-600 leading-relaxed">{sol.desc}</p>

                  <div className="pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 mb-2">
                      Fitur Kunci & Keunggulan Teknis:
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-700">
                      {sol.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="w-full lg:w-72 shrink-0 p-5 rounded-md bg-zinc-50 border border-zinc-200 text-xs space-y-3">
                  <div>
                    <span className="text-zinc-400 font-mono block text-[11px]">PROTOKOL TELEMETRI</span>
                    <span className="font-semibold text-zinc-900">{sol.protocols}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 font-mono block text-[11px]">INTEGRASI BACKEND</span>
                    <span className="text-zinc-700">REST Ingestion / Relational SQL</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-200">
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold uppercase tracking-wider text-white bg-zinc-950 rounded hover:bg-zinc-800 transition-colors"
                    >
                      <span>Ajukan Konsultasi</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Protocol Comparison Table */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 sm:p-8 mb-20 overflow-x-auto">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-zinc-950">Matriks Pemilihan Protokol Jaringan IoT</h2>
            <p className="text-xs text-zinc-500 mt-1">Panduan arsitektur dalam menentukan media komunikasi data lapangan.</p>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 font-mono uppercase">
                <th className="py-3 px-3">Protokol</th>
                <th className="py-3 px-3">Rentang Jarak</th>
                <th className="py-3 px-3">Throughput</th>
                <th className="py-3 px-3">Konsumsi Daya</th>
                <th className="py-3 px-3">Kasus Terbaik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              <tr>
                <td className="py-3 px-3 font-semibold text-zinc-900 font-mono">MQTT (TLS)</td>
                <td className="py-3 px-3">Global (via IP)</td>
                <td className="py-3 px-3">Tinggi (Real-time)</td>
                <td className="py-3 px-3">Sedang</td>
                <td className="py-3 px-3">Pabrik & data center berdaya tetap</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-zinc-900 font-mono">Modbus RTU / RS485</td>
                <td className="py-3 px-3">&le; 1.200 meter</td>
                <td className="py-3 px-3">Sangat Cepat</td>
                <td className="py-3 px-3">Kabel Fisik</td>
                <td className="py-3 px-3">PLC, genset, dan meteran energi listrik</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-zinc-900 font-mono">LoRaWAN</td>
                <td className="py-3 px-3">2 – 15 km</td>
                <td className="py-3 px-3">Rendah (&lt;50 kbps)</td>
                <td className="py-3 px-3">Sangat Rendah (Baterai)</td>
                <td className="py-3 px-3">Pertanian pintar, pemantauan tangki air</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-zinc-900 font-mono">4G LTE-M / NB-IoT</td>
                <td className="py-3 px-3">Jangkauan Seluler</td>
                <td className="py-3 px-3">Sedang</td>
                <td className="py-3 px-3">Optimal Baterai</td>
                <td className="py-3 px-3">Pelacak kargo logistik & cold chain</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* CTA Banner */}
        <div className="rounded-lg bg-zinc-950 text-white p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Siap Mengintegrasikan Perangkat Lapangan Anda?
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto mb-6 leading-relaxed">
            Insinyur sistem PT Innodesk siap membantu memetakan topologi sensor, pemilihan gateway, serta konfigurasi dashboard sentral.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-950 bg-white rounded hover:bg-zinc-100 transition-colors"
          >
            <span>Hubungi Divisi Engineering</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
