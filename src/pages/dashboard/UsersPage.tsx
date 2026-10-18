import React, { useState, useEffect } from 'react';
import { ApiClient } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Shield,
  CheckCircle2,
  XCircle,
  X,
  Lock,
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [deletingUser, setDeletingUser] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'operator',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await ApiClient.get<any[]>('/api/users');
    if (res.success && res.data) {
      setUsers(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name || !formData.email || !formData.password) {
      setFormError('Semua field wajib diisi.');
      return;
    }

    if (formData.password.length < 8) {
      setFormError('Password minimal 8 karakter.');
      return;
    }

    const res = await ApiClient.post('/api/users', formData);
    if (res.success) {
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'operator' });
      fetchUsers();
    } else {
      setFormError(res.error || 'Gagal membuat pengguna.');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setFormError(null);

    const res = await ApiClient.put(`/api/users/${editingUser.id}`, {
      name: editingUser.name,
      role: editingUser.role,
      is_active: editingUser.is_active,
      password: editingUser.password ? editingUser.password : undefined,
    });

    if (res.success) {
      setEditingUser(null);
      fetchUsers();
    } else {
      setFormError(res.error || 'Gagal memperbarui pengguna.');
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    const res = await ApiClient.delete(`/api/users/${deletingUser.id}`);
    if (res.success) {
      setDeletingUser(null);
      fetchUsers();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Manajemen Hak Akses & Pengguna (RBAC)
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Pengelolaan akun internal dengan otorisasi berbasis peran (Admin, Operator, Viewer).
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormData({ name: '', email: '', password: '', role: 'operator' });
            setFormError(null);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-zinc-950 rounded hover:bg-zinc-800 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-mono uppercase">
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Peran (Role)</th>
                <th className="py-3 px-4">Status Akun</th>
                <th className="py-3 px-4">Terdaftar Sejak</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400 font-mono">
                    Memuat data pengguna dari database...
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50">
                    <td className="py-3.5 px-4 font-bold text-zinc-950">
                      {u.name} {currentUser?.id === u.id && '(Anda)'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-600">{u.email}</td>
                    <td className="py-3.5 px-4 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-zinc-950 text-white'
                            : u.role === 'operator'
                            ? 'bg-zinc-200 text-zinc-900'
                            : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {u.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-zinc-400">
                          <XCircle className="w-3.5 h-3.5" />
                          Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500">
                      {u.created_at}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUser({ ...u, password: '' });
                            setFormError(null);
                          }}
                          className="p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {currentUser?.id !== u.id && (
                          <button
                            type="button"
                            onClick={() => setDeletingUser(u)}
                            className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add User */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-zinc-300 max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-zinc-950">Tambah Pengguna Internal</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-600">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-zinc-300"
                  placeholder="Nama Karyawan / Staf"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                  Email Perusahaan *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-zinc-300 font-mono"
                  placeholder="staf@innodesk.co.id"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                  Kata Sandi (Min. 8 Karakter) *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-zinc-300"
                  placeholder="••••••••••••"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                  Peran Otorisasi (Role)
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-zinc-300 bg-white"
                >
                  <option value="admin">Administrator (Hak Penuh)</option>
                  <option value="operator">Operator (Kelola Perangkat & Alert)</option>
                  <option value="viewer">Viewer (Akses Baca Telemetri)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-zinc-600 hover:text-zinc-950 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold uppercase tracking-wider bg-zinc-950 text-white rounded hover:bg-zinc-800 cursor-pointer"
                >
                  Buat Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit User */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-zinc-300 max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-zinc-950">
                Edit Pengguna: {editingUser.email}
              </h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-zinc-400 hover:text-zinc-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-600">
                {formError}
              </div>
            )}

            <form onSubmit={handleUpdateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-zinc-300"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                  Peran Otorisasi (Role)
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-zinc-300 bg-white"
                >
                  <option value="admin">Administrator</option>
                  <option value="operator">Operator</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                  Ubah Password (Kosongkan bila tidak ingin diganti)
                </label>
                <input
                  type="password"
                  value={editingUser.password || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-zinc-300"
                  placeholder="Min. 8 karakter baru"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={editingUser.is_active === 1 || editingUser.is_active === true}
                    onChange={(e) => setEditingUser({ ...editingUser, is_active: e.target.checked ? 1 : 0 })}
                    className="rounded text-zinc-900"
                  />
                  <span className="font-semibold text-zinc-800">Status Akun Aktif</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 font-semibold text-zinc-600 hover:text-zinc-950 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold uppercase tracking-wider bg-zinc-950 text-white rounded hover:bg-zinc-800 cursor-pointer"
                >
                  Perbarui Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete User */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-zinc-300 max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-950">Hapus Pengguna?</h3>
            <p className="text-xs text-zinc-600 mt-1 mb-5">
              Apakah Anda yakin ingin menghapus akun <span className="font-semibold">{deletingUser.name}</span> ({deletingUser.email})?
            </p>
            <div className="flex justify-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 font-semibold text-zinc-600 hover:text-zinc-950 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="px-4 py-2 font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
