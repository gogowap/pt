import React from 'react';
import { ProjectItem } from '../types';
import { Check, Info } from 'lucide-react';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div
        className="bg-white rounded-lg border border-zinc-300 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <span>{project.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>Tahun {project.year}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 text-sm font-semibold p-1 rounded hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Tutup studi kasus"
          >
            ✕
          </button>
        </div>

        {/* Dummy Notice Tag */}
        <div className="mb-4 p-2.5 rounded bg-amber-50/70 border border-amber-200/80 flex items-start gap-2 text-xs text-amber-900">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
          <span>{project.isDummyNotice}</span>
        </div>

        {/* Title */}
        <h3 id="modal-project-title" className="text-xl sm:text-2xl font-bold text-zinc-950 mb-2">
          {project.title}
        </h3>
        <p className="text-xs text-zinc-500 mb-6">
          Kategori Klien: <span className="font-semibold text-zinc-800">{project.clientType}</span>
        </p>

        {/* Metric Highlight Box */}
        <div className="p-4 rounded-md border border-zinc-200 bg-zinc-50 flex items-center justify-between mb-6">
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-950 tabular-nums">
              {project.keyMetric}
            </div>
            <div className="text-xs text-zinc-600 mt-0.5">
              {project.keyMetricLabel}
            </div>
          </div>
          <div className="text-xs font-mono text-zinc-400 text-right uppercase">
            Hasil Terukur
          </div>
        </div>

        {/* Case Narrative */}
        <div className="mb-6 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
            Latar Belakang & Pendekatan Teknis:
          </h4>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            {project.detailedCase}
          </p>
        </div>

        {/* Scope and Deliverables */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 mb-3">
            Lingkup Intervensi Operasional:
          </h4>
          <ul className="space-y-2">
            {project.scopeList.map((scope, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-700">
                <Check className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                <span>{scope}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-900 bg-zinc-100 rounded-md hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Tutup Studi Kasus
          </button>
        </div>
      </div>
    </div>
  );
};
