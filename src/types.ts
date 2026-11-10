export interface MiningSession {
  startTime: number; // Server timestamp in ms
  endTime: number; // Server timestamp in ms (startTime + 24h)
  dailyYield: number; // Calculated akce per 24 hours
  claimed: boolean;
}

export interface WheelState {
  spinsAvailable: number;
  lastDailySpinTime: number; // Server timestamp in ms
  totalSpins: number;
}

export interface User {
  id: string;
  email: string;
  nickname: string;
  avatarUrl: string | null;
  joinedAt: number;
  emailVerified: boolean;
  phone: string | null;
  phoneVerified: boolean;
  inviteCode: string;
  invitedBy: string | null;
  invitedCount: number;
  baseBalance: number;
  streak: number;
  lastMiningSession: MiningSession | null;
  wheel: WheelState;
}

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  avatarUrl: string | null;
  akce: number;
  streak: number;
  isCurrentUser?: boolean;
  isMining: boolean;
}

export interface GlobalStats {
  registeredCount: number;
  activeMinersCount: number;
  activeRatePercent: number;
  totalAkce: number;
}

export type TabType = 'mining' | 'wheel' | 'leaderboard' | 'about';

export interface SpinResult {
  sliceIndex: number;
  prizeType: 'akce' | 'spins';
  prizeValue: number;
  label: string;
  newBalance: number;
  spinsAvailable: number;
  nextFreeSpinTime: number;
}
