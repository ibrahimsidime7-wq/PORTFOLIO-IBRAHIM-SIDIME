import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Camera, Save, Phone, User, Globe } from 'lucide-react';

export const ProfileManager: React.FC = () => {
  const { profile, updateProfile, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarPreview, setAvatarPreview] = useState(profile.avatarUrl);
  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [tagline, setTagline] = useState(profile.tagline || 'BIENVENUE SUR MON PORTFOLIO');
  const [bio, setBio] = useState(profile.bio);
  const [aboutFull, setAboutFull] = useState(profile.aboutFull);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [location, setLocation] = useState(profile.location);

  // Socials
  const [tiktok, setTiktok] = useState(profile.socials.tiktok);
  const [instagram, setInstagram] = useState(profile.socials.instagram);
  const [facebook, setFacebook] = useState(profile.socials.facebook);
  const [youtube, setYoutube] = useState(profile.socials.youtube);
  const [linkedin, setLinkedin] = useState(profile.socials.linkedin);

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<string | undefined>(profile.lastUpdated);

  useEffect(() => {
    setName(profile.name);
    setTitle(profile.title);
    setTagline(profile.tagline || 'BIENVENUE SUR MON PORTFOLIO');
    setBio(profile.bio);
    setAboutFull(profile.aboutFull);
    setPhone(profile.phone);
    setEmail(profile.email);
    setLocation(profile.location);
    setAvatarPreview(profile.avatarUrl);
    setTiktok(profile.socials.tiktok);
    setInstagram(profile.socials.instagram);
    setFacebook(profile.socials.facebook);
    setYoutube(profile.socials.youtube);
    setLinkedin(profile.socials.linkedin);
    if (profile.lastUpdated) {
      setLastSavedTime(profile.lastUpdated);
    }
  }, [profile]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          const resultStr = loadEvent.target.result as string;
          setAvatarPreview(resultStr);
          setSaveStatus('idle');
          showToast('Nouvelle photo de profil sélectionnée ! Cliquez sur ENREGISTRER pour la valider.', 'info');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');

    const res = await updateProfile({
      name,
      title,
      tagline,
      bio,
      aboutFull,
      phone,
      email,
      location,
      avatarUrl: avatarPreview,
      socials: {
        tiktok,
        instagram,
        facebook,
        youtube,
        linkedin,
      },
    });

    setIsSaving(false);
    if (res.success) {
      setSaveStatus('success');
      setLastSavedTime(new Date().toISOString());
    } else {
      setSaveStatus('error');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">
          <span className="w-3 h-0.5 bg-orange-500 inline-block" />
          <span>ADMIN &gt; MON PROFIL</span>
        </div>
        <h2 className="text-2xl font-bold text-white font-syne">
          Informations du Profil
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Modifiez vos informations publiques, votre bio, vos coordonnées et vos réseaux sociaux.
        </p>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        <div className="rounded-3xl bg-[#0a0f1e] border border-slate-800/90 p-6 sm:p-8 shadow-2xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
            <span>PHOTO DE PROFIL</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-orange-500 to-amber-500 shadow-xl overflow-hidden">
                <img
                  src={avatarPreview}
                  alt={name}
                  className="w-full h-full object-cover object-top rounded-full bg-slate-900"
                />
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity cursor-pointer"
              >
                <Camera className="w-6 h-6 text-orange-400 mb-1" />
                <span className="text-[10px] font-bold">Changer</span>
              </button>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>CHANGER LA PHOTO</span>
              </button>
              <p className="text-xs text-slate-400 max-w-md">
                Sélectionnez directement une photo depuis votre ordinateur ou votre téléphone. La photo est automatiquement enregistrée sur le serveur.
              </p>
            </div>
          </div>
        </div>

        {/* Identity & Bio */}
        <div className="rounded-3xl bg-[#0a0f1e] border border-slate-800/90 p-6 sm:p-8 shadow-2xl space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 pb-2 border-b border-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-orange-400" />
            <span>IDENTITÉ &amp; PRÉSENTATION</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Nom complet *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Titre professionnel *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Accroche / Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Présentation courte (Hero) *
            </label>
            <textarea
              rows={2}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Présentation complète (Section À propos)
            </label>
            <textarea
              rows={4}
              value={aboutFull}
              onChange={(e) => setAboutFull(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>
        </div>

        {/* Contact Coordinates */}
        <div className="rounded-3xl bg-[#0a0f1e] border border-slate-800/90 p-6 sm:p-8 shadow-2xl space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 pb-2 border-b border-slate-800 flex items-center gap-2">
            <Phone className="w-4 h-4 text-orange-400" />
            <span>COORDONNÉES DE CONTACT</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Téléphone *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07 12 42 16 89"
                className="w-full px-4 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Localisation *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Abidjan, Côte d'Ivoire"
                className="w-full px-4 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email public *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ibrahimsidime7@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Réseaux Sociaux */}
        <div className="rounded-3xl bg-[#0a0f1e] border border-slate-800/90 p-6 sm:p-8 shadow-2xl space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 pb-2 border-b border-slate-800 flex items-center gap-2">
            <Globe className="w-4 h-4 text-orange-400" />
            <span>RÉSEAUX SOCIAUX</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                TikTok
              </label>
              <input
                type="text"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                placeholder="https://tiktok.com/@..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Instagram
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Facebook
              </label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                YouTube
              </label>
              <input
                type="text"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://youtube.com/@..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                LinkedIn
              </label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#070b16] border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div>
            {saveStatus === 'success' && (
              <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-in fade-in">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>✓ MODIFICATIONS ENREGISTRÉES DANS LA BASE DE DONNÉES</span>
                {lastSavedTime && (
                  <span className="text-slate-400 ml-1">
                    ({new Date(lastSavedTime).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })})
                  </span>
                )}
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="text-xs text-red-400 flex items-center gap-1.5 font-medium animate-in fade-in">
                <span>Échec de l'enregistrement. Veuillez réessayer.</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>ENREGISTREMENT EN COURS...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>ENREGISTRER LES MODIFICATIONS</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
