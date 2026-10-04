import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Pause, Volume2, VolumeX, Maximize2, Settings, AlertCircle } from 'lucide-react';

export const HeroVideo: React.FC = () => {
  const { presentationVideo } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [hasError, setHasError] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current || hasError) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    if (!isNaN(videoRef.current.duration) && videoRef.current.duration > 0) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const targetTime = Math.max(0, Math.min(pos * duration, duration));
    videoRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section id="accueil" className="pt-24 pb-8 sm:pt-28 sm:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-slate-800/90 shadow-2xl shadow-orange-950/10 bg-[#090d19] group">
        <div className="relative aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.35/1] w-full bg-black flex items-center justify-center overflow-hidden">
          {hasError ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
              <img
                src={presentationVideo.posterUrl}
                alt="Studio d'Ibrahim Sidime"
                className="absolute inset-0 w-full h-full object-cover opacity-40 blur-xs"
              />
              <div className="relative z-10 space-y-2 max-w-sm">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-white text-sm font-semibold">Vidéo en cours de chargement</p>
                <button
                  onClick={() => {
                    setHasError(false);
                    videoRef.current?.load();
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold cursor-pointer shadow-md"
                >
                  Réessayer la lecture
                </button>
              </div>
            </div>
          ) : presentationVideo.videoUrl ? (
            <video
              ref={videoRef}
              src={presentationVideo.videoUrl}
              poster={presentationVideo.posterUrl}
              muted={isMuted}
              playsInline
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              onError={() => setHasError(true)}
              onClick={togglePlay}
              className="w-full h-full object-cover cursor-pointer"
            />
          ) : (
            <img
              src={presentationVideo.posterUrl}
              alt="Studio d'Ibrahim Sidime"
              className="w-full h-full object-cover"
            />
          )}

          {/* Central Play Button Overlay */}
          {!isPlaying && !hasError && (
            <div 
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[2px] cursor-pointer transition-all duration-300 group-hover:bg-black/25"
            >
              <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white/80 bg-black/40 backdrop-blur-md shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:border-orange-500 group-hover:bg-orange-500/20">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1.5 text-white fill-white transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 rounded-full border border-orange-500/40 animate-ping opacity-25" />
              </div>
            </div>
          )}

          {/* Bottom Video Controls Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-8 pb-3 px-4 sm:px-6 transition-opacity duration-300">
            {/* Scrubber / Progress Bar */}
            <div
              ref={progressBarRef}
              onClick={handleSeek}
              className="relative w-full h-1.5 bg-slate-700/60 rounded-full cursor-pointer group/bar mb-3 overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-white text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="hover:text-orange-400 transition-colors p-1 cursor-pointer"
                  aria-label={isPlaying ? 'Pause' : 'Lecture'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                  )}
                </button>
                <div className="text-slate-300 text-xs tracking-wider">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-slate-500 mx-1">/</span>
                  <span className="text-slate-400">{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <button
                  onClick={toggleMute}
                  className="hover:text-orange-400 transition-colors p-1 cursor-pointer"
                  aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
                <button
                  onClick={handleFullscreen}
                  className="hover:text-orange-400 transition-colors p-1 cursor-pointer"
                  aria-label="Plein écran"
                >
                  <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
