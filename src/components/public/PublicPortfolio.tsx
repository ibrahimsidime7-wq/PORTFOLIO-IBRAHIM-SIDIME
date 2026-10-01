import React from 'react';
import { Navbar } from './Navbar';
import { HeroVideo } from './HeroVideo';
import { HeroProfile } from './HeroProfile';
import { ServicesSection } from './ServicesSection';
import { ProjectsSection } from './ProjectsSection';
import { AboutSection } from './AboutSection';
import { CtaSection } from './CtaSection';
import { Footer } from './Footer';
import { ProjectModal } from '../common/ProjectModal';
import { ContactModal } from '../common/ContactModal';
import { AllServicesModal } from '../common/AllServicesModal';
import { AllProjectsModal } from '../common/AllProjectsModal';

export const PublicPortfolio: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Fixed Sticky Header Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Cinematic Presentation Video Player */}
        <HeroVideo />

        {/* Profile Card, Bio & Highlights */}
        <HeroProfile />

        {/* Services */}
        <ServicesSection />

        {/* Projects Showcase */}
        <ProjectsSection />

        {/* About Ibrahim */}
        <AboutSection />

        {/* Call to Action */}
        <CtaSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <ProjectModal />
      <ContactModal />
      <AllServicesModal />
      <AllProjectsModal />
    </div>
  );
};
