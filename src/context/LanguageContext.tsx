import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'tr' | 'en';

export interface Translations {
  // Brand & Common
  appName: string;
  appSubtitle: string;
  loading: string;
  akce: string;
  akceBalance: string;
  close: string;
  save: string;
  cancel: string;
  refresh: string;
  copy: string;
  copied: string;
  you: string;
  day: string;
  days: string;
  streak: string;
  people: string;
  bonus: string;

  // Header
  member: string;
  openProfile: string;
  changeTheme: string;
  notificationsOn: string;
  notificationsOff: string;
  langSwitch: string;
  languageSelectLabel: string;
  turkish: string;
  english: string;

  // Tabs
  tabPouch: string;
  tabWheel: string;
  tabLeaderboard: string;
  tabAbout: string;

  // Mining Tab
  streakProtectTitle: string;
  streakProtectDesc: string;
  miningStart: string;
  miningStarting: string;
  miningCycle: string;
  sessionAccumulated: string;
  dailyStreak: string;
  streakEveryDayBonus: string;
  dailyYield: string;
  per24h: string;
  invitedCount: string;
  perInviteBonus: string;
  inviteFriendTitle: string;
  inviteFriendDesc: string;
  communityStatusTitle: string;
  registeredCount: string;
  activePouches: string;
  activeRate: string;
  totalCommunityAkce: string;

  // Wheel Tab
  wheelTitle: string;
  wheelSubtitle: string;
  remainingSpins: string;
  spinButton: string;
  nextFreeSpin: string;
  congratsWon: string;
  wonAkceDesc: string;
  wonSpinsDesc: string;
  extraSpin: string;

  // Leaderboard Tab
  rankStatus: string;
  yourRank: string;
  totalLabel: string;
  generalRankTitle: string;
  activeMiningNow: string;

  // About Tab
  aboutTitle: string;
  aboutIntro: string;
  formulaTitle: string;
  formulaDesc: string;
  formulaLabel: string;
  formulaBonusDecay: string;
  streakRuleTitle: string;
  streakRuleDesc: string;
  wheelRuleTitle: string;
  wheelRuleDesc: string;
  referralRuleTitle: string;
  referralRuleDesc: string;
  legalWarningTitle: string;
  legalWarningText: string;

  // Profile Modal
  profileTitle: string;
  changePhoto: string;
  removePhoto: string;
  joinedAt: string;
  nicknameLabel: string;
  nicknamePlaceholder: string;
  yourInviteCode: string;
  invitedFriendsCount: string;
  emailLabel: string;
  emailVerified: string;
  emailNotVerified: string;
  enterCode: string;
  phoneProtectionTitle: string;
  phoneProtectionDesc: string;
  protectedBadge: string;
  verifyAction: string;
  logout: string;

  // Auth Modal
  loginTab: string;
  registerTab: string;
  emailField: string;
  passwordField: string;
  passwordMinLength: string;
  inviteCodeOptional: string;
  validInviteBonus: string;
  inviteBonusHint: string;
  defaultNicknameHint: string;
  loginAction: string;
  registerAction: string;
  processing: string;
  quickDemoButton: string;
}

const translations: Record<Language, Translations> = {
  tr: {
    appName: 'Kese',
    appSubtitle: 'Günlük Akçe Birikimi',
    loading: 'KESE YÜKLENİYOR...',
    akce: 'akçe',
    akceBalance: 'Akçe Bakiyesi',
    close: 'Kapat',
    save: 'Kaydet',
    cancel: 'İptal',
    refresh: 'Yenile',
    copy: 'Kopyala',
    copied: 'Kopyalandı',
    you: 'sen',
    day: 'Gün',
    days: 'gün',
    streak: 'seri',
    people: 'Kişi',
    bonus: 'bonus',

    member: 'Üye',
    openProfile: 'Profil sayfasını aç',
    changeTheme: 'Tema değiştir',
    notificationsOn: 'Bildirimler etkin',
    notificationsOff: 'Bildirimleri aç',
    langSwitch: 'Dil Değiştir',
    languageSelectLabel: 'Dil Seçeneği',
    turkish: 'Türkçe',
    english: 'English',

    tabPouch: 'Kese',
    tabWheel: 'Çark',
    tabLeaderboard: 'Sıralama',
    tabAbout: 'Hakkında',

    streakProtectTitle: 'Serini Koru!',
    streakProtectDesc: 'Serini korumak için {time} içinde başla!',
    miningStart: 'Keseyi Doldur',
    miningStarting: 'Başlatılıyor...',
    miningCycle: '24 saatlik dolum',
    sessionAccumulated: 'Bu Oturumda Biriken',
    dailyStreak: 'Günlük Seri',
    streakEveryDayBonus: 'Her gün +bonus',
    dailyYield: 'Günlük Kazanç',
    per24h: 'akçe / 24 saat',
    invitedCount: 'Davet Edilen',
    perInviteBonus: '+5 akçe/davet',
    inviteFriendTitle: 'Arkadaşını Davet Et',
    inviteFriendDesc: 'Sana +5 akçe, arkadaşına +2 akçe hoş geldin bonusu.',
    communityStatusTitle: 'Topluluk Kese Durumu',
    registeredCount: 'Kayıtlı Kişi',
    activePouches: 'Aktif Kese',
    activeRate: 'Aktif Oranı',
    totalCommunityAkce: 'Toplam Akçe',

    wheelTitle: 'Günlük Şans Çarkı',
    wheelSubtitle: 'Her 24 saatte 1 ücretsiz hak',
    remainingSpins: 'Kalan Hak:',
    spinButton: 'Çevir',
    nextFreeSpin: 'Yeni hak için kalan:',
    congratsWon: 'Tebrikler! Kazandınız',
    wonAkceDesc: 'Kazanılan akçe anında bakiyenize eklendi.',
    wonSpinsDesc: 'Joker hakkı ile çarkı tekrar çevirebilirsiniz!',
    extraSpin: 'çevirme',

    rankStatus: 'Sıralama Durumun',
    yourRank: 'Sıran',
    totalLabel: 'Toplam:',
    generalRankTitle: 'Genel Sıralama',
    activeMiningNow: 'Şu an kesesi doluyor',

    aboutTitle: 'Kese Nedir?',
    aboutIntro: 'Kese, her gün düzenli olarak tek bir dokunuşla kesenize akçe doldurabileceğiniz, çark çevirebileceğiniz ve topluluk sıralamasında yerinizi alabileceğiniz mobil öncelikli günlük sadakat ve birikim simülasyonudur.',
    formulaTitle: 'Keseye Akçe Dolumu ve Günlük Kazanç Formülü',
    formulaDesc: 'Keseye akçe dolumu 24 saat sürer. Bu süreçte kazancınız kesenize her saniye canlı olarak dolar ve 24 saat tamamlandığında kesinleşir.',
    formulaLabel: 'Formül: 1 + (1 - 0.9^(seri - 1))',
    formulaBonusDecay: 'Eklenen seri bonusu her gün %10 küçülerek 2,00 akçeye yaklaşır:',
    streakRuleTitle: 'Seri Koruma Kuralı',
    streakRuleDesc: 'Kese dolumu bittikten sonraki 24 saatlik ek tolerans süresi içinde yeni bir dolum başlatırsanız seriniz kesintisiz devam eder. Bu süre kaçırılırsa seri sıfırlanır ve günlük kazanç yeniden 1,00 akçeden başlar.',
    wheelRuleTitle: 'Şans Çarkı ve Jokerler',
    wheelRuleDesc: 'Her kullanıcı günde 1 ücretsiz çevirme hakkına sahiptir. Çarkta 0,1 ile 1 akçe arası ödüllerin yanı sıra 2 ve 3 ekstra çevirme hakkı sağlayan joker dilimleri yer alır. Çark sonucu güvenli biçimde sunucu tarafından belirlenir.',
    referralRuleTitle: 'Davet Sistemi',
    referralRuleDesc: 'Profilinizde yer alan davet kodunuzla katılan her arkadaşınız için bakiyenize +5 akçe, kodunuzu giren arkadaşınıza ise anında +2 akçe hoş geldin bonusu verilir.',
    legalWarningTitle: 'Önemli Yasal Bildirim',
    legalWarningText: 'Akçe uygulama içi bir puandır. Para veya kripto para değildir.',

    profileTitle: 'Kese Profili',
    changePhoto: 'Fotoğrafı Değiştir',
    removePhoto: 'Kaldır',
    joinedAt: 'Katılım:',
    nicknameLabel: 'Takma Ad (Sıralamada görünür)',
    nicknamePlaceholder: 'Takma adınız',
    yourInviteCode: 'Davet Kodun',
    invitedFriendsCount: '{count} kişi davet edildi',
    emailLabel: 'E-posta Adresi',
    emailVerified: 'E-posta Doğrulandı',
    emailNotVerified: 'E-posta Henüz Doğrulanmadı',
    enterCode: 'Kodu Gir',
    phoneProtectionTitle: 'Bot & Çift Hesap Önlemi',
    phoneProtectionDesc: 'Telefon ile adil birikim koruması',
    protectedBadge: 'Korumalı',
    verifyAction: 'Doğrula',
    logout: 'Çıkış Yap',

    loginTab: 'Giriş Yap',
    registerTab: 'Kayıt Ol',
    emailField: 'E-posta Adresi',
    passwordField: 'Şifre (En az 6 karakter)',
    passwordMinLength: 'Şifre en az 6 karakter olmalıdır.',
    inviteCodeOptional: 'Davet Kodu (İsteğe bağlı)',
    validInviteBonus: 'Geçerli Kod! ({nickname} davetiyle +2 akçe hoş geldin bonusu)',
    inviteBonusHint: 'Geçerli bir davet koduyla katılırsanız hesabınıza +2 akçe hoş geldin bonusu eklenir.',
    defaultNicknameHint: 'ℹ️ Takma adınız varsayılan olarak e-postanızın (@ öncesi) bölümünden otomatik oluşturulur ve profilden değiştirilebilir.',
    loginAction: 'Giriş Yap',
    registerAction: 'Kayıt Ol',
    processing: 'İşleniyor...',
    quickDemoButton: '⚡ Demo Bilgilerini Doldur (ahmet_kaya)'
  },
  en: {
    appName: 'Kese',
    appSubtitle: 'Daily Akçe Accumulation',
    loading: 'LOADING KESE...',
    akce: 'akçe',
    akceBalance: 'Akçe Balance',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    refresh: 'Refresh',
    copy: 'Copy',
    copied: 'Copied',
    you: 'you',
    day: 'Day',
    days: 'days',
    streak: 'streak',
    people: 'Users',
    bonus: 'bonus',

    member: 'Member',
    openProfile: 'Open profile page',
    changeTheme: 'Toggle theme',
    notificationsOn: 'Notifications enabled',
    notificationsOff: 'Enable notifications',
    langSwitch: 'Switch Language',
    languageSelectLabel: 'Language',
    turkish: 'Türkçe',
    english: 'English',

    tabPouch: 'Kese',
    tabWheel: 'Wheel',
    tabLeaderboard: 'Ranks',
    tabAbout: 'About',

    streakProtectTitle: 'Protect Your Streak!',
    streakProtectDesc: 'Start within {time} to keep your streak!',
    miningStart: 'Fill the Pouch',
    miningStarting: 'Starting...',
    miningCycle: '24-hour cycle',
    sessionAccumulated: 'Earned This Session',
    dailyStreak: 'Daily Streak',
    streakEveryDayBonus: 'Daily +bonus',
    dailyYield: 'Daily Yield',
    per24h: 'akçe / 24 hours',
    invitedCount: 'Invited Users',
    perInviteBonus: '+5 akçe/invite',
    inviteFriendTitle: 'Invite a Friend',
    inviteFriendDesc: 'You receive +5 akçe, your friend gets +2 akçe welcome bonus.',
    communityStatusTitle: 'Community Pouch Status',
    registeredCount: 'Total Users',
    activePouches: 'Active Pouches',
    activeRate: 'Active Rate',
    totalCommunityAkce: 'Total Akçe',

    wheelTitle: 'Daily Lucky Wheel',
    wheelSubtitle: '1 free spin every 24 hours',
    remainingSpins: 'Spins Left:',
    spinButton: 'Spin',
    nextFreeSpin: 'Next free spin in:',
    congratsWon: 'Congratulations! You Won',
    wonAkceDesc: 'Awarded akçe has been instantly credited to your balance.',
    wonSpinsDesc: 'Use your bonus joker to spin the wheel again!',
    extraSpin: 'spins',

    rankStatus: 'Your Rank Status',
    yourRank: 'Your Rank',
    totalLabel: 'Total:',
    generalRankTitle: 'Leaderboard',
    activeMiningNow: 'Currently filling pouch',

    aboutTitle: 'What is Kese?',
    aboutIntro: 'Kese is a mobile-first daily loyalty and accumulation simulation where you fill your pouch with akçe points each day, spin the lucky wheel, and compete on community leaderboards.',
    formulaTitle: 'Pouch Filling & Daily Yield Formula',
    formulaDesc: 'Pouch filling lasts 24 hours. During this period, your earnings accumulate every second and are fully finalized at the end of 24 hours.',
    formulaLabel: 'Formula: 1 + (1 - 0.9^(streak - 1))',
    formulaBonusDecay: 'The streak bonus shrinks by 10% daily and asymptotically approaches 2.00 akçe:',
    streakRuleTitle: 'Streak Protection Rule',
    streakRuleDesc: 'If you start a new session within the 24-hour grace period after a session ends, your streak continues uninterrupted. If this window is missed, your streak resets back to 1.00 akçe.',
    wheelRuleTitle: 'Lucky Wheel & Jokers',
    wheelRuleDesc: 'Every user gets 1 free spin every 24 hours. The wheel includes prizes from 0.1 to 1 akçe as well as joker slices granting 2 or 3 extra spins. Spin results are determined securely by the server.',
    referralRuleTitle: 'Referral System',
    referralRuleDesc: 'For each friend who joins using your invite code, you receive +5 akçe, and your invited friend instantly receives a +2 akçe welcome bonus.',
    legalWarningTitle: 'Important Legal Notice',
    legalWarningText: 'Akçe is an in-app reward point. It is not real money or cryptocurrency.',

    profileTitle: 'Kese Profile',
    changePhoto: 'Change Photo',
    removePhoto: 'Remove',
    joinedAt: 'Joined:',
    nicknameLabel: 'Nickname (Visible on leaderboard)',
    nicknamePlaceholder: 'Your nickname',
    yourInviteCode: 'Your Invite Code',
    invitedFriendsCount: '{count} friends invited',
    emailLabel: 'Email Address',
    emailVerified: 'Email Verified',
    emailNotVerified: 'Email Not Verified',
    enterCode: 'Enter Code',
    phoneProtectionTitle: 'Bot & Multi-Account Protection',
    phoneProtectionDesc: 'Fair accumulation verified via phone',
    protectedBadge: 'Protected',
    verifyAction: 'Verify',
    logout: 'Log Out',

    loginTab: 'Log In',
    registerTab: 'Sign Up',
    emailField: 'Email Address',
    passwordField: 'Password (Min 6 characters)',
    passwordMinLength: 'Password must be at least 6 characters.',
    inviteCodeOptional: 'Invite Code (Optional)',
    validInviteBonus: 'Valid Code! (+2 akçe welcome bonus via {nickname})',
    inviteBonusHint: 'Join with a valid referral code to get +2 akçe welcome bonus.',
    defaultNicknameHint: 'ℹ️ Nickname is automatically set from the part before @ in your email and can be edited in your profile.',
    loginAction: 'Log In',
    registerAction: 'Sign Up',
    processing: 'Processing...',
    quickDemoButton: '⚡ Fill Demo Account (ahmet_kaya)'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('tr');

  useEffect(() => {
    const saved = localStorage.getItem('kese_lang') as Language | null;
    if (saved === 'en' || saved === 'tr') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kese_lang', lang);
  };

  const toggleLanguage = () => {
    const next: Language = language === 'tr' ? 'en' : 'tr';
    setLanguage(next);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
