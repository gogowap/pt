import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Cpu,
  Activity,
  Layers,
  Radio,
  BarChart3,
  ShieldAlert,
  Server,
  CheckCircle2,
  Send,
  Building2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ApiClient } from '../../lib/api';

export const HomePage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: 'Smart Monitoring',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await ApiClient.get<any[]>('/api/projects');
      if (res.success && res.data) {
        setProjects(res.data.slice(0, 3));
      }
      setLoadingProjects(false);
    };
    fetchProjects();
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) {
      errors.name = 'Nama lengkap minimal 3 karakter.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Format email tidak valid.';
    }
    if (!formData.company.trim()) {
      errors.company = 'Nama perusahaan atau instansi wajib diisi.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 15) {
      errors.message = 'Pesan kebutuhan minimal 15 karakter.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const res = await ApiClient.post('/api/contact', formData);
    setIsSubmitting(false);

    if (res.success) {
      setSubmitSuccess(res.message || 'Pesan Anda berhasil disimpan ke database PT Innodesk.');
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: 'Smart Monitoring',
        message: '',
      });
      setFormErrors({});
    } else {
      setFormErrors({ form: res.error || 'Gagal mengirim pesan.' });
    }
  };

  return (
    <div className="pt-18 pb-12">
      {/* 1. HERO SECTION */}
      <section className="py-20 md:py-28 bg-[#FAFAFA] border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Value Proposition (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-4">
                <span>PT Innodesk</span>
                <span aria-hidden="true">·</span>
                <span>Internet of Things (IoT) Solutions</span>
              </div>

              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-zinc-950 tracking-tight leading-[1.15] mb-6"
                style={{ textWrap: 'balance' }}
              >
                Infrastruktur IoT Presisi untuk Pengawasan Operasional Industri.
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl mb-8">
                PT Innodesk merancang dan menerapkan ekosistem Internet of Things (IoT) end-to-end: dari sensor transduser lapangan, edge telemetry gateway, hingga dashboard pengawasan sentral berkecepatan tinggi dengan analitik real-time.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
                <a
                  href="#contact-form"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold tracking-wide text-white bg-zinc-950 rounded-md hover:bg-zinc-800 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Konsultasi Proyek IoT</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  to="/solutions"
                  className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-zinc-800 bg-white border border-zinc-300 rounded-md hover:bg-zinc-100 hover:border-zinc-400 transition-all whitespace-nowrap"
                >
                  <span>Eksplorasi Solusi IoT</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-zinc-200/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-zinc-700" />
                  <span>Protokol MQTT & Modbus Industrial</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-zinc-700" />
                  <span>Penyimpanan Relasional Aman</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-zinc-700" />
                  <span>Deteksi Anomali Ambang Batas</span>
                </div>
              </div>
            </div>

            {/* Visual Asset (5 cols) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-lg overflow-hidden border border-zinc-300 bg-zinc-100 shadow-sm aspect-[16/11]">
                <img
                  src="/src/assets/images/innodesk_hero_architecture_1791787843185.jpg"
                  alt="Fasilitas Operasional & Inovasi IoT PT Innodesk"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale contrast-115"
                />
                <div className="absolute bottom-3 left-3 right-3 px-3 py-2 bg-zinc-950/85 backdrop-blur-xs text-white text-[11px] rounded border border-white/10 flex items-center justify-between">
                  <span className="font-medium tracking-wide">IoT Telemetry Control Center</span>
                  <span className="font-mono text-zinc-400">EDGE-NODE // 01</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Operational KPI Strip */}
          <div className="mt-14 pt-10 border-t border-zinc-200 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex flex-col">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-950 tabular-nums">99.85%</div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-800 mt-1">Uptime Jaringan Gateway</div>
              <div className="text-xs text-zinc-500 mt-0.5">Reliabilitas koneksi node telemetri</div>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-950 tabular-nums">&lt;500 ms</div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-800 mt-1">Latensi Ingestion Data</div>
              <div className="text-xs text-zinc-500 mt-0.5">Kecepatan alur transmisi telemetri</div>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-950 tabular-nums">100%</div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-800 mt-1">Audit Trail & Keamanan</div>
              <div className="text-xs text-zinc-500 mt-0.5">Pencatatan log transaksi terenkripsi</div>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-950 tabular-nums">24/7</div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-800 mt-1">Pengawasan Insiden Otomatis</div>
              <div className="text-xs text-zinc-500 mt-0.5">Peringatan dini ambang batas sensor</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IoT WORKS (Arsitektur Telemetri Terpadu) */}
      <section className="py-20 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2">
              <span>Metodologi Rekayasa</span>
              <span aria-hidden="true">·</span>
              <span>Alur Data Sistem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-950 tracking-tight">
              Bagaimana Arsitektur IoT PT Innodesk Bekerja
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed">
              Kami menyederhanakan kompleksitas integrasi perangkat keras ke dalam alur kerja lima tahap yang aman, handal, dan mudah dipelihara.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Transduser & Sensor',
                desc: 'Akuisisi data fisik seperti temperatur, vibrasi mekanis, tekanan udara, dan arus daya listrik.',
                icon: Activity,
              },
              {
                step: '02',
                title: 'Edge Gateway',
                desc: 'Konsolidasi data lokal melalui protokol Modbus/RS485, sanitasi noise, dan enkripsi payload.',
                icon: Cpu,
              },
              {
                step: '03',
                title: 'Ingestion Service',
                desc: 'Penerimaan payload via REST/MQTT API berkecepatan tinggi dengan validasi UID perangkat.',
                icon: Radio,
              },
              {
                step: '04',
                title: 'Relational Storage',
                desc: 'Penyimpanan terstruktur pada database dengan pengindeksan waktu untuk analisis time-series.',
                icon: Server,
              },
              {
                step: '05',
                title: 'Live Action & Alert',
                desc: 'Visualisasi dashboard interaktif dan otomatisasi notifikasi saat pembacaan melewati ambang batas.',
                icon: ShieldAlert,
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="p-5 rounded-lg border border-zinc-200 bg-zinc-50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-8 h-8 rounded bg-zinc-950 text-white flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-xs font-bold text-zinc-400">FASE · {s.step}</span>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-950 mb-2">{s.title}</h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CORE IoT SOLUTIONS (6 Pilar Solusi) */}
      <section className="py-20 md:py-24 bg-[#FAFAFA] border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2">
                <span>Layanan & Portofolio Teknologi</span>
                <span aria-hidden="true">·</span>
                <span>Solusi Utama</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-950 tracking-tight">
                6 Pilar Solusi Internet of Things PT Innodesk
              </h2>
            </div>
            <Link
              to="/solutions"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-950 hover:text-zinc-600 py-1"
            >
              <span>Lihat Detail Spesifikasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 'smart-monitoring',
                title: 'Smart Monitoring',
                desc: 'Pemantauan parameter ambient, suhu cold storage, kelembaban ruangan server, dan kualitas udara secara berkesinambungan.',
                icon: Activity,
                specs: 'Akurasi ±0.2°C, Rentang -40°C hingga +85°C, Notifikasi multi-kanal',
              },
              {
                id: 'industrial-iot',
                title: 'Industrial IoT (IIoT)',
                desc: 'Integrasi mesin pabrik, sensor getaran motor, pemantauan status PLC, dan estimasi waktu pemeliharaan preventif.',
                icon: Cpu,
                specs: 'Akselerometer 3-Axis, Protokol Modbus RTU/TCP, Sampling rate 10kHz',
              },
              {
                id: 'asset-tracking',
                title: 'Asset Tracking',
                desc: 'Pelacakan aset berharga bergerak dan armada logistik distribusi dengan modul GNSS presisi tinggi dan geofencing.',
                icon: Radio,
                specs: 'GPS/GLONASS/Galileo, Seluler 4G LTE-M / NB-IoT, Baterai siaga 3 tahun',
              },
              {
                id: 'smart-automation',
                title: 'Smart Automation',
                desc: 'Otomatisasi kendali relay dan aktuator berdasarkan logika pembacaan sensor tanpa intervensi manual.',
                icon: Layers,
                specs: 'Relay output 10A 250VAC, Eksekusi deterministik lokal, Fail-safe mode',
              },
              {
                id: 'iot-dashboard',
                title: 'IoT Telemetry Dashboard',
                desc: 'Antarmuka web responsif dengan visualisasi grafik time-series, manajemen inventaris perangkat, dan status koneksi.',
                icon: BarChart3,
                specs: 'Visualisasi Recharts, Polling dinamis, Manajemen role pengguna (RBAC)',
              },
              {
                id: 'connected-devices',
                title: 'Connected Devices Ecosystem',
                desc: 'Pengembangan node kustom berdaya ultra-rendah dan sertifikasi ketahanan lingkungan industri IP65/IP67.',
                icon: Server,
                specs: 'Enclosure tahan benturan, Proteksi lonjakan voltase, Desain PCB modular',
              },
            ].map((sol) => {
              const Icon = sol.icon;
              return (
                <div
                  key={sol.id}
                  className="bg-white rounded-lg border border-zinc-200 p-6 flex flex-col justify-between hover:border-zinc-400 hover:shadow-xs transition-all"
                >
                  <div>
                    <div className="w-10 h-10 rounded-md bg-zinc-950 text-white flex items-center justify-center mb-5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-950 mb-2">{sol.title}</h3>
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-4">{sol.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-zinc-100 text-[11px] font-mono text-zinc-500">
                    {sol.specs}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS (Dinamis dari Database) */}
      <section className="py-20 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2">
                <span>Studi Kasus & Implementasi</span>
                <span aria-hidden="true">·</span>
                <span>Data Database</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-950 tracking-tight">
                Portofolio Proyek IoT Unggulan
              </h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-950 hover:text-zinc-600 py-1"
            >
              <span>Seluruh Proyek</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loadingProjects ? (
            <div className="py-12 text-center text-xs text-zinc-500 font-mono">Memuat data proyek dari database...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="border border-zinc-200 rounded-lg overflow-hidden bg-white flex flex-col justify-between">
                  <div>
                    <div className="h-44 bg-zinc-100 relative overflow-hidden">
                      {proj.image_url ? (
                        <img
                          src={proj.image_url}
                          alt={proj.title}
                          className="w-full h-full object-cover grayscale contrast-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400 font-mono">
                          ASSET DOKUMENTASI PROYEK
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded font-medium">
                        {proj.category}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-bold text-zinc-950 mb-2">{proj.title}</h3>
                      <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3">{proj.description}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <Link
                      to="/projects"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:text-zinc-600"
                    >
                      <span>Pelajari Studi Kasus</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. INTERACTIVE CONTACT FORM (Disimpan Persisten ke Database) */}
      <section id="contact-form" className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Context & Info (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2">
                  <span>Konsultasi & Kemitraan</span>
                  <span aria-hidden="true">·</span>
                  <span>Hubungi Tim Insinyur</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight leading-tight">
                  Diskusikan Kebutuhan Infrastruktur IoT Anda
                </h2>
                <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                  Kirimkan detail parameter sistem operasional yang ingin Anda pantau. Formulir ini terhubung langsung ke database backend PT Innodesk untuk evaluasi teknis.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-zinc-200 p-5 space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900 block">Kantor Pusat PT Innodesk</span>
                    <span className="text-zinc-600">Gedung Pusat Bisnis Terpadu, Jakarta, Indonesia [Placeholder Resmi]</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900 block">Jam Operasional Layanan</span>
                    <span className="text-zinc-600">Senin – Jumat: 08:30 – 17:30 WIB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-lg border border-zinc-200 p-6 sm:p-8 shadow-xs">
                {submitSuccess ? (
                  <div className="py-6 text-center space-y-4">
                    <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-900">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-950">Pesan Berhasil Disimpan ke Database!</h3>
                    <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
                      {submitSuccess}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitSuccess(null)}
                      className="px-5 py-2 text-xs font-semibold tracking-wider uppercase text-white bg-zinc-950 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      Kirim Pesan Lainnya
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} noValidate className="space-y-4">
                    {formErrors.form && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                        {formErrors.form}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-1">
                          Nama Lengkap *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ir. Budi Santoso"
                          className="w-full px-3.5 py-2.5 text-xs rounded border border-zinc-300 focus:border-zinc-950 focus:outline-none"
                        />
                        {formErrors.name && <p className="text-[11px] text-red-600 mt-0.5">{formErrors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-1">
                          Email Perusahaan *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="budi@perusahaan.co.id"
                          className="w-full px-3.5 py-2.5 text-xs rounded border border-zinc-300 focus:border-zinc-950 focus:outline-none"
                        />
                        {formErrors.email && <p className="text-[11px] text-red-600 mt-0.5">{formErrors.email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-1">
                          Instansi / Perusahaan *
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="PT Manufaktur Mandiri"
                          className="w-full px-3.5 py-2.5 text-xs rounded border border-zinc-300 focus:border-zinc-950 focus:outline-none"
                        />
                        {formErrors.company && <p className="text-[11px] text-red-600 mt-0.5">{formErrors.company}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-1">
                          Kategori Solusi
                        </label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs rounded border border-zinc-300 focus:border-zinc-950 focus:outline-none bg-white"
                        >
                          <option value="Smart Monitoring">Smart Monitoring</option>
                          <option value="Industrial IoT (IIoT)">Industrial IoT (IIoT)</option>
                          <option value="Asset Tracking">Asset Tracking</option>
                          <option value="Smart Automation">Smart Automation</option>
                          <option value="IoT Dashboard Integration">IoT Dashboard Integration</option>
                          <option value="Custom Hardware & Sensors">Custom Hardware & Sensors</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-1">
                        Deskripsi Kebutuhan Teknis *
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Jelaskan jenis sensor, jumlah titik pemantauan, atau arsitektur jaringan yang direncanakan..."
                        className="w-full px-3.5 py-2.5 text-xs rounded border border-zinc-300 focus:border-zinc-950 focus:outline-none"
                      />
                      {formErrors.message && <p className="text-[11px] text-red-600 mt-0.5">{formErrors.message}</p>}
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-zinc-500">
                        * Data disimpan persisten ke tabel database MySQL.
                      </span>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-zinc-950 rounded hover:bg-zinc-800 disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Menyimpan...</span>
                          </>
                        ) : (
                          <>
                            <span>Kirim ke Database</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
