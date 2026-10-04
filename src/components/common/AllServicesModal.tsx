import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  X, 
  Film, 
  Sparkles, 
  Share2, 
  MessageSquareCode, 
  Palette, 
  Volume2, 
  CheckCircle2, 
  ArrowUpRight, 
  Clock, 
  Layers 
} from 'lucide-react';

export const AllServicesModal: React.FC = () => {
  const { 
    isAllServicesModalOpen, 
    setIsAllServicesModalOpen, 
    setIsContactModalOpen, 
    setContactModalType 
  } = useApp();

  if (!isAllServicesModalOpen) return null;

  const handleOpenContact = (serviceTitle: string) => {
    setIsAllServicesModalOpen(false);
    setContactModalType('quote');
    setIsContactModalOpen(true);
  };

  const detailedServices = [
    {
      id: 'montage-pro',
      title: 'Montage Vidéo Professionnel',
      category: 'Publicité • Corporate • Clips • Documentaires',
      icon: Film,
      description: 'Montage rythmé et immersif conçu pour captiver votre audience dès la première seconde et maximiser le taux de rétention.',
      points: [
        'Dérushage minutieux et découpage dynamique au beat audio',
        'Transitions invisibles et dynamiques (speed ramps, whip pans)',
        'Montage multi-caméras et synchronisation audio de précision',
        'Export master haute définition (4K / 1080p) et formats adaptés',
      ],
      softwares: 'Premiere Pro • DaVinci Resolve',
    },
    {
      id: 'motion-design',
      title: 'Motion Design & Habillage Vidéo',
      category: 'Animations 2D/3D • Logo Reveal • Synthés',
      icon: Sparkles,
      description: 'Apportez une signature visuelle futuriste et premium à vos vidéos grâce à des animations graphiques fluides et captivantes.',
      points: [
        'Animation de logos 2D / 3D percutants',
        'Création de synthés (lower-thirds), intros et outros de marque',
        'Typographies cinétiques et callouts animés',
        'Intégration d\'effets visuels VFX et éléments graphiques stylisés',
      ],
      softwares: 'After Effects • Blender • Photoshop',
    },
    {
      id: 'reseaux-sociaux',
      title: 'Formats Verticaux & Contenus Viraux',
      category: 'TikTok • Instagram Reels • YouTube Shorts',
      icon: Share2,
      description: 'Formats 9:16 optimisés pour les algorithmes des plateformes sociales afin d\'augmenter votre visibilité et votre engagement.',
      points: [
        'Hooks visuels et sonores percutants dans les 3 premières secondes',
        'Rythme soutenu sans temps mort avec zoom-in / zoom-out dynamiques',
        'Pack de vidéos mensuelles pour créateurs et marques',
        'Optimisation de la rétention et taux de complétion élevé',
      ],
      softwares: 'Premiere Pro • CapCut Pro',
    },
    {
      id: 'sous-titrage',
      title: 'Sous-titrage Dynamique & Multilingue',
      category: 'Style Créateur • Emojis • Transcription Précise',
      icon: MessageSquareCode,
      description: 'Plus de 80% des vidéos sont regardées sans son. Rendez vos contenus compréhensibles et captivants instantanément.',
      points: [
        'Sous-titres animés au mot par mot (style Alex Hormozi, Ali Abdaal)',
        'Mise en valeur par couleurs contrastées et emojis contextuels',
        'Sous-titrage multilingue (Français, Anglais)',
        'Incrustation directe ou fichier .SRT synchronisé',
      ],
      softwares: 'Premiere Pro • After Effects',
    },
    {
      id: 'etalonnage',
      title: 'Étalonnage Cinématographique (Color Grading)',
      category: 'Correction Colorimétrique • Mood & Ambiances',
      icon: Palette,
      description: 'Donnez un look cinématographique digne du grand écran à vos plans grâce à un travail poussé sur la colorimétrie.',
      points: [
        'Normalisation LOG / RAW et balance précise des blancs',
        'Harmonisation parfaite des teintes de peau (skin tones)',
        'Création d\'une identité visuelle moody, chaleureuse ou publicitaire',
        'Conformité des niveaux de diffusion broadcast et web',
      ],
      softwares: 'DaVinci Resolve Studio',
    },
    {
      id: 'sound-design',
      title: 'Sound Design & Mixage Audio',
      category: 'SFX • Nettoyage Voix • Musiques Libres de Droits',
      icon: Volume2,
      description: 'L\'audio représente 50% de l\'impact émotionnel d\'une vidéo. Offrez une expérience sonore puissante et cristalline.',
      points: [
        'Nettoyage des bruits parasites et mastering des voix off',
        'Bruitages immersifs (whooshes, risers, impacts, ambiances)',
        'Sélection et mixage de musiques adaptées au tempo',
        'Équilibrage dynamique pour une écoute confortable sur mobile',
      ],
      softwares: 'Soundly • Premiere Pro • Audition',
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsAllServicesModalOpen(false)}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#0a0f1f] border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with prominent Retour Button */}
        <div className="shrink-0 p-4 sm:p-6 border-b border-slate-800/80 bg-[#0a0f1f]/95 backdrop-blur-md flex items-center justify-between gap-3 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAllServicesModalOpen(false)}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-orange-500 hover:text-white text-slate-200 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
              title="Retour au portfolio"
            >
              <ArrowLeft className="w-4 h-4 text-orange-400 group-hover:text-white" />
              <span>RETOUR</span>
            </button>
            <div>
              <div className="text-[10px] sm:text-xs font-bold text-orange-500 uppercase tracking-widest hidden xs:block">
                SERVICES & EXPERTISE
              </div>
              <h2 className="text-base sm:text-xl font-bold text-white font-syne">
                Tous mes services créatifs
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsAllServicesModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 scroll-smooth overscroll-contain">
          {/* Introduction Card */}
          <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20">
            <h3 className="text-sm sm:text-base font-bold text-white font-syne mb-1">
              Des prestations sur-mesure pour sublimer vos images
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Basé à Abidjan, j'accompagne les entreprises, agences, marques et créateurs de contenu dans la réalisation de vidéos impactantes. Chaque projet bénéficie d'un suivi personnalisé de la pré-production à l'export final.
            </p>
          </div>

          {/* 6 Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {detailedServices.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.id}
                  className="p-5 rounded-2xl bg-[#070b16] border border-slate-800/80 hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between group shadow-lg shadow-black/20"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 text-right">
                        {srv.category}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                        {srv.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      {srv.points.map((pt, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                      <Layers className="w-3 h-3 text-orange-400" />
                      <span>{srv.softwares}</span>
                    </div>
                    <button
                      onClick={() => handleOpenContact(srv.title)}
                      className="text-xs font-semibold text-orange-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Devis</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Workflow in 4 steps */}
          <div className="rounded-2xl bg-[#080d1a] border border-slate-800/90 p-5 sm:p-6 space-y-4">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Comment se déroule une collaboration ?</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="font-extrabold text-orange-500 text-sm mb-1">01. Briefing</div>
                <p className="text-slate-300">Échange sur vos objectifs, votre audience et transmission des rushes.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="font-extrabold text-orange-500 text-sm mb-1">02. Premier Cut</div>
                <p className="text-slate-300">Montage dynamique, dérushage et sélection de la direction musicale.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="font-extrabold text-orange-500 text-sm mb-1">03. Finition</div>
                <p className="text-slate-300">Colorimétrie, animations motion design, sound design et sous-titres.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="font-extrabold text-orange-500 text-sm mb-1">04. Livraison</div>
                <p className="text-slate-300">Ajustements selon vos retours et livraison des masters prêts à publier.</p>
              </div>
            </div>
          </div>

          <div className="h-4" />
        </div>

        {/* Sticky/Fixed Footer Bar */}
        <div className="shrink-0 p-4 sm:p-6 border-t border-slate-800 bg-[#090d1b] flex flex-col sm:flex-row items-center justify-between gap-3 z-10 shadow-2xl">
          <button
            onClick={() => setIsAllServicesModalOpen(false)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-orange-400" />
            <span>← RETOUR AU PORTFOLIO</span>
          </button>

          <button
            onClick={() => {
              setIsAllServicesModalOpen(false);
              setContactModalType('quote');
              setIsContactModalOpen(true);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-95"
          >
            <span>DEMANDER UN DEVIS POUR CES SERVICES</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
