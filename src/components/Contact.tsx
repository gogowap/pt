import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Mail, Clock, Send, CheckCircle2, RotateCcw, Copy, Check, MapPin, Building2, Phone, AlertCircle } from 'lucide-react';
import { IOT_COMPANY_INFO } from '../data/iotData';

export interface ContactRef {
  selectSolution: (solutionTitle: string) => void;
}

export const Contact = forwardRef<ContactRef>((_, ref) => {
  const initialForm = {
    fullName: '',
    workEmail: '',
    companyName: '',
    solutionNeeded: 'Smart Monitoring',
    message: '',
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof initialForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<typeof initialForm | null>(null);
  const [copied, setCopied] = useState(false);

  useImperativeHandle(ref, () => ({
    selectSolution: (solutionTitle: string) => {
      setFormData((prev) => ({ ...prev, solutionNeeded: solutionTitle }));
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    },
  }));

  const validate = (): boolean => {
    const errs: Partial<Record<keyof typeof initialForm, string>> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Nama lengkap wajib diisi.';
    } else if (formData.fullName.trim().length < 3) {
      errs.fullName = 'Nama lengkap minimal 3 karakter.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.workEmail.trim()) {
      errs.workEmail = 'Email perusahaan wajib diisi.';
    } else if (!emailRegex.test(formData.workEmail.trim())) {
      errs.workEmail = 'Format email perusahaan tidak valid.';
    }

    if (!formData.companyName.trim()) {
      errs.companyName = 'Nama perusahaan atau lembaga wajib diisi.';
    }

    if (!formData.message.trim()) {
      errs.message = 'Pesan kebutuhan wajib diisi.';
    } else if (formData.message.trim().length < 15) {
      errs.message = 'Pesan kebutuhan minimal 15 karakter.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof initialForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Frontend-only simulation delay (No external backend or API called)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedData({ ...formData });
    }, 600);
  };

  const handleReset = () => {
    setFormData(initialForm);
    setErrors({});
    setSubmittedData(null);
  };

  const handleCopySummary = () => {
    if (!submittedData) return;
    const text = `[Permohonan Konsultasi PT Innodesk]\nNama: ${submittedData.fullName}\nEmail: ${submittedData.workEmail}\nPerusahaan: ${submittedData.companyName}\nKebutuhan Solusi: ${submittedData.solutionNeeded}\nPesan:\n${submittedData.message}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#737373] mb-2">
            <span>Konsultasi & Komunikasi</span>
            <span aria-hidden="true" className="text-[#E5E5E5]">·</span>
            <span>Contact Section</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] tracking-tight leading-tight">
            Diskusikan Kebutuhan IoT Perusahaan Anda.
          </h2>
          <p className="mt-3 text-sm text-[#737373] leading-relaxed">
            Sampaikan parameter operasional atau skenario pemantauan yang Anda butuhkan. Tim kami siap membantu memetakan topologi sensor dan opsi integrasi data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Office Information (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-lg border border-[#E5E5E5] bg-[#F7F7F7] p-6 space-y-5">
              <h3 className="text-base font-bold text-[#111111] pb-3 border-b border-[#E5E5E5] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#111111]" />
                <span>Informasi Kantor PT Innodesk</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#737373] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#111111] block">Alamat Perusahaan</span>
                    <span className="text-[#737373] leading-relaxed">
                      {IOT_COMPANY_INFO.contactPlaceholder.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#737373] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#111111] block">Email Resmi</span>
                    <span className="text-[#737373] font-mono">
                      {IOT_COMPANY_INFO.contactPlaceholder.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#737373] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#111111] block">Saluran Telepon</span>
                    <span className="text-[#737373] font-mono">
                      {IOT_COMPANY_INFO.contactPlaceholder.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#737373] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#111111] block">Jam Kerja Operasional</span>
                    <span className="text-[#737373]">{IOT_COMPANY_INFO.contactPlaceholder.hours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transparency Note */}
            <div className="p-4 rounded-md border border-[#E5E5E5] bg-white text-xs text-[#737373] leading-relaxed">
              <div className="font-semibold text-[#111111] mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#111111]" />
                <span>Pemberitahuan Teknis Formulir:</span>
              </div>
              Website ini beroperasi sepenuhnya pada arsitektur frontend tanpa database atau layanan backend. Setelah submit, data divalidasi langsung di browser dan menampilkan konfirmasi simulasi tanpa pengiriman permanen ke server luar.
            </div>
          </div>

          {/* Right Column: Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-lg border border-[#E5E5E5] bg-white p-6 sm:p-8 shadow-xs">
              {!submittedData ? (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Contoh: Budi Santoso"
                        className={`w-full px-3.5 py-2.5 text-xs rounded border bg-white text-[#111111] placeholder:text-[#737373] focus:outline-none transition-colors ${
                          errors.fullName
                            ? 'border-red-500 focus:border-red-600'
                            : 'border-[#E5E5E5] focus:border-[#111111]'
                        }`}
                      />
                      {errors.fullName && <p className="mt-1 text-[11px] text-red-600">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                        Email Perusahaan *
                      </label>
                      <input
                        type="email"
                        name="workEmail"
                        value={formData.workEmail}
                        onChange={handleChange}
                        placeholder="nama@perusahaan.co.id"
                        className={`w-full px-3.5 py-2.5 text-xs rounded border bg-white text-[#111111] placeholder:text-[#737373] focus:outline-none transition-colors ${
                          errors.workEmail
                            ? 'border-red-500 focus:border-red-600'
                            : 'border-[#E5E5E5] focus:border-[#111111]'
                        }`}
                      />
                      {errors.workEmail && <p className="mt-1 text-[11px] text-red-600">{errors.workEmail}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                        Nama Perusahaan *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="PT Mitra Industri Cemerlang"
                        className={`w-full px-3.5 py-2.5 text-xs rounded border bg-white text-[#111111] placeholder:text-[#737373] focus:outline-none transition-colors ${
                          errors.companyName
                            ? 'border-red-500 focus:border-red-600'
                            : 'border-[#E5E5E5] focus:border-[#111111]'
                        }`}
                      />
                      {errors.companyName && <p className="mt-1 text-[11px] text-red-600">{errors.companyName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                        Kebutuhan Solusi
                      </label>
                      <select
                        name="solutionNeeded"
                        value={formData.solutionNeeded}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-xs rounded border border-[#E5E5E5] bg-white text-[#111111] focus:border-[#111111] focus:outline-none"
                      >
                        <option value="Smart Monitoring">Smart Monitoring</option>
                        <option value="Industrial IoT">Industrial IoT</option>
                        <option value="Asset Tracking">Asset Tracking</option>
                        <option value="Smart Automation">Smart Automation</option>
                        <option value="IoT Dashboard">IoT Dashboard</option>
                        <option value="Connected Systems">Connected Systems</option>
                        <option value="Konsultasi Kustom">Konsultasi Kustom</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Pesan atau Kebutuhan Teknis *
                    </label>
                    <textarea
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Jelaskan kebutuhan sensor, target waktu implementasi, atau lingkungan operasional yang hendak dipantau..."
                      className={`w-full px-3.5 py-2.5 text-xs rounded border bg-white text-[#111111] placeholder:text-[#737373] focus:outline-none transition-colors ${
                        errors.message
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-[#E5E5E5] focus:border-[#111111]'
                      }`}
                    />
                    {errors.message && <p className="mt-1 text-[11px] text-red-600">{errors.message}</p>}
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[11px] text-[#737373]">
                      * Divalidasi di sisi klien melalui React state.
                    </p>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-4 py-2 text-xs font-semibold text-[#737373] hover:text-[#111111] border border-[#E5E5E5] rounded hover:bg-[#F7F7F7] cursor-pointer"
                      >
                        Reset
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] rounded hover:bg-[#242424] disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Memvalidasi...</span>
                          </>
                        ) : (
                          <>
                            <span>Kirim Permohonan</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                /* Submission Confirmation State */
                <div className="py-4 space-y-5 animate-in fade-in duration-200">
                  <div className="p-4 rounded bg-[#F7F7F7] border border-[#E5E5E5] flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#111111] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-[#111111]">
                        Validasi Formulir Berhasil Disimulasikan!
                      </h4>
                      <p className="text-xs text-[#737373] mt-1 leading-relaxed">
                        Data formulir Anda telah memenuhi seluruh aturan validasi frontend. Karena website ini murni frontend tanpa database, pengiriman nyata memerlukan integrasi ke backend server atau layanan email formulir.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded border border-[#E5E5E5] bg-white text-xs space-y-2">
                    <div className="font-mono text-[10px] uppercase text-[#737373] border-b border-[#E5E5E5] pb-1 mb-2">
                      Ringkasan Data yang Dimasukkan:
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-[#737373]">Nama:</span>
                      <span className="col-span-2 font-semibold text-[#111111]">{submittedData.fullName}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-[#737373]">Email:</span>
                      <span className="col-span-2 font-mono text-[#111111]">{submittedData.workEmail}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-[#737373]">Perusahaan:</span>
                      <span className="col-span-2 text-[#111111]">{submittedData.companyName}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-[#737373]">Kebutuhan:</span>
                      <span className="col-span-2 text-[#111111] font-semibold">{submittedData.solutionNeeded}</span>
                    </div>
                    <div className="pt-2 border-t border-[#E5E5E5]">
                      <span className="text-[#737373] block mb-1">Rincian Pesan:</span>
                      <p className="p-2.5 rounded bg-[#F7F7F7] border border-[#E5E5E5] text-[#242424] italic">
                        "{submittedData.message}"
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#242424] bg-[#F7F7F7] hover:bg-[#E5E5E5] border border-[#E5E5E5] rounded transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-[#111111]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Teks Tersalin!' : 'Salin Ringkasan Form'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#242424] rounded cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Input Permohonan Baru</span>
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
