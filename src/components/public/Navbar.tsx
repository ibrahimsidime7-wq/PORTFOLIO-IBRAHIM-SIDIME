import React, { useState, useEffect } from 'react';
import { Logo } from '../common/Logo';
import { useApp } from '../../context/AppContext';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { setIsContactModalOpen, setContactModalType } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#070a12]/90 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-lg shadow-black/40'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo onClick={() => scrollTo('accueil')} />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollTo('accueil')}
            className="text-sm font-semibold text-orange-500 relative py-1 after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-orange-500 transition-colors cursor-pointer"
          >
            Accueil
          </button>
          <button
            onClick={() => scrollTo('a-propos')}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            À propos
          </button>
          <button
            onClick={() => scrollTo('services')}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Mes services
          </button>
          <button
            onClick={() => scrollTo('projets')}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Réalisations
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => {
              setContactModalType('contact');
              setIsContactModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <span>Me contacter</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => {
              setContactModalType('contact');
              setIsContactModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-orange-500 text-white text-xs font-semibold cursor-pointer"
          >
            Contact
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0e1c] border-b border-slate-800 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200 shadow-2xl">
          <button
            onClick={() => scrollTo('accueil')}
            className="block w-full text-left text-base font-semibold text-orange-500 py-1"
          >
            Accueil
          </button>
          <button
            onClick={() => scrollTo('a-propos')}
            className="block w-full text-left text-base font-medium text-slate-200 py-1"
          >
            À propos
          </button>
          <button
            onClick={() => scrollTo('services')}
            className="block w-full text-left text-base font-medium text-slate-200 py-1"
          >
            Mes services
          </button>
          <button
            onClick={() => scrollTo('projets')}
            className="block w-full text-left text-base font-medium text-slate-200 py-1"
          >
            Réalisations
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="block w-full text-left text-base font-medium text-slate-200 py-1"
          >
            Contact
          </button>
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setContactModalType('contact');
                setIsContactModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <span>Me contacter</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
