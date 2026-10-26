import React, { useState, useEffect } from 'react';
import { User, LessonData, ResourceItem } from './types';
import { storageService } from './services/storageService';
import { INITIAL_LESSONS } from './data/initialData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CourseModules } from './components/CourseModules';
import { FeatureBand } from './components/FeatureBand';
import { ResourceLibrary } from './components/ResourceLibrary';
import { TeamSection } from './components/TeamSection';
import { LessonModal } from './components/LessonModal';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';
import { AdminWorkspace } from './components/AdminWorkspace';
import { ShieldCheck, ArrowLeft, Settings } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const user = storageService.getCurrentUser();
    if (user && user.role === 'admin') {
      user.name = 'ADIM (Cô Tú Lành)';
      storageService.setCurrentUser(user);
    }
    return user;
  });
  const [resources, setResources] = useState<ResourceItem[]>(() => storageService.getInitialSyncResources());
  const [selectedLesson, setSelectedLesson] = useState<LessonData | null>(null);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // When admin logs in, by default they enter the dedicated Admin Workspace (no student distractions)
  const [viewAsStudent, setViewAsStudent] = useState(false);

  // Load latest Cloud Firestore resources and subscribe in real-time across all devices
  useEffect(() => {
    // Initial fetch from Server API + Cloud Firestore
    storageService.getResources().then((data) => {
      if (data && data.length > 0) {
        setResources(data);
      }
    });

    // Real-time Cloud Firestore listener so any other computer sees changes instantly
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = storageService.subscribe((cloudData) => {
        if (cloudData && cloudData.length > 0) {
          setResources(cloudData);
        }
      });
    } catch (e) {
      console.warn('Không thể đăng ký real-time listener:', e);
    }

    const handleSync = (event: Event) => {
      const customEvent = event as CustomEvent<ResourceItem[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setResources(customEvent.detail);
      }
    };

    window.addEventListener('lms_resources_sync', handleSync);
    return () => {
      window.removeEventListener('lms_resources_sync', handleSync);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    storageService.setCurrentUser(user);
    setIsLoginOpen(false);
    if (user.role === 'admin') {
      setViewAsStudent(false); // Default to clean admin view
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    storageService.setCurrentUser(null);
    setViewAsStudent(false);
  };

  const handleNavClick = (targetId: string) => {
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const isAdmin = currentUser?.role === 'admin';
  const showAdminWorkspaceOnly = isAdmin && !viewAsStudent;

  return (
    <div className="min-h-screen bg-[#f7fbff] flex flex-col font-sans text-slate-800 antialiased selection:bg-[#ff9b31] selection:text-white">
      {/* Top Navigation */}
      <Header
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        isAdminWorkspace={showAdminWorkspaceOnly}
        onToggleAdminWorkspace={() => setViewAsStudent(!viewAsStudent)}
      />

      {/* Floating Teacher Mode Notice when Admin is previewing Student view */}
      {isAdmin && viewAsStudent && (
        <div className="bg-amber-500 text-white px-4 py-2.5 text-xs font-bold text-center flex items-center justify-center gap-3 sticky top-20 z-30 shadow-md">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Đang ở chế độ Xem trước giao diện Học sinh.</span>
          </span>
          <button
            onClick={() => setViewAsStudent(false)}
            className="px-3 py-1 bg-white text-amber-900 rounded-lg hover:bg-amber-50 font-extrabold text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại Quản lý học liệu</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {showAdminWorkspaceOnly ? (
          /* ONLY ADMIN LEARNING MATERIALS MANAGEMENT (No student buttons or lessons) */
          <AdminWorkspace
            resources={resources}
            currentUser={currentUser}
            onResourcesUpdated={(updated) => setResources(updated)}
            onSelectResource={(res) => setSelectedResource(res)}
            onSwitchToStudentView={() => setViewAsStudent(true)}
          />
        ) : (
          /* FULL STUDENT LEARNING PORTAL */
          <>
            {/* Hero Section */}
            <Hero
              onExploreCourses={() => handleNavClick('courses')}
              onExploreResources={() => handleNavClick('resources')}
              onOpenAdmin={() => setViewAsStudent(false)}
              isAdmin={isAdmin}
            />

            {/* 6 Subject Modules */}
            <CourseModules
              lessons={INITIAL_LESSONS}
              onSelectLesson={(lesson) => setSelectedLesson(lesson)}
            />

            {/* Pedagogical Feature Band */}
            <FeatureBand />

            {/* Kho học liệu số with in-place Teacher Management */}
            <ResourceLibrary
              resources={resources}
              currentUser={currentUser}
              onSelectResource={(res) => setSelectedResource(res)}
              onResourcesUpdated={(updated) => setResources(updated)}
              onOpenLogin={() => setIsLoginOpen(true)}
            />

            {/* Team & Product Credits */}
            <TeamSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavClick={handleNavClick}
        onOpenAdmin={() => setViewAsStudent(false)}
        isAdmin={isAdmin}
      />

      {/* Modals */}
      {selectedLesson && (
        <LessonModal
          lesson={selectedLesson}
          resources={resources}
          onClose={() => setSelectedLesson(null)}
          onSelectResource={(res) => setSelectedResource(res)}
        />
      )}

      {selectedResource && (
        <DocumentPreviewModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
