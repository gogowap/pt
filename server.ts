import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { db } from './src/server/db.js';
import { seedDatabase } from './src/server/seed.js';
import { simulator } from './src/server/simulator.js';

import authRoutes from './src/server/routes/auth.js';
import devicesRoutes from './src/server/routes/devices.js';
import sensorsRoutes from './src/server/routes/sensors.js';
import measurementsRoutes from './src/server/routes/measurements.js';
import dashboardRoutes from './src/server/routes/dashboard.js';
import alertsRoutes from './src/server/routes/alerts.js';
import projectsRoutes from './src/server/routes/projects.js';
import contactRoutes from './src/server/routes/contact.js';
import usersRoutes from './src/server/routes/users.js';
import simulatorRoutes from './src/server/routes/simulator.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();

  // Core Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Request Logger
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'UP',
      service: 'PT Innodesk IoT Platform Full-Stack Server',
      database: db.clientType,
      simulator: simulator.isRunning ? 'RUNNING' : 'PAUSED',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API Endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/devices', devicesRoutes);
  app.use('/api/sensors', sensorsRoutes);
  app.use('/api/measurements', measurementsRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/alerts', alertsRoutes);
  app.use('/api/projects', projectsRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/simulator', simulatorRoutes);

  // Initialize Database and Seed Data
  try {
    await db.init();
    await seedDatabase();
    
    // Start background IoT simulator if enabled
    if (process.env.SIMULATOR_ENABLED !== 'false') {
      const intervalSec = Number(process.env.SIMULATOR_INTERVAL_SEC) || 8;
      simulator.start(intervalSec);
    }
  } catch (err: any) {
    console.error('[Bootstrap Error] Failed to initialize database or simulator:', err);
  }

  // Vite Integration (SPA Middleware in Dev, Static in Prod)
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req: Request, res: Response, next: NextFunction) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('[Unhandled Server Error]', err);
    res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan internal pada server.',
      detail: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`  PT INNODESK IoT PLATFORM FULL-STACK RUNTIME`);
    console.log(`  Server running on http://0.0.0.0:${PORT}`);
    console.log(`  Database Engine: ${db.clientType.toUpperCase()}`);
    console.log(`  Simulator Status: ${simulator.isRunning ? 'ACTIVE' : 'IDLE'}`);
    console.log(`=======================================================`);
  });
}

startServer();
