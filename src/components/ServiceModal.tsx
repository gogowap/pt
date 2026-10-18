import React from 'react';
import { Server, Layers, Workflow, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onConsultService: (serviceName: string) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose, onConsultService }) => {
  if (!service) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-service-title"
    >
      <div
        className="bg-white rounded-lg border border-zinc-300 max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-zinc-500">
              LAYANAN · {service.number}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 text-sm font-semibold p-1 rounded hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            ✕
          </button>
        </div>

        {/* Title & Description */}
        <h3 id="modal-service-title" className="text-xl sm:text-2xl font-bold text-zinc-950 mb-3">
          {service.title}
        </h3>
        <p className="text-sm text-zinc-600 leading-relaxed mb-6">
          {service.description}
        </p>

        {/* Scope */}
        <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-md text-xs text-zinc-700 font-mono mb-6">
          {service.operationalScope}
        </div>

        {/* Deliverables */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 mb-3">
            Cakupan Kerja & Output Implementasi:
          </h4>
          <ul className="space-y-2.5">
            {service.deliverables.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700">
                <Check className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => {
              onConsultService(service.title);
              onClose();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-zinc-950 rounded-md hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <span>Pilih Layanan Ini</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
