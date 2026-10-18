import { Router } from 'express';
import { db } from '../db.js';
import { authenticateToken, requireRole, AuthenticatedRequest, logAudit } from '../middleware/auth.js';

const router = Router();

// POST /api/contact (Public Form Submission -> Persisted to Database)
router.post('/', async (req, res) => {
  try {
    const { name, email, company, subject, message } = req.body;

    // Strict Server-Side Validation
    if (!name || name.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'Nama lengkap minimal 3 karakter.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'Format email tidak valid.' });
    }

    if (!company || company.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Nama perusahaan/instansi wajib diisi.' });
    }

    if (!subject || subject.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Subjek pesan wajib dipilih atau diisi.' });
    }

    if (!message || message.trim().length < 15) {
      return res.status(400).json({ success: false, error: 'Pesan kebutuhan minimal 15 karakter.' });
    }

    // Persist directly into relational database
    const result = await db.execute(
      `INSERT INTO contact_messages (name, email, company, subject, message, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'unread', datetime('now'))`,
      [name.trim(), email.trim(), company.trim(), subject.trim(), message.trim()]
    );

    return res.status(201).json({
      success: true,
      message: 'Pesan konsultasi Anda telah berhasil disimpan ke database PT Innodesk. Tim teknis akan segera meninjau kebutuhan Anda.',
      data: {
        id: result.insertId,
        name: name.trim(),
        email: email.trim(),
        company: company.trim(),
        subject: subject.trim(),
        created_at: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('[Contact POST Error]', err);
    return res.status(500).json({ success: false, error: 'Terjadi kegagalan saat menyimpan pesan kontak ke database.' });
  }
});

// GET /api/contact/messages (Admin & Operator only)
router.get('/messages', authenticateToken, requireRole('admin', 'operator'), async (req, res) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM contact_messages';
    const params: any[] = [];

    if (status && status !== 'all') {
      sql += ' WHERE status = ?';
      params.push(status);
    }

    sql += ' ORDER BY id DESC';

    const messages = await db.query(sql, params);
    return res.json({ success: true, data: messages });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Gagal mengambil daftar pesan kontak.' });
  }
});

// PUT /api/contact/messages/:id/status (Admin & Operator only)
router.put('/messages/:id/status', authenticateToken, requireRole('admin', 'operator'), async (req: AuthenticatedRequest, res) => {
  try {
    const messageId = req.params.id;
    const { status } = req.body;

    if (!['unread', 'read', 'archived'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Status pesan tidak valid.' });
    }

    const existing = await db.queryOne('SELECT id FROM contact_messages WHERE id = ?', [messageId]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Pesan kontak tidak ditemukan.' });
    }

    await db.execute('UPDATE contact_messages SET status = ? WHERE id = ?', [status, messageId]);
    await logAudit(req.user?.id || null, `UPDATE_CONTACT_STATUS_${status.toUpperCase()}`, 'contact_messages', messageId);

    return res.json({ success: true, message: `Status pesan berhasil diubah menjadi ${status}.` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Gagal memperbarui status pesan.' });
  }
});

export default router;
