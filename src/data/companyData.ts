import { ServiceItem, ProjectItem, CompanyMetric } from '../types';

export const COMPANY_PROFILE = {
  name: 'PT Innodesk',
  tagline: 'Solusi Operasional & Infrastruktur Layanan Berkelanjutan',
  sector: 'Layanan Operasional & Teknologi (LOT)',
  heroHeading: 'Infrastruktur Presisi untuk Keandalan Operasional.',
  heroDescription:
    'PT Innodesk menghadirkan kerangka kerja operasional dan integrasi sistem modern. Kami menyelaraskan tata kelola perangkat kerja, efisiensi alur bisnis, serta pemantauan terpadu untuk organisasi berstandar tinggi.',
  mission: [
    'Membangun sistem operasional terpadu yang meminimalkan downtime dan friksi proses bisnis.',
    'Menghadirkan tata kelola perangkat dan infrastruktur kerja dengan akuntabilitas presisi tinggi.',
    'Menjadi mitra andalan korporasi dalam standardisasi alur kerja dan mitigasi risiko operasional.',
  ],
  vision:
    'Menjadi standar rujukan nasional dalam keunggulan Layanan Operasional dan Teknologi (LOT) yang adaptif, transparan, dan berkelanjutan.',
  coreValues: [
    {
      title: 'Integritas Operasional',
      desc: 'Transparansi penuh dalam pelaporan kinerja, SLA, dan kepatuhan prosedur regulasi operasional.',
    },
    {
      title: 'Presisi & Akurasi',
      desc: 'Eksekusi berbasis data metrik terukur, meminimalkan toleransi kesalahan dan redundansi alur kerja.',
    },
    {
      title: 'Keberlanjutan Sistem',
      desc: 'Rancang bangun solusi yang mudah dipelihara (maintainable), skalabel, dan ramah adaptasi jangka panjang.',
    },
    {
      title: 'Keandalan (Reliability)',
      desc: 'Komitmen terhadap ketersediaan layanan dan kesiapsiagaan kontinuitas bisnis tanpa kompromi.',
    },
  ],
  contactPlaceholder: {
    address: 'Gedung Pusat Bisnis Terpadu, Lantai 12 (Menunggu Konfirmasi Data Resmi PT Innodesk)',
    city: 'Jakarta, Indonesia',
    email: 'info@innodesk.co.id (Kontak Representatif)',
    phone: '+62 (Konfirmasi Nomor Resmi Kantor)',
    hours: 'Senin – Jumat: 08:30 – 17:30 WIB',
  },
};

export const COMPANY_METRICS: CompanyMetric[] = [
  {
    value: '99.85%',
    label: 'Ketersediaan Sistem Operasional',
    context: 'Rata-rata uptime pemantauan infrastruktur',
  },
  {
    value: '<15 Menit',
    label: 'Waktu Respons Insiden Tingkat 1',
    context: 'Standar penanganan tiket prioritas',
  },
  {
    value: '100%',
    label: 'Kepatuhan Standar Prosedural',
    context: 'Audit kepatuhan alur kerja internal',
  },
  {
    value: '40%',
    label: 'Efisiensi Siklus Kerja',
    context: 'Pengurangan redundansi alur operasional',
  },
];

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'lot-infrastructure',
    number: '01',
    title: 'Manajemen Infrastruktur LOT',
    summary:
      'Penyediaan, konfigurasi, dan tata kelola perangkat operasional teknologi dengan pengawasan siklus hidup menyeluruh.',
    description:
      'Layanan terstruktur untuk memastikan setiap instrumen operasional, perangkat kerja desk, dan sistem peripheral berjalan optimal sesuai ambang batas beban kerja perusahaan. Meliputi audit berkala, manajemen aset, dan peremajaan terencana.',
    iconName: 'Server',
    deliverables: [
      'Audit berkala perangkat dan kesiapan beban kerja',
      'Manajemen siklus hidup aset operasional',
      'Pemberian nomor inventaris & penelusuran status',
      'Rencana mitigasi dan kontinuitas perangkat darurat',
    ],
    operationalScope: 'Lingkup: Fasilitas Kantor Pusat, Fasilitas Cabang, & Hub Operasional Terpusat.',
  },
  {
    id: 'centralized-monitoring',
    number: '02',
    title: 'Integrasi Sistem & Monitoring Sentral',
    summary:
      'Konsolidasi telemetri operasional ke dalam satu konsol visibilitas dengan alert proaktif sebelum gangguan meluas.',
    description:
      'Menghubungkan subsistem kerja yang terisolasi ke dalam satu dashboard pemantauan berkinerja tinggi. Tim pengawas dapat mendeteksi anomali transmisi atau kemacetan antrean kerja secara real-time.',
    iconName: 'Layers',
    deliverables: [
      'Dashboard status kesehatan sistem satu pintu',
      'Pengaturan ambang batas notifikasi peringatan dini',
      'Integrasi protokol pelaporan antar-departemen',
      'Log audit terenkripsi untuk pelacakan insiden',
    ],
    operationalScope: 'Lingkup: Server internal, koneksi antar-node kerja, dan antarmuka operasional harian.',
  },
  {
    id: 'workflow-optimization',
    number: '03',
    title: 'Optimasi Alur Kerja & Otomasi Proses',
    summary:
      'Penghilangan bottleneck prosedural dan penyelarasan alur kerja digital antar divisi operasional.',
    description:
      'Analisis alur proses manual yang memakan waktu, digantikan dengan orkestrasi tugas otomatis yang akurat. Meningkatkan kecepatan throughput dokumen kerja dan validasi lintas fungsi tanpa mengurangi kontrol kepatuhan.',
    iconName: 'Workflow',
    deliverables: [
      'Pemetaan proses bisnis end-to-end (As-Is vs To-Be)',
      'Otomatisasi serah terima tugas berulang',
      'Pengurangan latensi persetujuan administratif',
      'Panduan standar operasional (SOP) digital terverifikasi',
    ],
    operationalScope: 'Lingkup: Alur permohonan, penugasan teknis lapangan, dan pelaporan manajerial.',
  },
  {
    id: 'security-compliance',
    number: '04',
    title: 'Kepatuhan & Keamanan Operasional',
    summary:
      'Penerapan protokol kendali akses, tata kelola data operasional, dan kepatuhan standar industri.',
    description:
      'Memastikan seluruh interaksi operasional memenuhi regulasi kepatuhan internal dan eksternal. Kami mengunci celah kerentanan prosedur kerja agar aset kritis perusahaan terlindungi dari kegagalan manusiawi atau kebocoran akses.',
    iconName: 'ShieldCheck',
    deliverables: [
      'Matriks kendali hak akses berbasis peran (RBAC)',
      'Prosedur tanggap darurat insiden operasional',
      'Laporan evaluasi berkala kepatuhan tata kelola',
      'Simulasi uji pemulihan bencana (Disaster Recovery Drill)',
    ],
    operationalScope: 'Lingkup: Kebijakan operasional internal, pengamanan workstation, & data kerja.',
  },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'proj-01',
    title: 'Standardisasi Node Kerja Fasilitas Terpadu',
    category: 'infrastruktur',
    categoryLabel: 'Infrastruktur LOT',
    year: '2025',
    clientType: 'Korporasi Logistik Distribusi [Data Dummy]',
    summary:
      'Penyusunan ulang tata kelola 140+ unit stasiun kerja operasional dan penataan kabel terstruktur untuk meningkatkan reliabilitas transaksi.',
    detailedCase:
      'Klien menghadapi gangguan konektivitas intermiten pada hub sortir akibat konfigurasi perangkat yang tidak terstandarisasi. PT Innodesk menyusun arsitektur perangkat baru dengan standardisasi perangkat keras, proteksi lonjakan daya, dan konfigurasi terminal seragam.',
    keyMetric: '99.9%',
    keyMetricLabel: 'Uptime operasional stasiun kerja setelah peremajaan',
    scopeList: [
      'Audit 140 node kerja fisik',
      'Implementasi skema daya cadangan mandiri',
      'Penyusunan panduan pemeliharaan rutin preventif',
    ],
    isDummyNotice: 'Proyek simulasi dummy untuk demonstrasi portofolio. Menunggu input riwayat proyek resmi PT Innodesk.',
  },
  {
    id: 'proj-02',
    title: 'Konsolidasi Konsol Pengawasan Operasional',
    category: 'sistem',
    categoryLabel: 'Sistem Terpadu',
    year: '2024',
    clientType: 'Perusahaan Manufaktur Komponen [Data Dummy]',
    summary:
      'Integrasi 4 silo pengawasan kerja lini produksi ke dalam satu tampilan terpadu dengan sistem peringatan dini.',
    detailedCase:
      'Sebelumnya setiap regu kerja memantau log sistem secara terpisah, mengakibatkan kelambatan deteksi saat terjadi kemacetan rantai pasok lokal. Kami menghubungkan telemetry gateway sehingga supervisor dapat melihat kondisi menyeluruh dari satu monitor.',
    keyMetric: '-65%',
    keyMetricLabel: 'Penurunan waktu rata-rata deteksi insiden (MTTD)',
    scopeList: [
      'Normalisasi format data telemetri',
      'Integrasi alert bertingkat via notifikasi internal',
      'Pelatihan teknis bagi 25 operator pengawas',
    ],
    isDummyNotice: 'Proyek simulasi dummy untuk demonstrasi portofolio. Menunggu input riwayat proyek resmi PT Innodesk.',
  },
  {
    id: 'proj-03',
    title: 'Restrukturisasi Alur Tiket & Dispatch Lapangan',
    category: 'alur_kerja',
    categoryLabel: 'Optimasi Alur Kerja',
    year: '2024',
    clientType: 'Penyedia Layanan Utilitas [Data Dummy]',
    summary:
      'Digitalisasi alur eskalasi penugasan teknisi operasional dengan routing cerdas berdasarkan ketersediaan dan zonasi.',
    detailedCase:
      'Proses manual melalui lembar kerja spreadsheet menyebabkan penumpukan penugasan teknisi dan keterlambatan penyelesaian tiket. Dengan rancangan alur kerja otomatis, penugasan dialirkan langsung ke terminal teknisi yang siap.',
    keyMetric: '2.4x',
    keyMetricLabel: 'Peningkatan kecepatan penutupan tiket layanan',
    scopeList: [
      'Penyusunan matriks eskalasi 3 tingkat',
      'Verifikasi serah terima tugas dengan tanda tangan digital',
      'Audit kepatuhan SLA mingguan otomatis',
    ],
    isDummyNotice: 'Proyek simulasi dummy untuk demonstrasi portofolio. Menunggu input riwayat proyek resmi PT Innodesk.',
  },
  {
    id: 'proj-04',
    title: 'Modernisasi Ruang Kontrol Operasi Sentral',
    category: 'infrastruktur',
    categoryLabel: 'Infrastruktur LOT',
    year: '2023',
    clientType: 'Pusat Distribusi Regional [Data Dummy]',
    summary:
      'Rancang bangun tata letak ergonomis, manajemen pendingin pasif, dan proteksi jaringan lokal untuk ruang kontrol utama.',
    detailedCase:
      'Pengembangan ruang operasi 24/7 yang memerlukan ketahanan suhu, penataan visual video-wall, dan pemisahan jalur kabel daya serta komunikasi data secara profesional.',
    keyMetric: '0 Jam',
    keyMetricLabel: 'Downtime tidak terjadwal selama 12 bulan beroperasi',
    scopeList: [
      'Desain arsitektur ruang kendali fisik',
      'Redundansi jalur uplink jaringan internal',
      'SOP penanganan insiden darurat kelistrikan',
    ],
    isDummyNotice: 'Proyek simulasi dummy untuk demonstrasi portofolio. Menunggu input riwayat proyek resmi PT Innodesk.',
  },
];
