import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';
import { 
  Plus, 
  Film, 
  Trash2, 
  Edit, 
  Upload, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Sparkles,
  Calendar,
  User,
  Layers,
  Clock,
  Play
} from 'lucide-react';

interface ProjectsManagerProps {
  editingProject: Project | null;
  setEditingProject: (p: Project | null) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({
  editingProject,
  setEditingProject,
  isCreateModalOpen,
  setIsCreateModalOpen,
}) => {
  const { 
    projects, 
    addProject, 
    updateProject, 
    deleteProject, 
    togglePublishProject,
    showToast 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'Tous' | 'Publié' | 'Brouillon' | 'Privé'>('Tous');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Project['category']>('Montage vidéo');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('30s');
  const [thumbnail, setThumbnail] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [selectedSoftwares, setSelectedSoftwares] = useState<string[]>(['Premiere Pro']);
  const [status, setStatus] = useState<Project['status']>('Publié');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const softwareOptions = [
    'Premiere Pro',
    'DaVinci Resolve',
    'After Effects',
    'Photoshop',
    'CapCut Pro',
    'Blender',
    'Audition',
    'Illustrator',
  ];

  const categories: Project['category'][] = [
    'Publicité',
    'Montage vidéo',
    'Motion design',
    'Réseaux sociaux',
    'Documentaire',
    'Clip musical',
  ];

  const openCreateModal = () => {
    setTitle('');
    setCategory('Montage vidéo');
    setDescription('');
    setClient('');
    setDate(new Date().toISOString().split('T')[0]);
    setDuration('30s');
    setThumbnail(projects[0]?.thumbnail || '');
    setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    setSelectedSoftwares(['Premiere Pro', 'After Effects']);
    setStatus('Publié');
    setEditingProject(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setTitle(p.title);
    setCategory(p.category);
    setDescription(p.description);
    setClient(p.client);
    setDate(p.date);
    setDuration(p.duration);
    setThumbnail(p.thumbnail);
    setVideoUrl(p.videoUrl || '');
    setSelectedSoftwares(p.softwares || []);
    setStatus(p.status);
    setIsCreateModalOpen(true);
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setThumbnail(uploadEvent.target.result as string);
          showToast('Miniature importée avec succès !', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      showToast(`Fichier vidéo "${file.name}" importé !`, 'success');
    }
  };

  const toggleSoftware = (sw: string) => {
    if (selectedSoftwares.includes(sw)) {
      setSelectedSoftwares(selectedSoftwares.filter((s) => s !== sw));
    } else {
      setSelectedSoftwares([...selectedSoftwares, sw]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Veuillez remplir le titre et la description.', 'error');
      return;
    }

    const payload = {
      title: title.trim(),
      category,
      description: description.trim(),
      client: client.trim() || 'Client Privé',
      date,
      duration: duration.trim() || '30s',
      thumbnail: thumbnail || projects[0]?.thumbnail || '',
      videoUrl: videoUrl || undefined,
      softwares: selectedSoftwares,
      status,
    };

    if (editingProject) {
      updateProject(editingProject.id, payload);
    } else {
      addProject(payload);
    }

    setIsCreateModalOpen(false);
    setEditingProject(null);
  };

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'Tous') return true;
    return p.status === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header and Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-syne">
            Gestion des Projets
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ajoutez, modifiez ou publiez vos réalisations sur le portfolio.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-orange-500/25 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ AJOUTER UN PROJET</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {(['Tous', 'Publié', 'Brouillon', 'Privé'] as const).map((filter) => {
          const count = filter === 'Tous' ? projects.length : projects.filter((p) => p.status === filter).length;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                activeFilter === filter
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {filter} ({count})
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => {
          const isPub = project.status === 'Publié';
          return (
            <div
              key={project.id}
              className="rounded-2xl bg-[#0a0f1e] border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden group shadow-lg shadow-black/30"
            >
              <div>
                {/* Thumbnail Header */}
                <div className="relative aspect-video w-full bg-black overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-md text-white border border-white/10">
                    {project.category}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md ${
                        project.status === 'Publié'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : project.status === 'Brouillon'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-slate-700/40 text-slate-300 border-slate-600'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-slate-300">
                    {project.duration}
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-2">
                  <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-orange-400" />
                      {project.client}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-orange-400" />
                      {project.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-[#080d19] border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => openEditModal(project)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>MODIFIER</span>
                </button>

                <button
                  onClick={() => togglePublishProject(project.id)}
                  title={isPub ? 'Dépublier' : 'Publier'}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isPub
                      ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {isPub ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>DÉPUBLIER</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>PUBLIER</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`Supprimer le projet "${project.title}" ?`)) {
                      deleteProject(project.id);
                    }
                  }}
                  title="Supprimer le projet"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add or Edit Project */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div 
            className="bg-[#0b101f] border border-slate-800 rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92dvh] overflow-y-auto p-4 sm:p-6 md:p-8 text-slate-100 shadow-2xl space-y-6 overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white font-syne">
                  {editingProject ? 'Modifier le projet' : 'Ajouter un nouveau projet'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Remplissez les détails du projet pour l'afficher sur votre portfolio.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Titre & Catégorie */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Titre du projet *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Publicité Commerciale Horizon"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Catégorie *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Client, Date & Durée */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Client / Marque
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Marque Horizon"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Date de réalisation
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Durée
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 30s ou 1:45"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Description du projet *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Décrivez le rôle, les défis, le montage et le sound design..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              {/* File Uploads: Miniature & Vidéo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Miniature Upload */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Miniature (Image)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4 text-orange-400" />
                      <span>Choisir une image</span>
                    </button>
                    {thumbnail && (
                      <div className="w-12 h-10 rounded-lg overflow-hidden border border-orange-500/60 shrink-0">
                        <img src={thumbnail} alt="Aperçu" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Vidéo Upload */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Fichier Vidéo (MP4, WEBM, MOV)
                  </label>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Film className="w-4 h-4 text-orange-400" />
                      <span>{videoUrl ? 'Remplacer la vidéo' : 'Importer vidéo'}</span>
                    </button>
                    {videoUrl && (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                        Prête
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Logiciels utilisés */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Logiciels utilisés
                </label>
                <div className="flex flex-wrap gap-2">
                  {softwareOptions.map((sw) => {
                    const isSelected = selectedSoftwares.includes(sw);
                    return (
                      <button
                        type="button"
                        key={sw}
                        onClick={() => toggleSoftware(sw)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {sw}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Statut */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Statut de publication
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Publié', 'Brouillon', 'Privé'] as const).map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setStatus(st)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        status === st
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                          : 'bg-slate-800/70 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
                >
                  {editingProject ? 'Enregistrer les modifications' : '+ Créer le projet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
