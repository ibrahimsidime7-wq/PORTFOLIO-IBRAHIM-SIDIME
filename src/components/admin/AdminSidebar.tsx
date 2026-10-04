import React from 'react';
import { Logo } from '../common/Logo';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Film, 
  Image as ImageIcon, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut,
  ExternalLink,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { 
    activeAdminTab, 
    setActiveAdminTab, 
    logout, 
    navigate, 
    messages,
    profile 
  } = useApp();

  const unreadCount = messages.filter((m) => m.unread).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      emoji: '📊',
    },
    {
      id: 'projects',
      label: 'Projets',
      icon: Film,
      emoji: '🎬',
    },
    {
      id: 'media',
      label: 'Médias',
      icon: ImageIcon,
      emoji: '🎥',
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      emoji: '✉️',
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      id: 'profile',
      label: 'Mon profil',
      icon: User,
      emoji: '👤',
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      emoji: '⚙️',
    },
  ];

  const handleSelectTab = (tab: any) => {
    setActiveAdminTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 h-full max-h-screen bg-[#080c18] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sticky Top Header & Logo */}
        <div className="shrink-0 p-5 sm:p-6 border-b border-slate-800/80 flex items-center justify-between bg-[#080c18]">
          <Logo onClick={() => navigate('/')} size="sm" />
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Middle Container: Profile & Navigation Items */}
        <div className="flex-1 overflow-y-auto overscroll-contain scroll-smooth py-1 scrollbar-thin scrollbar-thumb-slate-800">
          {/* Quick Profile Snapshot */}
          <div className="px-5 py-4 border-b border-slate-800/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-orange-500 overflow-hidden bg-slate-900 shrink-0 shadow-sm">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="overflow-hidden min-w-0">
              <div className="text-xs font-bold text-white truncate">{profile.name}</div>
              <div className="text-[10px] text-orange-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="truncate">Administrateur</span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3.5 space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeAdminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-[#0f1629]'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="text-base shrink-0">{item.emoji}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                        isActive
                          ? 'bg-white text-orange-600'
                          : 'bg-orange-500 text-white animate-pulse'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: View Site & Logout */}
        <div className="shrink-0 p-4 border-t border-slate-800/80 space-y-2 bg-[#080c18]">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group"
          >
            <span className="flex items-center gap-2">
              <span className="text-sm">🌐</span>
              <span>Voir le portfolio</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-400 transition-colors" />
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-white bg-red-950/20 hover:bg-red-600 border border-red-500/30 hover:border-red-600 transition-all duration-200 cursor-pointer shadow-sm group"
          >
            <span className="flex items-center gap-2.5">
              <span className="text-base group-hover:scale-110 transition-transform">🚪</span>
              <span className="tracking-wide uppercase">Déconnexion</span>
            </span>
            <LogOut className="w-3.5 h-3.5 text-red-400 group-hover:text-white transition-colors" />
          </button>
        </div>
      </aside>
    </>
  );
};
