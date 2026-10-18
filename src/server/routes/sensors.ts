import { Router } from 'express';
import { db } from '../db.js';
import { authenticateToken, requireRole, AuthenticatedRequest, logAudit } from '../middleware/auth.js';

const router = Router();

// GET /api/sensors (All sensors with device name and latest measurement)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { device_id, type } = req.query;

    let sql = `
      SELECT s.*, d.name as device_name, d.device_uid, d.status as device_status,
             (SELECT m.value FROM measurements m WHERE m.sensor_id = s.id ORDER BY m.id DESC LIMIT 1) as latest_value,
             (SELECT m.recorded_at FROM measurements m WHERE m.sensor_id = s.id ORDER BY m.id DESC LIMIT 1) as latest_recorded_at
      FROM sensors s
      JOIN devices d ON s.device_id = d.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (device_id) {
      sql += ' AND s.device_id = ?';
      params.push(device_id);
    }

    if (type && type !== 'all') {
      sql += ' AND s.sensor_type = ?';
      params.push(type);
    }

    sql += ' ORDER BY s.id DESC';

    const sensors = await db.query(sql, params);
    return res.json({ success: true, data: sensors });
  } catch (err: any) {
    console.error('[Sensors List Error]', err);
    return res.status(500).json({ success: false, error: 'Gagal mengambil data sensor.' });
  }
});

// GET /api/sensors/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const sensorId = req.params.id;
    const sensor = await db.queryOne(`
      SELECT s.*, d.name as device_name, d.device_uid, d.location as device_location
      FROM sensors s
      JOIN devices d ON s.device_id = d.id
      WHERE s.id = ?
    `, [sensorId]);

    if (!sensor) {
      return res.status(404).json({ success: false, error: 'Sensor tidak ditemukan.' });
    }

    const recentMeasurements = await db.query(`
      SELECT * FROM measurements 
      WHERE sensor_id = ? 
      ORDER BY id DESC 
      LIMIT 25
    `, [sensorId]);

    return res.json({
      success: true,
      data: {
        ...sensor,
        recentMeasurements,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Gagal mengambil detail sensor.' });
  }
});

// POST /api/sensors (Admin & Operator)
router.post('/', authenticateToken, requireRole('admin', 'operator'), async (req: AuthenticatedRequest, res) => {
  try {
    const { device_id, sensor_uid, name, sensor_type, unit, min_threshold, max_threshold, is_active } = req.body;

    if (!device_id || !sensor_uid || !name || !sensor_type || !unit) {
      return res.status(400).json({
        success: false,
        error: 'ID Perangkat, UID Sensor, Nama, Tipe Sensor, dan Satuan wajib diisi.',
      });
    }

    // Verify device exists
    const device = await db.queryOne('SELECT id FROM devices WHERE id = ?', [device_id]);
    if (!device) {
      return res.status(404).json({ success: false, error: 'Perangkat yang ditunjuk tidak ditemukan.' });
    }

    // Check duplicate UID
    const existing = await db.queryOne('SELECT id FROM sensors WHERE sensor_uid = ?', [sensor_uid.trim()]);
    if (existing) {
      return res.status(409).json({ success: false, error: `UID Sensor '${sensor_uid}' sudah terdaftar.` });
    }

    const result = await db.execute(
      `INSERT INTO sensors (device_id, sensor_uid, name, sensor_type, unit, min_threshold, max_threshold, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        device_id,
        sensor_uid.trim(),
        name.trim(),
        sensor_type.trim(),
        unit.trim(),
        min_threshold !== undefined ? Number(min_threshold) : 0,
        max_threshold !== undefined ? Number(max_threshold) : 100,
        is_active !== undefined ? (is_active ? 1 : 0) : 1,
      ]
    );

    await logAudit(req.user?.id || null, 'CREATE_SENSOR', 'sensors', result.insertId);

    const newSensor = await db.queryOne('SELECT * FROM sensors WHERE id = ?', [result.insertId]);
    return res.status(201).json({ success: true, message: 'Sensor berhasil ditambahkan.', data: newSensor });
  } catch (err: any) {
    console.error('[Create Sensor Error]', err);
    return res.status(500).json({ success: false, error: 'Gagal menambahkan sensor baru.' });
  }
});

// PUT /api/sensors/:id (Admin & Operator)
router.put('/:id', authenticateToken, requireRole('admin', 'operator'), async (req: AuthenticatedRequest, res) => {
  try {
    const sensorId = req.params.id;
    const { name, sensor_type, unit, min_threshold, max_threshold, is_active } = req.body;

    const existing = await db.queryOne('SELECT * FROM sensors WHERE id = ?', [sensorId]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Sensor tidak ditemukan.' });
    }

    await db.execute(
      `UPDATE sensors 
       SET name = ?, sensor_type = ?, unit = ?, min_threshold = ?, max_threshold = ?, is_active = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [
        name ? name.trim() : existing.name,
        sensor_type ? sensor_type.trim() : existing.sensor_type,
        unit ? unit.trim() : existing.unit,
        min_threshold !== undefined ? Number(min_threshold) : existing.min_threshold,
        max_threshold !== undefined ? Number(max_threshold) : existing.max_threshold,
        is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
        sensorId,
      ]
    );

    await logAudit(req.user?.id || null, 'UPDATE_SENSOR', 'sensors', sensorId);

    const updated = await db.queryOne('SELECT * FROM sensors WHERE id = ?', [sensorId]);
    return res.json({ success: true, message: 'Sensor berhasil diperbarui.', data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Gagal memperbarui konfigurasi sensor.' });
  }
});

// DELETE /api/sensors/:id (Admin only)
router.delete('/:id', authenticateToken, requireRole('admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const sensorId = req.params.id;
    const existing = await db.queryOne('SELECT * FROM sensors WHERE id = ?', [sensorId]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Sensor tidak ditemukan.' });
    }

    await db.execute('DELETE FROM sensors WHERE id = ?', [sensorId]);
    await logAudit(req.user?.id || null, 'DELETE_SENSOR', 'sensors', sensorId);

    return res.json({ success: true, message: `Sensor ${existing.name} berhasil dihapus.` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Gagal menghapus sensor.' });
  }
});

export default router;
