import { Router } from 'express';
import { db } from '../db.js';
import { authenticateToken, requireRole, AuthenticatedRequest, logAudit } from '../middleware/auth.js';

const router = Router();

// GET /api/alerts
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, severity } = req.query;

    let sql = `
      SELECT a.*, s.name as sensor_name, s.unit, s.min_threshold, s.max_threshold,
             d.name as device_name, d.device_uid, d.location as device_location
      FROM alerts a
      JOIN sensors s ON a.sensor_id = s.id
      JOIN devices d ON s.device_id = d.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status && status !== 'all') {
      sql += ' AND a.status = ?';
      params.push(status);
    }

    if (severity && severity !== 'all') {
      sql += ' AND a.severity = ?';
      params.push(severity);
    }

    sql += ' ORDER BY a.id DESC';

    const alerts = await db.query(sql, params);
    return res.json({ success: true, data: alerts });
  } catch (err: any) {
    console.error('[Alerts List Error]', err);
    return res.status(500).json({ success: false, error: 'Gagal mengambil data peringatan sistem.' });
  }
});

// PUT /api/alerts/:id/resolve
router.put('/:id/resolve', authenticateToken, requireRole('admin', 'operator'), async (req: AuthenticatedRequest, res) => {
  try {
    const alertId = req.params.id;
    const resolverName = req.user?.name || 'Operator Lapangan';

    const existing = await db.queryOne('SELECT * FROM alerts WHERE id = ?', [alertId]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Peringatan tidak ditemukan.' });
    }

    if (existing.status === 'resolved') {
      return res.status(400).json({ success: false, error: 'Peringatan ini sudah ditandai selesai sebelumnya.' });
    }

    await db.execute(
      `UPDATE alerts 
       SET status = 'resolved', resolved_at = datetime('now'), resolved_by = ?
       WHERE id = ?`,
      [resolverName, alertId]
    );

    await logAudit(req.user?.id || null, 'RESOLVE_ALERT', 'alerts', alertId);

    const updated = await db.queryOne('SELECT * FROM alerts WHERE id = ?', [alertId]);
    return res.json({
      success: true,
      message: `Peringatan ID #${alertId} berhasil ditandai selesai oleh ${resolverName}.`,
      data: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Gagal menyelesaikan peringatan.' });
  }
});

export default router;
