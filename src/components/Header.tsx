import React from 'react';
import { useAuth } from '../context/AuthContext';
import { formatAkce } from '../services/api';
import { Coins, Sun, Moon, Bell, BellRing, Download } from 'lucide-react';
import { KeseIcon, KlasikAkce } from './KeseIcon';

interface HeaderProps {
  onOpenProfile: () => void;
  onOpenInstall?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProfile, onOpenInstall }) => {
  const { user, liveAkce, theme, toggleTheme, notificationsEnabled, requestNotificationPermission } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/95 dark:bg-[#16303f]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#274858] transition-colors shadow-xs">
      {/* Left: Avatar & Logo */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenProfile}
          className="relative group rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b544] transition-transform active:scale-95"
          aria-label="Profil sayfasını aç"
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
              Kese
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[100px]">
            {user?.nickname || 'Üye'}
          </span>
        </div>
      </div>

      {/* Right: Balance & Theme / Notification */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end bg-slate-100 dark:bg-[#0e1f2b]/80 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-[#274858]">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            Akçe Bakiyesi
          </span>
          <div className="flex items-center gap-1.5 font-mono font-bold text-[#d97706] dark:text-[#f2b544] text-sm">
            <KlasikAkce size={15} className="animate-pulse" />
            <span>{formatAkce(liveAkce)}</span>
            <span className="text-[10px] font-sans font-medium text-slate-500 dark:text-slate-400">akçe</span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#274858] focus-visible:ring-2 focus-visible:ring-[#f2b544] transition-colors"
            title={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
            aria-label="Tema değiştir"
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
            title={notificationsEnabled ? 'Bildirimler etkin' : 'Bildirimleri aç'}
            aria-label="Bildirim ayarı"
          >
            {notificationsEnabled ? (
              <BellRing className="w-4 h-4 text-[#10b981] dark:text-[#5fd3b3]" />
            ) : (
              <Bell className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {onOpenInstall && (
            <button
              onClick={onOpenInstall}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#274858] focus-visible:ring-2 focus-visible:ring-[#f2b544] transition-colors"
              title="Telefona İndir / Yükle"
              aria-label="Telefona İndir"
            >
              <Download className="w-4 h-4 text-[#d97706] dark:text-[#f2b544]" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
