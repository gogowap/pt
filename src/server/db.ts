import mysql, { Pool } from 'mysql2/promise';

export type DBClientType = 'memory' | 'mysql';

class DatabaseService {
  public clientType: DBClientType = 'memory';
  private pool: Pool | null = null;
  public memoryStore: Record<string, any[]> = {};
  private isInitialized = false;
  private autoIncrementIds: Record<string, number> = {};

  async init() {
    if (this.isInitialized) return;

    this.memoryStore = {
      users: [],
      devices: [],
      sensors: [],
      measurements: [],
      alerts: [],
      projects: [],
      contact_messages: [],
      audit_logs: [],
    };

    // Database connection credentials from environment variables or local MySQL/XAMPP defaults
    const host = process.env.DB_HOST || '127.0.0.1';
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '';
    const database = process.env.DB_NAME || 'innodesk_iot';
    const port = Number(process.env.DB_PORT) || 3306;

    try {
      const testPool = mysql.createPool({
        host,
        user,
        password,
        database,
        port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 2000,
      });

      // Quick ping test to verify MySQL server is responsive
      await testPool.query('SELECT 1');
      this.pool = testPool;
      this.clientType = 'mysql';
      this.isInitialized = true;
      console.log(`[Database] Terhubung ke MySQL database '${database}' di ${host}:${port}`);
      return;
    } catch (err: any) {
      console.warn(`[Database Notice] Koneksi MySQL (${host}:${port}/${database}) tidak aktif: ${err.message}.`);
      console.log(`[Database Notice] Menggunakan In-Memory Mock Relational Engine.`);
      this.pool = null;
      this.clientType = 'memory';
      this.isInitialized = true;
    }
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    await this.init();
    if (this.clientType === 'mysql' && this.pool) {
      try {
        const [rows] = await this.pool.query(sql, params);
        return rows as T[];
      } catch (err) {
        console.error('[MySQL Query Error]:', err);
        throw err;
      }
    }

    // In-memory relational emulation
    return this.handleMemoryQuery<T>(sql, params);
  }

  async queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const results = await this.query<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  async execute(sql: string, params: any[] = []): Promise<{ insertId: number; affectedRows: number }> {
    await this.init();
    if (this.clientType === 'mysql' && this.pool) {
      try {
        const [result] = await this.pool.execute(sql, params);
        const res = result as any;
        return {
          insertId: res.insertId || 0,
          affectedRows: res.affectedRows || 0,
        };
      } catch (err) {
        console.error('[MySQL Execute Error]:', err);
        throw err;
      }
    }

    // In-memory relational emulation
    return this.handleMemoryExecute(sql, params);
  }

  private handleMemoryQuery<T>(sql: string, params: any[]): T[] {
    const cleanSql = sql.trim();
    const countMatch = cleanSql.match(/SELECT\s+COUNT\(\*\)\s+(?:as|AS)?\s*(\w+)?\s+FROM\s+(\w+)/i);
    if (countMatch) {
      const alias = countMatch[1] || 'count';
      const table = countMatch[2];
      const items = this.memoryStore[table] || [];
      return [{ [alias]: items.length }] as unknown as T[];
    }

    const fromMatch = cleanSql.match(/FROM\s+(\w+)/i);
    if (!fromMatch) return [] as T[];
    const table = fromMatch[1];
    let items = [...(this.memoryStore[table] || [])];

    // Simple WHERE clause support (e.g., WHERE col = ?)
    const whereMatch = cleanSql.match(/WHERE\s+(\w+)\s*=\s*\?/i);
    if (whereMatch && params.length > 0) {
      const col = whereMatch[1];
      const val = params[0];
      items = items.filter(item => String(item[col]).toLowerCase() === String(val).toLowerCase());
    }

    // ORDER BY id DESC / created_at DESC
    if (/ORDER BY/i.test(cleanSql)) {
      if (/DESC/i.test(cleanSql)) {
        items.sort((a, b) => (b.id || 0) - (a.id || 0));
      } else {
        items.sort((a, b) => (a.id || 0) - (b.id || 0));
      }
    }

    // LIMIT N
    const limitMatch = cleanSql.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1], 10);
      items = items.slice(0, limit);
    }

    return items as unknown as T[];
  }

  private handleMemoryExecute(sql: string, params: any[]): { insertId: number; affectedRows: number } {
    const cleanSql = sql.trim();

    // INSERT INTO table (col1, col2, ...) VALUES (?, ?, ...)
    const insertMatch = cleanSql.match(/INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)/i);
    if (insertMatch) {
      const table = insertMatch[1];
      const columns = insertMatch[2].split(',').map(c => c.trim().replace(/[`"']/g, ''));

      if (!this.memoryStore[table]) {
        this.memoryStore[table] = [];
      }
      this.autoIncrementIds[table] = (this.autoIncrementIds[table] || 0) + 1;
      const insertId = this.autoIncrementIds[table];

      const newRow: Record<string, any> = {
        id: insertId,
        created_at: new Date().toISOString(),
      };

      let paramIdx = 0;
      for (const col of columns) {
        if (paramIdx < params.length) {
          newRow[col] = params[paramIdx];
          paramIdx++;
        }
      }

      this.memoryStore[table].push(newRow);
      return { insertId, affectedRows: 1 };
    }

    // UPDATE table SET ... WHERE id = ?
    const updateMatch = cleanSql.match(/UPDATE\s+(\w+)/i);
    if (updateMatch) {
      const table = updateMatch[1];
      const items = this.memoryStore[table] || [];
      return { insertId: 0, affectedRows: items.length > 0 ? 1 : 0 };
    }

    // DELETE FROM table WHERE ...
    const deleteMatch = cleanSql.match(/DELETE\s+FROM\s+(\w+)/i);
    if (deleteMatch) {
      const table = deleteMatch[1];
      const count = (this.memoryStore[table] || []).length;
      this.memoryStore[table] = [];
      return { insertId: 0, affectedRows: count };
    }

    return { insertId: Date.now(), affectedRows: 1 };
  }
}

export const db = new DatabaseService();
