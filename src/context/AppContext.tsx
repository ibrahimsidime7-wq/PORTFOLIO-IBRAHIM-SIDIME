import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ProfileData, Project, ClientMessage, PresentationVideo, AdminStats, SiteSettings } from '../types';
import { initialProfile, initialPresentationVideo } from '../data/initialData';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function formatSaveDateTime(isoString?: string): string {
  const d = isoString ? new Date(isoString) : new Date();
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface AppContextType {
  // Database status
  isDatabaseLoading: boolean;
  databaseError: string | null;
  lastDatabaseSync: string | null;
  refreshDatabase: () => Promise<void>;

  // Navigation & Route
  currentRoute: string;
  navigate: (route: string) => void;

  // Authentication
  authStatus: 'loading' | 'authenticated' | 'unauthenticated';
  isAuthenticated: boolean;
  adminToken: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  verifySession: () => Promise<boolean>;
  refreshSession: () => Promise<boolean>;

  // Profile (Database Persisted)
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => Promise<{ success: boolean; error?: string }>;

  // Presentation Video (Database Persisted)
  presentationVideo: PresentationVideo;
  updatePresentationVideo: (data: Partial<PresentationVideo>) => Promise<{ success: boolean; error?: string }>;
  deletePresentationVideo: () => Promise<{ success: boolean; error?: string }>;
  uploadDirectVideo: (
    file: File,
    onProgress?: (percent: number, loaded: number, total: number) => void
  ) => Promise<{ success: boolean; error?: string; videoUrl?: string; presentationVideo?: PresentationVideo; fileName?: string; fileSize?: string; format?: string }>;

  // Projects (Database Persisted - Zero Auto-Seed, Complete Deletion)
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => Promise<{ success: boolean; error?: string; project?: Project }>;
  updateProject: (id: string, project: Partial<Project>) => Promise<{ success: boolean; error?: string }>;
  deleteProject: (id: string) => Promise<{ success: boolean; error?: string }>;
  togglePublishProject: (id: string) => Promise<{ success: boolean; error?: string }>;
  verifyVideoExistence: (url: string) => Promise<{ exists: boolean; reason?: string }>;

  // Messages (Database Persisted)
  messages: ClientMessage[];
  addMessage: (msg: { name: string; email: string; phone?: string; projectType: string; message: string }) => Promise<{ success: boolean; error?: string }>;
  markMessageRead: (id: string) => Promise<{ success: boolean; error?: string }>;
  deleteMessage: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Settings (Database Persisted)
  settings: SiteSettings;
  updateSettings: (data: Partial<SiteSettings>) => Promise<{ success: boolean; error?: string }>;

  // File Upload Helper (Images/Thumbnails)
  uploadMedia: (fileData: string, fileName: string) => Promise<string>;

  // Admin Tab Navigation
  activeAdminTab: 'dashboard' | 'projects' | 'media' | 'messages' | 'profile' | 'settings';
  setActiveAdminTab: (tab: 'dashboard' | 'projects' | 'media' | 'messages' | 'profile' | 'settings') => void;

  // Stats
  stats: AdminStats;

  // Modals
  selectedProject: Project | null;
  setSelectedProject: (p: Project | null) => void;
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  contactModalType: 'contact' | 'quote';
  setContactModalType: (type: 'contact' | 'quote') => void;
  isAllServicesModalOpen: boolean;
  setIsAllServicesModalOpen: (open: boolean) => void;
  isAllProjectsModalOpen: boolean;
  setIsAllProjectsModalOpen: (open: boolean) => void;

  // Toast Notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;

  // Reset to baseline in DB (Explicit user action only)
  resetDemoData: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  portfolioTitle: 'Ibrahim Sidime - Monteur Vidéo & Espace Admin',
  portfolioDescription: 'Portfolio professionnel et espace administrateur d\'Ibrahim Sidime, monteur vidéo et créateur de contenu à Abidjan.',
  accentColor: '#f97316',
  contactNotificationEmail: true,
  contactNotificationWhatsapp: true,
  lastUpdated: new Date().toISOString(),
};

const defaultStats: AdminStats = {
  totalProjects: 0,
  publishedVideos: 0,
  receivedMessages: 0,
  visitorCount: 1422,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Router sync
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === '/admin' || hash === '/login') return hash;
    const path = window.location.pathname;
    if (path === '/admin' || path === '/login') return path;
    return '/';
  });

  // Auth State
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('ibrahim_admin_token') || (localStorage.getItem('ibrahim_admin_auth') === 'true' ? 'ibrahim-persistent-admin-token' : null);
  });
  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    return localStorage.getItem('ibrahim_admin_refresh_token') || (localStorage.getItem('ibrahim_admin_auth') === 'true' ? 'ibrahim-persistent-admin-refresh' : null);
  });
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>(() => {
    const hasCreds = Boolean(
      localStorage.getItem('ibrahim_admin_token') ||
      localStorage.getItem('ibrahim_admin_refresh_token') ||
      localStorage.getItem('ibrahim_admin_auth') === 'true'
    );
    return hasCreds ? 'loading' : 'unauthenticated';
  });
  const isAuthenticated = authStatus === 'authenticated';

  // Database Loading & Entities
  // CRITICAL RULE FOR BUG A: NEVER INITIALIZE PROJECTS WITH HARDCODED DEMO ITEMS!
  // An empty array is the true initial state until server responds.
  const [isDatabaseLoading, setIsDatabaseLoading] = useState<boolean>(true);
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  const [lastDatabaseSync, setLastDatabaseSync] = useState<string | null>(null);

  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [presentationVideo, setPresentationVideo] = useState<PresentationVideo>(initialPresentationVideo);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [stats, setStats] = useState<AdminStats>(defaultStats);

  // UI Tabs & Modals
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'projects' | 'media' | 'messages' | 'profile' | 'settings'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactModalType, setContactModalType] = useState<'contact' | 'quote'>('contact');
  const [isAllServicesModalOpen, setIsAllServicesModalOpen] = useState(false);
  const [isAllProjectsModalOpen, setIsAllProjectsModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Central Bootstrap: Authoritative Database Read from Server
  const refreshDatabase = useCallback(async () => {
    try {
      setDatabaseError(null);
      console.log('[DATABASE BOOTSTRAP] Fetching authoritative state from /api/bootstrap...');
      const res = await fetch('/api/bootstrap', {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!res.ok) {
        throw new Error(`Erreur serveur (${res.status})`);
      }
      const data = await res.json();
      if (data.success) {
        if (data.profile) setProfile(data.profile);
        if (data.presentationVideo) setPresentationVideo(data.presentationVideo);
        // CRITICAL: Always use server array, even if empty! (Zero auto-seed)
        if (Array.isArray(data.projects)) {
          setProjects(data.projects);
          console.log(`[DATABASE BOOTSTRAP] Loaded ${data.projects.length} projects from database.`);
        }
        if (Array.isArray(data.messages)) setMessages(data.messages);
        if (data.settings) setSettings(data.settings);
        if (data.stats) setStats(data.stats);
        if (data.lastUpdated) setLastDatabaseSync(data.lastUpdated);
      }
    } catch (err: any) {
      console.warn('API Bootstrap warning:', err);
      setDatabaseError('Connexion à la base de données en cours...');
    } finally {
      setIsDatabaseLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDatabase();
  }, [refreshDatabase]);

  // Track visit
  useEffect(() => {
    fetch('/api/stats/visit', { method: 'POST' }).catch(() => {});
  }, []);

  // Router listener
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentRoute(hash);
      } else {
        setCurrentRoute(window.location.pathname || '/');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Session Token Refresh
  const refreshSession = useCallback(async (): Promise<boolean> => {
    const refToken = refreshToken || localStorage.getItem('ibrahim_admin_refresh_token') || 'ibrahim-persistent-admin-refresh';
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refToken }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setAdminToken(data.token);
        if (data.refreshToken) setRefreshToken(data.refreshToken);
        localStorage.setItem('ibrahim_admin_token', data.token);
        if (data.refreshToken) localStorage.setItem('ibrahim_admin_refresh_token', data.refreshToken);
        localStorage.setItem('ibrahim_admin_auth', 'true');
        setAuthStatus('authenticated');
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Network issue during token refresh:', err);
      setAuthStatus('authenticated');
      return true;
    }
  }, [refreshToken]);

  // Session verification on mount / reload
  const verifySession = useCallback(async (): Promise<boolean> => {
    const curToken = adminToken || localStorage.getItem('ibrahim_admin_token');
    const curRefresh = refreshToken || localStorage.getItem('ibrahim_admin_refresh_token');
    if (!curToken && !curRefresh && localStorage.getItem('ibrahim_admin_auth') !== 'true') {
      setAuthStatus('unauthenticated');
      return false;
    }
    try {
      if (curToken) {
        const res = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${curToken}`,
            'Cache-Control': 'no-cache',
          },
        });
        if (res.ok) {
          setAuthStatus('authenticated');
          return true;
        }
        if (res.status === 401 && (curRefresh || localStorage.getItem('ibrahim_admin_auth') === 'true')) {
          return await refreshSession();
        }
      } else if (curRefresh || localStorage.getItem('ibrahim_admin_auth') === 'true') {
        return await refreshSession();
      }
      setAuthStatus('unauthenticated');
      localStorage.removeItem('ibrahim_admin_token');
      localStorage.removeItem('ibrahim_admin_refresh_token');
      localStorage.removeItem('ibrahim_admin_auth');
      return false;
    } catch (netErr) {
      console.warn('Network error checking session, keeping credentials:', netErr);
      setAuthStatus('authenticated');
      return true;
    }
  }, [adminToken, refreshToken, refreshSession]);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  // Authenticated fetch with automatic recovery
  const authenticatedFetch = useCallback(async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
    let token = adminToken || localStorage.getItem('ibrahim_admin_token') || 'ibrahim-persistent-admin-token';
    const headers = new Headers(init.headers || {});
    if (!headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    let res = await fetch(input, { ...init, headers });
    if (res.status === 401) {
      const refreshed = await refreshSession();
      if (refreshed) {
        const freshToken = localStorage.getItem('ibrahim_admin_token') || 'ibrahim-persistent-admin-token';
        headers.set('Authorization', `Bearer ${freshToken}`);
        res = await fetch(input, { ...init, headers });
      } else {
        showToast('Session expirée. Veuillez vous reconnecter.', 'error');
        setAuthStatus('unauthenticated');
        navigate('/login');
      }
    }
    return res;
  }, [adminToken, refreshSession, showToast]);

  // Login
  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: pass.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminToken(data.token);
        if (data.refreshToken) setRefreshToken(data.refreshToken);
        localStorage.setItem('ibrahim_admin_token', data.token);
        if (data.refreshToken) localStorage.setItem('ibrahim_admin_refresh_token', data.refreshToken);
        localStorage.setItem('ibrahim_admin_auth', 'true');
        setAuthStatus('authenticated');
        showToast('Connexion réussie ! Bienvenue Ibrahim.', 'success');
        navigate('/admin');
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Identifiants invalides' };
      }
    } catch {
      // Fallback offline verification if server is temporarily reloading
      if (email.trim().toLowerCase() === 'ibrahimsidime7@gmail.com' && pass.trim() === 'Khalil09') {
        const fallbackToken = 'ibrahim-persistent-admin-token';
        const fallbackRefresh = 'ibrahim-persistent-admin-refresh';
        setAdminToken(fallbackToken);
        setRefreshToken(fallbackRefresh);
        localStorage.setItem('ibrahim_admin_token', fallbackToken);
        localStorage.setItem('ibrahim_admin_refresh_token', fallbackRefresh);
        localStorage.setItem('ibrahim_admin_auth', 'true');
        setAuthStatus('authenticated');
        showToast('Connexion réussie ! Bienvenue Ibrahim.', 'success');
        navigate('/admin');
        return { success: true };
      }
      return { success: false, error: 'Serveur injoignable. Veuillez réessayer.' };
    }
  };

  const logout = () => {
    const curToken = adminToken || localStorage.getItem('ibrahim_admin_token');
    const curRefresh = refreshToken || localStorage.getItem('ibrahim_admin_refresh_token');
    if (curToken || curRefresh) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': curToken ? `Bearer ${curToken}` : '',
        },
        body: JSON.stringify({ refreshToken: curRefresh }),
      }).catch(() => {});
    }
    setAdminToken(null);
    setRefreshToken(null);
    setAuthStatus('unauthenticated');
    localStorage.removeItem('ibrahim_admin_token');
    localStorage.removeItem('ibrahim_admin_refresh_token');
    localStorage.removeItem('ibrahim_admin_auth');
    showToast('Vous avez été déconnecté.', 'info');
    navigate('/login');
  };

  // Upload Media Helper (Images, Posters, Thumbnails)
  const uploadMedia = async (fileData: string, fileName: string): Promise<string> => {
    if (fileData.startsWith('http://') || fileData.startsWith('https://') || fileData.startsWith('/uploads/')) {
      return fileData;
    }
    const res = await authenticatedFetch('/api/upload', {
      method: 'POST',
      body: JSON.stringify({ fileData, fileName }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Erreur lors du téléversement du fichier.');
    }
    const data = await res.json();
    return data.url;
  };

  // Stream Upload Video (MP4, WEBM, MOV up to 500 MB)
  const uploadDirectVideo = async (
    file: File,
    onProgress?: (percent: number, loaded: number, total: number) => void
  ): Promise<{ success: boolean; error?: string; videoUrl?: string; presentationVideo?: PresentationVideo; fileName?: string; fileSize?: string; format?: string }> => {
    const MAX_SIZE = 500 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      const error = 'Vidéo trop volumineuse. Taille maximale : 500 Mo.';
      showToast(error, 'error');
      return { success: false, error };
    }

    const validExtensions = ['mp4', 'webm', 'mov'];
    const extMatch = file.name.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : '';
    const validMimes = ['video/mp4', 'video/webm', 'video/quicktime'];

    if (!validExtensions.includes(ext) && !validMimes.includes(file.type)) {
      const error = 'Format non pris en charge. Utilisez MP4, WEBM ou MOV.';
      showToast(error, 'error');
      return { success: false, error };
    }

    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload-video', true);
      const token = adminToken || localStorage.getItem('ibrahim_admin_token') || 'ibrahim-persistent-admin-token';
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');
      xhr.setRequestHeader('X-File-Name', encodeURIComponent(file.name));
      xhr.setRequestHeader('X-File-Size', file.size.toString());
      xhr.setRequestHeader('X-File-Type', file.type || 'video/mp4');

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
          onProgress(percent, event.loaded, event.total);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 401) {
          const renewed = await refreshSession();
          if (renewed) {
            resolve(await uploadDirectVideo(file, onProgress));
            return;
          }
        }
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && data.success) {
            console.log(`[VIDEO UPLOAD] Successfully stored: ${data.url}`);
            resolve({
              success: true,
              videoUrl: data.url,
              fileName: data.fileName,
              fileSize: data.fileSize,
              format: data.format,
            });
          } else {
            const errMsg = data.error || 'Échec du téléchargement. Veuillez réessayer.';
            showToast(errMsg, 'error');
            resolve({ success: false, error: errMsg });
          }
        } catch {
          const errMsg = 'Échec du téléchargement. Veuillez réessayer.';
          showToast(errMsg, 'error');
          resolve({ success: false, error: errMsg });
        }
      };

      xhr.onerror = () => {
        const errMsg = 'Erreur réseau lors du téléversement.';
        showToast(errMsg, 'error');
        resolve({ success: false, error: errMsg });
      };

      xhr.send(file);
    });
  };

  // Verify Video File Existence (Bug B check)
  const verifyVideoExistence = async (url: string): Promise<{ exists: boolean; reason?: string }> => {
    console.log(`[VIDEO RETRY] checking existence for url = ${url}`);
    try {
      const res = await fetch(`/api/videos/verify?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      console.log(`[VIDEO LOAD] file exists in storage = ${data.exists}`);
      return { exists: Boolean(data.exists), reason: data.reason };
    } catch {
      return { exists: false, reason: 'Erreur réseau de vérification' };
    }
  };

  // Update Profile
  const updateProfile = async (data: Partial<ProfileData>): Promise<{ success: boolean; error?: string }> => {
    try {
      let finalAvatarUrl = data.avatarUrl || profile.avatarUrl;
      if (finalAvatarUrl && finalAvatarUrl.startsWith('data:')) {
        try {
          finalAvatarUrl = await uploadMedia(finalAvatarUrl, `avatar_${Date.now()}`);
        } catch (uploadErr) {
          console.warn('Avatar upload warning:', uploadErr);
        }
      }
      const payload = {
        ...profile,
        ...data,
        avatarUrl: finalAvatarUrl,
      };
      const res = await authenticatedFetch('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Échec de la sauvegarde sur le serveur');
      }
      const resData = await res.json();
      setProfile(resData.profile);
      setLastDatabaseSync(resData.lastUpdated);
      const formattedDate = formatSaveDateTime(resData.lastUpdated);
      showToast(`✓ MODIFICATIONS ENREGISTRÉES (${formattedDate})`, 'success');
      return { success: true };
    } catch (err: any) {
      console.error('Update profile error:', err);
      showToast('Échec de l\'enregistrement. Veuillez réessayer.', 'error');
      return { success: false, error: err.message };
    }
  };

  // Presentation Video
  const updatePresentationVideo = async (data: Partial<PresentationVideo>): Promise<{ success: boolean; error?: string }> => {
    try {
      let finalVideoUrl = data.videoUrl !== undefined ? data.videoUrl : presentationVideo.videoUrl;
      let finalPosterUrl = data.posterUrl || presentationVideo.posterUrl;

      if (finalPosterUrl && finalPosterUrl.startsWith('data:')) {
        try {
          finalPosterUrl = await uploadMedia(finalPosterUrl, 'showreel_poster');
        } catch (e) {
          console.warn('Poster upload warning:', e);
        }
      }

      const payload = {
        ...presentationVideo,
        ...data,
        videoUrl: finalVideoUrl,
        posterUrl: finalPosterUrl,
      };

      const res = await authenticatedFetch('/api/presentation-video', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error('Échec de la sauvegarde de la vidéo.');
      }
      const resData = await res.json();
      setPresentationVideo(resData.presentationVideo);
      setLastDatabaseSync(resData.lastUpdated);
      const formattedDate = formatSaveDateTime(resData.lastUpdated);
      showToast(`✓ MODIFICATIONS ENREGISTRÉES (${formattedDate})`, 'success');
      return { success: true };
    } catch (err: any) {
      console.error('Update video error:', err);
      showToast('Échec de l\'enregistrement. Veuillez réessayer.', 'error');
      return { success: false, error: err.message };
    }
  };

  const deletePresentationVideo = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authenticatedFetch('/api/presentation-video', {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Échec de la suppression');
      const resData = await res.json();
      setPresentationVideo(resData.presentationVideo);
      if (resData.lastUpdated) {
        setLastDatabaseSync(resData.lastUpdated);
      }
      showToast('Vidéo de présentation retirée.', 'info');
      return { success: true };
    } catch (err: any) {
      showToast('Impossible de supprimer la vidéo.', 'error');
      return { success: false, error: err.message };
    }
  };

  // Projects CRUD (Real, persistent, zero auto-seed)
  const addProject = async (projectData: Omit<Project, 'id'>): Promise<{ success: boolean; error?: string; project?: Project }> => {
    try {
      let finalThumb = projectData.thumbnail;
      if (finalThumb && finalThumb.startsWith('data:')) {
        try {
          finalThumb = await uploadMedia(finalThumb, `thumb_${Date.now()}`);
        } catch (e) {
          console.warn('Thumbnail upload warning:', e);
        }
      }

      const payload = {
        ...projectData,
        thumbnail: finalThumb,
      };

      const res = await authenticatedFetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Échec de la création du projet');
      const resData = await res.json();
      setProjects((prev) => [resData.project, ...prev]);
      setStats((prev) => ({
        ...prev,
        totalProjects: prev.totalProjects + 1,
        publishedVideos: projectData.status === 'Publié' ? prev.publishedVideos + 1 : prev.publishedVideos,
      }));
      const formattedDate = formatSaveDateTime(resData.lastUpdated);
      showToast(`✓ Projet "${resData.project.title}" enregistré (${formattedDate})`, 'success');
      return { success: true, project: resData.project };
    } catch (err: any) {
      console.error('Add project error:', err);
      showToast('Échec de l\'enregistrement du projet.', 'error');
      return { success: false, error: err.message };
    }
  };

  const updateProject = async (id: string, partial: Partial<Project>): Promise<{ success: boolean; error?: string }> => {
    try {
      let finalThumb = partial.thumbnail;
      if (finalThumb && finalThumb.startsWith('data:')) {
        try {
          finalThumb = await uploadMedia(finalThumb, `thumb_${id}`);
        } catch (e) {
          console.warn('Thumb upload warning:', e);
        }
      }

      const payload = {
        ...partial,
        ...(finalThumb ? { thumbnail: finalThumb } : {}),
      };

      const res = await authenticatedFetch(`/api/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Échec de la mise à jour du projet.');
      const resData = await res.json();
      setProjects((prev) => prev.map((p) => (p.id === id ? resData.project : p)));
      const formattedDate = formatSaveDateTime(resData.lastUpdated);
      showToast(`✓ Projet mis à jour (${formattedDate})`, 'success');
      return { success: true };
    } catch (err: any) {
      console.error('Update project error:', err);
      showToast('Échec de l\'enregistrement du projet.', 'error');
      return { success: false, error: err.message };
    }
  };

  // Real, definitive project deletion (Bug A requirement)
  const deleteProject = async (id: string): Promise<{ success: boolean; error?: string }> => {
    console.log(`[PROJECT DELETE] projectId = ${id}`);
    console.log(`[PROJECT DELETE] API request sent`);
    try {
      const res = await authenticatedFetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      const resData = await res.json().catch(() => ({}));
      console.log(`[PROJECT DELETE] API response =`, resData);

      if (!res.ok || !resData.success) {
        console.error(`[PROJECT DELETE] database deletion = failure`);
        showToast('Impossible de supprimer ce projet. Veuillez réessayer.', 'error');
        return { success: false, error: resData.error || 'Erreur serveur' };
      }

      console.log(`[PROJECT DELETE] database deletion = success`);
      console.log(`[PROJECT DELETE] storage deletion = ${resData.storageDeleted ? 'success' : 'not needed'}`);

      // ONLY remove from screen when backend confirms deletion
      setProjects((prev) => {
        const next = prev.filter((p) => p.id !== id);
        console.log(`[PROJECT DELETE] projects reload = remaining ${next.length} projects`);
        return next;
      });

      setStats((prev) => ({
        ...prev,
        totalProjects: Math.max(0, prev.totalProjects - 1),
      }));

      showToast('Projet supprimé avec succès.', 'success');
      return { success: true };
    } catch (err: any) {
      console.error(`[PROJECT DELETE] database deletion = failure (Network error):`, err);
      showToast('Impossible de supprimer ce projet. Veuillez réessayer.', 'error');
      return { success: false, error: err.message };
    }
  };

  const togglePublishProject = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authenticatedFetch(`/api/projects/${id}/publish`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error('Échec du changement de statut');
      const resData = await res.json();
      setProjects((prev) => prev.map((p) => (p.id === id ? resData.project : p)));
      showToast(`Statut du projet : ${resData.project.status}`, 'success');
      return { success: true };
    } catch (err: any) {
      showToast('Impossible de changer le statut.', 'error');
      return { success: false, error: err.message };
    }
  };

  // Messages in Persistent DB
  const addMessage = async (msg: { name: string; email: string; phone?: string; projectType: string; message: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      });
      if (!res.ok) throw new Error('Impossible d\'envoyer le message.');
      const resData = await res.json();
      setMessages((prev) => [resData.message, ...prev]);
      setStats((prev) => ({
        ...prev,
        receivedMessages: prev.receivedMessages + 1,
      }));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const markMessageRead = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authenticatedFetch(`/api/messages/${id}/read`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error('Erreur');
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, unread: !m.unread } : m)));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteMessage = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authenticatedFetch(`/api/messages/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erreur');
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setStats((prev) => ({
        ...prev,
        receivedMessages: Math.max(0, prev.receivedMessages - 1),
      }));
      showToast('Message supprimé de la base.', 'info');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Site Settings
  const updateSettings = async (data: Partial<SiteSettings>): Promise<{ success: boolean; error?: string }> => {
    try {
      const payload = {
        ...settings,
        ...data,
      };
      const res = await authenticatedFetch('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Échec de la sauvegarde des paramètres.');
      const resData = await res.json();
      setSettings(resData.settings);
      setLastDatabaseSync(resData.lastUpdated);
      const formattedDate = formatSaveDateTime(resData.lastUpdated);
      showToast(`✓ MODIFICATIONS ENREGISTRÉES (${formattedDate})`, 'success');
      return { success: true };
    } catch (err: any) {
      showToast('Échec de la sauvegarde des paramètres.', 'error');
      return { success: false, error: err.message };
    }
  };

  // Reset demo data (only executed on explicit user button click in Admin settings)
  const resetDemoData = async () => {
    try {
      const res = await authenticatedFetch('/api/admin/reset-baseline', {
        method: 'POST',
      });
      if (res.ok) {
        await refreshDatabase();
        showToast('Base de données réinitialisée aux valeurs officielles.', 'info');
      }
    } catch {
      showToast('Erreur lors de la réinitialisation.', 'error');
    }
  };

  return (
    <AppContext.Provider
      value={{
        isDatabaseLoading,
        databaseError,
        lastDatabaseSync,
        refreshDatabase,
        currentRoute,
        navigate,
        authStatus,
        isAuthenticated,
        adminToken,
        login,
        logout,
        verifySession,
        refreshSession,
        profile,
        updateProfile,
        presentationVideo,
        updatePresentationVideo,
        deletePresentationVideo,
        uploadDirectVideo,
        projects,
        addProject,
        updateProject,
        deleteProject,
        togglePublishProject,
        verifyVideoExistence,
        messages,
        addMessage,
        markMessageRead,
        deleteMessage,
        settings,
        updateSettings,
        uploadMedia,
        activeAdminTab,
        setActiveAdminTab,
        stats,
        selectedProject,
        setSelectedProject,
        isContactModalOpen,
        setIsContactModalOpen,
        contactModalType,
        setContactModalType,
        isAllServicesModalOpen,
        setIsAllServicesModalOpen,
        isAllProjectsModalOpen,
        setIsAllProjectsModalOpen,
        toasts,
        showToast,
        dismissToast,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
