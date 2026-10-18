import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Mail, Clock, Send, CheckCircle2, RotateCcw, Copy, Check, MapPin, Building2, Phone } from 'lucide-react';
import { COMPANY_PROFILE } from '../data/companyData';
import { ContactFormData } from '../types';

export interface ContactRef {
  selectService: (serviceName: string) => void;
}

export const Contact = forwardRef<ContactRef>((_, ref) => {
  const initialFormData: ContactFormData = {
    fullName: '',
    workEmail: '',
    organization: '',
    serviceCategory: 'Manajemen Infrastruktur LOT',
    message: '',
    urgency: 'standar',
  };

  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<ContactFormData | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  useImperativeHandle(ref, () => ({
    selectService: (serviceName: string) => {
      setFormData((prev) => ({ ...prev, serviceCategory: serviceName }));
      const contactSection = document.getElementById('kontak');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    },
  }));

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi.';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Nama lengkap minimal 3 karakter.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.workEmail.trim()) {
      newErrors.workEmail = 'Email kantor wajib diisi.';
    } else if (!emailRegex.test(formData.workEmail.trim())) {
      newErrors.workEmail = 'Format email tidak valid (contoh: nama@perusahaan.co.id).';
    }

    if (!formData.organization.trim()) {
      newErrors.organization = 'Nama perusahaan atau instansi wajib diisi.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Deskripsi pesan atau kebutuhan wajib diisi.';
    } else if (formData.message.trim().length < 15) {
      newErrors.message = 'Deskripsi pesan minimal 15 karakter agar tim dapat menelaah.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate frontend validation & processing without backend/database
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedData({ ...formData });
    }, 700);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setSubmittedData(null);
  };

  const handleCopySummary = () => {
    if (!submittedData) return;
    const summaryText = `[Formulir Konsultasi PT Innodesk]\nNama: ${submittedData.fullName}\nEmail: ${submittedData.workEmail}\nOrganisasi: ${submittedData.organization}\nLayanan: ${submittedData.serviceCategory}\nPrioritas: ${submittedData.urgency}\nKebutuhan:\n${submittedData.message}`;
    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <section id="kontak" className="py-20 md:py-28 bg-[#FAFAFA] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2">
            <span>Komunikasi & Penjajakan</span>
            <span aria-hidden="true" className="text-zinc-300">·</span>
            <span>Konsultasi Operasional</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-950 tracking-tight leading-tight">
            Konsultasikan Kebutuhan Infrastruktur & Alur Kerja Anda
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed">
            Sampaikan parameter operasional organisasi Anda. Tim teknis kami siap memetakan opsi standardisasi dan optimasi sistem.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Kolom Informasi Kantor & Status Placeholder (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sm:p-7 shadow-xs">
              <h3 className="text-base font-bold text-zinc-950 mb-4 pb-3 border-b border-zinc-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-zinc-700" />
                <span>Saluran Resmi Representatif</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900 block">Alamat Kantor</span>
                    <span className="text-zinc-600 leading-relaxed">{COMPANY_PROFILE.contactPlaceholder.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900 block">Email Perusahaan</span>
                    <span className="text-zinc-600 font-mono">{COMPANY_PROFILE.contactPlaceholder.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900 block">Saluran Suara</span>
                    <span className="text-zinc-600 font-mono">{COMPANY_PROFILE.contactPlaceholder.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900 block">Jam Operasional</span>
                    <span className="text-zinc-600">{COMPANY_PROFILE.contactPlaceholder.hours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Catatan Transparansi Klien */}
            <div className="p-4 rounded-md border border-zinc-200 bg-zinc-100/70 text-xs text-zinc-600 leading-relaxed">
              <div className="font-semibold text-zinc-800 mb-1">Pemberitahuan Teknis Frontend:</div>
              Formulir di samping menggunakan validasi frontend murni tanpa database atau API eksternal. Setelah menekan tombol kirim, Anda akan melihat verifikasi simulasi instan dengan rincian data yang diinput.
            </div>
          </div>

          {/* Kolom Formulir Interaktif / Hasil Simulasi (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sm:p-8 shadow-xs">
              {!submittedData ? (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Nama Lengkap */}
                    <div>
                      <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-1.5">
                        Nama Lengkap <span className="text-zinc-900">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Contoh: Rian Hendrawan"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-md border bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition-colors ${
                          errors.fullName
                            ? 'border-red-500 focus:border-red-600'
                            : 'border-zinc-300 focus:border-zinc-950'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Email Kantor */}
                    <div>
                      <label htmlFor="workEmail" className="block text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-1.5">
                        Email Kantor / Bisnis <span className="text-zinc-900">*</span>
                      </label>
                      <input
                        id="workEmail"
                        type="email"
                        name="workEmail"
                        value={formData.workEmail}
                        onChange={handleChange}
                        placeholder="nama@perusahaan.co.id"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-md border bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition-colors ${
                          errors.workEmail
                            ? 'border-red-500 focus:border-red-600'
                            : 'border-zinc-300 focus:border-zinc-950'
                        }`}
                      />
                      {errors.workEmail && (
                        <p className="mt-1 text-xs text-red-600">{errors.workEmail}</p>
                      )}
                    </div>
                  </div>

                  {/* Organisasi / Perusahaan */}
                  <div>
                    <label htmlFor="organization" className="block text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-1.5">
                      Perusahaan / Lembaga <span className="text-zinc-900">*</span>
                    </label>
                    <input
                      id="organization"
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="Contoh: PT Mitra Dinamika Sejahtera"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-md border bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition-colors ${
                        errors.organization
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-zinc-300 focus:border-zinc-950'
                      }`}
                    />
                    {errors.organization && (
                      <p className="mt-1 text-xs text-red-600">{errors.organization}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Kategori Layanan */}
                    <div>
                      <label htmlFor="serviceCategory" className="block text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-1.5">
                        Subjek / Kategori Layanan
                      </label>
                      <select
                        id="serviceCategory"
                        name="serviceCategory"
                        value={formData.serviceCategory}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-sm rounded-md border border-zinc-300 bg-white text-zinc-900 focus:border-zinc-950 focus:outline-none transition-colors"
                      >
                        <option value="Manajemen Infrastruktur LOT">Manajemen Infrastruktur LOT</option>
                        <option value="Integrasi Sistem & Monitoring Sentral">Integrasi Sistem & Monitoring Sentral</option>
                        <option value="Optimasi Alur Kerja & Otomasi Proses">Optimasi Alur Kerja & Otomasi Proses</option>
                        <option value="Kepatuhan & Keamanan Operasional">Kepatuhan & Keamanan Operasional</option>
                        <option value="Konsultasi Umum Kemitraan">Konsultasi Umum Kemitraan</option>
                      </select>
                    </div>

                    {/* Tingkat Urgensi */}
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-1.5">
                        Tingkat Prioritas
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <label
                          className={`flex items-center justify-center p-2.5 text-xs font-semibold rounded-md border cursor-pointer transition-colors ${
                            formData.urgency === 'standar'
                              ? 'bg-zinc-900 text-white border-zinc-900'
                              : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="urgency"
                            value="standar"
                            checked={formData.urgency === 'standar'}
                            onChange={() => setFormData((p) => ({ ...p, urgency: 'standar' }))}
                            className="sr-only"
                          />
                          <span>Standar (1-2 Hari)</span>
                        </label>

                        <label
                          className={`flex items-center justify-center p-2.5 text-xs font-semibold rounded-md border cursor-pointer transition-colors ${
                            formData.urgency === 'prioritas'
                              ? 'bg-zinc-900 text-white border-zinc-900'
                              : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="urgency"
                            value="prioritas"
                            checked={formData.urgency === 'prioritas'}
                            onChange={() => setFormData((p) => ({ ...p, urgency: 'prioritas' }))}
                            className="sr-only"
                          />
                          <span>Prioritas Operasional</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Pesan Kebutuhan */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-1.5">
                      Rincian Kebutuhan atau Masalah Operasional <span className="text-zinc-900">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Jelaskan tantangan infrastruktur, jumlah node kerja, atau alur proses yang memerlukan penataan..."
                      className={`w-full px-3.5 py-2.5 text-sm rounded-md border bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition-colors ${
                        errors.message
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-zinc-300 focus:border-zinc-950'
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                    )}
                  </div>

                  {/* Tombol Aksi */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[11px] text-zinc-500">
                      * Seluruh data hanya divalidasi pada sesi browser saat ini.
                    </p>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="w-1/3 sm:w-auto px-4 py-2.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 border border-zinc-200 rounded-md hover:bg-zinc-50 transition-colors cursor-pointer"
                      >
                        Reset
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-2/3 sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold tracking-wider uppercase text-white bg-zinc-950 rounded-md hover:bg-zinc-800 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Memvalidasi...</span>
                          </>
                        ) : (
                          <>
                            <span>Kirim Permintaan Konsultasi</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                /* Success State with Honest Frontend Simulation Notice */
                <div className="py-2 animate-in fade-in duration-200">
                  <div className="flex items-start gap-3.5 p-4 rounded-md bg-zinc-50 border border-zinc-200 mb-6">
                    <CheckCircle2 className="w-5 h-5 text-zinc-900 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-zinc-950">
                        Validasi Frontend Berhasil Disimulasikan!
                      </h4>
                      <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                        Data formulir telah terverifikasi secara valid di sisi klien. Karena website ini tidak menggunakan backend/database, formulir tidak disimpan permanen di server luar.
                      </p>
                    </div>
                  </div>

                  <div className="border border-zinc-200 rounded-md p-4 bg-white mb-6 space-y-2 text-xs">
                    <div className="text-[11px] font-mono text-zinc-400 uppercase border-b border-zinc-100 pb-1 mb-2">
                      Ringkasan Parameter yang Dimasukkan:
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-zinc-500">Nama:</span>
                      <span className="col-span-2 font-semibold text-zinc-900">{submittedData.fullName}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-zinc-500">Email:</span>
                      <span className="col-span-2 font-mono text-zinc-900">{submittedData.workEmail}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-zinc-500">Organisasi:</span>
                      <span className="col-span-2 text-zinc-900">{submittedData.organization}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-zinc-500">Kategori:</span>
                      <span className="col-span-2 text-zinc-900">{submittedData.serviceCategory}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-zinc-500">Prioritas:</span>
                      <span className="col-span-2 uppercase font-mono font-semibold text-zinc-800">{submittedData.urgency}</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-100">
                      <span className="text-zinc-500 block mb-1">Rincian Kebutuhan:</span>
                      <p className="text-zinc-700 bg-zinc-50 p-2.5 rounded border border-zinc-100 italic leading-relaxed">
                        "{submittedData.message}"
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 rounded-md transition-colors cursor-pointer"
                    >
                      {copiedSummary ? <Check className="w-3.5 h-3.5 text-zinc-950" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSummary ? 'Teks Tersalin!' : 'Salin Ringkasan Form'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-zinc-950 hover:bg-zinc-800 rounded-md transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Input Permintaan Baru</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Contact.displayName = 'Contact';
