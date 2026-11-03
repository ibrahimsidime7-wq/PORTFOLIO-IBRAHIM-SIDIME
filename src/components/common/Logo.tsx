import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  linkToHome?: boolean;
  onClick?: () => void;
  className?: string;
}

/** Symbole seul de l'identité visuelle SIDIME. */
export const Logo: React.FC<LogoProps> = ({ size = 'md', onClick, className = '' }) => {
  const dimensions =
    size === 'sm'
      ? 'h-9 w-9 sm:h-10 sm:w-10'
      : size === 'lg'
        ? 'h-16 w-16 sm:h-20 sm:w-20'
        : 'h-12 w-12 sm:h-14 sm:w-14';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="SIDIME — Retour à l’accueil"
      className={`inline-flex shrink-0 items-center cursor-pointer select-none transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 ${className}`}
    >
      <img
        src="/2F346051-228F-439E-8AA8-4233F84A9DB6.png"
        alt="Symbole SIDIME"
        className={`block ${dimensions} object-contain`}
        loading="eager"
        decoding="async"
      />
    </button>
  );
};
