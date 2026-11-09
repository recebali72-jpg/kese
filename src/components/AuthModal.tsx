import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiValidateInviteCode } from '../services/api';
import { Mail, Lock, Gift, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { KeseIcon } from './KeseIcon';

export const AuthModal: React.FC = () => {
  const { login, register, verifyEmail } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [inviteBonusNotice, setInviteBonusNotice] = useState<string | null>(null);

  // Verification step state
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
        setInviteBonusNotice(`Geçerli Kod! (${check.inviterNickname} tarafından davet edildiniz: +2 akçe bonus)`);
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
      setErrorMsg('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Şifre en az 6 karakter olmalıdır.');
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
      setErrorMsg(err instanceof Error ? err.message : 'İşlem başarısız oldu.');
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
      setErrorMsg(err instanceof Error ? err.message : 'Doğrulama kodu hatalı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-[#0e1f2b]/90 backdrop-blur-md">
      <div className="w-full max-w-[390px] bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] rounded-3xl p-6 shadow-2xl flex flex-col gap-5 text-slate-900 dark:text-white">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f2b544] to-[#f7c768] text-[#0e1f2b] flex items-center justify-center shadow-md shadow-[#f2b544]/20 mb-2">
            <KeseIcon className="w-8 h-8 text-[#0e1f2b]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Kese</h1>
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
            Günlük Akçe Birikimi
          </p>
        </div>

        {/* Verification code step screen */}
        {needsVerification ? (
          <form onSubmit={handleVerifyCodeSubmit} className="flex flex-col gap-4">
            <div className="bg-emerald-50 dark:bg-[#5fd3b3]/15 border border-emerald-200 dark:border-[#5fd3b3] p-3.5 rounded-2xl text-xs flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#059669] dark:text-[#5fd3b3]">
                <Mail className="w-4 h-4" />
                <span>E-posta Doğrulama Kodu Gönderildi</span>
              </div>
              <div className="text-slate-600 dark:text-slate-200 leading-relaxed">
                <span className="font-semibold text-slate-900 dark:text-white">{email}</span> adresinize 6 haneli doğrulama kodu tanımlandı.
              </div>
              {codePreview && (
                <div className="mt-1 bg-white dark:bg-[#0e1f2b] p-2 rounded-xl text-center border border-emerald-200 dark:border-[#5fd3b3]/30 shadow-xs">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Doğrulama Kodunuz:</span>
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
                6 Haneli Kodu Girin
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
              {loading ? 'Doğrulanıyor...' : 'E-postayı Doğrula ve Başla'}
            </button>

            <button
              type="button"
              onClick={() => setNeedsVerification(false)}
              className="text-center text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white underline"
            >
              Daha sonra doğrula (Uygulamaya gir)
            </button>
          </form>
        ) : (
          <>
            {/* Mode Toggle (Giriş Yap / Kayıt Ol) */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-[#0e1f2b] border border-slate-200 dark:border-[#274858]">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  mode === 'login'
                    ? 'bg-[#f2b544] text-[#0e1f2b] shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  mode === 'register'
                    ? 'bg-[#f2b544] text-[#0e1f2b] shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Kayıt Ol
              </button>
            </div>

            {/* Error Message Area */}
            {errorMsg && (
              <div className="bg-rose-50 dark:bg-[#e8616b]/20 border border-rose-200 dark:border-[#e8616b] text-rose-800 dark:text-white p-2.5 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-[#e8616b] shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              {/* Email field */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>E-posta Adresi</span>
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

              {/* Password field */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Şifre (En az 6 karakter)</span>
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

              {/* Register Extras: Optional Invite Code */}
              {mode === 'register' && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-[#d97706] dark:text-[#f2b544]" />
                      <span>Davet Kodu (İsteğe bağlı)</span>
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
                        Geçerli bir davet koduyla katılırsanız hesabınıza{' '}
                        <strong className="text-[#d97706] dark:text-[#f2b544]">+2 akçe</strong> hoş geldin bonusu eklenir.
                      </span>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-[#0e1f2b]/60 p-2 rounded-lg border border-slate-200 dark:border-[#274858]">
                    ℹ️ Takma adınız varsayılan olarak e-postanızın (@ öncesi) bölümünden otomatik oluşturulur ve profilden değiştirilebilir.
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-3 rounded-xl bg-gradient-to-r from-[#f2b544] via-[#f7c768] to-[#f2b544] text-[#0e1f2b] font-black text-sm tracking-wide uppercase hover:opacity-95 active:scale-95 transition-all cursor-pointer shadow-lg shadow-[#f2b544]/15 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'İşleniyor...' : mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo Account Quick Fill */}
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setEmail('ahmet.kaya@kuyu.app');
                    setPassword('password123');
                  }}
                  className="w-full py-2 rounded-xl border border-dashed border-slate-300 dark:border-[#274858] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#274858]/40 transition-colors"
                >
                  ⚡ Demo Bilgilerini Doldur (ahmet_kaya)
                </button>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};
