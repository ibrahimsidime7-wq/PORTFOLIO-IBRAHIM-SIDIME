import React from 'react';
import { useApp } from '../../context/AppContext';
import { Film, Sparkles, MessageSquareCode, Share2, ArrowRight } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { setIsAllServicesModalOpen } = useApp();

  const services = [
    {
      id: 'montage',
      title: 'Montage vidéo',
      description: 'Clips, publicités, vidéos corporate, réseaux sociaux.',
      icon: Film,
    },
    {
      id: 'motion',
      title: 'Motion design',
      description: 'Animations graphiques, effets visuels, habillage vidéo.',
      icon: Sparkles,
    },
    {
      id: 'subtitles',
      title: 'Sous-titrage',
      description: 'Sous-titres modernes et multilingues.',
      icon: MessageSquareCode,
    },
    {
      id: 'social',
      title: 'Réseaux sociaux',
      description: 'TikTok, Instagram, Facebook, YouTube, Shorts.',
      icon: Share2,
    },
  ];

  return (
    <section id="services" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">
            <span className="w-4 h-0.5 bg-orange-500 inline-block" />
            <span>MES SERVICES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-syne tracking-tight">
            Des vidéos qui font <span className="text-orange-500">la différence</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-2xl">
            Des contenus créatifs et professionnels pour donner de la visibilité à vos projets.
          </p>
        </div>

        <button
          onClick={() => setIsAllServicesModalOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-orange-400 transition-colors cursor-pointer group shrink-0"
        >
          <span>Découvrir tous mes services</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              onClick={() => setIsAllServicesModalOpen(true)}
              className="relative p-6 rounded-2xl bg-[#090e1c] border border-slate-800/80 hover:border-orange-500/50 hover:bg-[#0c1326] transition-all duration-300 group cursor-pointer flex flex-col justify-between min-h-[175px] shadow-lg shadow-black/30"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors mb-2">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <span className="text-slate-500 group-hover:text-orange-400 transition-all group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
