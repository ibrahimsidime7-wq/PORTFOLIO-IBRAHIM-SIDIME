import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  linkToHome?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', onClick, className = '' }) => {
  const iconSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-9 h-9' : 'w-7 h-7';
  const titleSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg tracking-wider' : 'text-base tracking-wide';
  const subSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-[11px]' : 'text-[10px]';

  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 cursor-pointer select-none group transition-opacity hover:opacity-95 ${className}`}
    >
      {/* Orange geometric play triangle icon */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSize}`}>
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(255,106,0,0.5)] transition-transform group-hover:scale-105 duration-200"
        >
          <polygon 
            points="6,4 28,16 6,28" 
            stroke="#ff6a00" 
            strokeWidth="3.5" 
            strokeLinejoin="round"
            className="transition-colors group-hover:stroke-orange-400"
          />
          <polygon 
            points="12,11 20,16 12,21" 
            fill="#ff6a00" 
            opacity="0.9"
          />
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <div className={`font-bold font-syne text-white flex items-center gap-1.5 ${titleSize}`}>
          <span>IBRAHIM</span>
          <span className="text-orange-500 font-extrabold">SIDIME</span>
        </div>
        <span className={`text-slate-400 font-medium tracking-wider uppercase ${subSize}`}>
          MONTEUR VIDÉO & CRÉATEUR DE CONTENU
        </span>
      </div>
    </div>
  );
};
