export interface Project {
  id: string;
  title: string;
  category: 'Publicité' | 'Montage vidéo' | 'Motion design' | 'Réseaux sociaux' | 'Documentaire' | 'Clip musical';
  description: string;
  client: string;
  date: string;
  duration: string;
  thumbnail: string;
  videoUrl?: string;
  videoFileName?: string;
  videoFileSize?: string;
  softwares: string[];
  status: 'Publié' | 'Brouillon' | 'Privé';
  updatedAt?: string;
}

export interface ClientMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  message: string;
  date: string;
  timestamp: number;
  unread: boolean;
}

export interface ProfileData {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  aboutFull: string;
  phone: string;
  email: string;
  location: string;
  avatarUrl: string;
  lastUpdated?: string;
  socials: {
    tiktok: string;
    instagram: string;
    facebook: string;
    youtube: string;
    linkedin: string;
  };
}

export interface PresentationVideo {
  title: string;
  subtitle: string;
  videoUrl: string;
  posterUrl: string;
  duration: string;
  fileName?: string;
  fileSize?: string;
  format?: string;
  lastUpdated?: string;
}

export interface SiteSettings {
  portfolioTitle: string;
  portfolioDescription: string;
  accentColor: string;
  contactNotificationEmail: boolean;
  contactNotificationWhatsapp: boolean;
  lastUpdated?: string;
}

export interface AdminStats {
  totalProjects: number;
  publishedVideos: number;
  receivedMessages: number;
  visitorCount: number;
}
