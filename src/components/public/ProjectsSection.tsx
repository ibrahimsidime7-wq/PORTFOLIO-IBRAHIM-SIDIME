import React from 'react';
import { useApp } from '../../context/AppContext';
import { Play, ArrowRight } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const { projects, setSelectedProject, setIsAllProjectsModalOpen } = useApp();

  // Show only published projects on public page
  const publishedProjects = projects.filter((p) => p.status === 'Publié').slice(0, 4);

  return (
    <section id="projets" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">
            <span className="w-4 h-0.5 bg-orange-500 inline-block" />
            <span>MES RÉALISATIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-syne tracking-tight">
            Quelques <span className="text-orange-500">projets</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
            Quelques réalisations pour vous donner un aperçu de mon univers.
          </p>
        </div>

        <button
          onClick={() => setIsAllProjectsModalOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-orange-400 transition-colors cursor-pointer group shrink-0"
        >
          <span>Voir toutes les réalisations</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* 4 Cards Grid matching the screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {publishedProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="group cursor-pointer flex flex-col"
          >
            {/* Thumbnail with 16:9 ratio and centered circular play button */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#090d1a] border border-slate-800 group-hover:border-orange-500/60 transition-all duration-300 shadow-lg shadow-black/40">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Dark subtle overlay */}
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />

              {/* Centered Play Button matching the screenshot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-black/60 border border-white/60 backdrop-blur-sm text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-115 group-hover:bg-orange-500 group-hover:border-orange-500">
                  <Play className="w-4 h-4 ml-0.5 fill-white" />
                </div>
              </div>

              {/* Category pill on top-left if needed */}
              <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-semibold text-slate-300 border border-white/10">
                {project.category}
              </div>
            </div>

            {/* Labels below thumbnail matching screenshot */}
            <div className="mt-3">
              <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {project.client} • {project.duration}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
