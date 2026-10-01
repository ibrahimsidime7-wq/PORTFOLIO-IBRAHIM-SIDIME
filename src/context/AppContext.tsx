import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProfileData, Project, ClientMessage, PresentationVideo, AdminStats } from '../types';
import { initialProfile, initialProjects, initialMessages, initialPresentationVideo } from '../data/initialData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Navigation & Route
  currentRoute: string;
  navigate: (route: string) => void;

  // Authentication
  isAuthenticated: boolean;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;

  // Profile
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;

  // Presentation Video
  presentationVideo: PresentationVideo;
  updatePresentationVideo: (data: Partial<PresentationVideo>) => void;
  deletePresentationVideo: () => void;

  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  togglePublishProject: (id: string) => void;

  // Messages
  messages: ClientMessage[];
  addMessage: (msg: { name: string; email: string; phone?: string; projectType: string; message: string }) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;

  // Admin Tab Navigation
  activeAdminTab: 'dashboard' | 'projects' | 'media' | 'messages' | 'profile' | 'settings';
  setActiveAdminTab: (tab: 'dashboard' | 'projects' | 'media' | 'messages' | 'profile' | 'settings') => void;

  // Stats
  stats: AdminStats;

  // Project Modal for Public Viewer
  selectedProject: Project | null;
  setSelectedProject: (p: Project | null) => void;

  // Contact Modal
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  contactModalType: 'contact' | 'quote';
  setContactModalType: (type: 'contact' | 'quote') => void;

  // All Services Modal
  isAllServicesModalOpen: boolean;
  setIsAllServicesModalOpen: (open: boolean) => void;

  // All Projects Modal
  isAllProjectsModalOpen: boolean;
  setIsAllProjectsModalOpen: (open: boolean) => void;

  // Notification Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;

  // Reset to initial
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sync router with browser hash or path
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === '/admin' || hash === '/login') return hash;
    const path = window.location.pathname;
    if (path === '/admin' || path === '/login') return path;
    return '/';
  });

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ibrahim_admin_auth') === 'true';
  });

  // Profile Data
  const [profile, setProfile] = useState<ProfileData>(() => {
    try {
      const saved = localStorage.getItem('ibrahim_profile');
      return saved ? JSON.parse(saved) : initialProfile;
    } catch {
      return initialProfile;
    }
  });

  // Presentation Video
  const [presentationVideo, setPresentationVideo] = useState<PresentationVideo>(() => {
    try {
      const saved = localStorage.getItem('ibrahim_presentation_video');
      return saved ? JSON.parse(saved) : initialPresentationVideo;
    } catch {
      return initialPresentationVideo;
    }
  });

  // Projects
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('ibrahim_projects');
      return saved ? JSON.parse(saved) : initialProjects;
    } catch {
      return initialProjects;
    }
  });

  // Messages
  const [messages, setMessages] = useState<ClientMessage[]>(() => {
    try {
      const saved = localStorage.getItem('ibrahim_messages');
      return saved ? JSON.parse(saved) : initialMessages;
    } catch {
      return initialMessages;
    }
  });

  // Visitors count
  const [visitorCount, setVisitorCount] = useState<number>(() => {
    const saved = localStorage.getItem('ibrahim_visitors');
    const base = saved ? parseInt(saved, 10) : 1420;
    return isNaN(base) ? 1420 : base;
  });

  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'projects' | 'media' | 'messages' | 'profile' | 'settings'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactModalType, setContactModalType] = useState<'contact' | 'quote'>('contact');
  const [isAllServicesModalOpen, setIsAllServicesModalOpen] = useState(false);
  const [isAllProjectsModalOpen, setIsAllProjectsModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Track page visits
  useEffect(() => {
    const newCount = visitorCount + 1;
    setVisitorCount(newCount);
    localStorage.setItem('ibrahim_visitors', newCount.toString());
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

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Secure login logic
  const login = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (cleanEmail === 'ibrahimsidime7@gmail.com' && cleanPass === 'Khalil09') {
      setIsAuthenticated(true);
      localStorage.setItem('ibrahim_admin_auth', 'true');
      showToast('Connexion réussie ! Bienvenue Ibrahim.', 'success');
      navigate('/admin');
      return { success: true };
    }

    return {
      success: false,
      error: 'Identifiants invalides. Veuillez vérifier votre adresse e-mail et votre mot de passe.',
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ibrahim_admin_auth');
    showToast('Vous avez été déconnecté.', 'info');
    navigate('/login');
  };

  const updateProfile = (data: Partial<ProfileData>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem('ibrahim_profile', JSON.stringify(updated));
      return updated;
    });
    showToast('Profil mis à jour avec succès !', 'success');
  };

  const updatePresentationVideo = (data: Partial<PresentationVideo>) => {
    setPresentationVideo((prev) => {
      const updated = {
        ...prev,
        ...data,
        lastUpdated: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      };
      localStorage.setItem('ibrahim_presentation_video', JSON.stringify(updated));
      return updated;
    });
    showToast('Vidéo de présentation mise à jour !', 'success');
  };

  const deletePresentationVideo = () => {
    setPresentationVideo((prev) => {
      const updated = {
        ...prev,
        videoUrl: '',
        fileName: '',
        lastUpdated: 'Non définie',
      };
      localStorage.setItem('ibrahim_presentation_video', JSON.stringify(updated));
      return updated;
    });
    showToast('Vidéo de présentation supprimée.', 'info');
  };

  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProj: Project = {
      ...projectData,
      id: 'proj-' + Date.now(),
    };
    setProjects((prev) => {
      const updated = [newProj, ...prev];
      localStorage.setItem('ibrahim_projects', JSON.stringify(updated));
      return updated;
    });
    showToast(`Projet "${projectData.title}" créé avec succès !`, 'success');
  };

  const updateProject = (id: string, updatedFields: Partial<Project>) => {
    setProjects((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
      localStorage.setItem('ibrahim_projects', JSON.stringify(updated));
      return updated;
    });
    showToast('Projet modifié avec succès !', 'success');
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem('ibrahim_projects', JSON.stringify(updated));
      return updated;
    });
    showToast('Projet supprimé.', 'info');
  };

  const togglePublishProject = (id: string) => {
    setProjects((prev) => {
      const updated = prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === 'Publié' ? 'Brouillon' : 'Publié';
          showToast(`Projet passé en statut "${nextStatus}"`, 'info');
          return { ...p, status: nextStatus as 'Publié' | 'Brouillon' | 'Privé' };
        }
        return p;
      });
      localStorage.setItem('ibrahim_projects', JSON.stringify(updated));
      return updated;
    });
  };

  const addMessage = (msg: { name: string; email: string; phone?: string; projectType: string; message: string }) => {
    const newMsg: ClientMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      date: 'À l’instant',
      timestamp: Date.now(),
      unread: true,
    };
    setMessages((prev) => {
      const updated = [newMsg, ...prev];
      localStorage.setItem('ibrahim_messages', JSON.stringify(updated));
      return updated;
    });
    showToast('Votre message a bien été envoyé à Ibrahim !', 'success');
  };

  const markMessageRead = (id: string) => {
    setMessages((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, unread: false } : m));
      localStorage.setItem('ibrahim_messages', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      localStorage.setItem('ibrahim_messages', JSON.stringify(updated));
      return updated;
    });
    showToast('Message supprimé.', 'info');
  };

  const resetDemoData = () => {
    setProfile(initialProfile);
    setPresentationVideo(initialPresentationVideo);
    setProjects(initialProjects);
    setMessages(initialMessages);
    localStorage.removeItem('ibrahim_profile');
    localStorage.removeItem('ibrahim_presentation_video');
    localStorage.removeItem('ibrahim_projects');
    localStorage.removeItem('ibrahim_messages');
    showToast('Données réinitialisées aux valeurs par défaut !', 'info');
  };

  const stats: AdminStats = {
    totalProjects: projects.length,
    publishedVideos: projects.filter((p) => p.status === 'Publié').length + (presentationVideo.videoUrl ? 1 : 0),
    receivedMessages: messages.length,
    visitorCount,
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigate,
        isAuthenticated,
        login,
        logout,
        profile,
        updateProfile,
        presentationVideo,
        updatePresentationVideo,
        deletePresentationVideo,
        projects,
        addProject,
        updateProject,
        deleteProject,
        togglePublishProject,
        messages,
        addMessage,
        markMessageRead,
        deleteMessage,
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
