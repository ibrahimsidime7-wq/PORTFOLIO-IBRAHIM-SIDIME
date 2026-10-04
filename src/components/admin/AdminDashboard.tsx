import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { DashboardOverview } from './DashboardOverview';
import { ProjectsManager } from './ProjectsManager';
import { MediaManager } from './MediaManager';
import { MessagesManager } from './MessagesManager';
import { ProfileManager } from './ProfileManager';
import { SettingsManager } from './SettingsManager';
import { Project } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { activeAdminTab, setActiveAdminTab } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Shared project modal state across Dashboard and Projects tab
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleOpenAddProject = () => {
    setEditingProject(null);
    setIsCreateModalOpen(true);
    setActiveAdminTab('projects');
  };

  const handleEditProject = (proj: Project) => {
    setEditingProject(proj);
    setIsCreateModalOpen(true);
    setActiveAdminTab('projects');
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex">
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Header */}
        <AdminHeader onToggleMobileMenu={() => setMobileSidebarOpen(true)} />

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeAdminTab === 'dashboard' && (
            <DashboardOverview
              onOpenAddProjectModal={handleOpenAddProject}
              onEditProject={handleEditProject}
            />
          )}

          {activeAdminTab === 'projects' && (
            <ProjectsManager
              editingProject={editingProject}
              setEditingProject={setEditingProject}
              isCreateModalOpen={isCreateModalOpen}
              setIsCreateModalOpen={setIsCreateModalOpen}
            />
          )}

          {activeAdminTab === 'media' && <MediaManager />}
          {activeAdminTab === 'messages' && <MessagesManager />}
          {activeAdminTab === 'profile' && <ProfileManager />}
          {activeAdminTab === 'settings' && <SettingsManager />}
        </main>
      </div>
    </div>
  );
};
