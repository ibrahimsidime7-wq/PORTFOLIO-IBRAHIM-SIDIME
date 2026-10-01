import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, Phone, MessageSquare, Check, Sparkles, ArrowLeft } from 'lucide-react';

export const ContactModal: React.FC = () => {
  const { isContactModalOpen, setIsContactModalOpen, contactModalType, addMessage, profile } = useApp();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [projectType, setProjectType] = useState(
    contactModalType === 'quote' ? 'Demande de devis' : 'Montage vidéo'
  );
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isContactModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) return;

    // Check if contact looks like email or phone
    const isEmail = contact.includes('@');
    addMessage({
      name: name.trim(),
      email: isEmail ? contact.trim() : `${name.toLowerCase().replace(/\s+/g, '')}@client.ci`,
      phone: !isEmail ? contact.trim() : undefined,
      projectType,
      message: message.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setContact('');
      setMessage('');
      setIsContactModalOpen(false);
    }, 2000);
  };

  const projectTypes = [
    'Montage vidéo',
    'Motion design',
    'Réseaux sociaux (Reels/TikTok)',
    'Publicité de marque',
    'Sous-titrage & Habillage',
    'Demande de devis global',
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsContactModalOpen(false)}
    >
      <div 
        className="relative w-full max-w-lg bg-[#0c1222] border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-7 md:p-8 text-slate-100 max-h-[92dvh] overflow-y-auto overscroll-contain flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Row with RETOUR and CLOSE */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
          <button
            onClick={() => setIsContactModalOpen(false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-orange-500 hover:text-white text-slate-300 text-xs font-semibold transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-orange-400 group-hover:text-white" />
            <span>RETOUR</span>
          </button>

          <button
            onClick={() => setIsContactModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Message envoyé avec succès !</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              Ibrahim a bien reçu votre demande et vous répondra dans les plus brefs délais.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-500 uppercase tracking-widest mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                {contactModalType === 'quote' ? 'Demander un devis' : 'Travaillons ensemble'}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-syne">
                {contactModalType === 'quote' ? 'Estimer votre projet vidéo' : 'Démarrons votre projet'}
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                {profile.location} • <span className="text-orange-400">{profile.phone}</span>
              </p>
            </div>

            {/* Quick Contact Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
              <a
                href={`https://wa.me/225${profile.phone.replace(/\s+/g, '')}?text=Bonjour%20Ibrahim,%20je%20souhaite%20discuter%20d'un%20projet%20vidéo`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/30 text-xs font-semibold transition-all hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Direct</span>
              </a>
              <a
                href={`tel:+225${profile.phone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 hover:bg-slate-700/50 text-xs font-semibold transition-all hover:scale-[1.02]"
              >
                <Phone className="w-4 h-4 text-orange-400" />
                <span>Appeler : {profile.phone}</span>
              </a>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Votre Nom ou Entreprise *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jean Kouassi / Studio Horizon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080d1a] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email ou Téléphone *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: contact@exemple.com ou 07 00 00 00 00"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080d1a] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Type de projet
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080d1a] border border-slate-700 text-white focus:outline-none focus:border-orange-500 text-sm transition-colors cursor-pointer"
                >
                  {projectTypes.map((type) => (
                    <option key={type} value={type} className="bg-[#0c1222] text-white">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Description de votre besoin *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Parlez-moi de votre idée, du format souhaité, du calendrier ou du budget..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080d1a] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm transition-colors resize-none"
                />
              </div>

              {/* Bottom Buttons: Submit and Retour */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all duration-200 hover:shadow-orange-500/40 active:scale-[0.99] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer ma demande</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="w-full py-2 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>← Retour au site</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
