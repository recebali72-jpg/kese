import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatAkce } from '../services/api';
import { Sun, Moon, Bell, BellRing } from 'lucide-react';
import { KeseIcon, KlasikAkce } from './KeseIcon';

interface HeaderProps {
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProfile }) => {
  const { user, liveAkce, theme, toggleTheme, notificationsEnabled, requestNotificationPermission } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-3.5 py-3 bg-white/95 dark:bg-[#16303f]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#274858] transition-colors shadow-xs">
      {/* Left: Avatar & Logo */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenProfile}
          className="relative group rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b544] transition-transform active:scale-95"
          aria-label={t.openProfile}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-[#274858] border-2 border-[#f2b544] flex items-center justify-center text-[#d97706] dark:text-[#f2b544] font-bold text-lg shadow-sm">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.nickname}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{user?.nickname ? user.nickname.charAt(0).toUpperCase() : 'K'}</span>
            )}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#10b981] dark:bg-[#5fd3b3] border-2 border-white dark:border-[#16303f]" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <KeseIcon className="w-5 h-5 text-[#d97706] dark:text-[#f2b544]" />
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              {t.appName}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[90px]">
            {user?.nickname || t.member}
          </span>
        </div>
      </div>

      {/* Right: Balance & Theme / Notification / Lang */}
      <div className="flex items-center gap-1.5">
        <div className="flex flex-col items-end bg-slate-100 dark:bg-[#0e1f2b]/80 px-2 py-1 rounded-xl border border-slate-200 dark:border-[#274858]">
          <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            {t.akceBalance}
          </span>
          <div className="flex items-center gap-1 font-mono font-bold text-[#d97706] dark:text-[#f2b544] text-xs">
            <KlasikAkce size={14} className="animate-pulse" />
            <span>{formatAkce(liveAkce)}</span>
            <span className="text-[9px] font-sans font-medium text-slate-500 dark:text-slate-400">{t.akce}</span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          {/* Prominent Language Switcher */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-[#0e1f2b] border border-slate-200 dark:border-[#274858] text-[10px] font-bold shadow-2xs">
            <button
              onClick={() => setLanguage('tr')}
              className={`px-1.5 py-0.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                language === 'tr'
                  ? 'bg-white dark:bg-[#16303f] text-[#d97706] dark:text-[#f2b544] shadow-xs font-black'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white opacity-60'
              }`}
              title="Türkçe"
              aria-label="Türkçe"
            >
              <span>🇹🇷</span>
              <span>TR</span>
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-white dark:bg-[#16303f] text-[#d97706] dark:text-[#f2b544] shadow-xs font-black'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white opacity-60'
              }`}
              title="English"
              aria-label="English"
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#274858] focus-visible:ring-2 focus-visible:ring-[#f2b544] transition-colors"
            title={theme === 'dark' ? (language === 'tr' ? 'Açık temaya geç' : 'Switch to light theme') : (language === 'tr' ? 'Koyu temaya geç' : 'Switch to dark theme')}
            aria-label={t.changeTheme}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#f2b544]" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          <button
            onClick={requestNotificationPermission}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#274858] focus-visible:ring-2 focus-visible:ring-[#f2b544] transition-colors"
            title={notificationsEnabled ? t.notificationsOn : t.notificationsOff}
            aria-label={t.notificationsOff}
          >
            {notificationsEnabled ? (
              <BellRing className="w-4 h-4 text-[#10b981] dark:text-[#5fd3b3]" />
            ) : (
              <Bell className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
