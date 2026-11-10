import React from 'react';
import { TabType } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Disc, Trophy, Info } from 'lucide-react';
import { KeseIcon } from './KeseIcon';

interface NavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  isMiningActive: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange, isMiningActive }) => {
  const { t } = useLanguage();

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'mining', label: t.tabPouch, icon: KeseIcon },
    { id: 'wheel', label: t.tabWheel, icon: Disc },
    { id: 'leaderboard', label: t.tabLeaderboard, icon: Trophy },
    { id: 'about', label: t.tabAbout, icon: Info },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto z-30 bg-white/95 dark:bg-[#16303f]/95 backdrop-blur-lg border-t border-slate-200 dark:border-[#274858] px-3 py-2 shadow-sm"
      role="navigation"
      aria-label="Ana Gezinti"
    >
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-xs font-semibold transition-all relative ${
                isActive
                  ? 'text-[#d97706] dark:text-[#f2b544] bg-amber-50 dark:bg-[#274858]/60 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#274858]/30'
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b544]`}
              aria-selected={isActive}
              role="tab"
            >
              <div className="relative">
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#d97706] dark:text-[#f2b544] scale-110' : ''} transition-transform`} />
                {tab.id === 'mining' && isMiningActive && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-[#10b981] dark:bg-[#5fd3b3] animate-ping" />
                )}
              </div>
              <span className="text-[11px] tracking-tight">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-6 h-0.5 rounded-full bg-[#d97706] dark:bg-[#f2b544]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
