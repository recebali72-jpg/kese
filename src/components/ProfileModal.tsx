import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatAkce } from '../services/api';
import { KlasikAkce } from './KeseIcon';
import {
  X,
  Camera,
  Trash2,
  Copy,
  Check,
  Flame,
  Trophy,
  Mail,
  Phone,
  AlertCircle
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRank?: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, currentUserRank = 1 }) => {
  const { user, liveAkce, updateProfile, verifyEmail, verifyPhone } = useAuth();
  const { t, language } = useLanguage();

  const [nicknameInput, setNicknameInput] = useState(user?.nickname || '');
  const [savingNick, setSavingNick] = useState(false);
  const [nickSuccess, setNickSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Email verification modal inside profile if not verified
  const [showEmailVerify, setShowEmailVerify] = useState(false);
  const [emailCodeInput, setEmailCodeInput] = useState('');
  const [emailVerifyLoading, setEmailVerifyLoading] = useState(false);

  // Phone verification modal inside profile
  const [showPhoneVerify, setShowPhoneVerify] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneVerifyLoading, setPhoneVerifyLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen || !user) return null;

  // Format joined date according to active language
  const joinedDateStr = new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(user.joinedAt));

  // Square crop and compress photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage(language === 'en' ? 'Please select a valid image file.' : 'Lütfen geçerli bir resim dosyası seçin.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;

        const targetCanvasSize = 256;
        const canvas = document.createElement('canvas');
        canvas.width = targetCanvasSize;
        canvas.height = targetCanvasSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw square centered crop
        ctx.drawImage(
          img,
          startX,
          startY,
          size,
          size,
          0,
          0,
          targetCanvasSize,
          targetCanvasSize
        );

        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        try {
          await updateProfile(undefined, dataUrl);
          setErrorMessage(null);
        } catch (err: unknown) {
          setErrorMessage(err instanceof Error ? err.message : (language === 'en' ? 'Failed to save photo.' : 'Fotoğraf kaydedilemedi.'));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = async () => {
    try {
      await updateProfile(undefined, null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : (language === 'en' ? 'Failed to remove photo.' : 'Fotoğraf kaldırılamadı.'));
    }
  };

  const handleSaveNickname = async () => {
    const clean = nicknameInput.trim();
    if (clean.length < 2) {
      setErrorMessage(language === 'en' ? 'Nickname must be at least 2 characters.' : 'Takma ad en az 2 karakter olmalıdır.');
      return;
    }
    try {
      setSavingNick(true);
      setErrorMessage(null);
      await updateProfile(clean, undefined);
      setNickSuccess(true);
      setTimeout(() => setNickSuccess(false), 2500);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : (language === 'en' ? 'Failed to update nickname.' : 'Takma ad güncellenemedi.'));
    } finally {
      setSavingNick(false);
    }
  };

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(user.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleConfirmEmailCode = async () => {
    if (!emailCodeInput.trim()) return;
    try {
      setEmailVerifyLoading(true);
      await verifyEmail(emailCodeInput.trim());
      setShowEmailVerify(false);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : (language === 'en' ? 'Verification code invalid.' : 'Kod doğrulanamadı.'));
    } finally {
      setEmailVerifyLoading(false);
    }
  };

  const handleConfirmPhone = async () => {
    if (!phoneInput.trim()) return;
    try {
      setPhoneVerifyLoading(true);
      await verifyPhone(phoneInput.trim());
      setShowPhoneVerify(false);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : (language === 'en' ? 'Phone verification failed.' : 'Telefon doğrulanamadı.'));
    } finally {
      setPhoneVerifyLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-title"
    >
      <div className="w-full max-w-[390px] max-h-[92vh] overflow-y-auto bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-slate-900 dark:text-white relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#274858] transition-colors focus-visible:ring-2 focus-visible:ring-[#f2b544]"
          aria-label={t.close}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="profile-title" className="text-lg font-black text-slate-900 dark:text-white text-center">
          {t.profileTitle}
        </h2>

        {errorMessage && (
          <div className="bg-rose-50 dark:bg-[#e8616b]/20 border border-rose-200 dark:border-[#e8616b] text-rose-800 dark:text-white p-2.5 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-[#e8616b] shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Big Avatar & Photo Controls */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 dark:bg-[#274858] border-3 border-[#f2b544] flex items-center justify-center text-3xl font-black text-[#d97706] dark:text-[#f2b544] shadow-md">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.nickname}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user.nickname.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-[#f2b544] text-[#0e1f2b] shadow-md hover:scale-110 active:scale-95 transition-transform"
              title={t.changePhoto}
              aria-label={t.changePhoto}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />

          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 dark:bg-[#274858] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-transparent"
            >
              {t.changePhoto}
            </button>
            {user.avatarUrl && (
              <button
                onClick={handleRemovePhoto}
                className="text-xs font-semibold px-2 py-1 rounded-lg text-rose-600 dark:text-[#e8616b] hover:bg-rose-50 dark:hover:bg-[#e8616b]/15 transition-colors flex items-center gap-1"
                title={t.removePhoto}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.removePhoto}</span>
              </button>
            )}
          </div>

          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {t.joinedAt} {joinedDateStr}
          </span>
        </div>

        {/* 3 Metric Cards: Akce, Streak, Rank */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-50 dark:bg-[#0e1f2b] p-2.5 rounded-2xl border border-slate-200 dark:border-[#274858] flex flex-col items-center text-center">
            <div className="mb-1">
              <KlasikAkce size={16} />
            </div>
            <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400">{t.akceBalance}</span>
            <span className="text-xs font-black text-[#d97706] dark:text-[#f2b544] font-mono mt-0.5">
              {formatAkce(liveAkce).split(',')[0]},{formatAkce(liveAkce).split(',')[1].slice(0, 2)}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-[#0e1f2b] p-2.5 rounded-2xl border border-slate-200 dark:border-[#274858] flex flex-col items-center text-center">
            <Flame className="w-4 h-4 text-[#e8616b] mb-1" />
            <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400">{t.dailyStreak}</span>
            <span className="text-xs font-black text-slate-900 dark:text-white mt-0.5">
              {user.streak}. {t.day}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-[#0e1f2b] p-2.5 rounded-2xl border border-slate-200 dark:border-[#274858] flex flex-col items-center text-center">
            <Trophy className="w-4 h-4 text-[#059669] dark:text-[#5fd3b3] mb-1" />
            <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400">{t.yourRank}</span>
            <span className="text-xs font-black text-[#059669] dark:text-[#5fd3b3] font-mono mt-0.5">
              #{currentUserRank}
            </span>
          </div>
        </div>

        {/* Nickname Editor */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.nicknameLabel}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              maxLength={24}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0e1f2b] border border-slate-200 dark:border-[#274858] text-sm text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#f2b544]"
              placeholder={t.nicknamePlaceholder}
            />
            <button
              onClick={handleSaveNickname}
              disabled={savingNick || nicknameInput.trim() === user.nickname}
              className="px-4 py-2 rounded-xl bg-[#f2b544] text-[#0e1f2b] font-bold text-xs hover:bg-[#e0a435] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shrink-0"
            >
              {nickSuccess ? <Check className="w-4 h-4 text-emerald-900" /> : t.save}
            </button>
          </div>
        </div>

        {/* Invite Code */}
        <div className="bg-slate-50 dark:bg-[#0e1f2b] p-3 rounded-2xl border border-slate-200 dark:border-[#274858] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.yourInviteCode}
            </span>
            <span className="text-[10px] text-[#059669] dark:text-[#5fd3b3] font-semibold">
              {t.invitedFriendsCount.replace('{count}', String(user.invitedCount))}
            </span>
          </div>
          <div className="flex items-center justify-between bg-white dark:bg-[#16303f] px-3 py-2 rounded-xl border border-slate-200 dark:border-[#274858]">
            <span className="font-mono text-base font-black text-[#d97706] dark:text-[#f2b544] tracking-wider">
              {user.inviteCode}
            </span>
            <button
              onClick={handleCopyInviteCode}
              className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-white hover:text-[#d97706] dark:hover:text-[#f2b544] transition-colors p-1"
            >
              {copiedCode ? (
                <>
                  <Check className="w-4 h-4 text-[#059669] dark:text-[#5fd3b3]" />
                  <span className="text-[#059669] dark:text-[#5fd3b3]">{t.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{t.copy}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Account Security & Verification Badges */}
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#0e1f2b]/70 border border-slate-200 dark:border-[#274858]">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <div className="flex flex-col">
                <span className="text-slate-900 dark:text-white font-medium truncate max-w-[170px]">{user.email}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {user.emailVerified ? t.emailVerified : t.emailNotVerified}
                </span>
              </div>
            </div>
            {user.emailVerified ? (
              <span className="text-[10px] font-bold text-[#059669] dark:text-[#5fd3b3] bg-emerald-50 dark:bg-[#5fd3b3]/20 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-[#5fd3b3]/30">
                {t.protectedBadge}
              </span>
            ) : (
              <button
                onClick={() => setShowEmailVerify(!showEmailVerify)}
                className="text-[10px] font-bold text-[#d97706] dark:text-[#f2b544] underline"
              >
                {t.enterCode}
              </button>
            )}
          </div>

          {showEmailVerify && !user.emailVerified && (
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0e1f2b] border border-amber-300 dark:border-[#f2b544]/50 flex gap-2">
              <input
                type="text"
                value={emailCodeInput}
                onChange={(e) => setEmailCodeInput(e.target.value)}
                placeholder="6 haneli kod"
                maxLength={6}
                className="flex-1 px-2.5 py-1 text-xs font-mono bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] rounded-lg text-slate-900 dark:text-white"
              />
              <button
                onClick={handleConfirmEmailCode}
                disabled={emailVerifyLoading}
                className="px-3 py-1 bg-[#10b981] dark:bg-[#5fd3b3] text-white dark:text-[#0e1f2b] font-bold text-xs rounded-lg hover:opacity-90"
              >
                {emailVerifyLoading ? '...' : t.verifyAction}
              </button>
            </div>
          )}

          {/* Bot Protection / Phone Verification */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#0e1f2b]/70 border border-slate-200 dark:border-[#274858]">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <div className="flex flex-col">
                <span className="text-slate-900 dark:text-white font-medium">{t.phoneProtectionTitle}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {user.phoneVerified ? user.phone : t.phoneProtectionDesc}
                </span>
              </div>
            </div>
            {user.phoneVerified ? (
              <span className="text-[10px] font-bold text-[#059669] dark:text-[#5fd3b3] bg-emerald-50 dark:bg-[#5fd3b3]/20 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-[#5fd3b3]/30">
                {t.protectedBadge}
              </span>
            ) : (
              <button
                onClick={() => setShowPhoneVerify(!showPhoneVerify)}
                className="text-[10px] font-bold text-[#d97706] dark:text-[#f2b544] underline"
              >
                {t.verifyAction}
              </button>
            )}
          </div>

          {showPhoneVerify && !user.phoneVerified && (
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0e1f2b] border border-amber-300 dark:border-[#f2b544]/50 flex gap-2">
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+90 5xx xxx xx xx"
                className="flex-1 px-2.5 py-1 text-xs bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] rounded-lg text-slate-900 dark:text-white font-mono"
              />
              <button
                onClick={handleConfirmPhone}
                disabled={phoneVerifyLoading}
                className="px-3 py-1 bg-[#f2b544] text-[#0e1f2b] font-bold text-xs rounded-lg hover:opacity-90"
              >
                {phoneVerifyLoading ? '...' : t.save}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
