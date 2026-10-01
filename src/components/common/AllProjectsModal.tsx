import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';
import { 
  ArrowLeft, 
  X, 
  Play, 
  Search, 
  Film, 
  Calendar, 
  User, 
  Layers, 
  ArrowUpRight 
} from 'lucide-react';

export const AllProjectsModal: React.FC = () => {
  const { 
    isAllProjectsModalOpen, 
    setIsAllProjectsModalOpen, 
    projects, 
    setSelectedProject, 
    setIsContactModalOpen, 
    setContactModalType 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isAllProjectsModalOpen) return null;

  // Show only published projects on public view
  const publishedProjects = projects.filter((p) => p.status === 'Publié');

  const categories = [
    'Tous',
    'Publicité',
    'Montage vidéo',
    'Motion design',
    'Réseaux sociaux',
    'Documentaire',
    'Clip musical',
  ];

  const filteredProjects = publishedProjects.filter((p) => {
    const matchesCategory = activeCategory === 'Tous' || p.category === activeCategory;
    const matchesSearch = 
      !searchQuery.trim() || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsAllProjectsModalOpen(false)}
    >
      <div 
        className="relative w-full max-w-5xl bg-[#0a0f1f] border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with prominent Retour Button */}
        <div className="shrink-0 p-4 sm:p-6 border-b border-slate-800/80 bg-[#0a0f1f]/95 backdrop-blur-md flex items-center justify-between gap-3 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAllProjectsModalOpen(false)}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-orange-500 hover:text-white text-slate-200 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
              title="Retour au portfolio"
            >
              <ArrowLeft className="w-4 h-4 text-orange-400 group-hover:text-white" />
              <span>RETOUR</span>
            </button>

            <div>
              <div className="text-[10px] sm:text-xs font-bold text-orange-500 uppercase tracking-widest hidden xs:block">
                PORTFOLIO COMPLET
              </div>
              <h2 className="text-base sm:text-xl font-bold text-white font-syne">
                Toutes les réalisations
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsAllProjectsModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Bar: Search & Categories */}
        <div className="shrink-0 px-4 sm:px-6 py-3 border-b border-slate-800/60 bg-[#070b16] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  activeCategory === cat
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-60 shrink-0">
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Scrollable Projects Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 scroll-smooth overscroll-contain">
          
          {filteredProjects.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Film className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm">Aucune réalisation ne correspond à votre filtre.</p>
              <button
                onClick={() => {
                  setActiveCategory('Tous');
                  setSearchQuery('');
                }}
                className="text-xs text-orange-400 underline cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleOpenProject(project)}
                  className="rounded-2xl bg-[#070b16] border border-slate-800/80 hover:border-orange-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer shadow-lg shadow-black/30"
                >
                  <div>
                    {/* Thumbnail with overlay play */}
                    <div className="relative aspect-[16/10] w-full bg-black overflow-hidden">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-11 h-11 rounded-full bg-black/60 border border-white/60 backdrop-blur-sm text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-115 group-hover:bg-orange-500 group-hover:border-orange-500">
                          <Play className="w-4 h-4 ml-0.5 fill-white" />
                        </div>
                      </div>

                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-[10px] font-bold text-slate-200 border border-white/10">
                        {project.category}
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 text-[10px] text-slate-300">
                        {project.duration}
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="p-4 space-y-2">
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 truncate max-w-[120px]">
                          <User className="w-3 h-3 text-orange-400 shrink-0" />
                          <span className="truncate">{project.client}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-orange-400 shrink-0" />
                          <span>{project.date}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Card */}
                  <div className="p-3 bg-[#080d19] border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Layers className="w-3 h-3 text-orange-400" />
                      <span className="truncate max-w-[150px]">{project.softwares?.[0] || 'Vidéo HD'}</span>
                    </div>

                    <span className="text-xs font-semibold text-orange-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Visionner</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom spacing */}
          <div className="h-4" />
        </div>

        {/* Sticky/Fixed Footer Bar with Retour & Contact */}
        <div className="shrink-0 p-4 sm:p-6 border-t border-slate-800 bg-[#090d1b] flex flex-col sm:flex-row items-center justify-between gap-3 z-10 shadow-2xl">
          <button
            onClick={() => setIsAllProjectsModalOpen(false)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-orange-400" />
            <span>← RETOUR AU PORTFOLIO</span>
          </button>

          <button
            onClick={() => {
              setIsAllProjectsModalOpen(false);
              setContactModalType('quote');
              setIsContactModalOpen(true);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-95"
          >
            <span>DEMANDER UN DEVIS POUR VOTRE PROJET</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
