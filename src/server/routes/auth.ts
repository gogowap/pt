import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { authenticateToken, AuthenticatedRequest, logAudit } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'innodesk-iot-jwt-super-secret-key-2026-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email dan password wajib diisi.' });
    }

    const user = await db.queryOne<any>(
      'SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    if (!user) {
      return res.status(401).json({ success: false, error: 'Kredensial tidak valid: Akun tidak ditemukan.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, error: 'Akun telah dinonaktifkan oleh Administrator.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Kredensial tidak valid: Password keliru.' });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' } as jwt.SignOptions);

    await logAudit(user.id, 'USER_LOGIN', 'users', user.id);

    return res.json({
      success: true,
      message: 'Login berhasil.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error('[Auth Login Error]', err);
    return res.status(500).json({ success: false, error: 'Terjadi kegagalan pada server saat proses autentikasi.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res) => {
  if (req.user) {
    await logAudit(req.user.id, 'USER_LOGOUT', 'users', req.user.id);
  }
  return res.json({ success: true, message: 'Logout berhasil.' });
});

export default router;
