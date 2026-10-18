import React, { useState, useEffect } from 'react';
import { ApiClient } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import {
  Server,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Clock,
  MapPin,
  Tag,
} from 'lucide-react';

export const DevicesPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<any | null>(null);
  const [viewingDevice, setViewingDevice] = useState<any | null>(null);
  const [deletingDevice, setDeletingDevice] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    device_uid: '',
    name: '',
    description: '',
    location: '',
    category: 'Industrial Gateway',
    status: 'online',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const fetchDevices = async () => {
    setLoading(true);
    let url = `/api/devices?search=${encodeURIComponent(search)}&category=${encodeURIComponent(categoryFilter)}&status=${encodeURIComponent(statusFilter)}`;
    const res = await ApiClient.get<any[]>(url);
    if (res.success && res.data) {
      setDevices(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDevices();
  }, [categoryFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDevices();
  };

  const handleCreateDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.device_uid || !formData.name || !formData.location) {
      setFormError('UID, Nama, dan Lokasi wajib diisi.');
      return;
    }

    const res = await ApiClient.post('/api/devices', formData);
    if (res.success) {
      setIsAddModalOpen(false);
      setFormData({
        device_uid: '',
        name: '',
        description: '',
        location: '',
        category: 'Industrial Gateway',
        status: 'online',
      });
      fetchDevices();
    } else {
      setFormError(res.error || 'Gagal menyimpan perangkat.');
    }
  };

  const handleUpdateDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDevice) return;
    setFormError(null);

    const res = await ApiClient.put(`/api/devices/${editingDevice.id}`, {
      name: editingDevice.name,
      description: editingDevice.description,
      location: editingDevice.location,
      category: editingDevice.category,
      status: editingDevice.status,
    });

    if (res.success) {
      setEditingDevice(null);
      fetchDevices();
    } else {
      setFormError(res.error || 'Gagal memperbarui perangkat.');
    }
  };

  const handleDeleteDevice = async () => {
    if (!deletingDevice) return;
    const res = await ApiClient.delete(`/api/devices/${deletingDevice.id}`);
    if (res.success) {
      setDeletingDevice(null);
      fetchDevices();
    }
  };

  const openViewDetail = async (id: number) => {
    const res = await ApiClient.get(`/api/devices/${id}`);
    if (res.success && res.data) {
      setViewingDevice(res.data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Manajemen Perangkat & Gateway IoT
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Daftar simpul perangkat keras, node edge gateway, dan status konektivitas jaringan.
          </p>
        </div>

        {hasRole('admin', 'operator') && (
          <button
            type="button"
            onClick={() => {
              setFormData({
                device_uid: `DEV-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
                name: '',
                description: '',
                location: '',
                category: 'Industrial Gateway',
                status: 'online',
              });
              setFormError(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-zinc-950 rounded hover:bg-zinc-800 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Perangkat</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-lg border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, UID, atau lokasi..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded border border-zinc-300 focus:border-zinc-950 focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span>Kategori:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2 py-1 text-xs rounded border border-zinc-300 bg-white"
            >
              <option value="all">Semua Kategori</option>
              <option value="Industrial Gateway">Industrial Gateway</option>
              <option value="Environmental Monitor">Environmental Monitor</option>
              <option value="Machinery Telemetry">Machinery Telemetry</option>
              <option value="Temperature Monitoring">Temperature Monitoring</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1 text-xs rounded border border-zinc-300 bg-white"
            >
              <option value="all">Semua Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Devices Table */}
      <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-mono uppercase">
                <th className="py-3 px-4">UID / Nama Perangkat</th>
                <th className="py-3 px-4">Kategori & Lokasi</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Jumlah Sensor</th>
                <th className="py-3 px-4">Komunikasi Terakhir</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400 font-mono">
                    Memuat data perangkat dari database...
                  </td>
                </tr>
              ) : devices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    Tidak ada perangkat yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                devices.map((dev) => (
                  <tr key={dev.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-zinc-950 block">{dev.name}</span>
                      <span className="font-mono text-[11px] text-zinc-400">{dev.device_uid}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-zinc-800 font-medium">
                        <Tag className="w-3 h-3 text-zinc-400" />
                        <span>{dev.category}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] mt-0.5">
                        <MapPin className="w-3 h-3 text-zinc-400" />
                        <span className="truncate max-w-[200px]">{dev.location}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${
                          dev.status === 'online'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : dev.status === 'maintenance'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            dev.status === 'online'
                              ? 'bg-emerald-600'
                              : dev.status === 'maintenance'
                              ? 'bg-amber-600'
                              : 'bg-zinc-400'
                          }`}
                        />
                        {dev.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold">
                      {dev.sensor_count} Sensor
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500">
                      {dev.last_seen_at || 'Belum ada telemetri'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openViewDetail(dev.id)}
                          title="Lihat Detail & Sensor"
                          className="p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {hasRole('admin', 'operator') && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDevice({ ...dev });
                              setFormError(null);
                            }}
                            title="Edit Perangkat"
                            className="p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {hasRole('admin') && (
                          <button
                            type="button"
                            onClick={() => setDeletingDevice(dev)}
                            title="Hapus Perangkat (Admin)"
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

      {/* Modal: Add Device */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-zinc-300 max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-zinc-950">Tambah Perangkat IoT Baru</h3>
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

            <form onSubmit={handleCreateDevice} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                  Device UID (Unik) *
                </label>
                <input
                  type="text"
                  value={formData.device_uid}
                  onChange={(e) => setFormData({ ...formData, device_uid: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-zinc-300 font-mono"
                  placeholder="DEV-JKT-01"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                  Nama Perangkat *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-zinc-300"
                  placeholder="Master Edge Gateway Karawang"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-zinc-300 bg-white"
                  >
                    <option value="Industrial Gateway">Industrial Gateway</option>
                    <option value="Environmental Monitor">Environmental Monitor</option>
                    <option value="Machinery Telemetry">Machinery Telemetry</option>
                    <option value="Temperature Monitoring">Temperature Monitoring</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                    Status Awal
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-zinc-300 bg-white"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                  Lokasi Fisik Node *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-zinc-300"
                  placeholder="Contoh: Gedung A, Ruang Server Lt. 2"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                  Deskripsi / Catatan Perangkat
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-zinc-300"
                  placeholder="Node penghubung protokol RS485..."
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-zinc-600 hover:text-zinc-950"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold uppercase tracking-wider bg-zinc-950 text-white rounded hover:bg-zinc-800"
                >
                  Simpan Perangkat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Device */}
      {editingDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-zinc-300 max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-zinc-950">
                Edit Perangkat: {editingDevice.device_uid}
              </h3>
              <button
                type="button"
                onClick={() => setEditingDevice(null)}
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

            <form onSubmit={handleUpdateDevice} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                  Nama Perangkat
                </label>
                <input
                  type="text"
                  value={editingDevice.name}
                  onChange={(e) => setEditingDevice({ ...editingDevice, name: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-zinc-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={editingDevice.category}
                    onChange={(e) => setEditingDevice({ ...editingDevice, category: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-zinc-300 bg-white"
                  >
                    <option value="Industrial Gateway">Industrial Gateway</option>
                    <option value="Environmental Monitor">Environmental Monitor</option>
                    <option value="Machinery Telemetry">Machinery Telemetry</option>
                    <option value="Temperature Monitoring">Temperature Monitoring</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingDevice.status}
                    onChange={(e) => setEditingDevice({ ...editingDevice, status: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-zinc-300 bg-white"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                  Lokasi Fisik
                </label>
                <input
                  type="text"
                  value={editingDevice.location}
                  onChange={(e) => setEditingDevice({ ...editingDevice, location: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-zinc-300"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={2}
                  value={editingDevice.description || ''}
                  onChange={(e) => setEditingDevice({ ...editingDevice, description: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-zinc-300"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setEditingDevice(null)}
                  className="px-4 py-2 font-semibold text-zinc-600 hover:text-zinc-950"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold uppercase tracking-wider bg-zinc-950 text-white rounded hover:bg-zinc-800"
                >
                  Perbarui Perangkat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Device Detail & Sensors */}
      {viewingDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-zinc-300 max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-zinc-950">{viewingDevice.name}</h3>
                <span className="font-mono text-xs text-zinc-500">{viewingDevice.device_uid}</span>
              </div>
              <button
                type="button"
                onClick={() => setViewingDevice(null)}
                className="text-zinc-400 hover:text-zinc-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-50 rounded border border-zinc-200 text-xs mb-5">
              <div>
                <span className="text-zinc-400 block text-[11px]">KATEGORI:</span>
                <span className="font-semibold text-zinc-800">{viewingDevice.category}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[11px]">STATUS OPERASI:</span>
                <span className="font-mono font-bold text-zinc-900 uppercase">{viewingDevice.status}</span>
              </div>
              <div className="col-span-2">
                <span className="text-zinc-400 block text-[11px]">LOKASI:</span>
                <span className="text-zinc-800">{viewingDevice.location}</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 mb-2">
                Sensor Terhubung ({viewingDevice.sensors?.length || 0}):
              </h4>

              {viewingDevice.sensors?.length === 0 ? (
                <p className="text-xs text-zinc-500 italic">Belum ada sensor yang terhubung pada node ini.</p>
              ) : (
                <div className="space-y-2">
                  {viewingDevice.sensors?.map((s: any) => (
                    <div
                      key={s.id}
                      className="p-2.5 rounded border border-zinc-200 bg-white flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-zinc-900 block">{s.name}</span>
                        <span className="font-mono text-[10px] text-zinc-400">{s.sensor_uid}</span>
                      </div>
                      <div className="text-right font-mono text-xs">
                        <span className="text-zinc-500">Ambang: </span>
                        <span className="font-semibold">{s.min_threshold} - {s.max_threshold} {s.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-zinc-200">
              <button
                type="button"
                onClick={() => setViewingDevice(null)}
                className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation (Admin) */}
      {deletingDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-zinc-300 max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-950">Hapus Perangkat?</h3>
            <p className="text-xs text-zinc-600 mt-1 mb-5">
              Apakah Anda yakin ingin menghapus <span className="font-semibold">{deletingDevice.name}</span> ({deletingDevice.device_uid})? Seluruh sensor dan riwayat telemetri terkait akan terhapus secara permanen.
            </p>
            <div className="flex justify-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => setDeletingDevice(null)}
                className="px-4 py-2 font-semibold text-zinc-600 hover:text-zinc-950 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteDevice}
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
