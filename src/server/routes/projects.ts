import { Router } from 'express';
import { db } from '../db.js';
import { authenticateToken, requireRole, AuthenticatedRequest, logAudit } from '../middleware/auth.js';

const router = Router();

// GET /api/projects (Public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let sql = 'SELECT * FROM projects WHERE is_published = 1';
    const params: any[] = [];

    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY id DESC';
    const projects = await db.query(sql, params);
    return res.json({ success: true, data: projects });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Gagal mengambil data proyek.' });
  }
});

// GET /api/projects/:id (Public)
router.get('/:id', async (req, res) => {
  try {
    const project = await db.queryOne('SELECT * FROM projects WHERE id = ? OR slug = ?', [req.params.id, req.params.id]);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Proyek tidak ditemukan.' });
    }
    return res.json({ success: true, data: project });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Gagal mengambil detail proyek.' });
  }
});

// POST /api/projects (Admin only)
router.post('/', authenticateToken, requireRole('admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const { title, slug, description, category, image_url, is_published } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ success: false, error: 'Judul, deskripsi, dan kategori wajib diisi.' });
    }

    const projectSlug = slug ? slug.trim() : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const result = await db.execute(
      `INSERT INTO projects (title, slug, description, category, image_url, is_published, created_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      [title.trim(), projectSlug, description.trim(), category.trim(), image_url || null, is_published !== undefined ? is_published : 1]
    );

    await logAudit(req.user?.id || null, 'CREATE_PROJECT', 'projects', result.insertId);

    const newProj = await db.queryOne('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    return res.status(201).json({ success: true, message: 'Proyek berhasil ditambahkan.', data: newProj });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Gagal membuat proyek baru.' });
  }
});

// PUT /api/projects/:id (Admin only)
router.put('/:id', authenticateToken, requireRole('admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const projId = req.params.id;
    const { title, description, category, image_url, is_published } = req.body;

    const existing = await db.queryOne('SELECT * FROM projects WHERE id = ?', [projId]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Proyek tidak ditemukan.' });
    }

    await db.execute(
      `UPDATE projects 
       SET title = ?, description = ?, category = ?, image_url = ?, is_published = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [
        title ? title.trim() : existing.title,
        description ? description.trim() : existing.description,
        category ? category.trim() : existing.category,
        image_url !== undefined ? image_url : existing.image_url,
        is_published !== undefined ? (is_published ? 1 : 0) : existing.is_published,
        projId,
      ]
    );

    await logAudit(req.user?.id || null, 'UPDATE_PROJECT', 'projects', projId);

    const updated = await db.queryOne('SELECT * FROM projects WHERE id = ?', [projId]);
    return res.json({ success: true, message: 'Proyek berhasil diperbarui.', data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Gagal memperbarui data proyek.' });
  }
});

// DELETE /api/projects/:id (Admin only)
router.delete('/:id', authenticateToken, requireRole('admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const projId = req.params.id;
    const existing = await db.queryOne('SELECT * FROM projects WHERE id = ?', [projId]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Proyek tidak ditemukan.' });
    }

    await db.execute('DELETE FROM projects WHERE id = ?', [projId]);
    await logAudit(req.user?.id || null, 'DELETE_PROJECT', 'projects', projId);

    return res.json({ success: true, message: `Proyek '${existing.title}' berhasil dihapus.` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Gagal menghapus proyek.' });
  }
});

export default router;
