import { Router } from 'express';
import { simulator } from '../simulator.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/simulator/status
router.get('/status', authenticateToken, (req, res) => {
  return res.json({
    success: true,
    data: {
      isRunning: simulator.isRunning,
      intervalSeconds: simulator.intervalSeconds,
      lastSimulationRun: simulator.lastSimulationRun,
      generatedCount: simulator.generatedCount,
    },
  });
});

// POST /api/simulator/toggle (Admin & Operator)
router.post('/toggle', authenticateToken, requireRole('admin', 'operator'), (req, res) => {
  if (simulator.isRunning) {
    simulator.stop();
  } else {
    simulator.start();
  }

  return res.json({
    success: true,
    message: simulator.isRunning ? 'Simulator IoT berhasil diaktifkan.' : 'Simulator IoT telah dijeda.',
    data: {
      isRunning: simulator.isRunning,
      intervalSeconds: simulator.intervalSeconds,
    },
  });
});

// POST /api/simulator/tick (Admin & Operator: Immediate telemetry pulse)
router.post('/tick', authenticateToken, requireRole('admin', 'operator'), async (req, res) => {
  await simulator.tick();
  return res.json({
    success: true,
    message: 'Siklus telemetri baru berhasil dieksekusi dan disimpan ke database.',
    data: {
      lastSimulationRun: simulator.lastSimulationRun,
      generatedCount: simulator.generatedCount,
    },
  });
});

export default router;
