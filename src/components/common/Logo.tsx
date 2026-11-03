import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  linkToHome?: boolean;
  onClick?: () => void;
  className?: string;
}

/** Logo SIDIME original fourni dans l'identité visuelle. */
export const Logo: React.FC<LogoProps> = ({ size = 'md', onClick, className = '' }) => {
  const dimensions =
    size === 'sm'
      ? 'w-36 sm:w-40'
      : size === 'lg'
        ? 'w-56 sm:w-64'
        : 'w-44 sm:w-52';

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
        className="mr-2 h-9 w-9 sm:h-11 sm:w-11 shrink-0 object-contain"
        loading="eager"
        decoding="async"
      />
      <img
        src="/5B245A2C-DF43-4A30-9544-AA3585BF6F7C.png"
        alt="SIDIME — Monteur • Créateur de contenu"
        className={`block h-auto max-w-full object-contain ${dimensions}`}
        loading="eager"
        decoding="async"
      />
    </button>
  );
};
