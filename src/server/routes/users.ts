import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { authenticateToken, requireRole, AuthenticatedRequest, logAudit } from '../middleware/auth.js';

const router = Router();

// GET /api/users (Admin only)
router.get('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const users = await db.query(
      'SELECT id, name, email, role, is_active, created_at, updated_at FROM users ORDER BY id ASC'
    );
    return res.json({ success: true, data: users });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Gagal mengambil daftar pengguna.' });
  }
});

// POST /api/users (Admin only)
router.post('/', authenticateToken, requireRole('admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Nama, email, dan password wajib diisi.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password minimal 8 karakter.' });
    }

    const assignedRole = ['admin', 'operator', 'viewer'].includes(role) ? role : 'viewer';

    const existing = await db.queryOne('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (existing) {
      return res.status(409).json({ success: false, error: 'Email tersebut sudah terdaftar.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await db.execute(
      `INSERT INTO users (name, email, password_hash, role, is_active, created_at)
       VALUES (?, ?, ?, ?, 1, datetime('now'))`,
      [name.trim(), email.trim().toLowerCase(), passwordHash, assignedRole]
    );

    await logAudit(req.user?.id || null, 'CREATE_USER', 'users', result.insertId);

    const newUser = await db.queryOne(
      'SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({ success: true, message: 'Pengguna berhasil dibuat.', data: newUser });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Gagal membuat pengguna baru.' });
  }
});

// PUT /api/users/:id (Admin only)
router.put('/:id', authenticateToken, requireRole('admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const targetUserId = req.params.id;
    const { name, role, is_active, password } = req.body;

    const existing = await db.queryOne<any>('SELECT * FROM users WHERE id = ?', [targetUserId]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Pengguna tidak ditemukan.' });
    }

    let passwordHash = existing.password_hash;
    if (password && password.trim().length >= 8) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password.trim(), salt);
    }

    const newRole = role && ['admin', 'operator', 'viewer'].includes(role) ? role : existing.role;
    const newActive = is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active;

    await db.execute(
      `UPDATE users 
       SET name = ?, role = ?, is_active = ?, password_hash = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [name ? name.trim() : existing.name, newRole, newActive, passwordHash, targetUserId]
    );

    await logAudit(req.user?.id || null, 'UPDATE_USER', 'users', targetUserId);

    const updated = await db.queryOne(
      'SELECT id, name, email, role, is_active, updated_at FROM users WHERE id = ?',
      [targetUserId]
    );

    return res.json({ success: true, message: 'Data pengguna berhasil diperbarui.', data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Gagal memperbarui pengguna.' });
  }
});

// DELETE /api/users/:id (Admin only)
router.delete('/:id', authenticateToken, requireRole('admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const targetUserId = Number(req.params.id);

    // Prevent self-deletion
    if (req.user?.id === targetUserId) {
      return res.status(400).json({ success: false, error: 'Anda tidak dapat menghapus akun Anda sendiri saat sedang login.' });
    }

    const existing = await db.queryOne('SELECT id, name FROM users WHERE id = ?', [targetUserId]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Pengguna tidak ditemukan.' });
    }

    await db.execute('DELETE FROM users WHERE id = ?', [targetUserId]);
    await logAudit(req.user?.id || null, 'DELETE_USER', 'users', targetUserId);

    return res.json({ success: true, message: `Pengguna ${existing.name} berhasil dihapus.` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Gagal menghapus pengguna.' });
  }
});

export default router;
