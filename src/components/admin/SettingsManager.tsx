import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Key, Download, RefreshCw, Check, Bell, Lock, LogOut } from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const { profile, projects, messages, resetDemoData, showToast, logout } = useApp();
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);

  const handleExportData = () => {
    const data = {
      profile,
      projects,
      messages,
      exportDate: new Date().toISOString(),
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonStr);
    downloadAnchor.setAttribute('download', `portfolio_ibrahim_sidime_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Sauvegarde exportée avec succès !', 'success');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">
          <span className="w-3 h-0.5 bg-orange-500 inline-block" />
          <span>ADMIN &gt; PARAMÈTRES</span>
        </div>
        <h2 className="text-2xl font-bold text-white font-syne">
          Paramètres & Sécurité
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Gérez la sécurité d'accès, vos préférences et la sauvegarde de vos projets.
        </p>
      </div>

      {/* Account & Security Card */}
      <div className="rounded-3xl bg-[#0a0f1e] border border-slate-800/90 p-6 sm:p-8 shadow-2xl space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 pb-2 border-b border-slate-800 flex items-center gap-2">
          <Shield className="w-4 h-4 text-orange-400" />
          <span>Sécurité & Compte Administrateur</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#070b16] border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Email administrateur
            </span>
            <div className="text-sm font-bold text-white font-mono mt-1">
              ibrahimsidime7@gmail.com
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
              <Check className="w-3 h-3" />
              Compte vérifié
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#070b16] border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Mot de passe
            </span>
            <div className="text-sm font-bold text-white font-mono mt-1">
              •••••••••••
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Dernière mise à jour : actif
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-950/30 hover:bg-red-600 border border-red-500/40 hover:border-red-600 text-red-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>SE DÉCONNECTER DE L'ADMINISTRATION</span>
          </button>
        </div>
      </div>

      {/* Notifications Preferences */}
      <div className="rounded-3xl bg-[#0a0f1e] border border-slate-800/90 p-6 sm:p-8 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 pb-2 border-b border-slate-800 flex items-center gap-2">
          <Bell className="w-4 h-4 text-orange-400" />
          <span>Alertes des nouvelles demandes clients</span>
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#070b16] border border-slate-800 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-white">Notifications WhatsApp instantanées</div>
              <div className="text-[11px] text-slate-400">Recevoir un rappel sur votre numéro {profile.phone}</div>
            </div>
            <input
              type="checkbox"
              checked={notifyWhatsapp}
              onChange={(e) => setNotifyWhatsapp(e.target.checked)}
              className="accent-orange-500 w-4 h-4 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#070b16] border border-slate-800 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-white">Copie par Email</div>
              <div className="text-[11px] text-slate-400">Alerte automatique sur {profile.email}</div>
            </div>
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.checked)}
              className="accent-orange-500 w-4 h-4 rounded"
            />
          </label>
        </div>
      </div>

      {/* Backup and Data Export */}
      <div className="rounded-3xl bg-[#0a0f1e] border border-slate-800/90 p-6 sm:p-8 shadow-2xl space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 pb-2 border-b border-slate-800 flex items-center gap-2">
          <Download className="w-4 h-4 text-orange-400" />
          <span>Sauvegarde & Données</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-white">Exporter l'intégralité du portfolio</div>
            <p className="text-xs text-slate-400 mt-0.5">
              Téléchargez un fichier JSON contenant tous vos projets, médias, coordonnées et messages.
            </p>
          </div>

          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4 text-orange-400" />
            <span>Exporter en JSON</span>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-red-400">Réinitialiser les données de démonstration</div>
            <p className="text-xs text-slate-400 mt-0.5">
              Restaure le profil, la vidéo de présentation et les projets initiaux d’Ibrahim Sidime.
            </p>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Voulez-vous restaurer les données initiales ?')) {
                resetDemoData();
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Réinitialiser</span>
          </button>
        </div>
      </div>
    </div>
  );
};
