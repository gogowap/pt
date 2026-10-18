import { Router } from 'express';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET /api/dashboard/summary
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    // Total devices & status breakdown
    const devicesCount = await db.queryOne<{ total: number; online: number; offline: number }>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'online' THEN 1 ELSE 0 END) as online,
        SUM(CASE WHEN status != 'online' THEN 1 ELSE 0 END) as offline
      FROM devices
    `);

    // Total sensors
    const sensorsCount = await db.queryOne<{ total: number; active: number }>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active
      FROM sensors
    `);

    // Total measurements
    const measurementsCount = await db.queryOne<{ total: number }>(`
      SELECT COUNT(*) as total FROM measurements
    `);

    // Alerts count
    const alertsCount = await db.queryOne<{ total_open: number; critical_open: number; warning_open: number }>(`
      SELECT 
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as total_open,
        SUM(CASE WHEN status = 'open' AND severity = 'critical' THEN 1 ELSE 0 END) as critical_open,
        SUM(CASE WHEN status = 'open' AND severity = 'warning' THEN 1 ELSE 0 END) as warning_open
      FROM alerts
    `);

    // Recent 5 measurements
    const recentMeasurements = await db.query(`
      SELECT m.id, m.value, m.recorded_at, s.name as sensor_name, s.unit,
             s.min_threshold, s.max_threshold, d.name as device_name
      FROM measurements m
      JOIN sensors s ON m.sensor_id = s.id
      JOIN devices d ON s.device_id = d.id
      ORDER BY m.id DESC
      LIMIT 6
    `);

    // Recent 4 active alerts
    const recentAlerts = await db.query(`
      SELECT a.*, s.name as sensor_name, s.unit, d.name as device_name
      FROM alerts a
      JOIN sensors s ON a.sensor_id = s.id
      JOIN devices d ON s.device_id = d.id
      WHERE a.status = 'open'
      ORDER BY a.id DESC
      LIMIT 4
    `);

    // Recent audit logs
    const recentLogs = await db.query(`
      SELECT l.*, u.name as user_name
      FROM audit_logs l
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.id DESC
      LIMIT 5
    `);

    return res.json({
      success: true,
      data: {
        devices: {
          total: devicesCount?.total || 0,
          online: devicesCount?.online || 0,
          offline: devicesCount?.offline || 0,
        },
        sensors: {
          total: sensorsCount?.total || 0,
          active: sensorsCount?.active || 0,
        },
        measurements: {
          total: measurementsCount?.total || 0,
        },
        alerts: {
          openTotal: alertsCount?.total_open || 0,
          critical: alertsCount?.critical_open || 0,
          warning: alertsCount?.warning_open || 0,
        },
        recentMeasurements,
        recentAlerts,
        recentLogs,
      },
    });
  } catch (err: any) {
    console.error('[Dashboard Summary Error]', err);
    return res.status(500).json({ success: false, error: 'Gagal memuat ringkasan dashboard.' });
  }
});

export default router;
