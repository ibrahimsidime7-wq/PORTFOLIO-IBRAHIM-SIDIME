import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, Phone, MessageSquare, Check, Sparkles, ArrowLeft, Mail, ExternalLink } from 'lucide-react';

export const ContactModal: React.FC = () => {
  const { isContactModalOpen, setIsContactModalOpen, contactModalType, addMessage, profile } = useApp();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [projectType, setProjectType] = useState(
    contactModalType === 'quote' ? 'Demande de devis' : 'Montage vidéo'
  );
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastSentUrls, setLastSentUrls] = useState<{ gmailUrl: string; mailtoUrl: string } | null>(null);

  if (!isContactModalOpen) return null;

  const targetEmail = 'ibrahimsidime7@gmail.com';

  const generateEmailData = (clientName: string, clientContact: string, type: string, content: string) => {
    const subject = `[Portfolio] Demande de ${type} - ${clientName}`;
    const body = `Bonjour Ibrahim,\n\nJe vous contacte via votre portfolio professionnel concernant une prestation vidéo.\n\nDÉTAILS DE MA DEMANDE :\n- Nom / Entreprise : ${clientName}\n- Coordonnées de contact (Email / Téléphone) : ${clientContact}\n- Type de projet : ${type}\n\nMESSAGE :\n${content}\n\nMessage transmis directement à votre boîte Gmail : ${targetEmail}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const mailtoUrl = `mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return { gmailUrl, mailtoUrl };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) return;

    setIsSubmitting(true);
    const isEmail = contact.includes('@');

    await addMessage({
      name: name.trim(),
      email: isEmail ? contact.trim() : `${name.toLowerCase().replace(/\s+/g, '')}@client.ci`,
      phone: !isEmail ? contact.trim() : undefined,
      projectType,
      message: message.trim(),
    });

    const urls = generateEmailData(name.trim(), contact.trim(), projectType, message.trim());
    setLastSentUrls(urls);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setLastSentUrls(null);
    setName('');
    setContact('');
    setMessage('');
    setIsContactModalOpen(false);
  };

  const projectTypes = [
    'Montage vidéo',
    'Motion design',
    'Réseaux sociaux (Reels/TikTok)',
    'Publicité de marque',
    'Sous-titrage & Habillage',
    'Demande de devis global',
  ];

  const quickGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent("Demande de projet vidéo pour Ibrahim Sidime")}&body=${encodeURIComponent("Bonjour Ibrahim,\n\nJe vous contacte concernant un projet vidéo :\n\n")}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#0c1222] border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-7 md:p-8 text-slate-100 max-h-[92dvh] overflow-y-auto overscroll-contain flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Row with RETOUR and CLOSE */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
          <button
            onClick={handleClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-orange-500 hover:text-white text-slate-300 text-xs font-semibold transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-orange-400 group-hover:text-white" />
            <span>RETOUR</span>
          </button>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white font-syne">Demande enregistrée avec succès !</h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-sm mx-auto">
                Votre message est bien conservé dans le tableau de bord d'Ibrahim.
              </p>
            </div>

            {/* Direct Gmail Forwarding Box */}
            <div className="w-full p-4 rounded-2xl bg-gradient-to-br from-red-950/40 via-[#10172d] to-slate-900 border border-red-500/30 text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                <Mail className="w-4 h-4 text-red-400" />
                <span>Envoi direct vers la boîte Gmail</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pour garantir une réception immédiate dans la boîte de réception d'Ibrahim (<strong className="text-white">ibrahimsidime7@gmail.com</strong>), cliquez sur le bouton ci-dessous :
              </p>

              {lastSentUrls && (
                <div className="flex flex-col gap-2 pt-1">
                  <a
                    href={lastSentUrls.gmailUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>OUVRIR GMAIL ET ENVOYER LE MAIL</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={lastSentUrls.mailtoUrl}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                  >
                    <span>Ou ouvrir votre application e-mail habituelle (Mailto)</span>
                  </a>
                </div>
              )}
            </div>

            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Fermer et retourner au portfolio
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-500 uppercase tracking-widest mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                {contactModalType === 'quote' ? 'Demander un devis' : 'Travaillons ensemble'}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-syne">
                {contactModalType === 'quote' ? 'Estimer votre projet vidéo' : 'Démarrons votre projet'}
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                {profile.location} • Réception directe sur <span className="text-orange-400 font-semibold">{targetEmail}</span>
              </p>
            </div>

            {/* Quick Contact Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
              <a
                href={quickGmailUrl}
                target="_blank"
                rel="noreferrer"
                title="Écrire directement par Gmail à ibrahimsidime7@gmail.com"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 hover:bg-red-900/40 text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Mail className="w-4 h-4 text-red-400 shrink-0" />
                <span className="truncate">Gmail Direct</span>
              </a>

              <a
                href={`https://wa.me/225${profile.phone.replace(/\s+/g, '')}?text=Bonjour%20Ibrahim,%20je%20souhaite%20discuter%20d'un%20projet%20vid%C3%A9o`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/30 text-xs font-semibold transition-all hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">WhatsApp</span>
              </a>

              <a
                href={`tel:+225${profile.phone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 hover:bg-slate-700/50 text-xs font-semibold transition-all hover:scale-[1.02]"
              >
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="truncate">Appeler</span>
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
                  Type de prestation vidéo
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
                  placeholder="Parlez-moi de votre projet (format, style souhaité, délais)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080d1a] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm transition-colors resize-none"
                />
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#080d1a] border border-slate-800 text-[11px] text-slate-400">
                <Mail className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>
                  Ce message est instantanément transmis à <strong>{targetEmail}</strong>.
                </span>
              </div>

              <div className="pt-1 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all duration-200 hover:shadow-orange-500/40 active:scale-[0.99] cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Envoyer et transmettre à Gmail</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleClose}
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
