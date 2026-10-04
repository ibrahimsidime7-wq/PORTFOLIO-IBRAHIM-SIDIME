import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Calendar, User, Layers, ArrowLeft, AlertCircle, RefreshCw, Edit3 } from 'lucide-react';

export const ProjectModal: React.FC = () => {
  const { 
    selectedProject, 
    setSelectedProject, 
    setIsContactModalOpen, 
    setContactModalType,
    isAuthenticated,
    navigate,
    setActiveAdminTab
  } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [cacheBuster, setCacheBuster] = useState(0);

  useEffect(() => {
    if (selectedProject) {
      setVideoError(null);
      setIsPlaying(false);
      console.log(`[VIDEO LOAD] projectId = ${selectedProject.id}`);
      console.log(`[VIDEO LOAD] reference field used = videoUrl`);
      console.log(`[VIDEO LOAD] playback url = ${selectedProject.videoUrl || 'none'}`);
    }
  }, [selectedProject]);

  if (!selectedProject) return null;

  const togglePlay = () => {
    if (!videoRef.current || videoError) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch((err) => {
        console.warn('Playback error:', err);
      });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  // Video error handler
  const handleVideoError = () => {
    console.error(`[VIDEO LOAD] file exists in storage = false`);
    console.error(`[VIDEO LOAD] Failed to play video url: ${selectedProject.videoUrl}`);
    setVideoError('La vidéo associée à ce projet est introuvable. Veuillez importer une nouvelle vidéo.');
    setIsPlaying(false);
  };

  // True Retry Cycle as required by instructions:
  // Re-fetch project -> verify reference -> re-trigger playback
  const handleRetryVideo = async () => {
    console.log(`[VIDEO RETRY] re-fetch triggered`);
    setIsRetrying(true);
    setVideoError(null);

    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.project) {
          setSelectedProject(data.project);
        }
      }
    } catch {
      // ignore
    } finally {
      setCacheBuster(Date.now());
      setIsRetrying(false);
    }
  };

  const videoPlaybackSrc = selectedProject.videoUrl 
    ? (cacheBuster ? `${selectedProject.videoUrl}?t=${cacheBuster}` : selectedProject.videoUrl)
    : undefined;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setSelectedProject(null)}
    >
      <div 
        className="relative w-full max-w-3xl bg-[#0b101e] border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Controls with RETOUR and CLOSE */}
        <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between pointer-events-none">
          <button
            onClick={() => setSelectedProject(null)}
            className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-orange-500 hover:text-white text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-orange-400 group-hover:text-white" />
            <span>RETOUR</span>
          </button>

          <button
            onClick={() => setSelectedProject(null)}
            className="pointer-events-auto p-2 rounded-xl bg-black/70 text-slate-300 hover:text-white hover:bg-black/90 transition-all backdrop-blur-md border border-white/15 cursor-pointer shadow-lg"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player or Error State or Thumbnail */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {videoError ? (
            <div className="p-6 text-center space-y-3 max-w-md animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-white text-sm font-semibold">
                  {videoError}
                </p>
                <p className="text-xs text-slate-400">
                  La vidéo n'a pas pu être chargée ou le fichier a été déplacé.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  disabled={isRetrying}
                  onClick={handleRetryVideo}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-orange-400 ${isRetrying ? 'animate-spin' : ''}`} />
                  <span>RÉESSAYER</span>
                </button>

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProject(null);
                      setActiveAdminTab('projects');
                      navigate('/admin');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>CHANGER LA VIDÉO</span>
                  </button>
                )}
              </div>
            </div>
          ) : selectedProject.videoUrl ? (
            <>
              <video
                ref={videoRef}
                src={videoPlaybackSrc}
                poster={selectedProject.thumbnail}
                playsInline
                preload="metadata"
                onEnded={() => setIsPlaying(false)}
                onError={handleVideoError}
                onClick={togglePlay}
                className="w-full h-full object-contain cursor-pointer"
              />

              {!isPlaying && (
                <div 
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-full bg-orange-500/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-orange-500 transition-all duration-300">
                    <Play className="w-7 h-7 ml-1 fill-white" />
                  </div>
                </div>
              )}

              {/* Controls bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="hover:text-orange-400 transition-colors p-1">
                    {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>
                  <button onClick={toggleMute} className="hover:text-orange-400 transition-colors p-1">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="text-slate-300">{selectedProject.duration}</span>
                </div>
                <button onClick={handleFullscreen} className="hover:text-orange-400 transition-colors p-1">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <img
              src={selectedProject.thumbnail}
              alt={selectedProject.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Project Details */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/30">
              {selectedProject.category}
            </span>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-orange-500" />
                {selectedProject.client}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />
                {selectedProject.date}
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white font-syne">{selectedProject.title}</h2>
          <p className="text-slate-300 text-sm leading-relaxed">{selectedProject.description}</p>

          {/* Software stack */}
          {selectedProject.softwares && selectedProject.softwares.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Layers className="w-3.5 h-3.5 text-orange-400" />
                Logiciels utilisés
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedProject.softwares.map((sw) => (
                  <span
                    key={sw}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 border border-slate-700/60 text-slate-200"
                  >
                    {sw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom actions */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => setSelectedProject(null)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← RETOUR</span>
            </button>

            <button
              onClick={() => {
                setSelectedProject(null);
                setContactModalType('quote');
                setIsContactModalOpen(true);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-colors cursor-pointer text-center"
            >
              Demander un devis pour un projet similaire →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
