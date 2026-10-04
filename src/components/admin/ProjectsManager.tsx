import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Upload, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Calendar, 
  User, 
  Layers, 
  Film,
  Play,
  Pause,
  AlertTriangle,
  FileVideo,
  ExternalLink,
  CheckCircle2
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
    uploadDirectVideo,
    uploadMedia,
    showToast 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'Tous' | 'Publié' | 'Brouillon' | 'Privé'>('Tous');

  // Delete Confirmation Modal State
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [videoProjectToRemove, setVideoProjectToRemove] = useState<Project | null>(null);
  const [isRemovingVideo, setIsRemovingVideo] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Project['category']>('Montage vidéo');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('30s');
  const [thumbnail, setThumbnail] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoFileName, setVideoFileName] = useState<string>('');
  const [videoFileSize, setVideoFileSize] = useState<string>('');
  const [selectedSoftwares, setSelectedSoftwares] = useState<string[]>(['Premiere Pro']);
  const [status, setStatus] = useState<Project['status']>('Publié');
  const [isSaving, setIsSaving] = useState(false);

  // Live Video Upload State for Modal
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoUploadPercent, setVideoUploadPercent] = useState(0);
  const [videoUploadLoadedMb, setVideoUploadLoadedMb] = useState('0');
  const [videoUploadTotalMb, setVideoUploadTotalMb] = useState('0');
  const [videoUploadSpeed, setVideoUploadSpeed] = useState('');

  // Quick Inline Video Upload (for a project card directly)
  const [targetProjectForQuickVideo, setTargetProjectForQuickVideo] = useState<Project | null>(null);

  // Preview video state inside form
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [isModalVideoPlaying, setIsModalVideoPlaying] = useState(false);

  // Input refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const quickVideoInputRef = useRef<HTMLInputElement>(null);

  const softwareOptions = [
    'Premiere Pro',
    'DaVinci Resolve',
    'After Effects',
    'Photoshop',
    'CapCut Pro',
    'Blender',
    'Audition',
    'Illustrator',
    'Soundly',
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
    setThumbnail(projects[0]?.thumbnail || '/uploads/thumb_publicite.jpg');
    setVideoUrl('');
    setVideoFileName('');
    setVideoFileSize('');
    setSelectedSoftwares(['Premiere Pro', 'DaVinci Resolve']);
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
    setVideoFileName(p.videoFileName || (p.videoUrl ? p.videoUrl.split('/').pop() || 'video.mp4' : ''));
    setVideoFileSize(p.videoFileSize || '');
    setSelectedSoftwares(p.softwares || []);
    setStatus(p.status);
    setIsCreateModalOpen(true);
  };

  // Thumbnail upload
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const dataUri = uploadEvent.target.result as string;
          try {
            showToast('Téléversement de la miniature...', 'info');
            const url = await uploadMedia(dataUri, `thumb_${Date.now()}`);
            setThumbnail(url);
            showToast('Miniature importée et enregistrée !', 'success');
          } catch {
            setThumbnail(dataUri);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Direct video upload into modal (Persistent stream to /api/upload-video)
  const handleDirectVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setIsVideoUploading(true);
    setVideoUploadPercent(0);
    const start = Date.now();
    const totalMb = (file.size / (1024 * 1024)).toFixed(1);
    setVideoUploadTotalMb(totalMb);
    setVideoUploadLoadedMb('0');

    try {
      const res = await uploadDirectVideo(file, (percent, loaded, total) => {
        setVideoUploadPercent(percent);
        const lMb = (loaded / (1024 * 1024)).toFixed(1);
        setVideoUploadLoadedMb(lMb);
        const elapsed = (Date.now() - start) / 1000;
        if (elapsed > 0.5 && loaded > 0) {
          const speed = ((loaded / elapsed) / (1024 * 1024)).toFixed(1);
          setVideoUploadSpeed(`${speed} Mo/s`);
        }
      });
      setIsVideoUploading(false);

      if (res.success && res.videoUrl) {
        setVideoUrl(res.videoUrl);
        setVideoFileName(file.name);
        setVideoFileSize(`${totalMb} Mo`);
        showToast('✓ Vidéo téléversée avec succès sur le serveur !', 'success');
      } else {
        showToast(res.error || 'Échec du téléversement de la vidéo.', 'error');
      }
    } catch {
      setIsVideoUploading(false);
      showToast('Échec du téléversement de la vidéo.', 'error');
    }
  };

  // Quick Video Upload for a specific project from the cards list
  const triggerQuickVideoUpload = (project: Project) => {
    setTargetProjectForQuickVideo(project);
    quickVideoInputRef.current?.click();
  };

  const handleQuickVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetProjectForQuickVideo) return;
    e.target.value = '';

    showToast(`Téléversement de la vidéo pour "${targetProjectForQuickVideo.title}"...`, 'info');
    try {
      const res = await uploadDirectVideo(file);
      if (res.success && res.videoUrl) {
        const totalMb = (file.size / (1024 * 1024)).toFixed(1);
        await updateProject(targetProjectForQuickVideo.id, {
          videoUrl: res.videoUrl,
          videoFileName: file.name,
          videoFileSize: `${totalMb} Mo`,
        });
        showToast('✓ Vidéo associée au projet avec succès !', 'success');
      } else {
        showToast(res.error || 'Échec de l\'upload.', 'error');
      }
    } catch {
      showToast('Erreur lors du téléversement de la vidéo.', 'error');
    } finally {
      setTargetProjectForQuickVideo(null);
    }
  };

  // Quick remove video from a project (In-App Modal confirmation)
  const handleConfirmRemoveVideo = async () => {
    if (!videoProjectToRemove) return;
    setIsRemovingVideo(true);
    await updateProject(videoProjectToRemove.id, {
      videoUrl: undefined,
      videoFileName: undefined,
      videoFileSize: undefined,
    });
    setIsRemovingVideo(false);
    setVideoProjectToRemove(null);
    showToast('Vidéo retirée du projet avec succès.', 'info');
  };

  const toggleSoftware = (sw: string) => {
    if (selectedSoftwares.includes(sw)) {
      setSelectedSoftwares(selectedSoftwares.filter((s) => s !== sw));
    } else {
      setSelectedSoftwares([...selectedSoftwares, sw]);
    }
  };

  // Submit Project Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Veuillez remplir le titre et la description.', 'error');
      return;
    }

    setIsSaving(true);
    const payload = {
      title: title.trim(),
      category,
      description: description.trim(),
      client: client.trim() || 'Client Privé',
      date,
      duration: duration.trim() || '30s',
      thumbnail: thumbnail || '/uploads/thumb_publicite.jpg',
      videoUrl: videoUrl || undefined,
      videoFileName: videoFileName || undefined,
      videoFileSize: videoFileSize || undefined,
      softwares: selectedSoftwares,
      status,
    };

    let res;
    if (editingProject) {
      res = await updateProject(editingProject.id, payload);
    } else {
      res = await addProject(payload);
    }
    setIsSaving(false);

    if (res && res.success) {
      setIsCreateModalOpen(false);
      setEditingProject(null);
    }
  };

  // Confirmed Delete Execution
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    const res = await deleteProject(projectToDelete.id);
    setIsDeleting(false);
    if (res.success) {
      setProjectToDelete(null);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'Tous') return true;
    return p.status === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Hidden Quick Video Input */}
      <input
        ref={quickVideoInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
        onChange={handleQuickVideoUpload}
        className="hidden"
      />

      {/* Header and Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-syne">
            Gestion des Projets
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ajoutez, modifiez, gérez les vidéos associées ou supprimez définitivement vos réalisations.
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

      {/* Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#0a0f1e] border border-slate-800/80 text-center text-slate-400 space-y-4">
          <Film className="w-14 h-14 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Aucun projet dans cette catégorie</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {projects.length === 0 
                ? 'Tous les projets ont été supprimés. La liste restera vide jusqu\'à ce que vous ajoutiez un nouveau projet.'
                : 'Aucun projet ne correspond au filtre sélectionné.'}
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un projet</span>
          </button>
        </div>
      ) : (
        /* Projects Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const isPub = project.status === 'Publié';
            const hasValidVideo = Boolean(project.videoUrl);

            return (
              <div
                key={project.id}
                className="rounded-2xl bg-[#0a0f1e] border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden group shadow-lg shadow-black/30"
              >
                <div>
                  {/* Thumbnail & Video Status Overlay */}
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

                  {/* Body Info */}
                  <div className="p-4 space-y-2.5">
                    <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-orange-400" />
                        {project.client}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-orange-400" />
                        {project.date}
                      </span>
                    </div>

                    {/* Dedicated Video Status & Actions Section as required by Étape 5 */}
                    <div className="mt-3 p-3 rounded-xl bg-[#070b16] border border-slate-800 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                          <Film className="w-3 h-3 text-orange-400" />
                          <span>Vidéo associée</span>
                        </span>
                        {hasValidVideo ? (
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Aucune vidéo valide
                          </span>
                        )}
                      </div>

                      {hasValidVideo ? (
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                          <span className="text-[11px] text-slate-300 truncate max-w-[130px]" title={project.videoUrl}>
                            {project.videoFileName || 'video.mp4'}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => triggerQuickVideoUpload(project)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold transition-colors cursor-pointer"
                              title="Remplacer la vidéo de ce projet"
                            >
                              CHANGER
                            </button>
                            <button
                              type="button"
                              onClick={() => setVideoProjectToRemove(project)}
                              className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                              title="Supprimer la vidéo de ce projet"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => triggerQuickVideoUpload(project)}
                          className="w-full py-1.5 px-2.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Upload className="w-3 h-3" />
                          <span>+ AJOUTER UNE VIDÉO</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Primary Card Bottom Actions: MODIFIER / PUBLIER / SUPPRIMER */}
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

                  {/* SUPPRIMER BUTTON: Opens custom confirmation modal */}
                  <button
                    onClick={() => setProjectToDelete(project)}
                    title="Supprimer définitivement ce projet"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal for Permanent Deletion (Bug A) */}
      <ConfirmDeleteModal
        isOpen={Boolean(projectToDelete)}
        title="Supprimer ce projet ?"
        projectName={projectToDelete?.title || ''}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setProjectToDelete(null)}
      />

      {/* Confirmation Modal for Project Video Removal (Bug B) */}
      <ConfirmDeleteModal
        isOpen={Boolean(videoProjectToRemove)}
        title="Supprimer la vidéo de ce projet ?"
        projectName={videoProjectToRemove ? `Vidéo du projet "${videoProjectToRemove.title}"` : ''}
        isDeleting={isRemovingVideo}
        onConfirm={handleConfirmRemoveVideo}
        onCancel={() => setVideoProjectToRemove(null)}
      />

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
                  Remplissez les détails du projet et associez une vidéo persistante.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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

              {/* DEDICATED PERSISTENT VIDEO SECTION (Bug B fix) */}
              <div className="p-4 rounded-2xl bg-[#070b16] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                    <Film className="w-4 h-4" />
                    <span>Vidéo du projet (Stockage Persistant)</span>
                  </label>
                  {videoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setVideoUrl('');
                        setVideoFileName('');
                        setVideoFileSize('');
                      }}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>SUPPRIMER LA VIDÉO</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Le fichier est directement téléversé et stocké de façon permanente sur le serveur (MP4, WEBM, MOV jusqu'à 500 Mo). Aucune URL temporaire n'est utilisée.
                </p>

                {/* Upload in Progress */}
                {isVideoUploading && (
                  <div className="p-3.5 rounded-xl bg-orange-950/30 border border-orange-500/40 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-orange-300">
                      <span>TÉLÉVERSEMENT EN COURS ({videoUploadPercent}%)</span>
                      <span className="font-mono">{videoUploadLoadedMb} / {videoUploadTotalMb} Mo</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-orange-500 transition-all duration-150"
                        style={{ width: `${videoUploadPercent}%` }}
                      />
                    </div>
                    {videoUploadSpeed && (
                      <span className="text-[10px] text-slate-400 font-mono">Vitesse : {videoUploadSpeed}</span>
                    )}
                  </div>
                )}

                {/* Video Picker or Current Video State */}
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                  onChange={handleDirectVideoUpload}
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <button
                    type="button"
                    disabled={isVideoUploading}
                    onClick={() => videoInputRef.current?.click()}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4 text-orange-400" />
                    <span>{videoUrl ? 'CHANGER LA VIDÉO' : 'TÉLÉVERSER UN FICHIER VIDÉO'}</span>
                  </button>

                  {videoUrl && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate max-w-xs">{videoFileName || 'Vidéo enregistrée'}</span>
                    </div>
                  )}
                </div>

                {/* Video Preview in modal */}
                {videoUrl && (
                  <div className="pt-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Aperçu de la vidéo :
                    </span>
                    <div className="relative aspect-video w-full max-h-48 rounded-xl overflow-hidden bg-black border border-slate-700">
                      <video
                        ref={modalVideoRef}
                        src={videoUrl}
                        controls
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Miniature Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Miniature (Image de couverture)
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
                    <span>Choisir une image de couverture</span>
                  </button>
                  {thumbnail && (
                    <div className="w-14 h-10 rounded-lg overflow-hidden border border-orange-500/60 shrink-0">
                      <img src={thumbnail} alt="Aperçu" className="w-full h-full object-cover" />
                    </div>
                  )}
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
                  disabled={isSaving || isVideoUploading}
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isVideoUploading}
                  className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-95"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>ENREGISTREMENT EN COURS...</span>
                    </>
                  ) : (
                    <span>{editingProject ? 'ENREGISTRER LES MODIFICATIONS' : 'CRÉER ET ENREGISTRER LE PROJET'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
