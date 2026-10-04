import { ProfileData, Project, ClientMessage, PresentationVideo } from '../types';

export const initialProfile: ProfileData = {
  name: 'Ibrahim Sidime',
  title: 'MONTEUR VIDÉO & CRÉATEUR DE CONTENU',
  tagline: 'BIENVENUE SUR MON PORTFOLIO',
  bio: 'Je transforme vos idées en vidéos modernes, dynamiques et captivantes avec une précision cinématographique. Passionné par l\'image, le montage et le sound design, je donne vie à vos projets.',
  aboutFull: 'Je suis Ibrahim Sidime, monteur vidéo et créateur de contenu passionné par l\'image, le montage et la création visuelle.\n\nBasé à Abidjan en Côte d\'Ivoire, mon objectif est de transformer chaque idée en une vidéo claire, dynamique et adaptée à son public. Du spot publicitaire de haute volée aux formats verticaux viraux pour les réseaux sociaux, j\'apporte un soin maniaque au rythme, à la colorimétrie et au sound design.',
  phone: '07 12 42 16 89',
  email: 'ibrahimsidime7@gmail.com',
  location: 'Abidjan, Côte d\'Ivoire',
  avatarUrl: '/uploads/ibrahim_portrait.jpg',
  socials: {
    tiktok: 'https://tiktok.com/@ibrahim_sidime',
    instagram: 'https://instagram.com/ibrahim_sidime',
    facebook: 'https://facebook.com/ibrahim.sidime',
    youtube: 'https://youtube.com/@ibrahimsidime',
    linkedin: 'https://linkedin.com/in/ibrahim-sidime',
  },
};

export const initialPresentationVideo: PresentationVideo = {
  title: 'SHOWREEL OFFICIEL 2026',
  subtitle: 'Découvrez mon univers créatif en 30 secondes.',
  videoUrl: '/uploads/videos/ibrahim_showreel.mp4',
  posterUrl: '/uploads/video_studio_poster.jpg',
  duration: '0:30',
  fileName: 'ibrahim_showreel_master.mp4',
  lastUpdated: '2 oct. 2026',
  fileSize: '496 Ko',
  format: 'MP4',
};

// Note: These baseline projects are only used when explicitly requested via "Réinitialiser la base" in Admin.
// They are NEVER automatically re-injected on page reload or when projects are deleted!
export const baselineProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Publicité Commerciale Horizon',
    category: 'Publicité',
    description: 'Spot publicitaire cinématographique tourné et étalonné pour le lancement d\'une nouvelle marque urbaine. Rendu immersif, sound design soigné.',
    client: 'Marque Horizon',
    date: '2026-09-20',
    duration: '30s',
    thumbnail: '/uploads/thumb_publicite.jpg',
    videoUrl: '/uploads/videos/proj_horizon.mp4',
    softwares: ['Premiere Pro', 'DaVinci Resolve', 'Soundly'],
    status: 'Publié',
  },
  {
    id: 'proj-2',
    title: 'Showreel Studio Créatif',
    category: 'Montage vidéo',
    description: 'Montage ultra rythmé regroupant les meilleurs plans de production studio. Color grading poussé et découpage précis sur le beat.',
    client: 'Studio Nova',
    date: '2026-09-14',
    duration: '45s',
    thumbnail: '/uploads/thumb_montage.jpg',
    videoUrl: '/uploads/videos/proj_studio_nova.mp4',
    softwares: ['Premiere Pro', 'After Effects'],
    status: 'Publié',
  },
  {
    id: 'proj-3',
    title: 'Série Reels & TikTok Impact',
    category: 'Réseaux sociaux',
    description: 'Format vertical 9:16 avec hooks percutants dans les 3 premières secondes, sous-titres animés multilingues et effets de zoom dynamiques.',
    client: 'Créateur & Marque Food',
    date: '2026-08-30',
    duration: '15s',
    thumbnail: '/uploads/thumb_social.jpg',
    videoUrl: '/uploads/videos/proj_reels_tiktok.mp4',
    softwares: ['Premiere Pro', 'CapCut Pro'],
    status: 'Publié',
  },
  {
    id: 'proj-4',
    title: 'Identité Visuelle & Motion 3D',
    category: 'Motion design',
    description: 'Animations graphiques futuristes, typographie cinétique "Ideas Create Impact" et logo reveal en néon 3D pour conférence tech.',
    client: 'Impact Tech Summit',
    date: '2026-08-18',
    duration: '20s',
    thumbnail: '/uploads/thumb_motion.jpg',
    videoUrl: '/uploads/videos/proj_motion_3d.mp4',
    softwares: ['After Effects', 'Blender', 'Illustrator'],
    status: 'Publié',
  },
];

export const initialMessages: ClientMessage[] = [
  {
    id: 'msg-1',
    name: 'Jean Kouassi',
    email: 'jean.kouassi@creative.ci',
    phone: '07 08 90 12 34',
    projectType: 'Montage vidéo',
    message: 'Bonjour Ibrahim, j\'ai découvert votre portfolio et j\'adore votre style dynamique. Nous avons 5 vidéos d\'interview et 10 formats courts pour TikTok à monter ce mois-ci. Quels sont vos tarifs et disponibilités ?',
    date: 'Il y a 2 heures',
    timestamp: Date.now() - 7200000,
    unread: true,
  },
  {
    id: 'msg-2',
    name: 'Awa Diop',
    email: 'awa.diop@brandagency.ci',
    phone: '05 44 22 11 00',
    projectType: 'Publicité',
    message: 'Bonjour M. Sidime, nous préparons le lancement d\'une campagne publicitaire pour une marque panafricaine à Abidjan. Votre profil correspond exactement à notre vision. Pouvons-nous caler un appel téléphonique ?',
    date: 'Hier à 16:45',
    timestamp: Date.now() - 86400000,
    unread: false,
  },
];
