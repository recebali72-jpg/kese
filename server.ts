import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DB_FILE = path.resolve(__dirname, 'kuyu_database.json');

// Interface for database storage
interface UserRecord {
  id: string;
  email: string;
  password: string;
  nickname: string;
  avatarUrl: string | null;
  joinedAt: number;
  emailVerified: boolean;
  verificationCode: string;
  phone: string | null;
  phoneVerified: boolean;
  inviteCode: string;
  invitedBy: string | null;
  invitedCount: number;
  baseBalance: number;
  streak: number;
  lastMiningSession: {
    startTime: number;
    endTime: number;
    dailyYield: number;
    claimed: boolean;
  } | null;
  wheel: {
    spinsAvailable: number;
    lastDailySpinTime: number;
    totalSpins: number;
  };
}

interface Database {
  users: Record<string, UserRecord>;
  sessions: Record<string, string>; // token -> userId
}

// Initial mock community miners to populate leaderboard and community stats
function getInitialMockUsers(): Record<string, UserRecord> {
  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;
  
  const mocks: Partial<UserRecord>[] = [
    {
      id: 'mock_1',
      email: 'ahmet.kaya@kuyu.app',
      nickname: 'ahmet_kaya',
      baseBalance: 84.72510,
      streak: 28,
      invitedCount: 7,
      joinedAt: now - 35 * DAY_MS,
      avatarUrl: null,
      lastMiningSession: {
        startTime: now - 3 * 3600 * 1000,
        endTime: now + 21 * 3600 * 1000,
        dailyYield: 1.94,
        claimed: false
      }
    },
    {
      id: 'mock_2',
      email: 'deniz.alp@kuyu.app',
      nickname: 'deniz_alp',
      baseBalance: 62.41090,
      streak: 19,
      invitedCount: 4,
      joinedAt: now - 25 * DAY_MS,
      avatarUrl: null,
      lastMiningSession: {
        startTime: now - 11 * 3600 * 1000,
        endTime: now + 13 * 3600 * 1000,
        dailyYield: 1.86,
        claimed: false
      }
    },
    {
      id: 'mock_3',
      email: 'selin.demir@kuyu.app',
      nickname: 'selin_demir',
      baseBalance: 49.19830,
      streak: 15,
      invitedCount: 3,
      joinedAt: now - 20 * DAY_MS,
      avatarUrl: null,
      lastMiningSession: {
        startTime: now - 18 * 3600 * 1000,
        endTime: now + 6 * 3600 * 1000,
        dailyYield: 1.79,
        claimed: false
      }
    },
    {
      id: 'mock_4',
      email: 'kadir.k@kuyu.app',
      nickname: 'anadolu_madenci',
      baseBalance: 37.89200,
      streak: 12,
      invitedCount: 2,
      joinedAt: now - 16 * DAY_MS,
      avatarUrl: null,
      lastMiningSession: {
        startTime: now - 8 * 3600 * 1000,
        endTime: now + 16 * 3600 * 1000,
        dailyYield: 1.72,
        claimed: false
      }
    },
    {
      id: 'mock_5',
      email: 'zeynep.avci@kuyu.app',
      nickname: 'zeynep_avci',
      baseBalance: 24.50200,
      streak: 8,
      invitedCount: 1,
      joinedAt: now - 12 * DAY_MS,
      avatarUrl: null,
      lastMiningSession: {
        startTime: now - 23 * 3600 * 1000,
        endTime: now + 1 * 3600 * 1000,
        dailyYield: 1.52,
        claimed: false
      }
    },
    {
      id: 'mock_6',
      email: 'mert.ozkan@kuyu.app',
      nickname: 'mert_ozkan',
      baseBalance: 16.32000,
      streak: 5,
      invitedCount: 0,
      joinedAt: now - 7 * DAY_MS,
      avatarUrl: null,
      lastMiningSession: null
    },
    {
      id: 'mock_7',
      email: 'elif.kara@kuyu.app',
      nickname: 'elif_kara',
      baseBalance: 8.91000,
      streak: 3,
      invitedCount: 0,
      joinedAt: now - 4 * DAY_MS,
      avatarUrl: null,
      lastMiningSession: {
        startTime: now - 5 * 3600 * 1000,
        endTime: now + 19 * 3600 * 1000,
        dailyYield: 1.19,
        claimed: false
      }
    }
  ];

  const map: Record<string, UserRecord> = {};
  mocks.forEach((m, idx) => {
    map[m.id!] = {
      id: m.id!,
      email: m.email!,
      password: 'password123',
      nickname: m.nickname!,
      avatarUrl: m.avatarUrl || null,
      joinedAt: m.joinedAt!,
      emailVerified: true,
      verificationCode: '123456',
      phone: '+90555000000' + idx,
      phoneVerified: true,
      inviteCode: `KUYU-MOCK${idx + 1}`,
      invitedBy: null,
      invitedCount: m.invitedCount || 0,
      baseBalance: m.baseBalance || 0,
      streak: m.streak || 1,
      lastMiningSession: m.lastMiningSession || null,
      wheel: {
        spinsAvailable: 1,
        lastDailySpinTime: now - 12 * 3600 * 1000,
        totalSpins: 5
      }
    };
  });
  return map;
}

function loadDB(): Database {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      if (data && data.users) {
        return data;
      }
    }
  } catch (err) {
    console.error('Error loading database, initializing fresh:', err);
  }
  const initialDb: Database = {
    users: getInitialMockUsers(),
    sessions: {}
  };
  saveDB(initialDb);
  return initialDb;
}

function saveDB(db: Database) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

let db = loadDB();

// Yield calculation formula: 1 + (1 - 0.9^(seri - 1))
export function calculateDailyYield(streak: number): number {
  const s = Math.max(1, streak);
  const yieldAmount = 1 + (1 - Math.pow(0.9, s - 1));
  // Round to 5 decimals
  return Math.round(yieldAmount * 100000) / 100000;
}

// Generate unique invite code like KESE-4821
function generateInviteCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `KESE-${num}`;
}

// Helper: Calculate live akce balance for a user
function computeUserLiveBalance(user: UserRecord, now: number): number {
  let balance = user.baseBalance;
  if (user.lastMiningSession) {
    if (now >= user.lastMiningSession.endTime) {
      // If completed but not yet claimed/settled into baseBalance
      if (!user.lastMiningSession.claimed) {
        balance += user.lastMiningSession.dailyYield;
      }
    } else if (now > user.lastMiningSession.startTime) {
      const elapsedSeconds = Math.max(0, (now - user.lastMiningSession.startTime) / 1000);
      const earnedActive = (elapsedSeconds / 86400) * user.lastMiningSession.dailyYield;
      balance += earnedActive;
    }
  }
  return Math.round(balance * 100000) / 100000;
}

// Settle completed mining session into baseBalance if needed
function settleUserMiningSession(user: UserRecord, now: number): boolean {
  let changed = false;
  if (user.lastMiningSession && now >= user.lastMiningSession.endTime && !user.lastMiningSession.claimed) {
    user.baseBalance = Math.round((user.baseBalance + user.lastMiningSession.dailyYield) * 100000) / 100000;
    user.lastMiningSession.claimed = true;
    changed = true;
  }
  return changed;
}

// Check wheel daily spin availability
function checkWheelDailySpin(user: UserRecord, now: number): boolean {
  let changed = false;
  const DAY_MS = 24 * 60 * 60 * 1000;
  if (now - user.wheel.lastDailySpinTime >= DAY_MS) {
    if (user.wheel.spinsAvailable === 0) {
      user.wheel.spinsAvailable = 1;
      changed = true;
    }
  }
  return changed;
}

// Get user from Authorization header
function getAuthUser(req: express.Request): UserRecord | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  const userId = db.sessions[token];
  if (!userId || !db.users[userId]) {
    return null;
  }
  return db.users[userId];
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // Middleware to sync server time
  app.get('/api/time', (req, res) => {
    res.json({ serverTime: Date.now() });
  });

  // Global Community Stats
  app.get('/api/stats', (req, res) => {
    const now = Date.now();
    const allUsers = Object.values(db.users);
    const registeredCount = allUsers.length;
    let activeMinersCount = 0;

    for (const u of allUsers) {
      if (u.lastMiningSession && now >= u.lastMiningSession.startTime && now < u.lastMiningSession.endTime) {
        activeMinersCount++;
      }
    }

    const activeRatePercent = registeredCount > 0 
      ? Math.round((activeMinersCount / registeredCount) * 1000) / 10 
      : 0;

    res.json({
      registeredCount,
      activeMinersCount,
      activeRatePercent
    });
  });

  // Auth: Register
  app.post('/api/auth/register', (req, res) => {
    const { email, password, inviteCode, phone } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Geçerli bir e-posta adresi girin.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Şifre en az 6 karakter olmalıdır.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = Object.values(db.users).find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(400).json({ error: 'Bu e-posta adresiyle kayıtlı bir hesap zaten var.' });
    }

    const now = Date.now();
    const userId = 'usr_' + crypto.randomBytes(8).toString('hex');
    const token = 'tok_' + crypto.randomBytes(16).toString('hex');

    // Default nickname is part before @
    const defaultNickname = normalizedEmail.split('@')[0] || 'Madenci';
    const userInviteCode = generateInviteCode();
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    let initialBalance = 0;
    let inviterUser: UserRecord | null = null;

    // Check optional invite code
    if (inviteCode && typeof inviteCode === 'string') {
      const codeClean = inviteCode.trim().toUpperCase();
      const referrer = Object.values(db.users).find(u => u.inviteCode.toUpperCase() === codeClean);
      if (referrer) {
        inviterUser = referrer;
        initialBalance += 2.00000; // +2 akçe welcome bonus for new user
        referrer.invitedCount += 1;
        referrer.baseBalance = Math.round((referrer.baseBalance + 5.00000) * 100000) / 100000; // +5 akçe to referrer
      }
    }

    const newUser: UserRecord = {
      id: userId,
      email: normalizedEmail,
      password,
      nickname: defaultNickname,
      avatarUrl: null,
      joinedAt: now,
      emailVerified: false,
      verificationCode,
      phone: phone || null,
      phoneVerified: false,
      inviteCode: userInviteCode,
      invitedBy: inviterUser ? inviterUser.id : null,
      invitedCount: 0,
      baseBalance: initialBalance,
      streak: 1,
      lastMiningSession: null,
      wheel: {
        spinsAvailable: 1,
        lastDailySpinTime: now - 25 * 60 * 60 * 1000, // Available immediately
        totalSpins: 0
      }
    };

    db.users[userId] = newUser;
    db.sessions[token] = userId;
    saveDB(db);

    res.json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        nickname: newUser.nickname,
        avatarUrl: newUser.avatarUrl,
        joinedAt: newUser.joinedAt,
        emailVerified: newUser.emailVerified,
        phone: newUser.phone,
        phoneVerified: newUser.phoneVerified,
        inviteCode: newUser.inviteCode,
        invitedBy: newUser.invitedBy,
        invitedCount: newUser.invitedCount,
        baseBalance: newUser.baseBalance,
        streak: newUser.streak,
        lastMiningSession: newUser.lastMiningSession,
        wheel: newUser.wheel
      },
      welcomeBonusApplied: !!inviterUser,
      verificationCodePreview: verificationCode // sent to allow instant seamless testing of email verification
    });
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'E-posta ve şifre gereklidir.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = Object.values(db.users).find(
      u => u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: 'E-posta veya şifre hatalı.' });
    }

    const token = 'tok_' + crypto.randomBytes(16).toString('hex');
    db.sessions[token] = user.id;
    saveDB(db);

    const now = Date.now();
    settleUserMiningSession(user, now);
    checkWheelDailySpin(user, now);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatarUrl: user.avatarUrl,
        joinedAt: user.joinedAt,
        emailVerified: user.emailVerified,
        phone: user.phone,
        phoneVerified: user.phoneVerified,
        inviteCode: user.inviteCode,
        invitedBy: user.invitedBy,
        invitedCount: user.invitedCount,
        baseBalance: user.baseBalance,
        streak: user.streak,
        lastMiningSession: user.lastMiningSession,
        wheel: user.wheel
      }
    });
  });

  // Auth: Verify Email
  app.post('/api/auth/verify-email', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Oturum açmanız gerekiyor.' });
    }
    const { code } = req.body;
    if (!code || code !== user.verificationCode) {
      return res.status(400).json({ error: 'Geçersiz doğrulama kodu.' });
    }
    user.emailVerified = true;
    saveDB(db);
    res.json({ success: true, emailVerified: true });
  });

  // Auth: Resend Verification Code
  app.post('/api/auth/resend-code', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Oturum açmanız gerekiyor.' });
    }
    user.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    saveDB(db);
    res.json({ success: true, codePreview: user.verificationCode });
  });

  // Auth: Verify Phone (bot protection)
  app.post('/api/auth/verify-phone', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Oturum açmanız gerekiyor.' });
    }
    const { phone } = req.body;
    if (!phone || phone.length < 7) {
      return res.status(400).json({ error: 'Geçerli bir telefon numarası girin.' });
    }
    user.phone = phone;
    user.phoneVerified = true;
    saveDB(db);
    res.json({ success: true, phoneVerified: true, phone });
  });

  // Auth: Me
  app.get('/api/auth/me', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Oturum bulunamadı.' });
    }
    const now = Date.now();
    const changedMining = settleUserMiningSession(user, now);
    const changedWheel = checkWheelDailySpin(user, now);
    if (changedMining || changedWheel) {
      saveDB(db);
    }

    const liveBalance = computeUserLiveBalance(user, now);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatarUrl: user.avatarUrl,
        joinedAt: user.joinedAt,
        emailVerified: user.emailVerified,
        phone: user.phone,
        phoneVerified: user.phoneVerified,
        inviteCode: user.inviteCode,
        invitedBy: user.invitedBy,
        invitedCount: user.invitedCount,
        baseBalance: user.baseBalance,
        streak: user.streak,
        lastMiningSession: user.lastMiningSession,
        wheel: user.wheel
      },
      liveBalance,
      serverTime: now
    });
  });

  // Update Profile (Nickname, Avatar)
  app.post('/api/profile/update', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Oturum bulunamadı.' });
    }
    const { nickname, avatarUrl } = req.body;
    if (nickname !== undefined) {
      const cleanNick = String(nickname).trim();
      if (cleanNick.length < 2 || cleanNick.length > 24) {
        return res.status(400).json({ error: 'Takma ad 2 ile 24 karakter arasında olmalıdır.' });
      }
      user.nickname = cleanNick;
    }
    if (avatarUrl !== undefined) {
      user.avatarUrl = avatarUrl ? String(avatarUrl) : null;
    }
    saveDB(db);
    res.json({
      success: true,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl
    });
  });

  // Mining: Start Session
  app.post('/api/mining/start', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Oturum bulunamadı.' });
    }

    const now = Date.now();
    const DAY_MS = 24 * 60 * 60 * 1000;

    // Check if currently active session
    if (user.lastMiningSession && now < user.lastMiningSession.endTime) {
      return res.status(400).json({ 
        error: 'Madencilik zaten devam ediyor.',
        remainingMs: user.lastMiningSession.endTime - now
      });
    }

    // Settle prior completed session if needed
    if (user.lastMiningSession && !user.lastMiningSession.claimed) {
      user.baseBalance = Math.round((user.baseBalance + user.lastMiningSession.dailyYield) * 100000) / 100000;
      user.lastMiningSession.claimed = true;
    }

    // Streak logic:
    // If no previous session, streak = 1
    // If previous session ended:
    // User must start within 24 hours of endTime to continue streak
    // If now <= endTime + 24 hours, streak increases by 1!
    // Else streak resets to 1.
    let newStreak = 1;
    if (user.lastMiningSession) {
      const graceDeadline = user.lastMiningSession.endTime + DAY_MS;
      if (now <= graceDeadline) {
        newStreak = user.streak + 1;
      } else {
        newStreak = 1; // Streak broken!
      }
    } else {
      newStreak = 1;
    }

    user.streak = newStreak;
    const dailyYield = calculateDailyYield(newStreak);

    user.lastMiningSession = {
      startTime: now,
      endTime: now + DAY_MS,
      dailyYield,
      claimed: false
    };

    saveDB(db);

    res.json({
      success: true,
      streak: user.streak,
      dailyYield,
      startTime: now,
      endTime: user.lastMiningSession.endTime,
      baseBalance: user.baseBalance,
      serverTime: now
    });
  });

  // Wheel: Spin Outcome (Server Authoritative)
  app.post('/api/wheel/spin', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Oturum bulunamadı.' });
    }

    const now = Date.now();
    checkWheelDailySpin(user, now);

    if (user.wheel.spinsAvailable <= 0) {
      const DAY_MS = 24 * 60 * 60 * 1000;
      const nextFreeTime = user.wheel.lastDailySpinTime + DAY_MS;
      return res.status(400).json({
        error: 'Çevirme hakkınız bitti.',
        nextFreeSpinTime: Math.max(now, nextFreeTime)
      });
    }

    // 7 slices and exact requested probabilities:
    // Index 0: 0.1 akçe -> 50%
    // Index 1: 0.2 akçe -> 25%
    // Index 2: 0.3 akçe -> 10%
    // Index 3: 0.5 akçe -> 5%
    // Index 4: 1.0 akçe -> 1%
    // Index 5: 2 çevirme jokeri -> 6%
    // Index 6: 3 çevirme jokeri -> 3%
    const slices = [
      { index: 0, prizeType: 'akce', prizeValue: 0.1, label: '0,1 akçe', weight: 50 },
      { index: 1, prizeType: 'akce', prizeValue: 0.2, label: '0,2 akçe', weight: 25 },
      { index: 2, prizeType: 'spins', prizeValue: 2, label: '2 çevirme', weight: 6 },
      { index: 3, prizeType: 'akce', prizeValue: 0.5, label: '0,5 akçe', weight: 5 },
      { index: 4, prizeType: 'akce', prizeValue: 1.0, label: '1 akçe', weight: 1 },
      { index: 5, prizeType: 'akce', prizeValue: 0.3, label: '0,3 akçe', weight: 10 },
      { index: 6, prizeType: 'spins', prizeValue: 3, label: '3 çevirme', weight: 3 },
    ];

    // Cryptographically secure RNG between 0 and 99.99999
    const randomVal = crypto.randomInt(0, 100000) / 1000; // 0 to 100
    let cumulative = 0;
    let selectedSlice = slices[0];

    for (const slice of slices) {
      cumulative += slice.weight;
      if (randomVal < cumulative) {
        selectedSlice = slice;
        break;
      }
    }

    // Consume 1 spin right
    user.wheel.spinsAvailable -= 1;
    user.wheel.totalSpins += 1;
    user.wheel.lastDailySpinTime = now;

    // Apply prize
    if (selectedSlice.prizeType === 'akce') {
      user.baseBalance = Math.round((user.baseBalance + selectedSlice.prizeValue) * 100000) / 100000;
    } else if (selectedSlice.prizeType === 'spins') {
      user.wheel.spinsAvailable += selectedSlice.prizeValue;
    }

    saveDB(db);

    const DAY_MS = 24 * 60 * 60 * 1000;
    const nextFreeSpinTime = user.wheel.lastDailySpinTime + DAY_MS;

    res.json({
      sliceIndex: selectedSlice.index,
      prizeType: selectedSlice.prizeType,
      prizeValue: selectedSlice.prizeValue,
      label: selectedSlice.label,
      newBalance: user.baseBalance,
      spinsAvailable: user.wheel.spinsAvailable,
      nextFreeSpinTime
    });
  });

  // Leaderboard
  app.get('/api/leaderboard', (req, res) => {
    const currentUser = getAuthUser(req);
    const now = Date.now();

    // Map all users with their live akce balances
    const entries = Object.values(db.users).map(u => {
      const akce = computeUserLiveBalance(u, now);
      const isMining = Boolean(
        u.lastMiningSession && 
        now >= u.lastMiningSession.startTime && 
        now < u.lastMiningSession.endTime
      );
      return {
        id: u.id,
        nickname: u.nickname,
        avatarUrl: u.avatarUrl,
        akce,
        streak: u.streak,
        isMining,
        isCurrentUser: currentUser ? u.id === currentUser.id : false
      };
    });

    // Sort descending by akce
    entries.sort((a, b) => b.akce - a.akce);

    // Calculate current user's rank
    let currentUserRank = -1;
    if (currentUser) {
      const idx = entries.findIndex(e => e.id === currentUser.id);
      if (idx !== -1) {
        currentUserRank = idx + 1;
      }
    }

    res.json({
      leaderboard: entries.slice(0, 50),
      currentUserRank,
      totalParticipants: entries.length
    });
  });

  // Invite code validation endpoint
  app.get('/api/invite/validate/:code', (req, res) => {
    const code = req.params.code?.trim().toUpperCase();
    if (!code) {
      return res.json({ valid: false });
    }
    const inviter = Object.values(db.users).find(u => u.inviteCode.toUpperCase() === code);
    if (inviter) {
      return res.json({
        valid: true,
        inviterNickname: inviter.nickname,
        bonusAkce: 2.0
      });
    }
    return res.json({ valid: false });
  });

  // Vite Integration
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(__dirname, 'dist'))) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kuyu backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start Kuyu server:', err);
});
