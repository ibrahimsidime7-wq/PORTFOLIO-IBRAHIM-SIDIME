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
import { Film } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentRoute, isAuthenticated, authStatus, navigate, isDatabaseLoading } = useApp();

  // Route protection
  useEffect(() => {
    if (authStatus === 'loading') {
      return;
    }
    if (currentRoute === '/admin' && !isAuthenticated) {
      navigate('/login');
    }
    if (currentRoute === '/login' && isAuthenticated) {
      navigate('/admin');
    }
  }, [currentRoute, isAuthenticated, authStatus, navigate]);

  // Clean initial loading screen while database is booting or admin session is verifying
  if (isDatabaseLoading || (authStatus === 'loading' && currentRoute === '/admin')) {
    return (
      <div className="min-h-screen bg-[#060913] flex flex-col items-center justify-center p-4 selection:bg-orange-500 selection:text-white">
        <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-300 text-center">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 shadow-2xl shadow-orange-500/20">
            <Film className="w-7 h-7 animate-pulse text-orange-500" />
          </div>
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-widest text-orange-500">
              IBRAHIM SIDIME • PORTFOLIO
            </div>
            <div className="text-base font-bold text-white font-syne tracking-wide">
              {authStatus === 'loading' && currentRoute === '/admin'
                ? 'VÉRIFICATION DE LA SESSION...'
                : 'CHARGEMENT DU PORTFOLIO...'}
            </div>
            <p className="text-xs text-slate-400">
              {authStatus === 'loading' && currentRoute === '/admin'
                ? 'Vérification sécurisée de votre accès administrateur...'
                : 'Récupération des données officielles depuis la base de données...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

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
