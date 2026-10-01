import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, ChevronDown, ChevronUp, MapPin, Phone } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { profile, setIsContactModalOpen, setContactModalType } = useApp();
  const [showFull, setShowFull] = useState(false);

  return (
    <section id="a-propos" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-[#090e1c] border border-slate-800/90 p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xl">
        {/* Subtle orange ambient glow in background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Portrait Column */}
          <div className="md:col-span-4 flex justify-center">
            <div className="relative group">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-orange-500/80 shadow-xl bg-slate-900">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 px-3 py-1.5 rounded-xl bg-[#070a12] border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5 shadow-lg">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>Abidjan, CI</span>
              </div>
            </div>
          </div>

          {/* Text Column */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-500 uppercase tracking-widest">
              <span className="w-4 h-0.5 bg-orange-500 inline-block" />
              <span>QUI SUIS-JE ?</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-syne">
              Ibrahim Sidime, artisan de l'image et du rythme
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              « Je suis Ibrahim Sidime, monteur vidéo et créateur de contenu passionné par l’image, le montage et la création visuelle. Mon objectif est de transformer chaque idée en une vidéo claire, dynamique et adaptée à son public. »
            </p>

            {showFull && (
              <div className="pt-2 text-slate-400 text-sm leading-relaxed space-y-3 animate-in fade-in duration-300">
                <p>
                  Fort d’une solide expérience dans le montage publicitaire, les vidéos d'entreprise et les formats verticaux à fort engagement pour les créateurs, je maîtrise l'ensemble du workflow de post-production : dérushage, montage dynamique, habillage graphique, étalonnage cinématographique et mixage sonore.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-500" />
                    <span>Livraison rapide et soignée</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-500" />
                    <span>Formats adaptés (16:9 & 9:16)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-500" />
                    <span>Color grading de précision</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-500" />
                    <span>Accompagnement personnalisé</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowFull(!showFull)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <span>{showFull ? 'Réduire' : 'En savoir plus'}</span>
                {showFull ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => {
                  setContactModalType('contact');
                  setIsContactModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                <span>Me contacter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
