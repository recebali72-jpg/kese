import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { TabType } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { MiningTab } from './components/MiningTab';
import { WheelTab } from './components/WheelTab';
import { LeaderboardTab } from './components/LeaderboardTab';
import { AboutTab } from './components/AboutTab';
import { ProfileModal } from './components/ProfileModal';
import { LoginPage } from './components/LoginPage';

const AppContent: React.FC = () => {
  const { user, loading, isMiningActive, theme } = useAuth();
  const { t } = useLanguage();
  const [currentTab, setCurrentTab] = useState<TabType>('mining');
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#eef2f6] dark:bg-[#0e1f2b] text-slate-800 dark:text-white">
        <div className="w-12 h-12 rounded-full border-4 border-slate-300 dark:border-[#274858] border-t-[#f2b544] animate-spin mb-3" />
        <span className="text-sm font-bold tracking-wider text-[#d97706] dark:text-[#f2b544]">{t.loading}</span>
      </div>
    );
  }

  // If user is not logged in, render the dedicated LoginPage
  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className={`min-h-screen bg-[#dbe2ea] dark:bg-[#09151e] flex justify-center selection:bg-[#f2b544]/30 selection:text-[#d97706] ${theme}`}>
      {/* 420px Mobile Screen Wrapper */}
      <div className="w-full max-w-[420px] min-h-screen bg-[#eef2f6] dark:bg-[#0e1f2b] border-x border-slate-300 dark:border-[#274858]/60 flex flex-col relative shadow-xl overflow-x-hidden transition-colors">
        {/* Top Header */}
        <Header onOpenProfile={() => setProfileOpen(true)} />

        {/* Tab Content Area */}
        <main className="flex-1 px-3.5 pt-3 overflow-y-auto">
          {currentTab === 'mining' && <MiningTab />}
          {currentTab === 'wheel' && <WheelTab />}
          {currentTab === 'leaderboard' && <LeaderboardTab />}
          {currentTab === 'about' && <AboutTab />}
        </main>

        {/* Bottom Tab Navigation */}
        <Navigation
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          isMiningActive={isMiningActive}
        />

        {/* Profile Modal */}
        <ProfileModal
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
