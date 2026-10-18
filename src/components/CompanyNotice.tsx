import React, { useState } from 'react';
import { AlertCircle, Check, Copy } from 'lucide-react';

export const CompanyNotice: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const checklistItems = [
    'Detail spesifikasi definitif bidang Layanan Operasional & Teknologi (LOT)',
    'Alamat kantor pusat fisik, nomor telepon resmi, dan email domain perusahaan (@innodesk.co.id)',
    'Portofolio klien nyata dan surat izin usaha / registrasi legalitas',
    'Daftar sertifikasi korporat (ISO / K3 / Regulasi Industri terkait)',
  ];

  const handleCopyChecklist = () => {
    navigator.clipboard.writeText(
      checklistItems.map((item, idx) => `${idx + 1}. ${item}`).join('\n')
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-12 bg-zinc-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-zinc-300 bg-white p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded bg-zinc-100 text-zinc-900 shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-950">
                  Transparansi Status Data Resmi PT Innodesk
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-3xl">
                  Website ini dikembangkan dengan arsitektur frontend profesional berbasis standar korporat. Sesuai instruksi pengembangan, kami menghindari fabrikasi informasi bisnis fiktif. Komponen teks, metrik portofolio, dan kontak ditandai secara transparan sebagai placeholder yang siap digantikan data definitif manajemen PT Innodesk.
                </p>

                <div className="mt-4 pt-4 border-t border-zinc-100">
                  <div className="text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-2">
                    Daftar Kebutuhan Data Resmi untuk Peluncuran:
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-600">
                    {checklistItems.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="self-start md:self-center shrink-0">
              <button
                type="button"
                onClick={handleCopyChecklist}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded border border-zinc-300 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-zinc-900" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Checklist Data'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
