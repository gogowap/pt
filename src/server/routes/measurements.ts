import { Router } from 'express';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET /api/measurements (List with pagination and sensor filter)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { sensor_id, limit = '50', offset = '0' } = req.query;

    let sql = `
      SELECT m.*, s.name as sensor_name, s.unit, s.min_threshold, s.max_threshold,
             s.sensor_type, d.name as device_name, d.device_uid
      FROM measurements m
      JOIN sensors s ON m.sensor_id = s.id
      JOIN devices d ON s.device_id = d.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (sensor_id) {
      sql += ' AND m.sensor_id = ?';
      params.push(sensor_id);
    }

    sql += ' ORDER BY m.id DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const measurements = await db.query(sql, params);
    const totalCount = await db.queryOne<{ count: number }>(
      `SELECT COUNT(*) as count FROM measurements ${sensor_id ? 'WHERE sensor_id = ?' : ''}`,
      sensor_id ? [sensor_id] : []
    );

    return res.json({
      success: true,
      data: measurements,
      total: totalCount?.count || 0,
      limit: Number(limit),
      offset: Number(offset),
      is_simulated_notice: 'Data telemetri disajikan dari ingestion layer database relasional (Simulasi IoT Terpadu).',
    });
  } catch (err: any) {
    console.error('[Measurements Error]', err);
    return res.status(500).json({ success: false, error: 'Gagal mengambil data pengukuran.' });
  }
});

// GET /api/measurements/chart (Aggregated time series for Recharts)
router.get('/chart', authenticateToken, async (req, res) => {
  try {
    const { sensor_id, range = '24h' } = req.query;

    let timeFilter = "DATE_SUB(NOW(), INTERVAL 24 HOUR)";
    if (range === '1h') timeFilter = "DATE_SUB(NOW(), INTERVAL 1 HOUR)";
    else if (range === '6h') timeFilter = "DATE_SUB(NOW(), INTERVAL 6 HOUR)";
    else if (range === '7d') timeFilter = "DATE_SUB(NOW(), INTERVAL 7 DAY)";

    let sql = `
      SELECT m.id, m.sensor_id, m.value, m.recorded_at, s.name as sensor_name, s.unit,
             s.min_threshold, s.max_threshold
      FROM measurements m
      JOIN sensors s ON m.sensor_id = s.id
      WHERE m.recorded_at >= ${timeFilter}
    `;
    const params: any[] = [];

    if (sensor_id && sensor_id !== 'all') {
      sql += ' AND m.sensor_id = ?';
      params.push(sensor_id);
    }

    sql += ' ORDER BY m.id ASC LIMIT 100';

    const raw = await db.query(sql, params);

    // Format for Recharts
    const formatted = raw.map((r: any) => ({
      id: r.id,
      timestamp: r.recorded_at.split(' ')[1]?.substring(0, 5) || r.recorded_at,
      fullTime: r.recorded_at,
      sensorId: r.sensor_id,
      sensorName: r.sensor_name,
      value: r.value,
      unit: r.unit,
      minThreshold: r.min_threshold,
      maxThreshold: r.max_threshold,
      isBreached: r.value < r.min_threshold || r.value > r.max_threshold,
    }));

    return res.json({ success: true, data: formatted });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Gagal menyusun data grafik pengukuran.' });
  }
});

// POST /api/measurements/ingest (Ingestion Gateway for External Hardware / Edge Gateway)
router.post('/ingest', async (req, res) => {
  try {
    const { sensor_uid, value, recorded_at } = req.body;

    if (!sensor_uid || value === undefined) {
      return res.status(400).json({ success: false, error: 'sensor_uid dan value wajib disertakan.' });
    }

    const sensor = await db.queryOne<any>('SELECT * FROM sensors WHERE sensor_uid = ?', [sensor_uid]);
    if (!sensor) {
      return res.status(404).json({ success: false, error: `Sensor UID '${sensor_uid}' tidak terdaftar.` });
    }

    const valNum = Number(value);
    const recAt = recorded_at || new Date().toISOString();

    const result = await db.execute(
      `INSERT INTO measurements (sensor_id, value, recorded_at, received_at)
       VALUES (?, ?, ?, datetime('now'))`,
      [sensor.id, valNum, recAt]
    );

    // Update device last_seen_at
    await db.execute(
      `UPDATE devices SET last_seen_at = datetime('now'), status = 'online' WHERE id = ?`,
      [sensor.device_id]
    );

    return res.status(201).json({
      success: true,
      message: 'Pengukuran berhasil dicatat ke database.',
      measurement_id: result.insertId,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Gagal memproses ingestion pengukuran.' });
  }
});

export default router;
