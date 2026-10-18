import bcrypt from 'bcryptjs';
import { db } from './db.js';

export async function seedDatabase() {
  await db.init();

  // Check if users already seeded
  const existingUsers = await db.query('SELECT COUNT(*) as count FROM users');
  const count = (existingUsers[0] as any).count || 0;
  if (count > 0) {
    console.log('[Seed] Database already initialized with existing data.');
    return;
  }

  console.log('[Seed] Seeding initial relational data for PT Innodesk IoT Platform...');

  // 1. Seed Users (Admin, Operator, Viewer)
  const salt = await bcrypt.genSalt(10);
  const adminHash = await bcrypt.hash('InnodeskAdmin2026!', salt);
  const operatorHash = await bcrypt.hash('InnodeskOperator2026!', salt);
  const viewerHash = await bcrypt.hash('InnodeskViewer2026!', salt);

  await db.execute(
    `INSERT INTO users (name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?)`,
    ['Raden Satria (Lead Architect)', 'admin@innodesk.co.id', adminHash, 'admin', 1]
  );
  await db.execute(
    `INSERT INTO users (name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?)`,
    ['Bambang Prakoso (Site Operator)', 'operator@innodesk.co.id', operatorHash, 'operator', 1]
  );
  await db.execute(
    `INSERT INTO users (name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?)`,
    ['Dewi Lestari (Client Auditor)', 'viewer@innodesk.co.id', viewerHash, 'viewer', 1]
  );

  // 2. Seed IoT Devices
  const dev1 = await db.execute(
    `INSERT INTO devices (device_uid, name, description, location, category, status, last_seen_at) 
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
    [
      'DEV-JKT-HQ-01',
      'Industrial IoT Gateway HQ',
      'Master Edge Gateway untuk koordinasi data center & server telemetry room.',
      'Server Room Lt. 2, Kantor Pusat Jakarta',
      'Industrial Gateway',
      'online',
    ]
  );

  const dev2 = await db.execute(
    `INSERT INTO devices (device_uid, name, description, location, category, status, last_seen_at) 
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
    [
      'DEV-CKR-WH-02',
      'Warehouse Ambient & Environmental Node',
      'Unit pemantauan suhu, kelembaban, dan konsumsi daya gudang logistik terintegrasi.',
      'Hub Logistik & Gudang Cikarang Barat',
      'Environmental Monitor',
      'online',
    ]
  );

  const dev3 = await db.execute(
    `INSERT INTO devices (device_uid, name, description, location, category, status, last_seen_at) 
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
    [
      'DEV-SBY-FL-03',
      'Machinery Vibration & Telemetry Node',
      'Sensor getaran akselerometer 3-axis untuk pemeliharaan prediktif mesin konveyor.',
      'Pabrik Manufaktur Lini Perakitan 3, Surabaya',
      'Machinery Telemetry',
      'online',
    ]
  );

  const dev4 = await db.execute(
    `INSERT INTO devices (device_uid, name, description, location, category, status, last_seen_at) 
     VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-2 hours'))`,
    [
      'DEV-SMG-CS-04',
      'Cold Storage Temperature Sentinel',
      'Unit pengawasan temperatur ruang pendingin cold storage bahan farmasi.',
      'Kamar Pendingin A-01, Semarang Hub',
      'Temperature Monitoring',
      'offline',
    ]
  );

  // 3. Seed Sensors linked to devices
  // Device 1 Sensors
  const s1 = await db.execute(
    `INSERT INTO sensors (device_id, sensor_uid, name, sensor_type, unit, min_threshold, max_threshold, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    [dev1.insertId, 'SEN-HQ-TEMP-01', 'Server Rack Ambient Temperature', 'Temperature', '°C', 18.0, 27.0]
  );
  const s2 = await db.execute(
    `INSERT INTO sensors (device_id, sensor_uid, name, sensor_type, unit, min_threshold, max_threshold, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    [dev1.insertId, 'SEN-HQ-PWR-02', 'Main Busbar Power Consumption', 'Current', 'Ampere', 5.0, 45.0]
  );

  // Device 2 Sensors
  const s3 = await db.execute(
    `INSERT INTO sensors (device_id, sensor_uid, name, sensor_type, unit, min_threshold, max_threshold, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    [dev2.insertId, 'SEN-WH-HUMID-01', 'Warehouse Relative Humidity', 'Humidity', '%RH', 35.0, 65.0]
  );
  const s4 = await db.execute(
    `INSERT INTO sensors (device_id, sensor_uid, name, sensor_type, unit, min_threshold, max_threshold, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    [dev2.insertId, 'SEN-WH-TEMP-02', 'Warehouse Storage Zone Temperature', 'Temperature', '°C', 20.0, 32.0]
  );

  // Device 3 Sensors
  const s5 = await db.execute(
    `INSERT INTO sensors (device_id, sensor_uid, name, sensor_type, unit, min_threshold, max_threshold, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    [dev3.insertId, 'SEN-FL-VIB-01', 'Motor Conveyor Vibration Amplitude', 'Vibration', 'mm/s', 0.5, 4.5]
  );
  const s6 = await db.execute(
    `INSERT INTO sensors (device_id, sensor_uid, name, sensor_type, unit, min_threshold, max_threshold, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    [dev3.insertId, 'SEN-FL-RPM-02', 'Conveyor Roller Tachometer', 'Speed', 'RPM', 800.0, 1800.0]
  );

  // Device 4 Sensor
  const s7 = await db.execute(
    `INSERT INTO sensors (device_id, sensor_uid, name, sensor_type, unit, min_threshold, max_threshold, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    [dev4.insertId, 'SEN-CS-TEMP-01', 'Vaccine Storage Vault Cryo-Temp', 'Temperature', '°C', -25.0, -15.0]
  );

  // 4. Seed Time-Series Measurements (Last 24 hours trend)
  const sensorsList = [
    { id: s1.insertId, base: 23.5, variance: 2.0 },
    { id: s2.insertId, base: 28.0, variance: 8.0 },
    { id: s3.insertId, base: 52.0, variance: 6.0 },
    { id: s4.insertId, base: 26.5, variance: 3.0 },
    { id: s5.insertId, base: 2.1, variance: 0.8 },
    { id: s6.insertId, base: 1450.0, variance: 120.0 },
    { id: s7.insertId, base: -18.5, variance: 1.5 },
  ];

  for (const s of sensorsList) {
    for (let i = 12; i >= 0; i--) {
      const minutesAgo = i * 20;
      const noise = (Math.random() - 0.48) * s.variance;
      const val = Number((s.base + noise).toFixed(2));
      await db.execute(
        `INSERT INTO measurements (sensor_id, value, recorded_at, received_at)
         VALUES (?, ?, datetime('now', '-${minutesAgo} minutes'), datetime('now', '-${minutesAgo} minutes'))`,
        [s.id, val]
      );
    }
  }

  // 5. Seed Alerts
  await db.execute(
    `INSERT INTO alerts (sensor_id, severity, message, status, triggered_at, resolved_at, resolved_by)
     VALUES (?, 'critical', 'Warehouse Relative Humidity melewati batas ambang aman (tercatat 68.4% RH)', 'resolved', datetime('now', '-3 hours'), datetime('now', '-1 hour'), 'Bambang Prakoso')`,
    [s3.insertId]
  );

  await db.execute(
    `INSERT INTO alerts (sensor_id, severity, message, status, triggered_at)
     VALUES (?, 'warning', 'Suhu Server Rack mendekati ambang batas kritis (26.8°C)', 'open', datetime('now', '-18 minutes'))`,
    [s1.insertId]
  );

  await db.execute(
    `INSERT INTO alerts (sensor_id, severity, message, status, triggered_at)
     VALUES (?, 'critical', 'Perangkat Cold Storage Sentinel tidak merespons heartbeat telemetri (>90 menit)', 'open', datetime('now', '-45 minutes'))`,
    [s7.insertId]
  );

  // 6. Seed Projects
  await db.execute(
    `INSERT INTO projects (title, slug, description, category, image_url, is_published)
     VALUES (?, ?, ?, ?, ?, 1)`,
    [
      'Smart Cold Chain Telemetry System',
      'smart-cold-chain-telemetry',
      'Implementasi 28 node IoT bersertifikasi IP67 untuk pemantauan suhu kontainer rantai dingin distribusi vaksin nasional.',
      'Smart Monitoring',
      '/src/assets/images/innodesk_hero_architecture_1791787843185.jpg',
    ]
  );

  await db.execute(
    `INSERT INTO projects (title, slug, description, category, image_url, is_published)
     VALUES (?, ?, ?, ?, ?, 1)`,
    [
      'Predictive Maintenance Assembly Line',
      'predictive-maintenance-assembly',
      'Sensor getaran nirkabel berdaya ultra-rendah terhubung ke cloud telemetry gateway untuk mendeteksi keausan bearing motor industri sebelum downtime.',
      'Industrial IoT',
      '/src/assets/images/innodesk_system_hub_1791787869808.jpg',
    ]
  );

  await db.execute(
    `INSERT INTO projects (title, slug, description, category, image_url, is_published)
     VALUES (?, ?, ?, ?, ?, 1)`,
    [
      'Enterprise Fleet & Asset Geotracking',
      'enterprise-fleet-asset-geotracking',
      'Solusi pelacakan armada logistik real-time dengan dual GNSS/Cellular dan sensor pemantauan konsumsi bahan bakar.',
      'Asset Tracking',
      '/src/assets/images/innodesk_workspace_minimal_1791787856954.jpg',
    ]
  );

  // 7. Seed Contact Messages
  await db.execute(
    `INSERT INTO contact_messages (name, email, company, subject, message, status, created_at)
     VALUES (?, ?, ?, ?, ?, 'unread', datetime('now', '-30 minutes'))`,
    [
      'Ir. Hendra Gunawan',
      'hendra@nusantaramanufacturing.co.id',
      'PT Nusantara Precision Manufacturing',
      'Integrasi Sensor Telemetri Lini Pabrik Karawang',
      'Kami membutuhkan audit 60 titik sensor getaran motor dan suhu boiler pada pabrik kami. Mohon proposal implementasi teknis dan estimasi jadwal PoC.',
    ]
  );

  await db.execute(
    `INSERT INTO contact_messages (name, email, company, subject, message, status, created_at)
     VALUES (?, ?, ?, ?, ?, 'read', datetime('now', '-2 days'))`,
    [
      'Maya Anggraini, S.T.',
      'maya.a@logistikindonesia.com',
      'PT Global Logistik Distribusi',
      'Penjajakan Gateway IoT Cold Storage',
      'Tertarik dengan solusi pemantauan suhu kontainer refrigerated secara otomatis. Kami ingin menjadwalkan sesi demonstrasi langsung dashboard internal.',
    ]
  );

  // 8. Seed Audit Log
  await db.execute(
    `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, created_at)
     VALUES (1, 'SYSTEM_BOOTSTRAP', 'system', 'INIT_SEED', datetime('now'))`
  );

  console.log('[Seed] Database initialization and relational seeding complete!');
}
