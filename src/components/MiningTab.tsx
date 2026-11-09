import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatAkce, formatTimeCountdown } from '../services/api';
import { Flame, Users, AlertCircle, Sparkles } from 'lucide-react';
import { AnimatedKese } from './KeseIcon';

export const MiningTab: React.FC = () => {
  const {
    user,
    isMiningActive,
    miningRemainingMs,
    graceRemainingMs,
    currentDailyYield,
    sessionEarnedAkce,
    startMining,
    stats
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStartMining = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await startMining();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Keseye akçe dolumu başlatılamadı.');
    } finally {
      setLoading(false);
    }
  };

  // Ring calculation
  // Total 24 hours in ms
  const TOTAL_24H_MS = 24 * 60 * 60 * 1000;
  const radius = 108;
  const circumference = 2 * Math.PI * radius;

  // Active ring: counts down from 1 to 0 (mint green)
  // Inactive ring: full circle (coral red)
  const progressRatio = isMiningActive ? Math.max(0, Math.min(1, miningRemainingMs / TOTAL_24H_MS)) : 1;
  const strokeDashoffset = isMiningActive ? circumference * (1 - progressRatio) : 0;
  const ringColor = isMiningActive ? '#5fd3b3' : '#e8616b';

  return (
    <div className="flex flex-col gap-5 pb-24 pt-2">
      {/* Grace period warning if session completed and grace countdown is ticking */}
      {graceRemainingMs !== null && graceRemainingMs > 0 && !isMiningActive && (
        <div className="bg-[#e8616b]/15 border-2 border-[#e8616b] text-[#e8616b] px-4 py-3 rounded-2xl flex items-center gap-3 animate-pulse">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="text-xs font-semibold leading-relaxed">
            <span className="font-bold block text-sm">Serini Koru!</span>
            Serini korumak için{' '}
            <span className="font-mono font-bold underline">
              {formatTimeCountdown(graceRemainingMs)}
            </span>{' '}
            içinde başla!
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-[#e8616b]/20 border border-[#e8616b] text-white px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#e8616b] shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Mining Centerpiece */}
      <div className="flex flex-col items-center justify-center pt-2">
        <div className="relative w-[260px] h-[260px] flex items-center justify-center">
          {/* SVG Circular Ring */}
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
            {/* Background track circle */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              className="stroke-slate-300 dark:stroke-[#274858]"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Active / Inactive Ring */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke={ringColor}
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                transition: isMiningActive ? 'stroke-dashoffset 1s linear' : 'none',
              }}
            />
          </svg>

          {/* Central Circular Button */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            {isMiningActive ? (
              // Locked active state: Kese filling with gold coins & live session counter
              <div
                className="w-[185px] h-[185px] rounded-full bg-white dark:bg-[#16303f] border-4 border-[#10b981] dark:border-[#5fd3b3]/50 flex flex-col items-center justify-center shadow-lg text-center px-2 py-1 relative overflow-hidden"
                role="status"
                aria-live="polite"
              >
                <div className="scale-85 -my-1">
                  <AnimatedKese isActive={true} className="w-18 h-18" />
                </div>
                <div className="font-mono text-lg font-black text-slate-900 dark:text-white tracking-wider leading-tight">
                  {formatTimeCountdown(miningRemainingMs)}
                </div>
                <div className="mt-1 flex flex-col items-center bg-emerald-50 dark:bg-[#5fd3b3]/15 px-2.5 py-0.5 rounded-xl border border-emerald-200 dark:border-[#5fd3b3]/30 shadow-xs">
                  <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider leading-none mb-0.5">
                    Bu Oturumda Biriken
                  </span>
                  <div className="flex items-center gap-1 font-mono text-xs font-black text-[#059669] dark:text-[#5fd3b3] tracking-tight">
                    <span>+{formatAkce(sessionEarnedAkce)}</span>
                    <span className="font-sans font-medium text-[9px] text-slate-500 dark:text-slate-400">akçe</span>
                  </div>
                </div>
              </div>
            ) : (
              // Start Button: Keseyi Doldur
              <button
                onClick={handleStartMining}
                disabled={loading}
                className="w-[185px] h-[185px] rounded-full bg-gradient-to-tr from-[#f2b544] via-[#f7c768] to-[#f2b544] text-[#0e1f2b] font-black text-sm uppercase tracking-tight flex flex-col items-center justify-center shadow-xl shadow-[#f2b544]/25 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f2b544]/50 group px-2"
                aria-label="Keseyi doldur"
              >
                <div className="scale-90 -my-0.5 group-hover:scale-100 transition-transform duration-300">
                  <AnimatedKese isActive={false} className="w-18 h-18" />
                </div>
                <span className="leading-tight text-center px-1 font-extrabold text-sm text-[#0e1f2b]">
                  {loading ? 'Başlatılıyor...' : 'Keseyi Doldur'}
                </span>
                <span className="text-[10px] font-bold normal-case tracking-normal opacity-85 mt-0.5 text-[#0e1f2b]">
                  24 saatlik dolum
                </span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* 3 Metric Mini Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Card 1: Streak */}
        <div className="bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] rounded-2xl p-3 flex flex-col items-center text-center shadow-xs">
          <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-[#f2b544]/15 text-[#d97706] dark:text-[#f2b544] flex items-center justify-center mb-1.5">
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            Günlük Seri
          </span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
            {user?.streak || 1}. Gün
          </span>
          <span className="text-[9px] text-[#059669] dark:text-[#5fd3b3] mt-0.5 font-medium">
            Her gün +bonus
          </span>
        </div>

        {/* Card 2: Daily Yield */}
        <div className="bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] rounded-2xl p-3 flex flex-col items-center text-center shadow-xs">
          <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-[#5fd3b3]/15 text-[#059669] dark:text-[#5fd3b3] flex items-center justify-center mb-1.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            Günlük Kazanç
          </span>
          <span className="text-base font-extrabold text-[#d97706] dark:text-[#f2b544] mt-0.5 font-mono">
            +{formatAkce(currentDailyYield).split(',')[0]},{formatAkce(currentDailyYield).split(',')[1].slice(0, 2)}
          </span>
          <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            akçe / 24 saat
          </span>
        </div>

        {/* Card 3: Invited Count */}
        <div className="bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] rounded-2xl p-3 flex flex-col items-center text-center shadow-xs">
          <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-[#274858] text-[#d97706] dark:text-[#f2b544] flex items-center justify-center mb-1.5">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            Davet Edilen
          </span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
            {user?.invitedCount || 0} Kişi
          </span>
          <span className="text-[9px] text-[#d97706] dark:text-[#f2b544] mt-0.5 font-medium">
            +5 akçe/davet
          </span>
        </div>
      </div>

      {/* Referral Info Banner */}
      <div className="bg-white dark:bg-gradient-to-r dark:from-[#16303f] dark:to-[#1e3f52] border border-slate-200 dark:border-[#274858] rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-[#f2b544]/20 border border-amber-200 dark:border-[#f2b544]/30 flex items-center justify-center text-[#d97706] dark:text-[#f2b544] shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Arkadaşını Davet Et</div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300">
              Sana <span className="text-[#d97706] dark:text-[#f2b544] font-bold">+5 akçe</span>, arkadaşına{' '}
              <span className="text-[#059669] dark:text-[#5fd3b3] font-bold">+2 akçe</span> hoş geldin bonusu.
            </div>
          </div>
        </div>
        <div className="bg-slate-100 dark:bg-[#0e1f2b] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#274858] text-[11px] font-mono font-bold text-[#d97706] dark:text-[#f2b544]">
          {user?.inviteCode || 'KESE-KOD'}
        </div>
      </div>

      {/* Bottom Global Community Stats Card: exactly three numbers, no charts! */}
      <div className="bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] rounded-2xl p-4 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 text-center">
          Topluluk Kese Durumu
        </div>
        <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-[#274858] text-center">
          <div className="px-2">
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              {stats?.registeredCount ?? 1}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-tight">
              Kayıtlı Kişi
            </div>
          </div>
          <div className="px-2">
            <div className="text-lg font-extrabold text-[#059669] dark:text-[#5fd3b3]">
              {stats?.activeMinersCount ?? 0}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-tight">
              Aktif Kese
            </div>
          </div>
          <div className="px-2">
            <div className="text-lg font-extrabold text-[#d97706] dark:text-[#f2b544]">
              %{stats?.activeRatePercent ?? 0}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-tight">
              Aktif Oranı
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
