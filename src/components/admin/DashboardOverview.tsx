import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Film, 
  Video, 
  MessageSquare, 
  Users, 
  Plus, 
  Upload, 
  User, 
  ExternalLink,
  Edit, 
  ArrowRight,
  Clock
} from 'lucide-react';

interface DashboardOverviewProps {
  onOpenAddProjectModal: () => void;
  onEditProject: (project: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  onOpenAddProjectModal, 
  onEditProject 
}) => {
  const { 
    stats, 
    projects, 
    messages, 
    setActiveAdminTab, 
    navigate, 
    presentationVideo 
  } = useApp();

  const recentProjects = projects.slice(0, 4);
  const recentMessages = messages.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl bg-[#0a0f1e] border border-slate-800/90 shadow-lg shadow-black/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">PROJETS</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-syne">
              {projects.length}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Nombre total de projets
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a0f1e] border border-slate-800/90 shadow-lg shadow-black/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">VIDÉOS</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-syne">
              {projects.filter(p => p.status === 'Publié' && p.videoUrl).length + (presentationVideo.videoUrl ? 1 : 0)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Vidéos actives &amp; publiées
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a0f1e] border border-slate-800/90 shadow-lg shadow-black/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">MESSAGES</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-syne">
              {messages.length}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Nombre de demandes reçues
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a0f1e] border border-slate-800/90 shadow-lg shadow-black/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">VISITES</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-syne">
              {stats.visitorCount.toLocaleString('fr-FR')}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Nombre de visiteurs
            </p>
          </div>
        </div>
      </div>

      {/* ACTIONS RAPIDES */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-orange-500 flex items-center gap-2">
          <span className="w-3 h-0.5 bg-orange-500 inline-block" />
          ACTIONS RAPIDES
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={onOpenAddProjectModal}
            className="p-4 rounded-2xl bg-[#0c1224] border border-slate-800 hover:border-orange-500/50 hover:bg-[#101730] transition-all flex flex-col items-center justify-center gap-2 text-center group cursor-pointer shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200 group-hover:text-white">
              + AJOUTER UN PROJET
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('media')}
            className="p-4 rounded-2xl bg-[#0c1224] border border-slate-800 hover:border-orange-500/50 hover:bg-[#101730] transition-all flex flex-col items-center justify-center gap-2 text-center group cursor-pointer shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200 group-hover:text-white">
              🎥 VIDÉO SHOWREEL
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('messages')}
            className="p-4 rounded-2xl bg-[#0c1224] border border-slate-800 hover:border-orange-500/50 hover:bg-[#101730] transition-all flex flex-col items-center justify-center gap-2 text-center group cursor-pointer shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200 group-hover:text-white">
              ✉️ VOIR LES MESSAGES
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('profile')}
            className="p-4 rounded-2xl bg-[#0c1224] border border-slate-800 hover:border-orange-500/50 hover:bg-[#101730] transition-all flex flex-col items-center justify-center gap-2 text-center group cursor-pointer shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200 group-hover:text-white">
              👤 MODIFIER MON PROFIL
            </span>
          </button>
        </div>
      </div>

      {/* APERÇU DU PORTFOLIO CARD */}
      <div className="rounded-2xl bg-[#0a0f1e] border border-slate-800/90 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-14 rounded-xl overflow-hidden bg-black border border-slate-700/80 shrink-0">
              <img
                src={presentationVideo.posterUrl}
                alt="Aperçu site"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-0.5">
                MON PORTFOLIO
              </div>
              <h3 className="text-base font-bold text-white">
                Site Web Public en ligne
              </h3>
              <p className="text-xs text-slate-400">
                Toutes les modifications apportées ici sont immédiatement persistées dans la base de données.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-all shadow-md shadow-orange-500/20 active:scale-95 cursor-pointer shrink-0"
          >
            <span>VOIR LE PORTFOLIO</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TWO COLUMNS: PROJETS RÉCENTS & MESSAGES RÉCENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* PROJETS RÉCENTS */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-orange-500 flex items-center gap-2">
              <span className="w-3 h-0.5 bg-orange-500 inline-block" />
              PROJETS ({projects.length})
            </h2>
            <button
              onClick={() => setActiveAdminTab('projects')}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Gérer les projets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentProjects.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#0a0f1e] border border-slate-800 text-center text-xs text-slate-400 space-y-2">
                <p>Aucun projet dans la base de données.</p>
                <button
                  onClick={onOpenAddProjectModal}
                  className="text-xs text-orange-400 hover:underline font-semibold"
                >
                  + Ajouter votre premier projet
                </button>
              </div>
            ) : (
              recentProjects.map((project) => {
                const isPublished = project.status === 'Publié';
                const isDraft = project.status === 'Brouillon';

                return (
                  <div
                    key={project.id}
                    className="p-3.5 rounded-2xl bg-[#0a0f1e] border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-16 h-12 rounded-xl overflow-hidden bg-black border border-slate-700 shrink-0">
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                          {project.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span>{project.category}</span>
                          <span>•</span>
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.2 rounded-full ${
                              isPublished
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : isDraft
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-slate-700/30 text-slate-400'
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onEditProject(project)}
                      className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-orange-500 hover:text-white text-slate-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit className="w-3 h-3" />
                      <span>MODIFIER</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* MESSAGES RÉCENTS */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-orange-500 flex items-center gap-2">
              <span className="w-3 h-0.5 bg-orange-500 inline-block" />
              MESSAGES RÉCENTS
            </h2>
            <button
              onClick={() => setActiveAdminTab('messages')}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>VOIR TOUS LES MESSAGES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentMessages.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#0a0f1e] border border-slate-800 text-center text-xs text-slate-400">
                Aucun message reçu pour le moment.
              </div>
            ) : (
              recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setActiveAdminTab('messages')}
                  className={`p-4 rounded-2xl bg-[#0a0f1e] border transition-all cursor-pointer group ${
                    msg.unread ? 'border-orange-500/50 shadow-md shadow-orange-950/20' : 'border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                        {msg.name}
                      </span>
                      {msg.unread && (
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {msg.date}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-orange-400/90 mb-1">
                    {msg.projectType}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
