import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Upload, 
  Trash2, 
  Save, 
  Play, 
  Pause, 
  CheckCircle2, 
  Film, 
  FileVideo, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';

export const MediaManager: React.FC = () => {
  const { presentationVideo, updatePresentationVideo, deletePresentationVideo, showToast } = useApp();
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  const [currentVideoUrl, setCurrentVideoUrl] = useState(presentationVideo.videoUrl);
  const [currentPosterUrl, setCurrentPosterUrl] = useState(presentationVideo.posterUrl);
  const [fileName, setFileName] = useState(presentationVideo.fileName || 'ibrahim_showreel_2026.mp4');
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Directly select video file from device (MP4, WEBM, MOV) without asking for URL!
  const handleSelectVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file extension
      const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov)$/i)) {
        showToast('Format non supporté. Veuillez choisir un fichier MP4, WEBM ou MOV.', 'error');
        return;
      }

      // Create local object URL for instant preview
      const objectUrl = URL.createObjectURL(file);
      setCurrentVideoUrl(objectUrl);
      setFileName(file.name);
      setHasUnsavedChanges(true);
      showToast(`Fichier vidéo "${file.name}" chargé depuis votre appareil !`, 'info');
    }
  };

  const handleSelectPoster = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          setCurrentPosterUrl(loadEvent.target.result as string);
          setHasUnsavedChanges(true);
          showToast('Image de couverture sélectionnée !', 'info');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePreviewPlay = () => {
    if (!previewVideoRef.current) return;
    if (isPlaying) {
      previewVideoRef.current.pause();
      setIsPlaying(false);
    } else {
      previewVideoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSave = () => {
    updatePresentationVideo({
      videoUrl: currentVideoUrl,
      posterUrl: currentPosterUrl,
      fileName,
    });
    setHasUnsavedChanges(false);
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer la vidéo de présentation actuelle ?')) {
      deletePresentationVideo();
      setCurrentVideoUrl('');
      setFileName('');
      setHasUnsavedChanges(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">
          <span className="w-3 h-0.5 bg-orange-500 inline-block" />
          <span>ADMIN &gt; CONTENU & MÉDIAS</span>
        </div>
        <h2 className="text-2xl font-bold text-white font-syne">
          VIDÉO DE PRÉSENTATION
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Cette vidéo apparaît au sommet de votre portfolio public pour présenter votre univers en 30 secondes.
        </p>
      </div>

      {/* Main Video Box */}
      <div className="rounded-3xl bg-[#0a0f1e] border border-slate-800/90 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Status & Unsaved changes alert */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Vidéo actuelle :</span>
                <span className="text-orange-400 font-mono text-xs">
                  {fileName || 'Aucune vidéo configurée'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Dernière mise à jour : {presentationVideo.lastUpdated || 'Récemment'}
              </div>
            </div>
          </div>

          {hasUnsavedChanges && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              Modifications non enregistrées
            </span>
          )}
        </div>

        {/* Video Preview Card */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Aperçu en direct
          </label>

          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center group">
            {currentVideoUrl ? (
              <>
                <video
                  ref={previewVideoRef}
                  src={currentVideoUrl}
                  poster={currentPosterUrl}
                  playsInline
                  onEnded={() => setIsPlaying(false)}
                  onClick={togglePreviewPlay}
                  className="w-full h-full object-cover cursor-pointer"
                />
                {!isPlaying && (
                  <div 
                    onClick={togglePreviewPlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 ml-1 fill-white" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-8">
                <FileVideo className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-xs">
                  Aucune vidéo sélectionnée. Cliquez ci-dessous pour importer un fichier MP4, WEBM ou MOV.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls matching prompt:
            - bouton CHANGER LA VIDÉO
            - bouton SUPPRIMER
            - bouton ENREGISTRER
            Formats : MP4, WEBM, MOV (NE PAS DEMANDER D'URL)
        */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Hidden File Input */}
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
            onChange={handleSelectVideoFile}
            className="hidden"
          />

          <input
            ref={posterInputRef}
            type="file"
            accept="image/*"
            onChange={handleSelectPoster}
            className="hidden"
          />

          {/* Left: Change video file & poster */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>CHANGER LA VIDÉO</span>
            </button>

            <button
              type="button"
              onClick={() => posterInputRef.current?.click()}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Changer la miniature</span>
            </button>
          </div>

          {/* Right: Delete & Save */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {currentVideoUrl && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>SUPPRIMER</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>ENREGISTRER</span>
            </button>
          </div>
        </div>

        {/* Note on formats */}
        <div className="p-4 rounded-xl bg-[#070b16] border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Spécifications de fichier vidéo :</span>
          </div>
          <p>
            Formats acceptés : <strong>MP4, WEBM, MOV</strong>. Aucun lien URL externe requis. Le fichier est lu directement par le navigateur et remplace instantanément la vidéo sur la page d'accueil publique.
          </p>
        </div>

      </div>
    </div>
  );
};
