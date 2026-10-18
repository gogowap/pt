import React, { useState, useEffect } from 'react';
import { ApiClient } from '../../lib/api';
import { Server, ArrowRight, X, Check, Info } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const url = activeCategory === 'all' ? '/api/projects' : `/api/projects?category=${encodeURIComponent(activeCategory)}`;
      const res = await ApiClient.get<any[]>(url);
      if (res.success && res.data) {
        setProjects(res.data);
      }
      setLoading(false);
    };
    fetchProjects();
  }, [activeCategory]);

  const categories = [
    { key: 'all', label: 'Semua Proyek' },
    { key: 'Smart Monitoring', label: 'Smart Monitoring' },
    { key: 'Industrial IoT', label: 'Industrial IoT' },
    { key: 'Asset Tracking', label: 'Asset Tracking' },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2">
              <span>Portofolio & Rekayasa</span>
              <span aria-hidden="true">·</span>
              <span>Studi Kasus Nyata</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight leading-tight">
              Penerapan Ekosistem IoT di Berbagai Sektor Industri.
            </h1>
            <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
              Daftar proyek di bawah ini diambil secara langsung dari basis data relasional sistem kami. Menggambarkan integrasi edge telemetry dan platform analisis PT Innodesk.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-100 rounded-md border border-zinc-200 self-start md:self-end">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
                  activeCategory === c.key
                    ? 'bg-zinc-950 text-white'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notice */}
        <div className="mb-8 p-3.5 rounded bg-zinc-50 border border-zinc-200 flex items-start gap-3 text-xs text-zinc-600">
          <Info className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-zinc-800">Transparansi Data Proyek: </span>
            Daftar ini disajikan secara dinamis dari tabel <code className="font-mono bg-zinc-200/70 px-1 py-0.5 rounded">projects</code> database. Administrator internal dapat menambah atau menyunting proyek melalui Dashboard.
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-zinc-500 font-mono">
            Mengambil data dari database...
          </div>
        ) : projects.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 text-sm">
            Tidak ada proyek pada kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="rounded-lg border border-zinc-200 overflow-hidden bg-white flex flex-col justify-between hover:border-zinc-400 hover:shadow-xs transition-all"
              >
                <div>
                  <div className="h-48 bg-zinc-100 relative overflow-hidden">
                    {proj.image_url ? (
                      <img
                        src={proj.image_url}
                        alt={proj.title}
                        className="w-full h-full object-cover grayscale contrast-115"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400 font-mono">
                        DOKUMENTASI FOTOGRAFI PROYEK
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-zinc-950/85 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded font-medium">
                      {proj.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="text-[11px] font-mono text-zinc-400 mb-2">
                      PROYEK #{proj.id} · ID-PROJ
                    </div>
                    <h2 className="text-base font-bold text-zinc-950 mb-3">{proj.title}</h2>
                    <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(proj)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-950 hover:text-zinc-600 transition-colors cursor-pointer py-1"
                  >
                    <span>Rincian Studi Kasus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Detail Proyek */}
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="bg-white rounded-lg border border-zinc-300 max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                  {selectedProject.category}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="text-zinc-400 hover:text-zinc-900 p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedProject.image_url && (
                <div className="h-52 rounded-md overflow-hidden bg-zinc-100 mb-5 border border-zinc-200">
                  <img
                    src={selectedProject.image_url}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover grayscale contrast-110"
                  />
                </div>
              )}

              <h3 className="text-xl font-bold text-zinc-950 mb-3">{selectedProject.title}</h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6">
                {selectedProject.description}
              </p>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded text-xs space-y-2 mb-6">
                <div className="font-semibold text-zinc-900 uppercase tracking-wider text-[11px]">
                  Parameter Arsitektur:
                </div>
                <div className="grid grid-cols-2 gap-2 text-zinc-600">
                  <div>Status Rilis: <span className="font-semibold text-zinc-900">Publik / Teruji</span></div>
                  <div>Integritas: <span className="font-semibold text-zinc-900">SLA 99.8%</span></div>
                  <div>Transmisi: <span className="font-semibold text-zinc-900">MQTT Encrypted</span></div>
                  <div>Basis Data: <span className="font-semibold text-zinc-900">Relational SQL</span></div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
