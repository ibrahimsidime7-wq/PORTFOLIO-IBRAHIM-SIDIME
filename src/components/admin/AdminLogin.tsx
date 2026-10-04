import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Lock, Mail, Eye, EyeOff, ShieldCheck, KeyRound } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login, navigate } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await login(email, password);
      setIsLoading(false);
      if (!res.success) {
        setError(res.error || 'Identifiants invalides');
      }
    } catch {
      setIsLoading(false);
      setError('Erreur lors de la tentative de connexion.');
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative selection:bg-orange-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top bar back link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-2 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-orange-500" />
          <span>RETOUR AU PORTFOLIO</span>
        </button>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
          <span>Accès Privé &amp; Sécurisé</span>
        </div>
      </div>

      {/* Center Login Card */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-[#0b101f] border border-slate-800/90 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80 relative">
          <div className="flex flex-col items-center text-center mb-8">
            <Logo size="lg" className="mb-3" />
            <div className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">
              IBRAHIM SIDIME
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-syne uppercase">
              ESPACE ADMINISTRATEUR
            </h1>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                EMAIL
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre-email@exemple.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#070b16] border border-slate-700/80 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  MOT DE PASSE
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                >
                  MOT DE PASSE OUBLIÉ
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#070b16] border border-slate-700/80 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>SE CONNECTER</span>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto text-center py-4">
        <button
          onClick={() => navigate('/')}
          className="text-xs text-slate-400 hover:text-orange-400 transition-colors cursor-pointer"
        >
          ← RETOUR AU PORTFOLIO
        </button>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0c1224] border border-slate-800 rounded-2xl p-6 max-w-sm w-full text-slate-100 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Sécurité de l'accès</h3>
                <p className="text-xs text-slate-400">Espace strictement confidentiel</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              Cet espace est strictement réservé au titulaire du portfolio. Pour des raisons de confidentialité et de sécurité, aucun identifiant ou mot de passe n'est divulgué sur cette interface.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
