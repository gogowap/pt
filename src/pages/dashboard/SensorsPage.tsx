import React, { useState, useEffect } from 'react';
import { ApiClient } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import {
  Activity,
  Plus,
  Edit2,
  Trash2,
  Server,
  X,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export const SensorsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [sensors, setSensors] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSensor, setEditingSensor] = useState<any | null>(null);
  const [deletingSensor, setDeletingSensor] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    device_id: '',
    sensor_uid: '',
    name: '',
    sensor_type: 'Temperature',
    unit: '°C',
    min_threshold: 0,
    max_threshold: 50,
    is_active: true,
  });
  const [formError, setFormError] = useState<string | null>(null);

  const fetchSensors = async () => {
    setLoading(true);
    const [sensRes, devRes] = await Promise.all([
      ApiClient.get<any[]>('/api/sensors'),
      ApiClient.get<any[]>('/api/devices'),
    ]);

    if (sensRes.success && sensRes.data) {
      setSensors(sensRes.data);
    }
    if (devRes.success && devRes.data) {
      setDevices(devRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSensors();
    const interval = setInterval(fetchSensors, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateSensor = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.device_id || !formData.sensor_uid || !formData.name) {
      setFormError('Pilih perangkat, isi UID sensor, dan nama.');
      return;
    }

    const res = await ApiClient.post('/api/sensors', formData);
    if (res.success) {
      setIsAddModalOpen(false);
      setFormData({
        device_id: devices[0]?.id || '',
        sensor_uid: '',
        name: '',
        sensor_type: 'Temperature',
        unit: '°C',
        min_threshold: 0,
        max_threshold: 50,
        is_active: true,
      });
      fetchSensors();
    } else {
      setFormError(res.error || 'Gagal menyimpan sensor.');
    }
  };

  const handleUpdateSensor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSensor) return;
    setFormError(null);

    const res = await ApiClient.put(`/api/sensors/${editingSensor.id}`, {
      name: editingSensor.name,
      sensor_type: editingSensor.sensor_type,
      unit: editingSensor.unit,
      min_threshold: editingSensor.min_threshold,
      max_threshold: editingSensor.max_threshold,
      is_active: editingSensor.is_active,
    });

    if (res.success) {
      setEditingSensor(null);
      fetchSensors();
    } else {
      setFormError(res.error || 'Gagal memperbarui sensor.');
    }
  };

  const handleDeleteSensor = async () => {
    if (!deletingSensor) return;
    const res = await ApiClient.delete(`/api/sensors/${deletingSensor.id}`);
    if (res.success) {
      setDeletingSensor(null);
      fetchSensors();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Manajemen Sensor & Ambang Batas
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Konfigurasi transduser telemetri, rentang batas aman (min/max), dan status pembacaan terkini.
          </p>
        </div>

        {hasRole('admin', 'operator') && (
          <button
            type="button"
            onClick={() => {
              setFormData({
                device_id: devices[0]?.id || '',
                sensor_uid: `SEN-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
                name: '',
                sensor_type: 'Temperature',
                unit: '°C',
                min_threshold: 18,
                max_threshold: 30,
                is_active: true,
              });
              setFormError(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-zinc-950 rounded hover:bg-zinc-800 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Sensor</span>
          </button>
        )}
      </div>

      {/* Sensors Table */}
      <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-mono uppercase">
                <th className="py-3 px-4">Nama & UID Sensor</th>
                <th className="py-3 px-4">Perangkat Penghubung</th>
                <th className="py-3 px-4">Tipe & Satuan</th>
                <th className="py-3 px-4">Rentang Ambang Batas</th>
                <th className="py-3 px-4">Nilai Terakhir</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400 font-mono">
                    Memuat data sensor...
                  </td>
                </tr>
              ) : sensors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    Belum ada sensor yang terdaftar.
                  </td>
                </tr>
              ) : (
                sensors.map((s) => {
                  const hasBreached =
                    s.latest_value !== null &&
                    (s.latest_value < s.min_threshold || s.latest_value > s.max_threshold);

                  return (
                    <tr key={s.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-zinc-950 block">{s.name}</span>
                        <span className="font-mono text-[11px] text-zinc-400">{s.sensor_uid}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-zinc-900">
                          <Server className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{s.device_name}</span>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-400 block">{s.device_uid}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-semibold text-zinc-800">{s.sensor_type}</span>
                        <span className="text-zinc-500 ml-1">({s.unit})</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <span className="text-zinc-700">{s.min_threshold} s/d {s.max_threshold} {s.unit}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {s.latest_value !== null ? (
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-mono font-bold text-sm tabular-nums ${
                                hasBreached ? 'text-red-600' : 'text-zinc-950'
                              }`}
                            >
                              {s.latest_value} {s.unit}
                            </span>
                            {hasBreached && (
                              <span title="Melanggar ambang batas">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-zinc-400 font-mono text-[11px]">N/A</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            s.is_active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                          }`}
                        >
                          {s.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {hasRole('admin', 'operator') && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSensor({ ...s });
                                setFormError(null);
                              }}
                              title="Edit Konfigurasi Ambang Batas"
                              className="p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {hasRole('admin') && (
                            <button
                              type="button"
                              onClick={() => setDeletingSensor(s)}
                              title="Hapus Sensor"
                              className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Sensor */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-zinc-300 max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-zinc-950">Tambah Sensor Baru</h3>
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

            <form onSubmit={handleCreateSensor} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                  Hubungkan ke Perangkat *
                </label>
                <select
                  value={formData.device_id}
                  onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-zinc-300 bg-white"
                >
                  <option value="">-- Pilih Perangkat --</option>
                  {devices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.device_uid})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                  Sensor UID (Unik) *
                </label>
                <input
                  type="text"
                  value={formData.sensor_uid}
                  onChange={(e) => setFormData({ ...formData, sensor_uid: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-zinc-300 font-mono"
                  placeholder="SEN-TEMP-01"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                  Nama Sensor *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-zinc-300"
                  placeholder="Sensor Suhu Ruang Reaktor"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                    Tipe Sensor
                  </label>
                  <input
                    type="text"
                    value={formData.sensor_type}
                    onChange={(e) => setFormData({ ...formData, sensor_type: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-zinc-300"
                    placeholder="Temperature / Vibration / Pressure"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                    Satuan Pengukuran
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-zinc-300"
                    placeholder="°C / %RH / Bar / Ampere"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                    Ambang Minimum
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.min_threshold}
                    onChange={(e) => setFormData({ ...formData, min_threshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded border border-zinc-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                    Ambang Maksimum
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.max_threshold}
                    onChange={(e) => setFormData({ ...formData, max_threshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded border border-zinc-300 font-mono"
                  />
                </div>
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
                  Simpan Sensor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Sensor */}
      {editingSensor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-zinc-300 max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-zinc-950">
                Edit Sensor: {editingSensor.sensor_uid}
              </h3>
              <button
                type="button"
                onClick={() => setEditingSensor(null)}
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

            <form onSubmit={handleUpdateSensor} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                  Nama Sensor
                </label>
                <input
                  type="text"
                  value={editingSensor.name}
                  onChange={(e) => setEditingSensor({ ...editingSensor, name: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-zinc-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                    Tipe Sensor
                  </label>
                  <input
                    type="text"
                    value={editingSensor.sensor_type}
                    onChange={(e) => setEditingSensor({ ...editingSensor, sensor_type: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-zinc-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                    Satuan Pengukuran
                  </label>
                  <input
                    type="text"
                    value={editingSensor.unit}
                    onChange={(e) => setEditingSensor({ ...editingSensor, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-zinc-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                    Ambang Batas Minimum
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={editingSensor.min_threshold}
                    onChange={(e) => setEditingSensor({ ...editingSensor, min_threshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded border border-zinc-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                    Ambang Batas Maksimum
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={editingSensor.max_threshold}
                    onChange={(e) => setEditingSensor({ ...editingSensor, max_threshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded border border-zinc-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={editingSensor.is_active === 1 || editingSensor.is_active === true}
                    onChange={(e) => setEditingSensor({ ...editingSensor, is_active: e.target.checked ? 1 : 0 })}
                    className="rounded text-zinc-900"
                  />
                  <span className="font-semibold text-zinc-800">Sensor Aktif Menerima Pengukuran</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setEditingSensor(null)}
                  className="px-4 py-2 font-semibold text-zinc-600 hover:text-zinc-950"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold uppercase tracking-wider bg-zinc-950 text-white rounded hover:bg-zinc-800"
                >
                  Perbarui Sensor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Sensor (Admin) */}
      {deletingSensor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-zinc-300 max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-950">Hapus Sensor?</h3>
            <p className="text-xs text-zinc-600 mt-1 mb-5">
              Apakah Anda yakin ingin menghapus <span className="font-semibold">{deletingSensor.name}</span>? Seluruh riwayat telemetri sensor ini akan terhapus.
            </p>
            <div className="flex justify-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => setDeletingSensor(null)}
                className="px-4 py-2 font-semibold text-zinc-600 hover:text-zinc-950 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteSensor}
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
