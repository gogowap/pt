import React, { useState } from 'react';
import { ArrowRight, Server, FileText } from 'lucide-react';
import { PROJECTS_DATA } from '../data/companyData';
import { ProjectItem, ProjectCategory } from '../types';
import { ProjectModal } from './ProjectModal';

export const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const categories: { key: ProjectCategory; label: string }[] = [
    { key: 'all', label: 'Semua Proyek' },
    { key: 'infrastruktur', label: 'Infrastruktur LOT' },
    { key: 'sistem', label: 'Sistem Terpadu' },
    { key: 'alur_kerja', label: 'Optimasi Alur Kerja' },
  ];

  const filteredProjects = activeCategory === 'all'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter((p) => p.category === activeCategory);

  return (
    <section id="portofolio" className="py-20 md:py-28 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2">
              <span>Portofolio & Rekayasa</span>
              <span aria-hidden="true" className="text-zinc-300">·</span>
              <span>Studi Kasus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-950 tracking-tight leading-tight">
              Implementasi Solusi Terukur di Lapangan
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed">
              Koleksi simulasi proyek penataan infrastruktur dan pembenahan operasional. Data di bawah ini diformat sebagai kerangka demonstrasi siap pakai untuk data resmi PT Innodesk.
            </p>
          </div>

          {/* Interactive Category Filter Tabs (functional segmented buttons) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-100 rounded-lg border border-zinc-200 self-start md:self-end">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.key
                    ? 'bg-zinc-950 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Showcase Banner (Bento Style with System Hub Image) */}
        <div className="mb-12 rounded-lg border border-zinc-200 bg-zinc-50 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-2">
              <span>LINGKUNGAN PENGUJIAN</span>
              <span aria-hidden="true">·</span>
              <span>HUB SENTRAL</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 mb-3">
              Fasilitas Monitoring & Kontrol LOT Terpusat
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6">
              Infrastruktur fisik dan node server beroperasi di bawah protokol mitigasi redundan. Setiap stasiun terhubung ke konsol pemantauan berkecepatan tinggi.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
              <div>
                <span className="block text-zinc-900 font-bold text-sm">24/7</span>
                <span>Protokol Pengawasan</span>
              </div>
              <div className="h-6 w-px bg-zinc-200" />
              <div>
                <span className="block text-zinc-900 font-bold text-sm">N+1</span>
                <span>Toleransi Redundansi</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 h-64 sm:h-80 lg:h-full relative overflow-hidden bg-zinc-200">
            <img
              src="/src/assets/images/innodesk_system_hub_1791787869808.jpg"
              alt="Hub Infrastruktur Sistem PT Innodesk"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent" />
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="border border-zinc-200 rounded-lg p-6 sm:p-7 bg-white hover:border-zinc-400 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                {/* Meta */}
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-3">
                  <span>{project.categoryLabel}</span>
                  <span>{project.year}</span>
                </div>

                <h3 className="text-lg font-bold text-zinc-950 mb-2">
                  {project.title}
                </h3>
                <p className="text-xs text-zinc-500 mb-4">
                  {project.clientType}
                </p>

                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6">
                  {project.summary}
                </p>

                {/* KPI callout */}
                <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-md flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xl font-bold font-mono text-zinc-950 tabular-nums">
                      {project.keyMetric}
                    </span>
                    <span className="block text-[11px] text-zinc-500">
                      {project.keyMetricLabel}
                    </span>
                  </div>
                  <Server className="w-5 h-5 text-zinc-400 shrink-0" />
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-950 hover:text-zinc-600 transition-colors cursor-pointer py-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Lihat Studi Kasus</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Data Dummy
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
