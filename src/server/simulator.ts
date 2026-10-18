import { db } from './db.js';

class IoTSimulator {
  private timer: NodeJS.Timeout | null = null;
  public isRunning = false;
  public intervalSeconds = 8;
  public lastSimulationRun: string | null = null;
  public generatedCount = 0;

  start(intervalSec = 8) {
    if (this.isRunning) return;
    this.intervalSeconds = intervalSec;
    this.isRunning = true;
    console.log(`[IoT Simulator] Telemetry simulation started (Interval: ${this.intervalSeconds}s)`);

    this.timer = setInterval(() => {
      this.tick();
    }, this.intervalSeconds * 1000);

    // Initial immediate tick
    this.tick();
  }

  stop() {
    if (!this.isRunning) return;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    console.log('[IoT Simulator] Telemetry simulation paused');
  }

  async tick() {
    try {
      // Fetch active sensors on online devices
      const activeSensors = await db.query<any>(`
        SELECT s.id, s.name, s.unit, s.min_threshold, s.max_threshold, s.sensor_type, d.id as device_id, d.name as device_name
        FROM sensors s
        JOIN devices d ON s.device_id = d.id
        WHERE s.is_active = 1 AND d.status = 'online'
      `);

      if (!activeSensors || activeSensors.length === 0) return;

      for (const sensor of activeSensors) {
        // Calculate realistic reading with occasional slight deviation
        const mid = (sensor.min_threshold + sensor.max_threshold) / 2;
        const range = sensor.max_threshold - sensor.min_threshold;
        
        // 92% normal fluctuation, 8% spike for threshold testing
        const shouldSpike = Math.random() < 0.08;
        let value: number;

        if (shouldSpike) {
          // Spike above max or below min
          const above = Math.random() > 0.5;
          value = above ? sensor.max_threshold + range * 0.12 : sensor.min_threshold - range * 0.12;
        } else {
          // Normal Gaussian-like fluctuation around mid
          const fluctuation = (Math.random() - 0.5) * range * 0.6;
          value = mid + fluctuation;
        }

        value = Number(value.toFixed(2));

        // Insert measurement
        const result = await db.execute(
          `INSERT INTO measurements (sensor_id, value, recorded_at, received_at)
           VALUES (?, ?, datetime('now'), datetime('now'))`,
          [sensor.id, value]
        );

        this.generatedCount++;

        // Threshold breach detection
        if (value > sensor.max_threshold || value < sensor.min_threshold) {
          const breachDirection = value > sensor.max_threshold ? 'melebihi ambang batas atas' : 'di bawah ambang batas minimum';
          const thresholdVal = value > sensor.max_threshold ? sensor.max_threshold : sensor.min_threshold;
          const severity = Math.abs(value - thresholdVal) > range * 0.1 ? 'critical' : 'warning';
          const msg = `[Auto-Telemetry] Sensor ${sensor.name} ${breachDirection} (Tercatat: ${value} ${sensor.unit}, Batas: ${thresholdVal} ${sensor.unit})`;

          // Check if an open alert already exists for this sensor in the last 15 minutes to avoid flood
          const existing = await db.queryOne<any>(`
            SELECT id FROM alerts 
            WHERE sensor_id = ? AND status = 'open' 
              AND triggered_at > datetime('now', '-15 minutes')
          `, [sensor.id]);

          if (!existing) {
            await db.execute(
              `INSERT INTO alerts (sensor_id, measurement_id, severity, message, status, triggered_at)
               VALUES (?, ?, ?, ?, 'open', datetime('now'))`,
              [sensor.id, result.insertId, severity, msg]
            );
            console.log(`[Alert Triggered] ${msg}`);
          }
        }

        // Update device last_seen_at
        await db.execute(
          `UPDATE devices SET last_seen_at = datetime('now') WHERE id = ?`,
          [sensor.device_id]
        );
      }

      this.lastSimulationRun = new Date().toISOString();
    } catch (err: any) {
      console.error('[IoT Simulator Error]', err.message);
    }
  }
}

export const simulator = new IoTSimulator();
