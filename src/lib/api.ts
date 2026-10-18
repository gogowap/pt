export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  total?: number;
  limit?: number;
  offset?: number;
  is_simulated_notice?: string;
  [key: string]: any;
}

// Initial Mock Seed Data for Frontend-Only Execution
const INITIAL_PROJECTS = [
  {
    id: 1,
    title: 'Sistem Telemetri Cold Storage Vaksin Biofarma',
    category: 'Smart Monitoring',
    description: 'Implementasi 48 titik sensor suhu PT100 ultra-presisi dengan edge gateway berlatensi rendah untuk pemantauan suhu -80°C hingga +4°C secara kontinu dengan audit trail otomatis.',
    image_url: '/src/assets/images/innodesk_hero_architecture_1791787843185.jpg',
  },
  {
    id: 2,
    title: 'Monitoring Getaran & Arus Motor Konveyor Pelabuhan',
    category: 'Industrial IoT',
    description: 'Pemasangan akselerometer piezoelektrik 3-axis dan Current Transformer industri pada 12 unit motor penggerak konveyor batubara untuk mendeteksi kegagalan mekanis sebelum downtime.',
    image_url: '/src/assets/images/innodesk_system_hub_1791787869808.jpg',
  },
  {
    id: 3,
    title: 'Pelacakan Kontainer Logistik Cold-Chain Lintas Jawa-Bali',
    category: 'Asset Tracking',
    description: 'Penerapan 120 modul telematika GNSS mandiri berdaya baterai 3 tahun dengan konektivitas seluler 4G Cat-M1 dan sensor suhu kargo terpadu.',
    image_url: '/src/assets/images/innodesk_workspace_minimal_1791787856954.jpg',
  },
  {
    id: 4,
    title: 'Otomasi Ventilasi & Efisiensi Energi Smart Building HQ',
    category: 'Smart Automation',
    description: 'Integrasi sensor kualitas udara CO2 dan temperatur ruangan ke pengontrol aktuator HVAC otomatis untuk menghemat konsumsi daya listrik hingga 24% per bulan.',
    image_url: '/src/assets/images/innodesk_hero_architecture_1791787843185.jpg',
  },
];

const INITIAL_DEVICES = [
  {
    id: 1,
    name: 'EDGE-GATEWAY-HQ-01',
    device_code: 'INN-GW-001',
    location: 'Ruang Server Pusat HQ Jakarta',
    status: 'online',
    ip_address: '192.168.10.45',
    last_seen: new Date().toISOString(),
    sensors_count: 4,
  },
  {
    id: 2,
    name: 'EDGE-GATEWAY-PLANT-02',
    device_code: 'INN-GW-002',
    location: 'Lini Manufaktur Pabrik Cikarang',
    status: 'online',
    ip_address: '10.20.1.12',
    last_seen: new Date().toISOString(),
    sensors_count: 6,
  },
  {
    id: 3,
    name: 'TRACKER-FLEET-LOG-09',
    device_code: 'INN-TRK-009',
    location: 'Armada Truk Logistik Rute Pantura',
    status: 'online',
    ip_address: 'Dynamic Cellular (4G)',
    last_seen: new Date().toISOString(),
    sensors_count: 2,
  },
  {
    id: 4,
    name: 'GATEWAY-COLD-STORAGE-04',
    device_code: 'INN-GW-004',
    location: 'Gudang Pendingin Surabaya',
    status: 'warning',
    ip_address: '172.16.4.88',
    last_seen: new Date(Date.now() - 360000).toISOString(),
    sensors_count: 3,
  },
];

const INITIAL_SENSORS = [
  {
    id: 1,
    device_id: 1,
    name: 'Suhu Lingkungan Server Rack HQ',
    sensor_type: 'Temperature',
    unit: '°C',
    current_value: 23.4,
    min_threshold: 18.0,
    max_threshold: 27.0,
    status: 'normal',
    last_reading: new Date().toISOString(),
  },
  {
    id: 2,
    device_id: 1,
    name: 'Kelembaban Relatif Ruang Server',
    sensor_type: 'Humidity',
    unit: '%RH',
    current_value: 52.1,
    min_threshold: 40.0,
    max_threshold: 65.0,
    status: 'normal',
    last_reading: new Date().toISOString(),
  },
  {
    id: 3,
    device_id: 2,
    name: 'Getaran Motor Konveyor Utama #1',
    sensor_type: 'Vibration',
    unit: 'mm/s',
    current_value: 2.15,
    min_threshold: 0.2,
    max_threshold: 4.5,
    status: 'normal',
    last_reading: new Date().toISOString(),
  },
  {
    id: 4,
    device_id: 2,
    name: 'Beban Arus Listrik Motor Utama',
    sensor_type: 'Current',
    unit: 'Ampere',
    current_value: 38.6,
    min_threshold: 10.0,
    max_threshold: 50.0,
    status: 'normal',
    last_reading: new Date().toISOString(),
  },
  {
    id: 5,
    device_id: 4,
    name: 'Suhu Ruang Cold Storage #04',
    sensor_type: 'Temperature',
    unit: '°C',
    current_value: -18.2,
    min_threshold: -25.0,
    max_threshold: -15.0,
    status: 'normal',
    last_reading: new Date().toISOString(),
  },
];

const INITIAL_ALERTS = [
  {
    id: 1,
    sensor_name: 'Getaran Motor Konveyor Utama #1',
    device_name: 'EDGE-GATEWAY-PLANT-02',
    severity: 'warning',
    message: 'Getaran motor sempat mendekati batas toleransi 4.2 mm/s.',
    created_at: new Date(Date.now() - 1800000).toISOString(),
    status: 'active',
  },
  {
    id: 2,
    sensor_name: 'Beban Arus Listrik Motor Utama',
    device_name: 'EDGE-GATEWAY-PLANT-02',
    severity: 'info',
    message: 'Fluktuasi beban beban normal pasca penyalaan pompa tambahan.',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    status: 'acknowledged',
  },
];

export class ApiClient {
  private static getToken(): string | null {
    return localStorage.getItem('innodesk_token');
  }

  public static setToken(token: string) {
    localStorage.setItem('innodesk_token', token);
  }

  public static removeToken() {
    localStorage.removeItem('innodesk_token');
  }

  // In-memory / LocalStorage State Helpers
  private static getStoredData<T>(key: string, defaultVal: T): T {
    try {
      const item = localStorage.getItem(`innodesk_${key}`);
      return item ? JSON.parse(item) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private static setStoredData<T>(key: string, val: T): void {
    try {
      localStorage.setItem(`innodesk_${key}`, JSON.stringify(val));
    } catch {
      // ignore
    }
  }

  // Simulated Mock Response Handler (Zero Backend Dependency Guarantee)
  private static handleMockRequest<T = any>(endpoint: string, options: RequestInit = {}): ApiResponse<T> {
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : {};

    // 1. Projects
    if (endpoint.startsWith('/api/projects')) {
      const projects = this.getStoredData('projects', INITIAL_PROJECTS);
      return {
        success: true,
        data: projects as unknown as T,
        total: projects.length,
      };
    }

    // 2. Contact form submission
    if (endpoint === '/api/contact' && method === 'POST') {
      const messages = this.getStoredData<any[]>('contact_messages', []);
      const newMsg = {
        id: messages.length + 101,
        ...body,
        created_at: new Date().toISOString(),
        status: 'unread',
      };
      messages.unshift(newMsg);
      this.setStoredData('contact_messages', messages);

      return {
        success: true,
        data: { id: newMsg.id } as unknown as T,
        message: 'Permintaan konsultasi Anda telah berhasil disimpan di sistem PT Innodesk. Tim insinyur kami akan menghubungi Anda.',
      };
    }

    // 3. Auth
    if (endpoint === '/api/auth/me') {
      const user = this.getStoredData<any>('current_user', {
        id: 1,
        name: 'Insinyur Sistem Innodesk',
        email: 'engineer@innodesk.id',
        role: 'admin',
      });
      return {
        success: true,
        user: user as unknown as T,
      };
    }

    if (endpoint === '/api/auth/login' && method === 'POST') {
      let role: 'admin' | 'operator' | 'viewer' = 'admin';
      const email = body.email || '';
      if (email.includes('operator')) role = 'operator';
      if (email.includes('viewer')) role = 'viewer';

      const user = {
        id: Date.now(),
        name: role === 'admin' ? 'Administrator Innodesk' : role === 'operator' ? 'Operator Telemetri' : 'Viewer Audit',
        email: email || 'admin@innodesk.id',
        role,
      };

      this.setStoredData('current_user', user);
      const token = `innodesk_jwt_mock_${Date.now()}`;

      return {
        success: true,
        token,
        user: user as unknown as T,
        message: 'Autentikasi berhasil.',
      };
    }

    if (endpoint === '/api/auth/logout') {
      this.setStoredData('current_user', null);
      return { success: true, message: 'Logout berhasil.' };
    }

    // 4. Dashboard Summary
    if (endpoint === '/api/dashboard/summary') {
      const devices = this.getStoredData('devices', INITIAL_DEVICES);
      const sensors = this.getStoredData('sensors', INITIAL_SENSORS);
      const alerts = this.getStoredData('alerts', INITIAL_ALERTS);

      return {
        success: true,
        data: {
          total_devices: devices.length,
          active_devices: devices.filter((d) => d.status === 'online').length,
          total_sensors: sensors.length,
          active_alerts: alerts.filter((a) => a.status === 'active').length,
          system_uptime: '99.85%',
          data_points_today: 142580,
        } as unknown as T,
      };
    }

    // 5. Devices
    if (endpoint.startsWith('/api/devices')) {
      let devices = this.getStoredData<any[]>('devices', INITIAL_DEVICES);
      if (method === 'POST') {
        const newDev = {
          id: devices.length + 1,
          name: body.name || `DEVICE-NODE-${devices.length + 1}`,
          device_code: body.device_code || `INN-DEV-${100 + devices.length}`,
          location: body.location || 'Fasilitas Industri',
          status: 'online',
          ip_address: body.ip_address || '192.168.1.50',
          last_seen: new Date().toISOString(),
          sensors_count: 0,
        };
        devices.push(newDev);
        this.setStoredData('devices', devices);
        return { success: true, data: newDev as unknown as T, message: 'Perangkat baru berhasil ditambahkan.' };
      }
      return { success: true, data: devices as unknown as T, total: devices.length };
    }

    // 6. Sensors
    if (endpoint.startsWith('/api/sensors')) {
      const sensors = this.getStoredData<any[]>('sensors', INITIAL_SENSORS);
      return { success: true, data: sensors as unknown as T, total: sensors.length };
    }

    // 7. Measurements (Timeseries)
    if (endpoint.startsWith('/api/measurements')) {
      const points = [];
      const now = Date.now();
      for (let i = 24; i >= 0; i--) {
        const time = new Date(now - i * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        points.push({
          time,
          temperature: +(23.5 + Math.sin(i / 3) * 2.2 + (Math.random() - 0.5)).toFixed(1),
          humidity: +(54.0 + Math.cos(i / 4) * 4.5 + (Math.random() - 0.5)).toFixed(1),
          vibration: +(1.8 + Math.sin(i / 2) * 0.4 + (Math.random() - 0.5) * 0.2).toFixed(2),
          current: +(32.0 + Math.sin(i / 5) * 6.0).toFixed(1),
        });
      }
      return { success: true, data: points as unknown as T };
    }

    // 8. Alerts
    if (endpoint.startsWith('/api/alerts')) {
      let alerts = this.getStoredData<any[]>('alerts', INITIAL_ALERTS);
      if (method === 'PUT' || method === 'POST') {
        alerts = alerts.map((a) => ({ ...a, status: 'acknowledged' }));
        this.setStoredData('alerts', alerts);
        return { success: true, message: 'Peringatan telah ditindaklanjuti.' };
      }
      return { success: true, data: alerts as unknown as T };
    }

    // 9. Messages
    if (endpoint.startsWith('/api/contact/messages') || endpoint.startsWith('/api/messages')) {
      const messages = this.getStoredData<any[]>('contact_messages', [
        {
          id: 101,
          name: 'Budi Santoso',
          email: 'budi@industri-nusantara.co.id',
          company: 'PT Industri Manufaktur Nusantara',
          subject: 'Industrial IoT',
          message: 'Kami memerlukan solusi monitoring 24 unit motor konveyor dengan transmisi Modbus RTU.',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          status: 'unread',
        },
      ]);
      return { success: true, data: messages as unknown as T };
    }

    // Fallback default response
    return {
      success: true,
      data: {} as unknown as T,
      message: 'Permintaan berhasil diproses di antarmuka frontend.',
    };
  }

  public static async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Attempt real backend call first with short timeout; if offline or fails, seamlessly use mock handler
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      const response = await fetch(endpoint, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // If response is HTML (e.g. Vite SPA fallback for unmatched /api routes), fall back to mock
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return this.handleMockRequest<T>(endpoint, options);
      }

      const json = await response.json();
      return json;
    } catch {
      // Graceful fallback to client-side mock store
      return this.handleMockRequest<T>(endpoint, options);
    }
  }

  public static get<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  public static post<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public static put<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public static delete<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}
