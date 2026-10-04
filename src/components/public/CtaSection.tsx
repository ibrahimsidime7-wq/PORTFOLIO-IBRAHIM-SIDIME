import React from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, ArrowUpRight, FileText } from 'lucide-react';

export const CtaSection: React.FC = () => {
  const { setIsContactModalOpen, setContactModalType } = useApp();

  return (
    <section id="contact" className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-2xl md:rounded-3xl bg-[#080d1a] border border-slate-800/90 p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-400 via-orange-500 to-amber-500" />

        <div className="flex items-start gap-5 pl-2 sm:pl-3">
          <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 shrink-0 hidden sm:flex">
            <Mail className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 tracking-wide">
              Un projet en tête ?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-syne">
              Parlons-en !
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl pt-0.5 leading-relaxed">
              Vous avez une idée, un besoin en montage ou en création de contenu ? Je suis disponible pour échanger sur votre projet.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pl-2 sm:pl-0 shrink-0">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=ibrahimsidime7@gmail.com&su=Demande%20de%20projet%20vid%C3%A9o"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-300 hover:text-white font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer shadow-lg shadow-red-950/30"
            title="Écrire directement par Gmail à ibrahimsidime7@gmail.com"
          >
            <Mail className="w-4 h-4 text-red-400" />
            <span>Gmail Direct</span>
          </a>

          <button
            onClick={() => {
              setContactModalType('contact');
              setIsContactModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <span>Me contacter</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setContactModalType('quote');
              setIsContactModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0d1326] border border-slate-700/80 hover:border-slate-500 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Demander un devis</span>
          </button>
        </div>
      </div>
    </section>
  );
};
