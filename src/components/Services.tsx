import React, { useState } from 'react';
import { Server, Layers, Workflow, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SERVICES_DATA } from '../data/companyData';
import { ServiceItem } from '../types';
import { ServiceModal } from './ServiceModal';

interface ServicesProps {
  onSelectServiceForContact: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectServiceForContact }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const getIcon = (name: ServiceItem['iconName']) => {
    switch (name) {
      case 'Server':
        return <Server className="w-5 h-5" />;
      case 'Layers':
        return <Layers className="w-5 h-5" />;
      case 'Workflow':
        return <Workflow className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      default:
        return <Server className="w-5 h-5" />;
    }
  };

  return (
    <section id="layanan" className="py-20 md:py-28 bg-[#FAFAFA] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2">
              <span>Kapabilitas & Solusi</span>
              <span aria-hidden="true" className="text-zinc-300">·</span>
              <span>Layanan LOT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-950 tracking-tight leading-tight">
              Kerangka Kerja Operasional & Solusi Terintegrasi
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed">
              Setiap layanan dirancang dengan metodologi audit presisi untuk meminimalkan friksi sistem kerja dan memastikan kesinambungan operasional organisasi.
            </p>
          </div>

          <div className="text-xs text-zinc-500 font-mono hidden md:block">
            04 PILAR UTAMA OPERASIONAL
          </div>
        </div>

        {/* Asymmetric Bento / Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SERVICES_DATA.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg border border-zinc-200 p-7 sm:p-8 flex flex-col justify-between hover:border-zinc-400 hover:shadow-xs transition-all group"
            >
              <div>
                {/* Number & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-md bg-zinc-950 text-white flex items-center justify-center">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="font-mono text-xs font-semibold text-zinc-400 group-hover:text-zinc-900 transition-colors">
                    LAYANAN · {service.number}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-zinc-950 mb-3 group-hover:text-zinc-900 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6">
                  {service.summary}
                </p>

                {/* Key Deliverables preview */}
                <div className="space-y-2 mb-6">
                  {service.deliverables.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedService(service)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-900 hover:text-zinc-600 transition-colors cursor-pointer py-1"
                >
                  <span>Spesifikasi Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-zinc-400">DETAIL & RUANG LINGKUP</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Dialog */}
      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onConsultService={(title) => {
          onSelectServiceForContact(title);
        }}
      />
    </section>
  );
};
