import React, { useState } from 'react';
import { ApiClient } from '../../lib/api';
import { Mail, Clock, Send, CheckCircle2, MapPin, Building2, Phone, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: 'Smart Monitoring',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ id?: number; message?: string } | null>(null);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) {
      errors.name = 'Nama lengkap minimal 3 karakter.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Format email perusahaan tidak valid.';
    }
    if (!formData.company.trim()) {
      errors.company = 'Nama perusahaan atau instansi wajib diisi.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 15) {
      errors.message = 'Deskripsi kebutuhan teknis minimal 15 karakter.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const res = await ApiClient.post('/api/contact', formData);
    setIsSubmitting(false);

    if (res.success) {
      setSubmitResult({
        id: res.data?.id,
        message: res.message,
      });
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: 'Smart Monitoring',
        message: '',
      });
      setFormErrors({});
    } else {
      setFormErrors({ form: res.error || 'Gagal menyimpan pesan ke database.' });
    }
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2">
            <span>Kontak & Konsultasi</span>
            <span aria-hidden="true">·</span>
            <span>PT Innodesk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight leading-tight">
            Hubungi Tim Solusi IoT & Telemetri PT Innodesk.
          </h1>
          <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
            Formulir ini memvalidasi input di frontend dan backend sebelum menyimpannya ke tabel database relasional. Tim teknis kami akan meninjau pesan melalui Dashboard Internal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Kolom Informasi Kantor (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-lg border border-zinc-200 p-6 space-y-5">
              <h2 className="text-base font-bold text-zinc-950 pb-3 border-b border-zinc-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-zinc-900" />
                <span>Saluran Resmi Kantor Pusat</span>
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900 block">Alamat Perusahaan</span>
                    <span className="text-zinc-600 leading-relaxed">
                      Gedung Pusat Bisnis Terpadu, Lantai 12, Jakarta, Indonesia [Placeholder Resmi Perusahaan]
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900 block">Email Perusahaan</span>
                    <span className="text-zinc-600 font-mono">info@innodesk.co.id [Placeholder Kontak]</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900 block">Saluran Telepon</span>
                    <span className="text-zinc-600 font-mono">+62 (Konfirmasi Nomor Kantor Resmi)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900 block">Jam Operasional</span>
                    <span className="text-zinc-600">Senin – Jumat: 08:30 – 17:30 WIB</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-md border border-zinc-200 bg-zinc-50 text-xs text-zinc-600 leading-relaxed">
              <div className="font-semibold text-zinc-800 mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-zinc-700" />
                <span>Alur Persistensi Database:</span>
              </div>
              Pesan yang Anda kirim akan disimpan ke tabel <code className="font-mono bg-zinc-200/60 px-1 py-0.5 rounded">contact_messages</code> dengan status default <span className="font-mono text-zinc-900 font-semibold">unread</span> dan dapat ditindaklanjuti oleh staf operator melalui menu Pesan di Dashboard.
            </div>
          </div>

          {/* Kolom Formulir (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sm:p-8 shadow-xs">
              {submitResult ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-900">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-950">
                    Pesan Berhasil Tercatat di Database!
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
                    {submitResult.message}
                  </p>
                  {submitResult.id && (
                    <div className="text-xs font-mono text-zinc-500 bg-zinc-50 py-1.5 px-3 rounded inline-block border border-zinc-200">
                      ID TIKET DATABASE: #{submitResult.id}
                    </div>
                  )}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSubmitResult(null)}
                      className="px-5 py-2 text-xs font-semibold tracking-wider uppercase text-white bg-zinc-950 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      Kirim Formulir Lain
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {formErrors.form && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                      {formErrors.form}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-1">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Contoh: Pratama Wicaksana"
                        className="w-full px-3.5 py-2.5 text-xs rounded border border-zinc-300 focus:border-zinc-950 focus:outline-none"
                      />
                      {formErrors.name && <p className="text-[11px] text-red-600 mt-0.5">{formErrors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-1">
                        Email Perusahaan / Kantor *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="pratama@perusahaan.co.id"
                        className="w-full px-3.5 py-2.5 text-xs rounded border border-zinc-300 focus:border-zinc-950 focus:outline-none"
                      />
                      {formErrors.email && <p className="text-[11px] text-red-600 mt-0.5">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-1">
                        Nama Lembaga / Perusahaan *
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="PT Logistik Cemerlang Nusantara"
                        className="w-full px-3.5 py-2.5 text-xs rounded border border-zinc-300 focus:border-zinc-950 focus:outline-none"
                      />
                      {formErrors.company && <p className="text-[11px] text-red-600 mt-0.5">{formErrors.company}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-1">
                        Kategori Subjek Solusi
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded border border-zinc-300 focus:border-zinc-950 focus:outline-none bg-white"
                      >
                        <option value="Smart Monitoring">Smart Monitoring</option>
                        <option value="Industrial IoT (IIoT)">Industrial IoT (IIoT)</option>
                        <option value="Asset Tracking">Asset Tracking</option>
                        <option value="Smart Automation">Smart Automation</option>
                        <option value="IoT Dashboard Integration">IoT Dashboard Integration</option>
                        <option value="Connected Devices / Hardware Kustom">Connected Devices / Hardware Kustom</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-1">
                      Deskripsi Kebutuhan & Parameter Sistem *
                    </label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Jelaskan kebutuhan sensor, target waktu deployment, atau kendala operasional yang ingin diselesaikan..."
                      className="w-full px-3.5 py-2.5 text-xs rounded border border-zinc-300 focus:border-zinc-950 focus:outline-none"
                    />
                    {formErrors.message && <p className="text-[11px] text-red-600 mt-0.5">{formErrors.message}</p>}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500">
                      * Divalidasi dan disimpan ke backend REST API.
                    </span>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-zinc-950 rounded hover:bg-zinc-800 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <span>Kirim ke Database</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
