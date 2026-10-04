import React from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, ExternalLink, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleMobileMenu }) => {
  const { navigate, profile, logout } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-[#070a14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Left Greeting & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white font-syne flex items-center gap-2">
            <span>BONJOUR IBRAHIM</span>
            <span className="text-xl">👋</span>
          </h1>
          <p className="text-xs text-slate-400">
            Bienvenue dans votre espace de gestion.
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-white text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm"
        >
          <span className="hidden sm:inline">VOIR LE PORTFOLIO</span>
          <span className="sm:hidden">PORTFOLIO</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={logout}
          title="Se déconnecter de l'administration"
          className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-red-950/30 border border-red-500/40 text-red-300 hover:bg-red-600 hover:text-white hover:border-red-600 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">DÉCONNEXION</span>
          <span className="sm:hidden">QUITTER</span>
        </button>

        <div className="w-9 h-9 rounded-full border border-orange-500/80 overflow-hidden bg-slate-900 hidden md:block">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>
    </header>
  );
};
