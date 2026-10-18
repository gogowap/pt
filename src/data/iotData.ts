export interface SolutionItem {
  id: string;
  number: string;
  title: string;
  categoryTag: string;
  description: string;
  features: string[];
  sampleProtocols: string;
  iconName: 'Activity' | 'Cpu' | 'Radio' | 'Layers' | 'BarChart3' | 'Server';
}

export interface UseCaseItem {
  id: string;
  title: string;
  category: string;
  challenge: string;
  solution: string;
  measuredResult: string;
  metricLabel: string;
  imagePlaceholder: string;
  tag: string;
}

export const IOT_COMPANY_INFO = {
  name: 'PT Innodesk',
  industry: 'Internet of Things (IoT)',
  heroHeadline: 'Connecting Devices. Empowering Intelligence.',
  heroDescription:
    'PT Innodesk menghadirkan solusi Internet of Things untuk membantu bisnis menghubungkan perangkat, memantau operasional, dan mengoptimalkan pengambilan keputusan berbasis data.',
  aboutSummary:
    'PT Innodesk adalah perusahaan penyedia solusi Internet of Things (IoT) yang berfokus pada perancangan arsitektur perangkat cerdas, konektivitas telemetri, dan platform pemantauan operasional terpadu. Kami membantu organisasi mentransformasikan data sensor fisik menjadi wawasan strategis untuk efisiensi bisnis, mitigasi risiko dini, dan kontinuitas proses operasional.',
  vision:
    'Menjadi mitra terpercaya dalam percepatan adopsi Internet of Things yang andal, aman, dan berdaya guna tinggi bagi ekosistem industri di Indonesia.',
  mission: [
    'Menyediakan infrastruktur sensor dan gateway IoT dengan standar kestabilan operasional tinggi.',
    'Membangun sistem pemantauan data telemetri yang transparan, mudah diakses, dan aman.',
    'Mendukung efisiensi proses bisnis melalui otomasi dan analitik data berbasis waktu nyata (real-time).',
  ],
  coreValues: [
    {
      title: 'Reliabilitas Sistem',
      desc: 'Komitmen pada ketersediaan data dan ketahanan perangkat di berbagai kondisi lingkungan kerja.',
    },
    {
      title: 'Akurasi Data',
      desc: 'Pengukuran telemetri yang presisi untuk menghasilkan keputusan operasional yang dapat dipertanggungjawabkan.',
    },
    {
      title: 'Konektivitas Terbuka',
      desc: 'Mendukung integrasi beragam protokol standar industri tanpa keterikatan vendor tertutup (open standards).',
    },
    {
      title: 'Keamanan Berlapis',
      desc: 'Penerapan perlindungan data mulai dari node sensor fisik, transmisi jaringan, hingga visualisasi antarmuka.',
    },
  ],
  contactPlaceholder: {
    address: 'Gedung Pusat Bisnis Terpadu, Jakarta, Indonesia [Data Alamat Resmi Menunggu Konfirmasi]',
    email: 'info@innodesk.co.id [Placeholder Kontak Resmi]',
    phone: '+62 (Konfirmasi Saluran Telepon Resmi Perusahaan)',
    hours: 'Senin – Jumat: 08:30 – 17:30 WIB',
  },
};

export const IOT_SOLUTIONS: SolutionItem[] = [
  {
    id: 'smart-monitoring',
    number: '01',
    title: 'Smart Monitoring',
    categoryTag: 'Kategori Contoh Layanan',
    description:
      'Pemantauan kondisi fisik perangkat dan parameter lingkungan kritis seperti suhu, kelembaban, tekanan, dan konsumsi energi secara kontinu.',
    features: [
      'Akuisisi data sensor berkala berlatensi rendah',
      'Peringatan dini saat nilai melewati ambang batas toleransi',
      'Pencatatan riwayat tren untuk analisis deviasi jangka panjang',
    ],
    sampleProtocols: 'MQTT, HTTPS, Modbus RTU',
    iconName: 'Activity',
  },
  {
    id: 'industrial-iot',
    number: '02',
    title: 'Industrial IoT (IIoT)',
    categoryTag: 'Kategori Contoh Layanan',
    description:
      'Konektivitas dan pemantauan proses industri pada mesin pabrik, turbin, dan jalur produksi untuk mendukung pemeliharaan preventif.',
    features: [
      'Telemetri getaran mekanis dan suhu motor industri',
      'Konektivitas ke Programmable Logic Controller (PLC)',
      'Deteksi anomali operasional sebelum terjadi downtime mesin',
    ],
    sampleProtocols: 'Modbus TCP/IP, OPC-UA, RS485',
    iconName: 'Cpu',
  },
  {
    id: 'asset-tracking',
    number: '03',
    title: 'Asset Tracking',
    categoryTag: 'Kategori Contoh Layanan',
    description:
      'Pemantauan lokasi, pergerakan, dan status aset berharga bergerak serta armada logistik distribusi dalam rantai pasok.',
    features: [
      'Penentuan posisi geospasial presisi dengan modul GNSS',
      'Pemberitahuan batas wilayah operasional (Geofencing)',
      'Manajemen efisiensi daya untuk daya tahan baterai optimal',
    ],
    sampleProtocols: '4G LTE-M, NB-IoT, BLE',
    iconName: 'Radio',
  },
  {
    id: 'smart-automation',
    number: '04',
    title: 'Smart Automation',
    categoryTag: 'Kategori Contoh Layanan',
    description:
      'Otomasi proses operasional dan pengendalian aktuator secara otomatis berdasarkan input parameter sensor yang terkonfigurasi.',
    features: [
      'Pemicuan relai dan sistem cadangan darurat otomatis',
      'Logika penanganan kondisi batas aman (Fail-safe rules)',
      'Pengurangan ketergantungan pada intervensi manual lapangan',
    ],
    sampleProtocols: 'Digital I/O, MQTT, Modbus',
    iconName: 'Layers',
  },
  {
    id: 'iot-dashboard',
    number: '05',
    title: 'IoT Dashboard',
    categoryTag: 'Kategori Contoh Layanan',
    description:
      'Platform visualisasi data terpusat dengan antarmuka grafis yang bersih, metrik kunci, dan kemudahan manajemen inventaris perangkat.',
    features: [
      'Grafik visual time-series interaktif dan responsif',
      'Status online/offline seluruh simpul perangkat secara seketika',
      'Pengaturan ambang batas aman langsung dari antarmuka web',
    ],
    sampleProtocols: 'RESTful API, WebSockets, JSON',
    iconName: 'BarChart3',
  },
  {
    id: 'connected-systems',
    number: '06',
    title: 'Connected Systems',
    categoryTag: 'Kategori Contoh Layanan',
    description:
      'Integrasi perangkat IoT dengan sistem enterprise digital yang telah digunakan perusahaan, seperti ERP, CRM, atau sistem inventaris.',
    features: [
      'Integrasi pertukaran data dua arah melalui API terbuka',
      'Standardisasi format data lintas departemen kerja',
      'Penyelarasan alur kerja digital tanpa duplikasi input data',
    ],
    sampleProtocols: 'REST, Webhook, OPC-UA',
    iconName: 'Server',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Devices & Sensors',
    subtitle: 'Pengumpulan Data',
    desc: 'Perangkat transduser dan sensor mengukur parameter fisik di lapangan seperti suhu, vibrasi, tekanan, atau koordinat lokasi.',
    iconName: 'Activity',
  },
  {
    step: '02',
    title: 'Connectivity',
    subtitle: 'Transmisi Jaringan',
    desc: 'Data yang terhimpun dikirimkan melalui saluran komunikasi yang aman menggunakan protokol nirkabel atau kabel industri.',
    iconName: 'Radio',
  },
  {
    step: '03',
    title: 'Data Processing',
    subtitle: 'Pemrosesan & Analisis',
    desc: 'Data diverifikasi, disaring dari derau (noise), dan dianalisis untuk mendeteksi deviasi terhadap ambang batas yang ditentukan.',
    iconName: 'Cpu',
  },
  {
    step: '04',
    title: 'Dashboard & Action',
    subtitle: 'Visualisasi & Keputusan',
    desc: 'Informasi disajikan dalam dashboard visual yang mudah dipahami, memicu peringatan otomatis, atau menjalankan instruksi otomasi.',
    iconName: 'BarChart3',
  },
];

export const TECHNOLOGY_DOMAINS = [
  {
    title: 'Sensor & Transduser',
    desc: 'Komponen perangkat keras pendeteksi perubahan fisik di lingkungan industri dengan toleransi deviasi rendah dan ketahanan material teruji.',
    items: ['Sensor Suhu & Kelembaban Presisi', 'Akselerometer 3-Axis Analisis Getaran', 'Transduser Tekanan & Aliran Fluida', 'Current Transformer (CT) Daya Listrik'],
  },
  {
    title: 'Jaringan & Konektivitas',
    desc: 'Infrastruktur komunikasi data yang dirancang untuk stabilitas transmisi, keamanan enkripsi, dan efisiensi konsumsi daya.',
    items: ['Protokol Industri Modbus RTU/TCP', 'Protokol Pesan Ringan MQTT / MQTTS', 'Jaringan Nirkabel Jarak Jauh LoRaWAN', 'Konektivitas Seluler Seluler NB-IoT / LTE-M'],
  },
  {
    title: 'Pemrosesan Data Telemetri',
    desc: 'Arsitektur pemrosesan aliran data (stream processing) yang menyaring dan mengagregasi data mentah menjadi parameter yang bermakna.',
    items: ['Edge Computing & Penyaringan Derau Lokal', 'Validasi Format & Integritas Payload', 'Penyimpanan Data Berbasis Waktu (Time-Series)', 'Evaluasi Ambang Batas Berkecepatan Tinggi'],
  },
  {
    title: 'Visualisasi & Monitoring',
    desc: 'Antarmuka pengguna grafis yang memberikan kemudahan pemantauan status seluruh armada perangkat dari satu layar terpadu.',
    items: ['Grafik Tren Interaktif & Analisis Titik', 'Indikator Status Online/Offline Real-time', 'Sistem Manajemen Peringatan Bertingkat', 'Ekspor Laporan Data untuk Audit Berkala'],
  },
];

export const USE_CASES_DATA: UseCaseItem[] = [
  {
    id: 'uc-01',
    title: 'Pemantauan Lingkungan Fasilitas Kritis',
    category: 'Environmental Monitoring',
    tag: 'Contoh Use Case',
    challenge:
      'Kebutuhan pemantauan parameter suhu dan kelembaban ruangan secara terus-menerus pada fasilitas penyimpanan bernilai tinggi agar terhindar dari kerusakan material.',
    solution:
      'Pemasangan simpul sensor nirkabel berdaya baterai dengan interval transmisi teratur dan pengaturan ambang batas bertingkat pada dashboard pemantauan.',
    measuredResult: '±0.2°C',
    metricLabel: 'Stabilitas deviasi pembacaan termal yang terukur',
    imagePlaceholder: '/src/assets/images/innodesk_hero_architecture_1791787843185.jpg',
  },
  {
    id: 'uc-02',
    title: 'Monitoring Peralatan Mesin Industri',
    category: 'Industrial IoT',
    tag: 'Contoh Use Case',
    challenge:
      'Deteksi dini terhadap keausan bearing dan getaran abnormal pada motor konveyor industri guna meminimalkan penghentian lini produksi mendadak.',
    solution:
      'Integrasi sensor getaran dan transduser kecepatan ke modul gateway industri yang terhubung langsung ke dashboard telemetri operasional.',
    measuredResult: '0 Insiden',
    metricLabel: 'Penghentian mesin mendadak selama periode pengujian',
    imagePlaceholder: '/src/assets/images/innodesk_system_hub_1791787869808.jpg',
  },
  {
    id: 'uc-03',
    title: 'Pemantauan Lokasi & Kondisi Aset',
    category: 'Asset Tracking',
    tag: 'Contoh Use Case',
    challenge:
      'Memastikan visibilitas posisi dan keterjagaan suhu kontainer berpendingin selama distribusi kargo jarak jauh antar wilayah.',
    solution:
      'Penggunaan modul pelacak terintegrasi GNSS dan sensor temperatur internal yang mengirimkan telemetri berkala melalui jaringan seluler.',
    measuredResult: '100%',
    metricLabel: 'Visibilitas titik transit sepanjang rute distribusi',
    imagePlaceholder: '/src/assets/images/innodesk_workspace_minimal_1791787856954.jpg',
  },
  {
    id: 'uc-04',
    title: 'Otomasi & Kontrol Fasilitas Gedung',
    category: 'Smart Automation',
    tag: 'Contoh Use Case',
    challenge:
      'Mengurangi pemborosan energi listrik dan beban pendingin udara pada ruangan fasilitas kerja di luar jam kerja efektif operasional.',
    solution:
      'Penerapan modul relai pengendali otomatis berbasis sensor kehadiran dan sensor suhu untuk penyesuaian beban kerja sirkulasi udara.',
    measuredResult: '28%',
    metricLabel: 'Efisiensi konsumsi daya pada zona fasilitas yang diuji',
    imagePlaceholder: '/src/assets/images/innodesk_hero_architecture_1791787843185.jpg',
  },
];
