import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Download, RefreshCw, Check, LogOut, Save, Sliders } from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const { profile, projects, messages, settings, updateSettings, resetDemoData, showToast, logout } = useApp();

  const [portfolioTitle, setPortfolioTitle] = useState(settings.portfolioTitle || 'Ibrahim Sidime - Monteur Vidéo & Espace Admin');
  const [portfolioDescription, setPortfolioDescription] = useState(settings.portfolioDescription || 'Portfolio professionnel et espace administrateur d\'Ibrahim Sidime, monteur vidéo et créateur de contenu à Abidjan.');
  const [accentColor, setAccentColor] = useState(settings.accentColor || '#f97316');
  const [notifyEmail, setNotifyEmail] = useState(settings.contactNotificationEmail ?? true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(settings.contactNotificationWhatsapp ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    setPortfolioTitle(settings.portfolioTitle);
    setPortfolioDescription(settings.portfolioDescription);
    setAccentColor(settings.accentColor || '#f97316');
    setNotifyEmail(settings.contactNotificationEmail ?? true);
    setNotifyWhatsapp(settings.contactNotificationWhatsapp ?? true);
  }, [settings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');

    const res = await updateSettings({
      portfolioTitle,
      portfolioDescription,
      accentColor,
      contactNotificationEmail: notifyEmail,
      contactNotificationWhatsapp: notifyWhatsapp,
    });

    setIsSaving(false);
    if (res.success) {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 5000);
    } else {
      setSaveStatus('error');
    }
  };

  const handleExportData = () => {
    const data = {
      profile,
      projects,
      messages,
      settings,
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
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">
          <span className="w-3 h-0.5 bg-orange-500 inline-block" />
          <span>ADMIN &gt; PARAMÈTRES</span>
        </div>
        <h2 className="text-2xl font-bold text-white font-syne">
          Paramètres du Site &amp; Sécurité
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Gérez les paramètres généraux de votre portfolio, vos préférences de notifications et la sauvegarde en base de données.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="rounded-3xl bg-[#0a0f1e] border border-slate-800/90 p-6 sm:p-8 shadow-2xl space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 pb-2 border-b border-slate-800 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-orange-400" />
          <span>Configuration générale du portfolio</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Titre du portfolio
            </label>
            <input
              type="text"
              required
              value={portfolioTitle}
              onChange={(e) => setPortfolioTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Description SEO &amp; Métadonnées
            </label>
            <textarea
              rows={2}
              value={portfolioDescription}
              onChange={(e) => setPortfolioDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Couleur d'accentuation
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-300 uppercase">{accentColor} (Orange Studio)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Alertes des nouvelles demandes clients
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#070b16] border border-slate-800 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-white">WhatsApp instantané</div>
                <div className="text-[11px] text-slate-400">Rappel sur {profile.phone}</div>
              </div>
              <input
                type="checkbox"
                checked={notifyWhatsapp}
                onChange={(e) => setNotifyWhatsapp(e.target.checked)}
                className="accent-orange-500 w-4 h-4 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#070b16] border border-slate-800 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-white">Copie Email</div>
                <div className="text-[11px] text-slate-400">Alerte sur {profile.email}</div>
              </div>
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="accent-orange-500 w-4 h-4 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div>
            {saveStatus === 'success' && (
              <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-in fade-in">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>✓ PARAMÈTRES ENREGISTRÉS DANS LA BASE DE DONNÉES</span>
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="text-xs text-red-400 font-medium">
                Échec de l'enregistrement. Veuillez réessayer.
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>ENREGISTREMENT...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>ENREGISTRER LES PARAMÈTRES</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Account Security */}
      <div className="rounded-3xl bg-[#0a0f1e] border border-slate-800/90 p-6 sm:p-8 shadow-2xl space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 pb-2 border-b border-slate-800 flex items-center gap-2">
          <Shield className="w-4 h-4 text-orange-400" />
          <span>Sécurité &amp; Compte Administrateur</span>
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
              ••••••••••••
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

      {/* Backup and Data Export */}
      <div className="rounded-3xl bg-[#0a0f1e] border border-slate-800/90 p-6 sm:p-8 shadow-2xl space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 pb-2 border-b border-slate-800 flex items-center gap-2">
          <Download className="w-4 h-4 text-orange-400" />
          <span>Sauvegarde &amp; Données</span>
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
              Restaure le profil, la vidéo de présentation et les projets initiaux d'Ibrahim Sidime dans la base de données.
            </p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Voulez-vous restaurer les données initiales dans la base de données ?')) {
                resetDemoData();
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Réinitialiser la base</span>
          </button>
        </div>
      </div>
    </div>
  );
};
