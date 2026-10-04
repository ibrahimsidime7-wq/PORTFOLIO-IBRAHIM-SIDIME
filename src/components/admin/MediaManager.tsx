import React, { useRef, useState, useEffect } from 'react';
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
  Sparkles,
  Link as LinkIcon,
  Image as ImageIcon,
  Check
} from 'lucide-react';

export const MediaManager: React.FC = () => {
  const { 
    presentationVideo, 
    updatePresentationVideo, 
    deletePresentationVideo, 
    uploadDirectVideo, 
    uploadMedia,
    showToast 
  } = useApp();

  const videoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  // Video State
  const [currentVideoUrl, setCurrentVideoUrl] = useState(presentationVideo.videoUrl);
  const [currentPosterUrl, setCurrentPosterUrl] = useState(presentationVideo.posterUrl);
  const [title, setTitle] = useState(presentationVideo.title || 'SHOWREEL OFFICIEL 2026');
  const [subtitle, setSubtitle] = useState(presentationVideo.subtitle || 'Découvrez mon univers créatif en 30 secondes.');
  const [fileName, setFileName] = useState(presentationVideo.fileName || '');
  const [fileSize, setFileSize] = useState(presentationVideo.fileSize || '');
  const [format, setFormat] = useState(presentationVideo.format || '');
  const [lastUpdated, setLastUpdated] = useState(presentationVideo.lastUpdated || '');

  // Upload Progress State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadLoadedMb, setUploadLoadedMb] = useState('0');
  const [uploadTotalMb, setUploadTotalMb] = useState('0');
  const [uploadSpeed, setUploadSpeed] = useState('');
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState(false);
  const uploadStartTimeRef = useRef<number>(0);

  // Player & UI States
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Secondary Optional URL state
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');

  // Sync state when presentationVideo changes in AppContext
  useEffect(() => {
    setCurrentVideoUrl(presentationVideo.videoUrl);
    setCurrentPosterUrl(presentationVideo.posterUrl);
    setTitle(presentationVideo.title || 'SHOWREEL OFFICIEL 2026');
    setSubtitle(presentationVideo.subtitle || 'Découvrez mon univers créatif en 30 secondes.');
    setFileName(presentationVideo.fileName || '');
    setFileSize(presentationVideo.fileSize || '');
    setFormat(presentationVideo.format || (presentationVideo.videoUrl ? 'MP4' : ''));
    setLastUpdated(presentationVideo.lastUpdated || '');
  }, [presentationVideo]);

  // Primary Action: Direct Video File Upload (Up to 500 MB)
  const handleSelectVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const MAX_SIZE = 500 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      showToast('Vidéo trop volumineuse. Taille maximale : 500 Mo.', 'error');
      return;
    }

    const extMatch = file.name.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : '';
    const allowed = ['mp4', 'webm', 'mov'];
    const validMimes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowed.includes(ext) && !validMimes.includes(file.type)) {
      showToast('Format non pris en charge. Utilisez MP4, WEBM ou MOV.', 'error');
      return;
    }

    setIsUploading(true);
    setUploadPercent(0);
    setUploadSuccessMessage(false);
    uploadStartTimeRef.current = Date.now();
    const totalInMb = (file.size / (1024 * 1024)).toFixed(1);
    setUploadTotalMb(totalInMb);
    setUploadLoadedMb('0');

    try {
      const res = await uploadDirectVideo(file, (percent, loaded, total) => {
        setUploadPercent(percent);
        const loadedMb = (loaded / (1024 * 1024)).toFixed(1);
        const totMb = (total / (1024 * 1024)).toFixed(1);
        setUploadLoadedMb(loadedMb);
        setUploadTotalMb(totMb);
        const elapsedSeconds = (Date.now() - uploadStartTimeRef.current) / 1000;
        if (elapsedSeconds > 0.5 && loaded > 0) {
          const speedBytesPerSec = loaded / elapsedSeconds;
          const speedMb = (speedBytesPerSec / (1024 * 1024)).toFixed(1);
          setUploadSpeed(`${speedMb} Mo/s`);
        }
      });
      setIsUploading(false);

      if (res.success && res.videoUrl) {
        setCurrentVideoUrl(res.videoUrl);
        setFileName(file.name);
        setFileSize(`${totalInMb} Mo`);
        setFormat(ext.toUpperCase() || 'MP4');
        setUploadSuccessMessage(true);
        setHasUnsavedChanges(false);
        setSaveStatus('idle');

        // Automatically persist in DB
        await updatePresentationVideo({
          videoUrl: res.videoUrl,
          fileName: file.name,
          fileSize: `${totalInMb} Mo`,
          format: ext.toUpperCase() || 'MP4',
        });

        setTimeout(() => {
          setUploadSuccessMessage(false);
        }, 6000);
      } else {
        showToast(res.error || 'Échec du téléchargement. Veuillez réessayer.', 'error');
      }
    } catch {
      setIsUploading(false);
      showToast('Échec du téléchargement. Veuillez réessayer.', 'error');
    }
  };

  // Change poster image
  const handleSelectPoster = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = async (loadEvent) => {
      const dataUri = loadEvent.target?.result as string;
      if (dataUri) {
        try {
          showToast('Enregistrement de la miniature...', 'info');
          const uploadedPosterUrl = await uploadMedia(dataUri, `poster_${Date.now()}`);
          setCurrentPosterUrl(uploadedPosterUrl);
          setHasUnsavedChanges(true);
          showToast('Miniature sélectionnée ! Cliquez sur "ENREGISTRER" pour valider.', 'info');
        } catch {
          setCurrentPosterUrl(dataUri);
          setHasUnsavedChanges(true);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Secondary Option: Direct URL
  const handleApplyExternalUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalUrl.trim()) return;
    const url = externalUrl.trim();
    setCurrentVideoUrl(url);
    const parsedName = url.split('/').pop()?.split('?')[0] || 'video_externe.mp4';
    setFileName(parsedName);
    setFormat('STREAM');
    setFileSize('Lien distant');
    setHasUnsavedChanges(true);
    setShowUrlInput(false);
    showToast('Lien vidéo externe appliqué ! Cliquez sur ENREGISTRER pour valider.', 'info');
  };

  const togglePlay = () => {
    if (!previewVideoRef.current) return;
    if (isPlaying) {
      previewVideoRef.current.pause();
      setIsPlaying(false);
    } else {
      previewVideoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    const res = await updatePresentationVideo({
      videoUrl: currentVideoUrl,
      posterUrl: currentPosterUrl,
      title: title.trim(),
      subtitle: subtitle.trim(),
      fileName: fileName || undefined,
      fileSize: fileSize || undefined,
      format: format || undefined,
    });
    setIsSaving(false);
    if (res.success) {
      setHasUnsavedChanges(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 5000);
    } else {
      setSaveStatus('error');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Voulez-vous vraiment supprimer la vidéo de présentation actuelle ?')) {
      setIsSaving(true);
      const res = await deletePresentationVideo();
      setIsSaving(false);
      if (res.success) {
        setCurrentVideoUrl('');
        setFileName('');
        setFileSize('');
        setFormat('');
        setHasUnsavedChanges(false);
        setSaveStatus('idle');
      }
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">
          <span className="w-3 h-0.5 bg-orange-500 inline-block" />
          <span>ADMIN &gt; CONTENU &gt; VIDÉO DE PRÉSENTATION</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-syne">
          VIDÉO DE PRÉSENTATION
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Téléversez directement votre vidéo showreel (jusqu'à 500 Mo). Elle sera diffusée en haute qualité sur la page d'accueil de votre portfolio public.
        </p>
      </div>

      <div className="rounded-3xl bg-[#0a0f1e] border border-slate-800/90 p-5 sm:p-8 shadow-2xl space-y-6">
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
          accept="image/jpeg,image/png,image/webp"
          onChange={handleSelectPoster}
          className="hidden"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Fichier actif :</span>
                <span className="text-orange-400 font-mono text-xs font-semibold truncate max-w-xs sm:max-w-md">
                  {fileName || 'Aucune vidéo configurée'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {lastUpdated ? `Dernière mise à jour : ${lastUpdated}` : 'Prêt pour l\'importation'}
              </div>
            </div>
          </div>

          {hasUnsavedChanges && !isUploading && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              Modifications non enregistrées
            </span>
          )}
        </div>

        {isUploading && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-950/40 via-[#0e162d] to-slate-900 border border-orange-500/40 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2 text-orange-400 uppercase tracking-wider">
                <div className="w-3.5 h-3.5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                <span>UPLOAD EN COURS ({uploadPercent}%)</span>
              </div>
              <span className="text-white font-mono">{uploadLoadedMb} Mo / {uploadTotalMb} Mo</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden relative p-0.5 border border-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 transition-all duration-150 shadow-md shadow-orange-500/40"
                style={{ width: `${uploadPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Vitesse : <strong className="text-slate-200">{uploadSpeed || 'Calcul...'}</strong></span>
            </div>
          </div>
        )}

        {uploadSuccessMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in shadow-lg shadow-emerald-950/30">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <span>✓ VIDÉO TÉLÉVERSÉE ET PERSISTÉE AVEC SUCCÈS</span>
              <p className="text-[11px] text-emerald-400/80 font-normal mt-0.5">
                La vidéo est désormais stockée sur le serveur et visible sur la page d'accueil de votre portfolio.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Lecteur Vidéo &amp; Aperçu
            </label>
            {currentVideoUrl && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Vidéo prête pour diffusion
              </span>
            )}
          </div>

          <div className="relative aspect-video w-full max-h-[440px] rounded-2xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center shadow-xl">
            {currentVideoUrl ? (
              <video
                ref={previewVideoRef}
                src={currentVideoUrl}
                poster={currentPosterUrl}
                controls
                playsInline
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <div className="text-center p-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
                  <FileVideo className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-white text-sm font-semibold">Aucune vidéo de présentation</p>
                  <p className="text-slate-400 text-xs max-w-sm mx-auto">
                    Cliquez sur le bouton ci-dessous pour choisir votre vidéo sur votre ordinateur ou téléphone (jusqu'à 500 Mo).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {currentVideoUrl && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#070b16] border border-slate-800/90 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Nom du fichier</span>
              <p className="text-white font-medium truncate" title={fileName || 'showreel.mp4'}>
                {fileName || 'showreel_officiel.mp4'}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Taille</span>
              <p className="text-orange-400 font-bold font-mono">
                {fileSize || 'Standard'}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Format</span>
              <p className="text-white font-bold">
                {format || 'MP4'}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Date</span>
              <p className="text-slate-300">
                {lastUpdated || 'Récemment'}
              </p>
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => videoInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{currentVideoUrl ? 'CHANGER LA VIDÉO' : 'IMPORTER UNE VIDÉO'}</span>
            </button>

            {currentVideoUrl && (
              <button
                type="button"
                onClick={togglePlay}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 text-orange-400" /> : <Play className="w-4 h-4 text-orange-400" />}
                <span>APERÇU</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => posterInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/80 transition-colors cursor-pointer"
              title="Sélectionner une image de couverture pour la vidéo"
            >
              <ImageIcon className="w-4 h-4 text-slate-400" />
              <span>Miniature</span>
            </button>

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="px-3.5 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium transition-colors cursor-pointer border border-slate-800"
            >
              <span className="flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5" />
                <span>{showUrlInput ? 'Fermer URL' : 'Ou utiliser un lien vidéo'}</span>
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 justify-end">
            {currentVideoUrl && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSaving || isUploading}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>SUPPRIMER</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isUploading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>ENREGISTREMENT...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>ENREGISTRER</span>
                </>
              )}
            </button>
          </div>
        </div>

        {saveStatus === 'success' && (
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>✓ MODIFICATIONS ENREGISTRÉES DANS LA BASE DE DONNÉES</span>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>Échec de l'enregistrement. Veuillez réessayer.</span>
          </div>
        )}

        {showUrlInput && (
          <form onSubmit={handleApplyExternalUrl} className="p-4 sm:p-5 rounded-2xl bg-[#070b16] border border-slate-700/80 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <LinkIcon className="w-3.5 h-3.5 text-orange-400" />
              <span>Coller un lien vidéo (YouTube, Vimeo, Cloud CDN, Google Drive...)</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://exemple.com/video.mp4"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Appliquer
              </button>
            </div>
          </form>
        )}

        <div className="p-4 rounded-2xl bg-[#070b16] border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Caractéristiques du système de stockage vidéo :</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-400 pt-1">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>Taille maximale autorisée : <strong>500 Mo</strong></span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>Formats acceptés : <strong>MP4, WEBM, MOV</strong></span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>Stockage persistant sur disque : <strong>/data/uploads/videos/</strong></span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>Lecture avec Range Requests (seek rapide &amp; streaming)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
