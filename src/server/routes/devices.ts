import { Router } from 'express';
import { db } from '../db.js';
import { authenticateToken, requireRole, AuthenticatedRequest, logAudit } from '../middleware/auth.js';

const router = Router();

// GET /api/devices (List with search and filters)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, category, status } = req.query;

    let sql = `
      SELECT d.*, COUNT(s.id) as sensor_count 
      FROM devices d
      LEFT JOIN sensors s ON d.id = s.device_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      sql += ` AND (d.name LIKE ? OR d.device_uid LIKE ? OR d.location LIKE ?)`;
      const term = `%${String(search).trim()}%`;
      params.push(term, term, term);
    }

    if (category && category !== 'all') {
      sql += ` AND d.category = ?`;
      params.push(category);
    }

    if (status && status !== 'all') {
      sql += ` AND d.status = ?`;
      params.push(status);
    }

    sql += ` GROUP BY d.id ORDER BY d.id DESC`;

    const devices = await db.query(sql, params);
    return res.json({ success: true, data: devices });
  } catch (err: any) {
    console.error('[Devices List Error]', err);
    return res.status(500).json({ success: false, error: 'Gagal mengambil data perangkat.' });
  }
});

// GET /api/devices/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const deviceId = req.params.id;
    const device = await db.queryOne('SELECT * FROM devices WHERE id = ?', [deviceId]);

    if (!device) {
      return res.status(404).json({ success: false, error: 'Perangkat tidak ditemukan.' });
    }

    const sensors = await db.query('SELECT * FROM sensors WHERE device_id = ? ORDER BY id ASC', [deviceId]);

    return res.json({
      success: true,
      data: {
        ...device,
        sensors,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Gagal mengambil detail perangkat.' });
  }
});

// POST /api/devices (Admin & Operator)
router.post('/', authenticateToken, requireRole('admin', 'operator'), async (req: AuthenticatedRequest, res) => {
  try {
    const { device_uid, name, description, location, category, status } = req.body;

    if (!device_uid || !name || !location || !category) {
      return res.status(400).json({
        success: false,
        error: 'UID Perangkat, Nama, Lokasi, dan Kategori wajib diisi.',
      });
    }

    // Check duplicate UID
    const existing = await db.queryOne('SELECT id FROM devices WHERE device_uid = ?', [device_uid.trim()]);
    if (existing) {
      return res.status(409).json({ success: false, error: `UID Perangkat '${device_uid}' sudah digunakan.` });
    }

    const result = await db.execute(
      `INSERT INTO devices (device_uid, name, description, location, category, status, last_seen_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      [device_uid.trim(), name.trim(), description || '', location.trim(), category.trim(), status || 'online']
    );

    await logAudit(req.user?.id || null, 'CREATE_DEVICE', 'devices', result.insertId);

    const newDevice = await db.queryOne('SELECT * FROM devices WHERE id = ?', [result.insertId]);
    return res.status(201).json({ success: true, message: 'Perangkat berhasil ditambahkan.', data: newDevice });
  } catch (err: any) {
    console.error('[Create Device Error]', err);
    return res.status(500).json({ success: false, error: 'Gagal menyimpan perangkat baru.' });
  }
});

// PUT /api/devices/:id (Admin & Operator)
router.put('/:id', authenticateToken, requireRole('admin', 'operator'), async (req: AuthenticatedRequest, res) => {
  try {
    const deviceId = req.params.id;
    const { name, description, location, category, status } = req.body;

    const existing = await db.queryOne('SELECT * FROM devices WHERE id = ?', [deviceId]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Perangkat tidak ditemukan.' });
    }

    await db.execute(
      `UPDATE devices 
       SET name = ?, description = ?, location = ?, category = ?, status = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [
        name ? name.trim() : existing.name,
        description !== undefined ? description : existing.description,
        location ? location.trim() : existing.location,
        category ? category.trim() : existing.category,
        status || existing.status,
        deviceId,
      ]
    );

    await logAudit(req.user?.id || null, 'UPDATE_DEVICE', 'devices', deviceId);

    const updated = await db.queryOne('SELECT * FROM devices WHERE id = ?', [deviceId]);
    return res.json({ success: true, message: 'Perangkat berhasil diperbarui.', data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Gagal memperbarui perangkat.' });
  }
});

// DELETE /api/devices/:id (Admin only)
router.delete('/:id', authenticateToken, requireRole('admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const deviceId = req.params.id;
    const existing = await db.queryOne('SELECT * FROM devices WHERE id = ?', [deviceId]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Perangkat tidak ditemukan.' });
    }

    await db.execute('DELETE FROM devices WHERE id = ?', [deviceId]);
    await logAudit(req.user?.id || null, 'DELETE_DEVICE', 'devices', deviceId);

    return res.json({ success: true, message: `Perangkat ${existing.name} (${existing.device_uid}) berhasil dihapus.` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Gagal menghapus perangkat.' });
  }
});

export default router;
