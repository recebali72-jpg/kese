import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { apiValidateInviteCode } from '../services/api';
import { Mail, Lock, Gift, AlertCircle, CheckCircle2, ArrowRight, Sun, Moon, Globe, AlertTriangle } from 'lucide-react';
import { KeseIcon } from './KeseIcon';

export const LoginPage: React.FC = () => {
  const { login, register, verifyEmail, theme, toggleTheme } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [inviteBonusNotice, setInviteBonusNotice] = useState<string | null>(null);

  // Email verification step
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [codePreview, setCodePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Real-time invite code check
  const handleInviteCodeChange = async (val: string) => {
    setInviteCode(val);
    const trimmed = val.trim().toUpperCase();
    if (trimmed.length >= 4) {
      const check = await apiValidateInviteCode(trimmed);
      if (check.valid) {
        setInviteBonusNotice(
          t.validInviteBonus.replace('{nickname}', check.inviterNickname || '')
        );
      } else {
        setInviteBonusNotice(null);
      }
    } else {
      setInviteBonusNotice(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg(language === 'en' ? 'Please enter a valid email address.' : 'Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg(t.passwordMinLength);
      return;
    }

    try {
      setLoading(true);
      if (mode === 'login') {
        await login(email, password);
      } else {
        const result = await register(email, password, inviteCode);
        setCodePreview(result.verificationCodePreview);
        setNeedsVerification(true);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : (language === 'en' ? 'Operation failed.' : 'İşlem başarısız oldu.'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setErrorMsg(null);
    try {
      setLoading(true);
      await login('ahmet.kaya@kuyu.app', 'password123');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : (language === 'en' ? 'Demo login failed.' : 'Demo girişi başarısız oldu.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCodeInput.trim()) return;
    try {
      setLoading(true);
      setErrorMsg(null);
      await verifyEmail(verificationCodeInput.trim());
      setNeedsVerification(false);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : (language === 'en' ? 'Invalid verification code.' : 'Doğrulama kodu hatalı.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#dbe2ea] dark:bg-[#09151e] flex justify-center selection:bg-[#f2b544]/30 selection:text-[#d97706] ${theme}`}>
      <div className="w-full max-w-[420px] min-h-screen bg-[#eef2f6] dark:bg-[#0e1f2b] border-x border-slate-300 dark:border-[#274858]/60 flex flex-col justify-between p-5 text-slate-900 dark:text-white shadow-xl">
        {/* Top bar with language & theme toggles */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-[#f2b544]/20 border border-amber-300 dark:border-[#f2b544]/40 flex items-center justify-center text-[#d97706] dark:text-[#f2b544]">
              <KeseIcon className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-xs tracking-wider text-slate-700 dark:text-slate-300 uppercase">
              {t.appName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* TR / EN Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-amber-400 dark:hover:border-[#f2b544] transition-all shadow-xs cursor-pointer"
              title={t.langSwitch}
            >
              <Globe className="w-3.5 h-3.5 text-[#d97706] dark:text-[#f2b544]" />
              <span className="font-mono">{language === 'tr' ? 'EN' : 'TR'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-xl bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs cursor-pointer"
              title={t.changeTheme}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#f2b544]" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Central Auth Container */}
        <div className="my-auto py-6">
          <div className="bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] rounded-3xl p-6 shadow-xl flex flex-col gap-5">
            {/* Brand Header */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#f2b544] via-[#f7c768] to-[#f2b544] text-[#0e1f2b] flex items-center justify-center shadow-lg shadow-[#f2b544]/25 mb-2.5">
                <KeseIcon className="w-9 h-9 text-[#0e1f2b]" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {t.appName}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
                {t.appSubtitle}
              </p>
            </div>

            {/* Verification code screen */}
            {needsVerification ? (
              <form onSubmit={handleVerifyCodeSubmit} className="flex flex-col gap-4">
                <div className="bg-emerald-50 dark:bg-[#5fd3b3]/15 border border-emerald-200 dark:border-[#5fd3b3] p-3.5 rounded-2xl text-xs flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#059669] dark:text-[#5fd3b3]">
                    <Mail className="w-4 h-4" />
                    <span>{language === 'en' ? 'Email Verification Code Sent' : 'E-posta Doğrulama Kodu Gönderildi'}</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-200 leading-relaxed">
                    {language === 'en' ? (
                      <>A 6-digit verification code has been assigned to <span className="font-semibold text-slate-900 dark:text-white">{email}</span>.</>
                    ) : (
                      <><span className="font-semibold text-slate-900 dark:text-white">{email}</span> adresinize 6 haneli doğrulama kodu tanımlandı.</>
                    )}
                  </div>
                  {codePreview && (
                    <div className="mt-1 bg-white dark:bg-[#0e1f2b] p-2 rounded-xl text-center border border-emerald-200 dark:border-[#5fd3b3]/30 shadow-xs">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{language === 'en' ? 'Your Verification Code:' : 'Doğrulama Kodunuz:'}</span>
                      <span className="font-mono text-base font-bold text-[#059669] dark:text-[#5fd3b3] tracking-widest">
                        {codePreview}
                      </span>
                    </div>
                  )}
                </div>

                {errorMsg && (
                  <div className="bg-rose-50 dark:bg-[#e8616b]/20 border border-rose-200 dark:border-[#e8616b] text-rose-800 dark:text-white p-2.5 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-[#e8616b] shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === 'en' ? 'Enter 6-Digit Code' : '6 Haneli Kodu Girin'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={verificationCodeInput}
                    onChange={(e) => setVerificationCodeInput(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0e1f2b] border border-slate-200 dark:border-[#274858] text-center font-mono text-lg font-bold tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-[#5fd3b3]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#10b981] dark:bg-[#5fd3b3] text-white dark:text-[#0e1f2b] font-black text-sm tracking-wide hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                >
                  {loading
                    ? (language === 'en' ? 'Verifying...' : 'Doğrulanıyor...')
                    : (language === 'en' ? 'Verify Email & Start' : 'E-postayı Doğrula ve Başla')}
                </button>

                <button
                  type="button"
                  onClick={() => setNeedsVerification(false)}
                  className="text-center text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white underline cursor-pointer"
                >
                  {language === 'en' ? 'Verify later (Enter app)' : 'Daha sonra doğrula (Uygulamaya gir)'}
                </button>
              </form>
            ) : (
              <>
                {/* Mode Segmented Controls */}
                <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-[#0e1f2b] border border-slate-200 dark:border-[#274858]">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg(null);
                    }}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      mode === 'login'
                        ? 'bg-[#f2b544] text-[#0e1f2b] shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {t.loginTab}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMsg(null);
                    }}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      mode === 'register'
                        ? 'bg-[#f2b544] text-[#0e1f2b] shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {t.registerTab}
                  </button>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="bg-rose-50 dark:bg-[#e8616b]/20 border border-rose-200 dark:border-[#e8616b] text-rose-800 dark:text-white p-2.5 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-[#e8616b] shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                  {/* Email */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.emailField}</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@kese.app"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0e1f2b] border border-slate-200 dark:border-[#274858] text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#f2b544]"
                    />
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.passwordField}</span>
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0e1f2b] border border-slate-200 dark:border-[#274858] text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#f2b544]"
                    />
                  </div>

                  {/* Invite Code for Register */}
                  {mode === 'register' && (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Gift className="w-3.5 h-3.5 text-[#d97706] dark:text-[#f2b544]" />
                          <span>{t.inviteCodeOptional}</span>
                        </label>
                        <input
                          type="text"
                          value={inviteCode}
                          onChange={(e) => handleInviteCodeChange(e.target.value)}
                          placeholder="KESE-XXXX"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0e1f2b] border border-slate-200 dark:border-[#274858] font-mono text-sm uppercase text-slate-900 dark:text-white focus:outline-none focus:border-[#f2b544]"
                        />
                        {inviteBonusNotice ? (
                          <div className="text-[11px] font-semibold text-[#059669] dark:text-[#5fd3b3] flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>{inviteBonusNotice}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {t.inviteBonusHint}
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-[#0e1f2b]/60 p-2 rounded-lg border border-slate-200 dark:border-[#274858]">
                        {t.defaultNicknameHint}
                      </div>
                    </>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-1 py-3 rounded-xl bg-gradient-to-r from-[#f2b544] via-[#f7c768] to-[#f2b544] text-[#0e1f2b] font-black text-sm tracking-wide uppercase hover:opacity-95 active:scale-95 transition-all cursor-pointer shadow-lg shadow-[#f2b544]/20 flex items-center justify-center gap-2"
                  >
                    <span>{loading ? t.processing : mode === 'login' ? t.loginAction : t.registerAction}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* One-Click Fast Demo Login */}
                  <button
                    type="button"
                    onClick={handleQuickDemo}
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl border border-dashed border-amber-400 dark:border-[#f2b544]/60 bg-amber-50/60 dark:bg-[#f2b544]/10 text-xs font-bold text-slate-800 dark:text-white hover:bg-amber-100 dark:hover:bg-[#f2b544]/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>⚡ {language === 'en' ? 'Quick Demo Login (ahmet_kaya)' : 'Demo Hesabı ile Hızlı Giriş (ahmet_kaya)'}</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="bg-rose-50 dark:bg-[#e8616b]/15 border border-rose-200 dark:border-[#e8616b]/40 rounded-2xl p-3 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#e8616b] shrink-0 mt-0.5" />
          <div className="text-[11px] text-rose-950 dark:text-rose-100 leading-relaxed">
            <span className="font-bold block text-rose-700 dark:text-[#e8616b] text-[10px] uppercase tracking-wider mb-0.5">
              {t.legalWarningTitle}
            </span>
            {t.legalWarningText}
          </div>
        </div>
      </div>
    </div>
  );
};
