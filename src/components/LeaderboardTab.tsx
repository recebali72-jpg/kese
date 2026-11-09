import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { LeaderboardEntry } from '../types';
import { apiGetLeaderboard, formatAkce } from '../services/api';
import { Trophy, Medal, Flame, RefreshCw, Crown } from 'lucide-react';

export const LeaderboardTab: React.FC = () => {
  const { user, liveAkce } = useAuth();
  const [list, setList] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const loadLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGetLeaderboard();
      setList(data.leaderboard);
      setCurrentUserRank(data.currentUserRank > 0 ? data.currentUserRank : 1);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  return (
    <div className="flex flex-col gap-4 pb-24 pt-2">
      {/* Top Banner: Big Current User Rank */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-[#16303f] dark:via-[#1a3a4c] dark:to-[#16303f] border-2 border-amber-400 dark:border-[#f2b544]/60 rounded-3xl p-5 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 text-[#f2b544]">
          <Trophy className="w-28 h-28" />
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#d97706] dark:text-[#f2b544] uppercase tracking-wider">
              <Crown className="w-4 h-4" />
              <span>Sıralama Durumun</span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {user?.nickname || 'Sen'}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
              Toplam: <span className="font-mono font-bold text-[#d97706] dark:text-[#f2b544]">{formatAkce(liveAkce)}</span> akçe
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-[#0e1f2b]/80 border-2 border-amber-400 dark:border-[#f2b544] px-4 py-2.5 rounded-2xl shadow-inner min-w-[76px]">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              Sıran
            </span>
            <span className="text-2xl font-black text-[#d97706] dark:text-[#f2b544] font-mono leading-none mt-1">
              #{currentUserRank}
            </span>
          </div>
        </div>
      </div>

      {/* Header and Refresh */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Genel Sıralama ({list.length} kişi)
        </span>
        <button
          onClick={loadLeaderboard}
          disabled={loading}
          className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-[#d97706] dark:hover:text-[#f2b544] transition-colors p-1"
          aria-label="Sıralamayı yenile"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#d97706] dark:text-[#f2b544]' : ''}`} />
          <span>Yenile</span>
        </button>
      </div>

      {/* Leaderboard Table List */}
      <div className="flex flex-col gap-2">
        {list.map((entry, idx) => {
          const rank = idx + 1;
          const isMe = entry.isCurrentUser || entry.id === user?.id;

          let rankBadge = (
            <span className="font-mono font-bold text-xs text-slate-500 dark:text-slate-400 w-6 text-center">
              #{rank}
            </span>
          );

          if (rank === 1) {
            rankBadge = (
              <div className="w-6 h-6 rounded-full bg-[#f2b544] text-[#0e1f2b] flex items-center justify-center font-black text-xs shadow-sm">
                1
              </div>
            );
          } else if (rank === 2) {
            rankBadge = (
              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-300 text-[#0e1f2b] flex items-center justify-center font-black text-xs shadow-sm">
                2
              </div>
            );
          } else if (rank === 3) {
            rankBadge = (
              <div className="w-6 h-6 rounded-full bg-amber-600 dark:bg-[#d97706] text-white flex items-center justify-center font-black text-xs shadow-sm">
                3
              </div>
            );
          }

          return (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                isMe
                  ? 'border-2 border-amber-500 dark:border-[#f2b544] bg-amber-50/90 dark:bg-[#f2b544]/15 shadow-sm'
                  : 'border border-slate-200 dark:border-[#274858] bg-white dark:bg-[#16303f] hover:bg-slate-50 dark:hover:bg-[#1c3c4f] shadow-xs'
              }`}
            >
              {/* Left: Rank, Avatar, Name */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="shrink-0 flex items-center justify-center">{rankBadge}</div>

                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-[#274858] border border-slate-300 dark:border-[#274858] overflow-hidden flex items-center justify-center text-xs font-bold text-slate-700 dark:text-white">
                    {entry.avatarUrl ? (
                      <img
                        src={entry.avatarUrl}
                        alt={entry.nickname}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{entry.nickname.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  {entry.isMining && (
                    <span
                      className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10b981] dark:bg-[#5fd3b3] border border-white dark:border-[#16303f]"
                      title="Şu an kesesi doluyor"
                    />
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[130px]">
                      {entry.nickname}
                    </span>
                    {isMe && (
                      <span className="text-[10px] font-black uppercase text-[#d97706] dark:text-[#f2b544] bg-amber-100 dark:bg-[#f2b544]/20 px-1.5 py-0.2 rounded border border-amber-300 dark:border-[#f2b544]/30 shrink-0">
                        (sen)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                    <Flame className="w-3 h-3 text-[#d97706] dark:text-[#f2b544] fill-current" />
                    <span>{entry.streak} gün seri</span>
                  </div>
                </div>
              </div>

              {/* Right: Akçe Balance */}
              <div className="flex flex-col items-end shrink-0 pl-2">
                <span className="font-mono text-xs font-bold text-[#d97706] dark:text-[#f2b544]">
                  {formatAkce(isMe ? liveAkce : entry.akce)}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">akçe</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
