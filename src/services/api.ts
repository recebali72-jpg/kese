import { User, SpinResult, LeaderboardEntry, GlobalStats } from '../types';

let serverTimeOffset = 0;

export async function fetchServerTime(): Promise<number> {
  try {
    const start = performance.now();
    const res = await fetch('/api/time');
    const data = await res.json();
    const latency = (performance.now() - start) / 2;
    serverTimeOffset = data.serverTime + latency - Date.now();
    return getServerNow();
  } catch (err) {
    console.error('Failed to sync time:', err);
    return Date.now();
  }
}

export function getServerNow(): number {
  return Date.now() + serverTimeOffset;
}

export function formatAkce(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '0,00000';
  return Number(value).toFixed(5).replace('.', ',');
}

export function formatTimeCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('kuyu_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRegister(
  email: string,
  password: string,
  inviteCode?: string,
  phone?: string
): Promise<{ token: string; user: User; welcomeBonusApplied: boolean; verificationCodePreview: string }> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, inviteCode, phone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Kayıt başarısız oldu.');
  localStorage.setItem('kuyu_token', data.token);
  return data;
}

export async function apiLogin(
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Giriş başarısız oldu.');
  localStorage.setItem('kuyu_token', data.token);
  return data;
}

export async function apiGetMe(): Promise<{ user: User; liveBalance: number; serverTime: number } | null> {
  const token = localStorage.getItem('kuyu_token');
  if (!token) return null;

  try {
    const res = await fetch('/api/auth/me', {
      headers: { ...getAuthHeader() },
    });
    if (res.status === 401) {
      localStorage.removeItem('kuyu_token');
      return null;
    }
    const data = await res.json();
    if (!res.ok) {
      localStorage.removeItem('kuyu_token');
      return null;
    }
    if (data.serverTime) {
      serverTimeOffset = data.serverTime - Date.now();
    }
    return data;
  } catch {
    return null;
  }
}

export async function apiVerifyEmail(code: string): Promise<boolean> {
  const res = await fetch('/api/auth/verify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ code }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Kod doğrulanamadı.');
  return data.success;
}

export async function apiResendEmailCode(): Promise<string> {
  const res = await fetch('/api/auth/resend-code', {
    method: 'POST',
    headers: { ...getAuthHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Kod gönderilemedi.');
  return data.codePreview;
}

export async function apiVerifyPhone(phone: string): Promise<boolean> {
  const res = await fetch('/api/auth/verify-phone', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ phone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Telefon doğrulanamadı.');
  return data.success;
}

export async function apiStartMining(): Promise<{
  streak: number;
  dailyYield: number;
  startTime: number;
  endTime: number;
  baseBalance: number;
}> {
  const res = await fetch('/api/mining/start', {
    method: 'POST',
    headers: { ...getAuthHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Keseye akçe dolumu başlatılamadı.');
  if (data.serverTime) {
    serverTimeOffset = data.serverTime - Date.now();
  }
  return data;
}

export async function apiSpinWheel(): Promise<SpinResult> {
  const res = await fetch('/api/wheel/spin', {
    method: 'POST',
    headers: { ...getAuthHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Çark çevrilemedi.');
  return data;
}

export async function apiGetLeaderboard(): Promise<{
  leaderboard: LeaderboardEntry[];
  currentUserRank: number;
  totalParticipants: number;
}> {
  const res = await fetch('/api/leaderboard', {
    headers: { ...getAuthHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Sıralama alınamadı.');
  return data;
}

export async function apiGetStats(): Promise<GlobalStats> {
  const res = await fetch('/api/stats');
  const data = await res.json();
  if (!res.ok) throw new Error('İstatistikler alınamadı.');
  return data;
}

export async function apiUpdateProfile(
  nickname?: string,
  avatarUrl?: string | null
): Promise<{ nickname: string; avatarUrl: string | null }> {
  const res = await fetch('/api/profile/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ nickname, avatarUrl }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Profil güncellenemedi.');
  return data;
}

export async function apiValidateInviteCode(
  code: string
): Promise<{ valid: boolean; inviterNickname?: string; bonusAkce?: number }> {
  try {
    const res = await fetch(`/api/invite/validate/${encodeURIComponent(code)}`);
    return await res.json();
  } catch {
    return { valid: false };
  }
}
