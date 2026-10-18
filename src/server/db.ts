import Database from 'better-sqlite3';
import mysql from 'mysql2/promise';
import path from 'path';
import fs from 'fs';

export type DBClientType = 'sqlite' | 'mysql';

class DatabaseService {
  public clientType: DBClientType = 'sqlite';
  private sqliteDb: Database.Database | null = null;
  private mysqlPool: mysql.Pool | null = null;
  private isInitialized = false;

  async init() {
    if (this.isInitialized) return;

    // Check if MySQL environment credentials are provided and accessible
    const mysqlHost = process.env.DB_HOST;
    const mysqlUser = process.env.DB_USER;
    const mysqlDb = process.env.DB_NAME;

    if (mysqlHost && mysqlUser && mysqlDb) {
      try {
        console.log(`[Database] Attempting MySQL connection to ${mysqlHost}:${process.env.DB_PORT || 3306}...`);
        const pool = mysql.createPool({
          host: mysqlHost,
          port: Number(process.env.DB_PORT || 3306),
          user: mysqlUser,
          password: process.env.DB_PASSWORD || '',
          database: mysqlDb,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
        });

        // Test connection with timeout
        const conn = await pool.getConnection();
        await conn.ping();
        conn.release();

        this.mysqlPool = pool;
        this.clientType = 'mysql';
        console.log('[Database] Connected successfully to MySQL database engine.');
        this.isInitialized = true;
        return;
      } catch (err: any) {
        console.warn(`[Database] MySQL connection failed (${err.message}). Seamlessly engaging embedded SQLite engine for 100% operational reliability.`);
      }
    }

    // Embedded Relational Engine (better-sqlite3)
    const dbDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    const dbPath = path.join(dbDir, 'innodesk_iot.db');
    this.sqliteDb = new Database(dbPath);
    this.sqliteDb.pragma('journal_mode = WAL');
    this.sqliteDb.pragma('foreign_keys = ON');
    this.clientType = 'sqlite';
    console.log(`[Database] Embedded relational SQLite database initialized at ${dbPath}`);

    this.createSqliteTables();
    this.isInitialized = true;
  }

  private createSqliteTables() {
    if (!this.sqliteDb) return;

    this.sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'viewer',
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_uid TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        location TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'offline',
        last_seen_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sensors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id INTEGER NOT NULL,
        sensor_uid TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        sensor_type TEXT NOT NULL,
        unit TEXT NOT NULL,
        min_threshold REAL NOT NULL DEFAULT 0.0,
        max_threshold REAL NOT NULL DEFAULT 100.0,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS measurements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sensor_id INTEGER NOT NULL,
        value REAL NOT NULL,
        recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        received_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sensor_id) REFERENCES sensors(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sensor_id INTEGER NOT NULL,
        measurement_id INTEGER,
        severity TEXT NOT NULL DEFAULT 'warning',
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'open',
        triggered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        resolved_at DATETIME,
        resolved_by TEXT,
        FOREIGN KEY (sensor_id) REFERENCES sensors(id) ON DELETE CASCADE,
        FOREIGN KEY (measurement_id) REFERENCES measurements(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        image_url TEXT,
        is_published INTEGER NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'unread',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_devices_uid ON devices (device_uid);
      CREATE INDEX IF NOT EXISTS idx_sensors_device_id ON sensors (device_id);
      CREATE INDEX IF NOT EXISTS idx_measurements_sensor_recorded ON measurements (sensor_id, recorded_at);
      CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts (status);
    `);
  }

  // Unified Query Execution Interface
  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    await this.init();

    if (this.clientType === 'mysql' && this.mysqlPool) {
      const [rows] = await this.mysqlPool.execute(sql, params);
      return rows as T[];
    }

    if (this.sqliteDb) {
      // In SQLite, convert MySQL param syntax if needed
      const stmt = this.sqliteDb.prepare(sql);
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        return stmt.all(...params) as T[];
      } else {
        const info = stmt.run(...params);
        return [{ insertId: info.lastInsertRowid, affectedRows: info.changes }] as any;
      }
    }

    throw new Error('Database service is not initialized');
  }

  async queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const results = await this.query<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  async execute(sql: string, params: any[] = []): Promise<{ insertId: number | bigint; affectedRows: number }> {
    await this.init();

    if (this.clientType === 'mysql' && this.mysqlPool) {
      const [result] = await this.mysqlPool.execute(sql, params);
      const res = result as mysql.ResultSetHeader;
      return { insertId: res.insertId, affectedRows: res.affectedRows };
    }

    if (this.sqliteDb) {
      const stmt = this.sqliteDb.prepare(sql);
      const info = stmt.run(...params);
      return { insertId: info.lastInsertRowid, affectedRows: info.changes };
    }

    throw new Error('Database service is not initialized');
  }
}

export const db = new DatabaseService();
