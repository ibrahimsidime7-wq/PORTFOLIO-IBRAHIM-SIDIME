import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  linkToHome?: boolean;
  onClick?: () => void;
  className?: string;
}

/** Responsive SIDIME wordmark. Uses the site's existing orange accent and dark-theme contrast. */
export const Logo: React.FC<LogoProps> = ({ size = 'md', onClick, className = '' }) => {
  const wordSize = size === 'sm' ? 'text-2xl' : size === 'lg' ? 'text-4xl' : 'text-3xl';
  const taglineSize = size === 'sm' ? 'text-[7px]' : size === 'lg' ? 'text-[9px]' : 'text-[8px]';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="SIDIME — Retour à l’accueil"
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group transition-opacity hover:opacity-90 ${className}`}
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-500/40 bg-orange-500/10 text-orange-400 shadow-[0_0_22px_rgba(249,115,22,0.12)] transition-colors group-hover:bg-orange-500/20">
        <svg viewBox="0 0 36 36" aria-hidden="true" className="h-6 w-6" fill="none">
          <rect x="3.5" y="6.5" width="29" height="23" rx="5" stroke="currentColor" strokeWidth="1.7"/>
          <path d="M15 12.5L24 18L15 23.5V12.5Z" fill="currentColor"/>
        </svg>
      </span>
      <span className="flex min-w-0 flex-col items-start leading-none">
        <span className={`font-syne font-extrabold italic tracking-[-0.065em] text-white ${wordSize}`}>
          SIDIME<span className="text-orange-500">.</span>
        </span>
        <span className={`mt-1 whitespace-nowrap font-semibold uppercase tracking-[0.16em] text-slate-400 ${taglineSize}`}>
          MONTEUR • CRÉATEUR DE CONTENU
        </span>
      </span>
    </button>
  );
};
