import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Cpu,
  Activity,
  Layers,
  Radio,
  BarChart3,
  ShieldCheck,
  Server,
  CheckCircle2,
  Send,
  Building2,
  Clock,
  Sparkles,
  Sliders,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Download,
  Info,
  ChevronRight,
  ExternalLink,
  Zap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ApiClient } from '../../lib/api';

interface SensorSimItem {
  id: string;
  name: string;
  node: string;
  type: string;
  unit: string;
  currentValue: number;
  minLimit: number;
  maxLimit: number;
  history: { time: string; val: number }[];
}

export const HomePage: React.FC = () => {
  // 1. Projects State
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // 2. Interactive Simulator State (100% Frontend React State)
  const [sensors, setSensors] = useState<SensorSimItem[]>([
    {
      id: 'sen-01',
      name: 'Suhu Server Rack HQ',
      node: 'EDGE-GATEWAY-01',
      type: 'Temperature',
      unit: '°C',
      currentValue: 23.8,
      minLimit: 18.0,
      maxLimit: 27.0,
      history: [
        { time: '10:00', val: 23.2 },
        { time: '10:05', val: 23.5 },
        { time: '10:10', val: 23.9 },
        { time: '10:15', val: 24.1 },
        { time: '10:20', val: 23.6 },
        { time: '10:25', val: 23.8 },
      ],
    },
    {
      id: 'sen-02',
      name: 'Kelembaban Ruang Penyimpanan',
      node: 'EDGE-GATEWAY-01',
      type: 'Humidity',
      unit: '%RH',
      currentValue: 53.4,
      minLimit: 40.0,
      maxLimit: 65.0,
      history: [
        { time: '10:00', val: 51.0 },
        { time: '10:05', val: 52.3 },
        { time: '10:10', val: 53.0 },
        { time: '10:15', val: 54.2 },
        { time: '10:20', val: 53.9 },
        { time: '10:25', val: 53.4 },
      ],
    },
    {
      id: 'sen-03',
      name: 'Vibrasi Motor Konveyor Pabrik',
      node: 'EDGE-GATEWAY-02',
      type: 'Vibration',
      unit: 'mm/s',
      currentValue: 2.15,
      minLimit: 0.5,
      maxLimit: 4.5,
      history: [
        { time: '10:00', val: 1.8 },
        { time: '10:05', val: 1.95 },
        { time: '10:10', val: 2.3 },
        { time: '10:15', val: 2.1 },
        { time: '10:20', val: 2.22 },
        { time: '10:25', val: 2.15 },
      ],
    },
    {
      id: 'sen-04',
      name: 'Beban Arus Listrik Busbar',
      node: 'EDGE-GATEWAY-02',
      type: 'Current',
      unit: 'Ampere',
      currentValue: 34.2,
      minLimit: 5.0,
      maxLimit: 48.0,
      history: [
        { time: '10:00', val: 32.0 },
        { time: '10:05', val: 33.4 },
        { time: '10:10', val: 35.1 },
        { time: '10:15', val: 34.8 },
        { time: '10:20', val: 33.9 },
        { time: '10:25', val: 34.2 },
      ],
    },
  ]);
  const [activeSensorId, setActiveSensorId] = useState('sen-01');
  const [isSimRunning, setIsSimRunning] = useState(true);
  const [manualSliderValue, setManualSliderValue] = useState<number | null>(null);

  // 3. Solution Calculator / Estimator State
  const [calcScale, setCalcScale] = useState<'small' | 'medium' | 'enterprise'>('medium');
  const [calcDomain, setCalcDomain] = useState<'monitoring' | 'iiot' | 'fleet'>('monitoring');

  // 4. Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    solutionCategory: 'Smart Industrial & Manufacturing',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<{
    ticketId: string;
    timestamp: string;
    data: typeof formData;
  } | null>(null);
  const [ticketCopied, setTicketCopied] = useState(false);

  // Load Projects from ApiClient (supports frontend mock)
  useEffect(() => {
    const fetchProjects = async () => {
      const res = await ApiClient.get<any[]>('/api/projects');
      if (res.success && res.data) {
        setProjects(res.data);
      }
    };
    fetchProjects();
  }, []);

  // Simulator interval loop
  useEffect(() => {
    if (!isSimRunning) return;
    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((s) => {
          const delta = (Math.random() - 0.48) * (s.type === 'Vibration' ? 0.35 : 0.8);
          const nextVal = Number((s.currentValue + delta).toFixed(2));
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const nextHistory = [...s.history.slice(1), { time: timeStr, val: nextVal }];
          return {
            ...s,
            currentValue: nextVal,
            history: nextHistory,
          };
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [isSimRunning]);

  const activeSensor = sensors.find((s) => s.id === activeSensorId) || sensors[0];
  const displayVal = manualSliderValue !== null ? manualSliderValue : activeSensor.currentValue;
  const isBreached = displayVal < activeSensor.minLimit || displayVal > activeSensor.maxLimit;
  const alertStatus = isBreached
    ? displayVal > activeSensor.maxLimit * 1.15
      ? 'CRITICAL'
      : 'WARNING'
    : 'NORMAL';

  // Manual Slider handler
  const handleSliderChange = (newVal: number) => {
    setManualSliderValue(newVal);
    setSensors((prev) =>
      prev.map((s) => {
        if (s.id === activeSensorId) {
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          return {
            ...s,
            currentValue: newVal,
            history: [...s.history.slice(1), { time: timeStr, val: newVal }],
          };
        }
        return s;
      })
    );
  };

  // Contact form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) {
      errors.name = 'Nama lengkap minimal 3 karakter.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Format email perusahaan tidak valid.';
    }
    if (!formData.company.trim()) {
      errors.company = 'Nama perusahaan atau institusi wajib diisi.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 15) {
      errors.message = 'Deskripsi kebutuhan teknis minimal 15 karakter.';
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
      const ticket = `INN-IOT-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmissionReceipt({
        ticketId: ticket,
        timestamp: new Date().toLocaleString('id-ID'),
        data: { ...formData },
      });
      setFormData({
        name: '',
        email: '',
        company: '',
        solutionCategory: 'Smart Industrial & Manufacturing',
        message: '',
      });
      setFormErrors({});
    }
  };

  const copyTicket = () => {
    if (submissionReceipt?.ticketId) {
      navigator.clipboard.writeText(submissionReceipt.ticketId);
      setTicketCopied(true);
      setTimeout(() => setTicketCopied(false), 2500);
    }
  };

  return (
    <div className="pt-18 pb-12 bg-[#FFFFFF] text-[#111111] font-sans">
      {/* 1. HERO SECTION */}
      <section className="py-20 md:py-28 bg-[#FFFFFF] border-b border-[#E5E5E5] relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Value Proposition (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#737373] mb-4">
                <span className="inline-block w-2 h-2 rounded-full bg-[#111111]" />
                <span>PT Innodesk</span>
                <span aria-hidden="true" className="text-[#E5E5E5]">·</span>
                <span>Internet of Things (IoT) Systems</span>
              </div>

              {/* Exact Master Headline */}
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#111111] tracking-tight leading-[1.14] mb-6"
                style={{ textWrap: 'balance' }}
              >
                Connecting Devices. Empowering Intelligence.
              </h1>

              {/* Exact Master Description */}
              <p className="text-base sm:text-lg text-[#737373] leading-relaxed max-w-2xl mb-8">
                PT Innodesk menghadirkan solusi Internet of Things untuk membantu bisnis menghubungkan perangkat, memantau operasional, dan mengoptimalkan pengambilan keputusan berbasis data.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
                <a
                  href="#solutions"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold tracking-wide text-white bg-[#111111] rounded hover:bg-[#242424] active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap shadow-xs"
                >
                  <span>Jelajahi Solusi</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-[#111111] bg-white border border-[#E5E5E5] rounded hover:bg-[#F7F7F7] hover:border-[#737373] transition-all whitespace-nowrap"
                >
                  <span>Hubungi Kami</span>
                </a>
              </div>

              {/* Badges / Tech Highlights */}
              <div className="pt-6 border-t border-[#E5E5E5] flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#737373]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#111111]" />
                  <span>Protokol MQTT, CoAP & Modbus</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#111111]" />
                  <span>Edge Computing & Anomali Real-time</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#111111]" />
                  <span>Arsitektur End-to-End Handal</span>
                </div>
              </div>
            </div>

            {/* Visual Asset & Live Telemetry Feed Card (5 cols) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-lg overflow-hidden border border-[#E5E5E5] bg-[#F7F7F7] shadow-sm">
                <div className="aspect-[16/11] relative overflow-hidden bg-[#242424]">
                  <img
                    src="/src/assets/images/innodesk_hero_architecture_1791787843185.jpg"
                    alt="Pusat Operasional IoT PT Innodesk"
                    className="w-full h-full object-cover grayscale contrast-115"
                  />
                  <div className="absolute top-3 left-3 bg-[#111111]/85 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded border border-white/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>EDGE-HUB // ACTIVE</span>
                  </div>
                </div>

                {/* Telemetry Snapshot Panel */}
                <div className="p-4 bg-white border-t border-[#E5E5E5] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#737373]">NODE TELEMETRY STATUS</span>
                    <span className="text-emerald-700 font-semibold">ONLINE (0 ms latency)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-[#F7F7F7] rounded border border-[#E5E5E5]">
                      <span className="text-[10px] text-[#737373] font-mono block">SUHU SERVER</span>
                      <span className="text-sm font-bold font-mono text-[#111111]">
                        {sensors[0].currentValue} °C
                      </span>
                    </div>
                    <div className="p-2.5 bg-[#F7F7F7] rounded border border-[#E5E5E5]">
                      <span className="text-[10px] text-[#737373] font-mono block">VIBRASI MOTOR</span>
                      <span className="text-sm font-bold font-mono text-[#111111]">
                        {sensors[2].currentValue} mm/s
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="mt-14 pt-10 border-t border-[#E5E5E5] grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex flex-col">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#111111] tabular-nums">99.85%</div>
              <div className="text-xs sm:text-sm font-semibold text-[#242424] mt-1">Uptime Telemetri Gateway</div>
              <div className="text-xs text-[#737373] mt-0.5">Stabilitas konektivitas 24/7</div>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#111111] tabular-nums">&lt;500 ms</div>
              <div className="text-xs sm:text-sm font-semibold text-[#242424] mt-1">Kecepatan Transmisi Data</div>
              <div className="text-xs text-[#737373] mt-0.5">Alur pemrosesan MQTT / REST</div>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#111111] tabular-nums">4 Lapis</div>
              <div className="text-xs sm:text-sm font-semibold text-[#242424] mt-1">Arsitektur Modular</div>
              <div className="text-xs text-[#737373] mt-0.5">Sensor, Jaringan, Cloud & Analisis</div>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#111111] tabular-nums">0%</div>
              <div className="text-xs sm:text-sm font-semibold text-[#242424] mt-1">Vendor Lock-in</div>
              <div className="text-xs text-[#737373] mt-0.5">Mendukung protokol industri terbuka</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SOLUTIONS SECTION (3 Core Solutions & Expanded Pillars) */}
      <section id="solutions" className="py-20 md:py-24 bg-[#F7F7F7] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#737373] mb-2">
                <span>Pilar Solusi IoT</span>
                <span aria-hidden="true" className="text-[#E5E5E5]">·</span>
                <span>Internet of Things Portfolio</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] tracking-tight">
                Solusi Unggulan Internet of Things PT Innodesk
              </h2>
              <p className="mt-3 text-sm text-[#737373] leading-relaxed">
                Kami menyediakan tumpukan solusi IoT yang siap diterapkan, terukur dari tahap uji coba (PoC) hingga penyebaran masif ribuan node perangkat.
              </p>
            </div>
            <Link
              to="/solutions"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#111111] hover:text-[#737373] transition-colors py-1 shrink-0"
            >
              <span>Lihat Detail Spesifikasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 3 Core Solutions Required by Brief + Additional Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 1. Smart Industrial & Manufacturing */}
            <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 sm:p-8 flex flex-col justify-between hover:border-[#737373] hover:shadow-xs transition-all group">
              <div>
                <div className="w-10 h-10 rounded bg-[#111111] text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-[#737373] uppercase block mb-1">SOLUSI · 01</span>
                <h3 className="text-lg font-bold text-[#111111] mb-2">Smart Industrial & Manufacturing</h3>
                <p className="text-xs sm:text-sm text-[#737373] leading-relaxed mb-6">
                  Monitoring mesin industri, efisiensi energi lini produksi, dan analisis prediktif untuk meminimalkan kegagalan mekanis.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-[#E5E5E5]">
                  <span className="text-[11px] font-mono font-bold text-[#111111] uppercase block">
                    Kapabilitas Sistem:
                  </span>
                  <div className="flex items-start gap-2 text-xs text-[#242424]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5" />
                    <span>Sensor vibrasi motor 3-axis & deteksi keausan bearing</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#242424]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5" />
                    <span>Integrasi Modbus RTU/TCP langsung ke PLC mesin</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#242424]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5" />
                    <span>Kalkulasi metrik Overall Equipment Effectiveness (OEE)</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-[#737373]">Protokol: Modbus, MQTT</span>
                <a
                  href="#interactive-demo"
                  className="inline-flex items-center gap-1 font-semibold text-[#111111] hover:text-[#737373]"
                >
                  <span>Coba Demo</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* 2. Smart Building & Energy */}
            <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 sm:p-8 flex flex-col justify-between hover:border-[#737373] hover:shadow-xs transition-all group">
              <div>
                <div className="w-10 h-10 rounded bg-[#111111] text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-[#737373] uppercase block mb-1">SOLUSI · 02</span>
                <h3 className="text-lg font-bold text-[#111111] mb-2">Smart Building & Energy</h3>
                <p className="text-xs sm:text-sm text-[#737373] leading-relaxed mb-6">
                  Manajemen daya listrik cerdas, otomasi HVAC & sirkulasi udara gedung, serta pengawasan utilitas fasilitas publik.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-[#E5E5E5]">
                  <span className="text-[11px] font-mono font-bold text-[#111111] uppercase block">
                    Kapabilitas Sistem:
                  </span>
                  <div className="flex items-start gap-2 text-xs text-[#242424]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5" />
                    <span>Pemantauan kualitas udara (CO2, PM2.5, VOC) & termal</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#242424]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5" />
                    <span>Current Transformer (CT) metering sub-panel listrik</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#242424]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5" />
                    <span>Otomasi relai jadwal & ambang batas occupancy</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-[#737373]">Protokol: BACnet, MQTT</span>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1 font-semibold text-[#111111] hover:text-[#737373]"
                >
                  <span>Konsultasi</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* 3. Fleet & Asset Tracking */}
            <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 sm:p-8 flex flex-col justify-between hover:border-[#737373] hover:shadow-xs transition-all group">
              <div>
                <div className="w-10 h-10 rounded bg-[#111111] text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Radio className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-[#737373] uppercase block mb-1">SOLUSI · 03</span>
                <h3 className="text-lg font-bold text-[#111111] mb-2">Fleet & Asset Tracking</h3>
                <p className="text-xs sm:text-sm text-[#737373] leading-relaxed mb-6">
                  Pemantauan armada kendaraan distribusi, geofencing lokasi real-time, serta sensor suhu kargo cold-chain jarak jauh.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-[#E5E5E5]">
                  <span className="text-[11px] font-mono font-bold text-[#111111] uppercase block">
                    Kapabilitas Sistem:
                  </span>
                  <div className="flex items-start gap-2 text-xs text-[#242424]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5" />
                    <span>Modul GNSS presisi tinggi dengan baterai siaga 3 tahun</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#242424]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5" />
                    <span>Jaringan seluler 4G Cat-M1 & NB-IoT hemat daya</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#242424]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5" />
                    <span>Audit trail suhu kontainer vaksin & bahan pangan</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-[#737373]">Protokol: Cellular LTE-M, BLE</span>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1 font-semibold text-[#111111] hover:text-[#737373]"
                >
                  <span>Konsultasi</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TECHNOLOGY & ARCHITECTURE SECTION (4-Layer IoT Architecture) */}
      <section id="technology" className="py-20 md:py-28 bg-[#FFFFFF] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#737373] mb-2">
              <span>Arsitektur Sistem</span>
              <span aria-hidden="true" className="text-[#E5E5E5]">·</span>
              <span>4-Layer IoT Model</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] tracking-tight">
              Arsitektur Internet of Things 4 Lapis PT Innodesk
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#737373] leading-relaxed">
              Arsitektur modular kami memastikan isolasi kesalahan yang baik, keamanan bertingkat dari sisi fisik perangkat hingga komputasi awan, serta kemudahan integrasi dengan sistem korporasi eksisting.
            </p>
          </div>

          {/* 4 Layers Architectural Diagram */}
          <div className="space-y-4 mb-14">
            {[
              {
                layer: '04',
                name: 'Application & Analytics Layer',
                subtitle: 'Visualisasi, Dashboard Terpusat, & API Eksternal',
                description:
                  'Menyediakan antarmuka grafis interaktif untuk operator, visualisasi tren waktu (time-series), notifikasi anomali, ekspor audit, dan API terbuka untuk integrasi ke ERP / SAP perusahaan.',
                techs: ['Next/React SPA', 'Recharts Visualizer', 'RESTful API / Webhooks', 'Role-Based Access (RBAC)'],
                icon: BarChart3,
              },
              {
                layer: '03',
                name: 'Cloud & Processing Layer',
                subtitle: 'Data Ingestion Engine & Time-Series Engine',
                description:
                  'Layanan backend berkinerja tinggi yang memverifikasi tanda tangan payload, menyaring derau (noise filtering), mengevaluasi ambang batas secara instan, dan menyimpan data secara persisten.',
                techs: ['Stream Ingestion', 'Time-Series Indexing', 'Rule Engine (IF-THEN)', 'Enkripsi Data At-Rest'],
                icon: Server,
              },
              {
                layer: '02',
                name: 'Connectivity & Protocol Layer',
                subtitle: 'Transmisi Nirkabel & Kabel Berkeamanan Tinggi',
                description:
                  'Mengelola koneksi telemetri antara node fisik lapangan dengan server pusat menggunakan protokol industri yang teruji, andal, dan hemat konsumsi bandwidth.',
                techs: ['MQTT / TLS 1.3', 'Modbus RTU/TCP', 'LoRaWAN Long-Range', 'Cellular 4G LTE-M / NB-IoT'],
                icon: Radio,
              },
              {
                layer: '01',
                name: 'Sensing & Device Layer',
                subtitle: 'Transduser Fisik, Edge Computing, & Mikrokontroler',
                description:
                  'Akuisisi data langsung dari lingkungan atau mesin dengan toleransi deviasi rendah, penyaringan derau lokal, proteksi lonjakan listrik industri, dan casing berstandar IP67.',
                techs: ['Sensor PT100 / Thermocouple', 'Akselerometer 3-Axis', 'Edge Microcontroller', 'IP67 Rugged Enclosure'],
                icon: Cpu,
              },
            ].map((l) => {
              const Icon = l.icon;
              return (
                <div
                  key={l.layer}
                  className="rounded-lg border border-[#E5E5E5] bg-[#F7F7F7] p-6 sm:p-8 hover:border-[#111111] transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4 max-w-3xl">
                      <div className="w-10 h-10 rounded bg-[#111111] text-white flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-[#737373]">LAYER · {l.layer}</span>
                          <span className="text-[#E5E5E5]">|</span>
                          <span className="text-xs font-semibold text-[#111111]">{l.subtitle}</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#111111] mb-2">{l.name}</h3>
                        <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">{l.description}</p>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-wrap lg:flex-col gap-1.5 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#E5E5E5]">
                      {l.techs.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 text-[11px] font-mono rounded bg-white text-[#242424] border border-[#E5E5E5]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE FEATURE: LIVE SENSOR SIMULATOR (100% Frontend State with Recharts) */}
      <section id="interactive-demo" className="py-20 bg-[#F7F7F7] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#737373] mb-2">
              <Zap className="w-4 h-4 text-[#111111]" />
              <span>Simulasi Interaktif Tanpa Backend</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
              Live Interactive IoT Telemetry Simulator
            </h2>
            <p className="mt-2 text-sm text-[#737373] leading-relaxed">
              Demonstrasi pemantauan telemetri waktu nyata di sisi klien (React state). Anda dapat mengaktifkan siklus auto-tick, beralih antar sensor, dan menggeser slider ambang batas untuk menguji deteksi anomali.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 sm:p-8 shadow-xs">
            {/* Simulator Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5E5E5] gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${isSimRunning ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
                <span className="text-xs font-mono font-bold text-[#111111]">
                  STATUS TRANSMISI: {isSimRunning ? 'STREAMING AKTIF (3.5s)' : 'DIJEDA MANUAL'}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSimRunning(!isSimRunning)}
                  className={`px-3 py-1.5 text-xs font-mono font-semibold rounded uppercase tracking-wider transition-colors cursor-pointer ${
                    isSimRunning
                      ? 'bg-[#111111] text-white hover:bg-[#242424]'
                      : 'bg-[#E5E5E5] text-[#242424] hover:bg-[#737373] hover:text-white'
                  }`}
                >
                  {isSimRunning ? 'Jeda Stream' : 'Lanjutkan Stream'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setManualSliderValue(null);
                  }}
                  className="px-3 py-1.5 text-xs font-mono text-[#737373] hover:text-[#111111] border border-[#E5E5E5] rounded bg-white hover:bg-[#F7F7F7] cursor-pointer"
                >
                  Reset Manual
                </button>
              </div>
            </div>

            {/* Sensor Switcher Tabs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              {sensors.map((s) => {
                const isActive = s.id === activeSensorId;
                const isItemBreached = s.currentValue < s.minLimit || s.currentValue > s.maxLimit;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setActiveSensorId(s.id);
                      setManualSliderValue(null);
                    }}
                    className={`p-3.5 rounded border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'border-[#111111] bg-[#111111] text-white shadow-xs'
                        : 'border-[#E5E5E5] bg-[#F7F7F7] hover:border-[#737373] text-[#111111]'
                    }`}
                  >
                    <div className={`text-[10px] font-mono ${isActive ? 'text-[#E5E5E5]' : 'text-[#737373]'}`}>
                      {s.node}
                    </div>
                    <div className="text-xs font-bold truncate mt-0.5">{s.name}</div>
                    <div className="mt-2 flex items-baseline justify-between font-mono">
                      <span className="text-sm font-bold tabular-nums">
                        {s.currentValue} {s.unit}
                      </span>
                      {isItemBreached && (
                        <span className="text-[10px] font-bold text-red-400">ALERT</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Telemetry Display & Live Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Metric Details & Interactive Slider (5 cols) */}
              <div className="lg:col-span-5 space-y-5 bg-[#F7F7F7] p-6 rounded-lg border border-[#E5E5E5]">
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#737373] block mb-1">
                    PEMBACAAN TELEMETRI LANGSUNG:
                  </span>
                  <div className="text-4xl font-bold font-mono text-[#111111] tabular-nums flex items-baseline gap-2">
                    <span>{displayVal}</span>
                    <span className="text-lg font-normal text-[#737373]">{activeSensor.unit}</span>
                  </div>
                </div>

                {/* Status Indicator Pill */}
                <div>
                  {alertStatus === 'NORMAL' && (
                    <div className="p-3 bg-white border border-[#E5E5E5] rounded text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold">Status: Parameter Berada dalam Batas Toleransi Normal</span>
                    </div>
                  )}
                  {alertStatus === 'WARNING' && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-semibold">Peringatan: Nilai Mendekati / Melewati Ambang Batas!</span>
                    </div>
                  )}
                  {alertStatus === 'CRITICAL' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span className="font-semibold">Kritis: Nilai Ekstrem! Pemicuan Relai Darurat Aktif!</span>
                    </div>
                  )}
                </div>

                {/* Interactive Slider to simulate values */}
                <div className="pt-4 border-t border-[#E5E5E5] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#242424] font-semibold">Uji Slider Nilai Manual:</span>
                    <span className="text-[#737373]">
                      {activeSensor.minLimit} s/d {activeSensor.maxLimit * 1.3} {activeSensor.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={activeSensor.minLimit * 0.8}
                    max={activeSensor.maxLimit * 1.35}
                    step={activeSensor.type === 'Vibration' ? 0.05 : 0.2}
                    value={displayVal}
                    onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-[#E5E5E5] rounded-lg appearance-none cursor-pointer accent-[#111111]"
                  />
                  <p className="text-[11px] text-[#737373] leading-relaxed">
                    Geser tuas ke kanan melewati batas maks ({activeSensor.maxLimit} {activeSensor.unit}) untuk menguji respon alarm otomatis.
                  </p>
                </div>

                <div className="text-xs font-mono text-[#737373] space-y-1 pt-2">
                  <div>Batas Minimum: {activeSensor.minLimit} {activeSensor.unit}</div>
                  <div>Batas Maksimum: {activeSensor.maxLimit} {activeSensor.unit}</div>
                  <div>Protokol Transmisi: MQTT over TLS (QoS 1)</div>
                </div>
              </div>

              {/* Right Column: Recharts Monochromatic Line Chart (7 cols) */}
              <div className="lg:col-span-7 bg-white p-6 rounded-lg border border-[#E5E5E5] space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-[#111111]">TREN TELEMETRI HISTORIS WAKTU NYATA</span>
                  <span className="text-[#737373]">SATUAN: {activeSensor.unit}</span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activeSensor.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                      <XAxis dataKey="time" stroke="#737373" fontSize={11} tickLine={false} />
                      <YAxis
                        stroke="#737373"
                        fontSize={11}
                        domain={[
                          Math.floor(activeSensor.minLimit * 0.9),
                          Math.ceil(activeSensor.maxLimit * 1.25),
                        ]}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#111111',
                          color: '#FFFFFF',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontFamily: 'monospace',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="val"
                        stroke="#111111"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#111111' }}
                        activeDot={{ r: 5, fill: '#111111' }}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-[#737373] pt-2 border-t border-[#E5E5E5]">
                  <span>Sampling: 6 Titik Terakhir</span>
                  <span>Ambang Normal: {activeSensor.minLimit} - {activeSensor.maxLimit}</span>
                  <Link to="/dashboard" className="text-[#111111] font-semibold hover:underline">
                    Buka Dashboard Penuh &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT US SECTION */}
      <section id="about" className="py-20 md:py-24 bg-[#FFFFFF] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#737373] mb-2">
              <span>Tentang PT Innodesk</span>
              <span aria-hidden="true" className="text-[#E5E5E5]">·</span>
              <span>Profil Korporat</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] tracking-tight">
              Inovasi Telemetri & Kecerdasan Perangkat Terhubung
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#737373] leading-relaxed">
              PT Innodesk didirikan sebagai penyedia solusi terintegrasi dalam lanskap Internet of Things (IoT). Kami menjembatani perangkat keras industri di lapangan dengan sistem pengawasan digital terpusat demi efisiensi operasional yang terukur.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            <div className="lg:col-span-5">
              <div className="rounded-lg overflow-hidden border border-[#E5E5E5] bg-[#F7F7F7] aspect-[4/3]">
                <img
                  src="/src/assets/images/innodesk_workspace_minimal_1791787856954.jpg"
                  alt="Ruang Kerja Rekayasa PT Innodesk"
                  className="w-full h-full object-cover grayscale contrast-110"
                />
              </div>
              <div className="mt-3 text-[11px] font-mono text-[#737373]">
                FASILITAS RISET & EVALUASI FIRMWARE EDGE IOT
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-lg border border-[#E5E5E5] bg-[#F7F7F7]">
                <span className="text-xs font-mono font-bold uppercase text-[#737373] block mb-1">
                  VISI PERUSAHAAN
                </span>
                <p className="text-base font-semibold text-[#111111] leading-relaxed">
                  "Menjadi penggerak utama transformasi infrastruktur cerdas di Indonesia melalui solusi Internet of Things yang terpercaya, aman, dan berstandar internasional."
                </p>
              </div>

              <div className="p-6 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF]">
                <span className="text-xs font-mono font-bold uppercase text-[#737373] block mb-3">
                  MISI KORPORASI
                </span>
                <ul className="space-y-3 text-xs sm:text-sm text-[#242424]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                    <span>Menghadirkan ekosistem node sensor dan edge gateway berdaya tahan tinggi.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                    <span>Membangun pipeline ingestion data telemetri yang aman dan berlatensi ultra-rendah.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                    <span>Memberikan analitik operasional yang mendukung penghematan energi dan zero downtime.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 4 Core Values */}
          <div>
            <h3 className="text-lg font-bold text-[#111111] mb-6">4 Nilai Keunggulan Rekayasa</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Reliability',
                  subtitle: 'Keandalan 24/7',
                  desc: 'Ketahanan node perangkat keras dan uptime gateway untuk menjamin aliran data tanpa henti di medan berat.',
                },
                {
                  title: 'Scalability',
                  subtitle: 'Skalabilitas Masif',
                  desc: 'Arsitektur backend sanggup menampung ekspansi ribuan perangkat tanpa penurunan performa sistem.',
                },
                {
                  title: 'Security',
                  subtitle: 'Keamanan Berlapis',
                  desc: 'Enkripsi payload TLS 1.3, autentikasi kunci ganda, dan kepatuhan audit trail transaksi telemetri.',
                },
                {
                  title: 'Engineering Precision',
                  subtitle: 'Presisi Rekayasa',
                  desc: 'Akurasi transduser yang dikalibrasi ketat untuk menghasilkan data yang dapat dipertanggungjawabkan.',
                },
              ].map((val) => (
                <div key={val.title} className="p-5 rounded-lg border border-[#E5E5E5] bg-[#F7F7F7]">
                  <span className="font-mono text-xs font-bold text-[#737373] uppercase block mb-1">
                    {val.title}
                  </span>
                  <div className="text-sm font-bold text-[#111111] mb-2">{val.subtitle}</div>
                  <p className="text-xs text-[#737373] leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURED PROJECTS / CASE STUDIES */}
      <section className="py-20 bg-[#F7F7F7] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#737373] mb-2">
                <span>Studi Kasus & Portofolio</span>
                <span aria-hidden="true" className="text-[#E5E5E5]">·</span>
                <span>Implementasi Lapangan</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                Portofolio Proyek Internet of Things
              </h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#111111] hover:text-[#737373]"
            >
              <span>Semua Proyek</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((proj) => (
              <div
                key={proj.id}
                className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden flex flex-col justify-between hover:border-[#737373] transition-colors"
              >
                <div>
                  <div className="h-44 bg-[#242424] relative overflow-hidden">
                    <img
                      src={proj.image_url || '/src/assets/images/innodesk_hero_architecture_1791787843185.jpg'}
                      alt={proj.title}
                      className="w-full h-full object-cover grayscale contrast-115"
                    />
                    <div className="absolute top-3 left-3 bg-[#111111]/85 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      {proj.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold text-[#111111] mb-2 line-clamp-2">{proj.title}</h3>
                    <p className="text-xs text-[#737373] leading-relaxed line-clamp-3">{proj.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(proj)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#111111] hover:text-[#737373] cursor-pointer"
                  >
                    <span>Pelajari Rincian</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CONTACT & CONSULTATION SECTION */}
      <section id="contact" className="py-20 md:py-24 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Info Col (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#737373] mb-2">
                  <span>Konsultasi Teknis</span>
                  <span aria-hidden="true" className="text-[#E5E5E5]">·</span>
                  <span>Hubungi Tim Insinyur</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight leading-tight">
                  Diskusikan Kebutuhan Infrastruktur IoT Anda
                </h2>
                <p className="mt-3 text-sm text-[#737373] leading-relaxed">
                  Isi parameter awal kebutuhan sistem yang ingin Anda pantau. Tim insinyur PT Innodesk akan memberikan rekomendasi topologi sensor, pilihan gateway, dan estimasi waktu penerapan.
                </p>
              </div>

              <div className="bg-[#F7F7F7] rounded-lg border border-[#E5E5E5] p-5 space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#111111] block">Kantor Operasional PT Innodesk</span>
                    <span className="text-[#737373]">Gedung Pusat Bisnis Terpadu, Jakarta, Indonesia [Placeholder Resmi]</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#111111] block">Jam Layanan Rekayasa</span>
                    <span className="text-[#737373]">Senin – Jumat: 08:30 – 17:30 WIB</span>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="p-4 rounded border border-[#E5E5E5] bg-[#FFFFFF] text-[11px] text-[#737373] leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                <span>
                  Formulir ini menggunakan validasi frontend menyeluruh dengan simulasi konfirmasi tiket resmi secara instan.
                </span>
              </div>
            </div>

            {/* Form Col (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-[#FFFFFF] rounded-lg border border-[#E5E5E5] p-6 sm:p-8 shadow-xs">
                {submissionReceipt ? (
                  <div className="py-6 space-y-5">
                    <div className="w-12 h-12 bg-[#111111] text-white rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>

                    <div className="text-center">
                      <h3 className="text-lg font-bold text-[#111111]">
                        Permintaan Konsultasi Telah Terverifikasi!
                      </h3>
                      <p className="text-xs sm:text-sm text-[#737373] mt-1 max-w-md mx-auto">
                        Terima kasih, <strong>{submissionReceipt.data.name}</strong>. Tim rekayasa IoT PT Innodesk telah menerima ringkasan kebutuhan sistem Anda.
                      </p>
                    </div>

                    {/* Receipt Details Box */}
                    <div className="p-4 bg-[#F7F7F7] rounded border border-[#E5E5E5] space-y-2.5 font-mono text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
                        <span className="text-[#737373]">NOMOR REFERENSI TIKET:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#111111]">{submissionReceipt.ticketId}</span>
                          <button
                            type="button"
                            onClick={copyTicket}
                            className="p-1 hover:bg-[#E5E5E5] rounded text-[#111111] cursor-pointer"
                            title="Salin ID Tiket"
                          >
                            {ticketCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>Perusahaan: <span className="text-[#111111] font-semibold">{submissionReceipt.data.company}</span></div>
                        <div>Email: <span className="text-[#111111] font-semibold">{submissionReceipt.data.email}</span></div>
                        <div>Kategori: <span className="text-[#111111] font-semibold">{submissionReceipt.data.solutionCategory}</span></div>
                        <div>Waktu Submit: <span className="text-[#111111] font-semibold">{submissionReceipt.timestamp}</span></div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setSubmissionReceipt(null)}
                        className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] rounded hover:bg-[#242424] cursor-pointer"
                      >
                        Kirim Permintaan Baru
                      </button>
                      <button
                        type="button"
                        onClick={copyTicket}
                        className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#111111] bg-white border border-[#E5E5E5] rounded hover:bg-[#F7F7F7] cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {ticketCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{ticketCopied ? 'Tersalin' : 'Salin Tiket'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} noValidate className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                          Nama Lengkap *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ir. Budi Santoso"
                          className="w-full px-3.5 py-2.5 text-xs rounded border border-[#E5E5E5] focus:border-[#111111] focus:outline-none"
                        />
                        {formErrors.name && <p className="text-[11px] text-red-600 mt-0.5">{formErrors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                          Email Perusahaan *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="budi@perusahaan.co.id"
                          className="w-full px-3.5 py-2.5 text-xs rounded border border-[#E5E5E5] focus:border-[#111111] focus:outline-none"
                        />
                        {formErrors.email && <p className="text-[11px] text-red-600 mt-0.5">{formErrors.email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                          Perusahaan / Instansi *
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="PT Manufaktur Mandiri"
                          className="w-full px-3.5 py-2.5 text-xs rounded border border-[#E5E5E5] focus:border-[#111111] focus:outline-none"
                        />
                        {formErrors.company && <p className="text-[11px] text-red-600 mt-0.5">{formErrors.company}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                          Kategori Solusi IoT
                        </label>
                        <select
                          value={formData.solutionCategory}
                          onChange={(e) => setFormData({ ...formData, solutionCategory: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs rounded border border-[#E5E5E5] focus:border-[#111111] focus:outline-none bg-white text-[#111111]"
                        >
                          <option value="Smart Industrial & Manufacturing">Smart Industrial & Manufacturing</option>
                          <option value="Smart Building & Energy">Smart Building & Energy</option>
                          <option value="Fleet & Asset Tracking">Fleet & Asset Tracking</option>
                          <option value="Smart Automation & Closed-Loop Control">Smart Automation & Closed-Loop Control</option>
                          <option value="IoT Telemetry Dashboard Platform">IoT Telemetry Dashboard Platform</option>
                          <option value="Custom Hardware & Sensor Design">Custom Hardware & Sensor Design</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                        Deskripsi Kebutuhan Teknis *
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Jelaskan parameter yang ingin dipantau (suhu, getaran, arus listrik), jumlah titik sensor, atau kendala operasional..."
                        className="w-full px-3.5 py-2.5 text-xs rounded border border-[#E5E5E5] focus:border-[#111111] focus:outline-none"
                      />
                      {formErrors.message && <p className="text-[11px] text-red-600 mt-0.5">{formErrors.message}</p>}
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-[#737373]">
                        * Validasi instan di sisi klien
                      </span>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] rounded hover:bg-[#242424] disabled:opacity-50 cursor-pointer shadow-xs"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Memproses...</span>
                          </>
                        ) : (
                          <>
                            <span>Kirim Permintaan</span>
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

      {/* Project Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/70 backdrop-blur-xs"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white rounded-lg border border-[#E5E5E5] max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] mb-4">
              <span className="text-xs font-mono text-[#737373] uppercase tracking-wider">
                {selectedProject.category}
              </span>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="text-[#737373] hover:text-[#111111] text-xs font-mono cursor-pointer"
              >
                [TUTUP]
              </button>
            </div>

            <div className="h-48 rounded bg-[#242424] overflow-hidden mb-5">
              <img
                src={selectedProject.image_url}
                alt={selectedProject.title}
                className="w-full h-full object-cover grayscale contrast-110"
              />
            </div>

            <h3 className="text-xl font-bold text-[#111111] mb-2">{selectedProject.title}</h3>
            <p className="text-xs sm:text-sm text-[#737373] leading-relaxed mb-6">
              {selectedProject.description}
            </p>

            <div className="p-4 bg-[#F7F7F7] rounded border border-[#E5E5E5] text-xs font-mono text-[#242424] space-y-1 mb-6">
              <div>SLA Konektivitas: 99.85%</div>
              <div>Protokol Jaringan: MQTT TLS 1.3 / Modbus RTU</div>
              <div>Penyimpanan Data: Time-series database dengan audit log</div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] rounded hover:bg-[#242424] cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
