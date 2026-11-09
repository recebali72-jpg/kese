import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, GlobalStats, SpinResult } from '../types';
import {
  apiGetMe,
  apiLogin,
  apiRegister,
  apiStartMining,
  apiSpinWheel,
  apiUpdateProfile,
  apiVerifyEmail,
  apiVerifyPhone,
  apiGetStats,
  getServerNow,
  fetchServerTime
} from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  liveAkce: number;
  stats: GlobalStats | null;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isMiningActive: boolean;
  miningRemainingMs: number;
  graceRemainingMs: number | null;
  currentDailyYield: number;
  sessionEarnedAkce: number;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, inviteCode?: string, phone?: string) => Promise<{ welcomeBonusApplied: boolean; verificationCodePreview: string }>;
  logout: () => void;
  startMining: () => Promise<void>;
  spinWheel: () => Promise<SpinResult>;
  updateProfile: (nickname?: string, avatarUrl?: string | null) => Promise<void>;
  verifyEmail: (code: string) => Promise<boolean>;
  verifyPhone: (phone: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  notificationsEnabled: boolean;
  requestNotificationPermission: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [liveAkce, setLiveAkce] = useState<number>(0);
  const [sessionEarnedAkce, setSessionEarnedAkce] = useState<number>(0);
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [isMiningActive, setIsMiningActive] = useState<boolean>(false);
  const [miningRemainingMs, setMiningRemainingMs] = useState<number>(0);
  const [graceRemainingMs, setGraceRemainingMs] = useState<number | null>(null);
  const [notificationSentForSession, setNotificationSentForSession] = useState<number | null>(null);

  // Initialize theme from localStorage or default light (açık gri)
  useEffect(() => {
    const savedTheme = localStorage.getItem('kuyu_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      document.documentElement.classList.toggle('light', savedTheme === 'light');
    } else {
      setTheme('light');
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }

    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('kuyu_theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    document.documentElement.classList.toggle('light', nextTheme === 'light');
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) return false;
    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setNotificationsEnabled(granted);
      return granted;
    } catch {
      return false;
    }
  };

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiGetMe();
      if (!data) {
        setUser(null);
      } else {
        setUser(data.user);
        setLiveAkce(data.liveBalance);
      }
    } catch {
      localStorage.removeItem('kuyu_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const s = await apiGetStats();
      setStats(s);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchServerTime().then(() => {
      refreshUser();
      refreshStats();
    });
    const interval = setInterval(refreshStats, 30000);
    return () => clearInterval(interval);
  }, [refreshUser, refreshStats]);

  // Live Mining Calculation loop (every 500ms for smooth live counter)
  useEffect(() => {
    if (!user) {
      setIsMiningActive(false);
      setMiningRemainingMs(0);
      setGraceRemainingMs(null);
      return;
    }

    const timer = setInterval(() => {
      const now = getServerNow();
      const session = user.lastMiningSession;
      const DAY_MS = 24 * 60 * 60 * 1000;

      if (session) {
        if (now < session.endTime) {
          // Mining is active!
          setIsMiningActive(true);
          const remaining = Math.max(0, session.endTime - now);
          setMiningRemainingMs(remaining);
          setGraceRemainingMs(null);

          const elapsedSec = Math.max(0, (now - session.startTime) / 1000);
          const earned = Math.min(session.dailyYield, (elapsedSec / 86400) * session.dailyYield);
          const safeEarnedRounded = Math.round(earned * 100000) / 100000;
          setSessionEarnedAkce(safeEarnedRounded);
          setLiveAkce(Math.round((user.baseBalance + safeEarnedRounded) * 100000) / 100000);
        } else {
          // Mining finished!
          setIsMiningActive(false);
          setMiningRemainingMs(0);
          setSessionEarnedAkce(0);

          // Grace period check: 24h after endTime
          const graceDeadline = session.endTime + DAY_MS;
          if (now <= graceDeadline) {
            setGraceRemainingMs(graceDeadline - now);
          } else {
            setGraceRemainingMs(null); // Grace expired, streak resets on next start
          }

          // Balance with completed yield
          const settled = session.claimed ? user.baseBalance : user.baseBalance + session.dailyYield;
          setLiveAkce(Math.round(settled * 100000) / 100000);

          // Trigger "Madenciliğin hazır" notification once when session completes
          if (
            notificationsEnabled &&
            'Notification' in window &&
            Notification.permission === 'granted' &&
            notificationSentForSession !== session.startTime
          ) {
            setNotificationSentForSession(session.startTime);
            try {
              new Notification('Kese', {
                body: 'Kesen hazır! 🪙 Akçeni topla ve serini korumak için keseyi doldurmaya başla.',
                icon: '/favicon.ico',
              });
            } catch (e) {
              console.log('Notification error:', e);
            }
          }
        }
      } else {
        setIsMiningActive(false);
        setMiningRemainingMs(0);
        setGraceRemainingMs(null);
        setSessionEarnedAkce(0);
        setLiveAkce(user.baseBalance);
      }
    }, 500);

    return () => clearInterval(timer);
  }, [user, notificationsEnabled, notificationSentForSession]);

  const login = async (email: string, pass: string) => {
    const res = await apiLogin(email, pass);
    setUser(res.user);
    setLiveAkce(res.user.baseBalance);
    refreshStats();
  };

  const register = async (email: string, pass: string, inviteCode?: string, phone?: string) => {
    const res = await apiRegister(email, pass, inviteCode, phone);
    setUser(res.user);
    setLiveAkce(res.user.baseBalance);
    refreshStats();
    return {
      welcomeBonusApplied: res.welcomeBonusApplied,
      verificationCodePreview: res.verificationCodePreview,
    };
  };

  const logout = () => {
    localStorage.removeItem('kuyu_token');
    setUser(null);
    setLiveAkce(0);
    setSessionEarnedAkce(0);
    setIsMiningActive(false);
  };

  const startMining = async () => {
    const res = await apiStartMining();
    if (user) {
      setUser({
        ...user,
        streak: res.streak,
        baseBalance: res.baseBalance,
        lastMiningSession: {
          startTime: res.startTime,
          endTime: res.endTime,
          dailyYield: res.dailyYield,
          claimed: false,
        },
      });
      setIsMiningActive(true);
      setMiningRemainingMs(res.endTime - res.startTime);
      setSessionEarnedAkce(0);
      setGraceRemainingMs(null);
    }
    refreshStats();
  };

  const spinWheel = async (): Promise<SpinResult> => {
    const res = await apiSpinWheel();
    if (user) {
      setUser({
        ...user,
        baseBalance: res.newBalance,
        wheel: {
          ...user.wheel,
          spinsAvailable: res.spinsAvailable,
          lastDailySpinTime: getServerNow(),
          totalSpins: user.wheel.totalSpins + 1,
        },
      });
      if (res.prizeType === 'akce') {
        setLiveAkce(res.newBalance);
      }
    }
    return res;
  };

  const updateProfile = async (nickname?: string, avatarUrl?: string | null) => {
    const res = await apiUpdateProfile(nickname, avatarUrl);
    if (user) {
      setUser({
        ...user,
        nickname: res.nickname,
        avatarUrl: res.avatarUrl,
      });
    }
  };

  const verifyEmail = async (code: string): Promise<boolean> => {
    const success = await apiVerifyEmail(code);
    if (success && user) {
      setUser({ ...user, emailVerified: true });
    }
    return success;
  };

  const verifyPhone = async (phone: string): Promise<boolean> => {
    const success = await apiVerifyPhone(phone);
    if (success && user) {
      setUser({ ...user, phone, phoneVerified: true });
    }
    return success;
  };

  // Formula: 1 + (1 - 0.9^(seri - 1))
  const currentDailyYield = user
    ? Math.round((1 + (1 - Math.pow(0.9, Math.max(1, user.streak) - 1))) * 100000) / 100000
    : 1.0;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        liveAkce,
        stats,
        theme,
        toggleTheme,
        isMiningActive,
        miningRemainingMs,
        graceRemainingMs,
        currentDailyYield,
        sessionEarnedAkce,
        login,
        register,
        logout,
        startMining,
        spinWheel,
        updateProfile,
        verifyEmail,
        verifyPhone,
        refreshUser,
        notificationsEnabled,
        requestNotificationPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
