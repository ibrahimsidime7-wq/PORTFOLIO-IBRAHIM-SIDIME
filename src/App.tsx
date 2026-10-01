/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PublicPortfolio } from './components/public/PublicPortfolio';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ToastContainer } from './components/common/ToastContainer';
import { Shield, ExternalLink, UserCheck, LogOut } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentRoute, isAuthenticated, navigate, logout } = useApp();

  // Route protection
  useEffect(() => {
    if (currentRoute === '/admin' && !isAuthenticated) {
      navigate('/login');
    }
    if (currentRoute === '/login' && isAuthenticated) {
      navigate('/admin');
    }
  }, [currentRoute, isAuthenticated]);

  return (
    <div className="relative min-h-screen bg-[#070a12] text-slate-100 font-sans">
      {/* Route Switcher */}
      {currentRoute === '/admin' ? (
        isAuthenticated ? <AdminDashboard /> : <AdminLogin />
      ) : currentRoute === '/login' ? (
        <AdminLogin />
      ) : (
        <PublicPortfolio />
      )}

      {/* Floating Mode Toggle Bar for effortless preview & testing */}
      <aside 
        aria-label="Mode switcher"
        className="fixed bottom-4 left-4 z-40 flex items-center gap-1.5 p-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md text-xs font-semibold"
      >
        <button
          onClick={() => navigate('/')}
          className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
            currentRoute === '/'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Portfolio Public</span>
        </button>

        <button
          onClick={() => navigate(isAuthenticated ? '/admin' : '/login')}
          className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
            currentRoute === '/admin' || currentRoute === '/login'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {isAuthenticated ? (
            <>
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin (Connecté)</span>
            </>
          ) : (
            <>
              <Shield className="w-3.5 h-3.5" />
              <span>Espace Admin</span>
            </>
          )}
        </button>

        {isAuthenticated && (
          <button
            onClick={logout}
            title="Se déconnecter de l'admin"
            className="px-2.5 py-1.5 rounded-full text-red-400 hover:text-white hover:bg-red-600 border border-red-500/30 transition-all flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        )}
      </aside>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
