import React from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Mail, Film, Sparkles, Video, ArrowUpRight } from 'lucide-react';

export const HeroProfile: React.FC = () => {
  const { profile, setIsContactModalOpen, setContactModalType } = useApp();

  const scrollToVideo = () => {
    const el = document.getElementById('accueil');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        
        {/* Left: Circular Portrait with Orange Border */}
        <div className="lg:col-span-4 flex justify-center lg:justify-start">
          <div className="relative group">
            {/* Outer subtle glow */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 opacity-40 blur-lg group-hover:opacity-60 transition duration-500" />
            
            {/* Circular image container with orange border */}
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 md:w-64 md:h-64 rounded-full p-1.5 bg-gradient-to-b from-orange-500 via-orange-600 to-amber-600 shadow-2xl">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#090d19] border-2 border-[#070a12]">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center: Profile Bio & Direct CTAs */}
        <div className="lg:col-span-5 text-center lg:text-left space-y-4">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-500 uppercase tracking-widest">
            <span>{profile.tagline || 'BIENVENUE SUR MON PORTFOLIO'}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-syne">
            <span>Ibrahim </span>
            <span className="text-orange-500">Sidime</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-300 uppercase">
            MONTEUR <span className="text-white font-bold">VIDÉO</span> •{' '}
            <span className="text-white font-bold">CRÉATEUR DE</span> CONTENU
          </p>

          {/* Bio text */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
            {profile.bio}
          </p>

          {/* Social Icons matching the screenshot */}
          <div className="flex items-center justify-center lg:justify-start gap-4 pt-1 text-slate-400">
            {/* TikTok */}
            <a
              href={profile.socials.tiktok}
              target="_blank"
              rel="noreferrer"
              title="TikTok"
              className="p-2 rounded-full hover:text-orange-400 hover:bg-slate-800/60 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.41a6.33 6.33 0 0 0-6.6 6.35 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.05a8.2 8.2 0 0 0 4.18 1.15V6.75a4.83 4.83 0 0 1-1-.06z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href={profile.socials.instagram}
              target="_blank"
              rel="noreferrer"
              title="Instagram"
              className="p-2 rounded-full hover:text-orange-400 hover:bg-slate-800/60 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href={profile.socials.facebook}
              target="_blank"
              rel="noreferrer"
              title="Facebook"
              className="p-2 rounded-full hover:text-orange-400 hover:bg-slate-800/60 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href={profile.socials.youtube}
              target="_blank"
              rel="noreferrer"
              title="YouTube"
              className="p-2 rounded-full hover:text-orange-400 hover:bg-slate-800/60 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              title="LinkedIn"
              className="p-2 rounded-full hover:text-orange-400 hover:bg-slate-800/60 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>

          {/* Action Buttons matching the screenshot */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
            <button
              onClick={scrollToVideo}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Voir ma vidéo de présentation</span>
            </button>

            <button
              onClick={() => {
                setContactModalType('contact');
                setIsContactModalOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0a0f1d] border border-slate-700/80 hover:border-slate-500 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-slate-400" />
              <span>Me contacter</span>
            </button>
          </div>
        </div>

        {/* Right: 3 Feature Cards matching the screenshot */}
        <div className="lg:col-span-3 space-y-3.5 pt-4 lg:pt-0">
          {/* Card 1 */}
          <div className="p-4 rounded-2xl bg-[#090e1c] border border-slate-800/80 hover:border-orange-500/40 transition-all duration-300 group shadow-lg shadow-black/20 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 shrink-0 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                Montage vidéo
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Clips, publicités, réseaux sociaux
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-2xl bg-[#090e1c] border border-slate-800/80 hover:border-orange-500/40 transition-all duration-300 group shadow-lg shadow-black/20 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 shrink-0 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                Motion design
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Animations & effets visuels
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-2xl bg-[#090e1c] border border-slate-800/80 hover:border-orange-500/40 transition-all duration-300 group shadow-lg shadow-black/20 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 shrink-0 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                Contenus sur mesure
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pour votre marque ou projet
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
