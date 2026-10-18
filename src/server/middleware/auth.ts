import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'innodesk-iot-jwt-super-secret-key-2026-production';

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Akses ditolak: Token autentikasi tidak ditemukan.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    
    // Check if user is active in DB
    const user = await db.queryOne<{ id: number; name: string; email: string; role: any; is_active: number }>(
      'SELECT id, name, email, role, is_active FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!user || !user.is_active) {
      return res.status(403).json({ success: false, error: 'Akun telah dinonaktifkan atau tidak ditemukan.' });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err: any) {
    return res.status(401).json({ success: false, error: 'Sesi kedaluwarsa atau token tidak valid. Silakan login kembali.' });
  }
};

export const requireRole = (...allowedRoles: ('admin' | 'operator' | 'viewer')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Autentikasi diperlukan.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Izin tidak memadai. Fitur ini memerlukan role: ${allowedRoles.join(' atau ')}. Role Anda: ${req.user.role}`,
      });
    }

    next();
  };
};

export const logAudit = async (
  userId: number | null,
  action: string,
  entityType: string,
  entityId: string | number | bigint
) => {
  try {
    await db.execute(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, created_at)
       VALUES (?, ?, ?, ?, datetime('now'))`,
      [userId, action, entityType, String(entityId)]
    );
  } catch (e) {
    console.error('[AuditLog Error]', e);
  }
};
