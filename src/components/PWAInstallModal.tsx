import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Share, PlusSquare, MoreVertical, X, CheckCircle2 } from 'lucide-react';
import { KeseIcon } from './KeseIcon';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 dark:bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-title"
    >
      <div className="w-full max-w-[390px] bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-slate-900 dark:text-white relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#274858] transition-colors focus-visible:ring-2 focus-visible:ring-[#f2b544]"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon & Title */}
        <div className="flex flex-col items-center text-center pt-1">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f2b544] via-[#f7c768] to-[#f2b544] text-[#0e1f2b] flex items-center justify-center shadow-lg shadow-[#f2b544]/20 mb-2.5">
            <KeseIcon className="w-8 h-8 text-[#0e1f2b]" />
          </div>
          <h2 id="pwa-install-title" className="text-xl font-black text-slate-900 dark:text-white">
            Kese'yi Telefona Yükle
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-[280px]">
            Uygulama mağazası (App Store / Play Store) aramadan doğrudan ana ekranınıza tek dokunuşla ekleyin.
          </p>
        </div>

        {/* If already running in standalone */}
        {isInstalled && (
          <div className="bg-emerald-50 dark:bg-[#5fd3b3]/15 border border-emerald-200 dark:border-[#5fd3b3] p-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-[#059669] dark:text-[#5fd3b3]">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Kese uygulaması zaten telefonunuzda yüklü ve ana ekranınızda çalışıyor!</span>
          </div>
        )}

        {/* Direct One-Click Install for Android / Chromium */}
        {isInstallable && (
          <button
            onClick={async () => {
              const res = await install();
              if (res) onClose();
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#f2b544] via-[#f7c768] to-[#f2b544] text-[#0e1f2b] font-black text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#f2b544]/25 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Hemen Telefona Yükle</span>
          </button>
        )}

        {/* Device Guides Tab/Cards */}
        <div className="flex flex-col gap-3">
          {/* iOS / iPhone Guide */}
          <div className={`p-3.5 rounded-2xl border ${isIOS ? 'border-amber-400 dark:border-[#f2b544] bg-amber-50/50 dark:bg-[#f2b544]/10' : 'border-slate-200 dark:border-[#274858] bg-slate-50 dark:bg-[#0e1f2b]/60'}`}>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-2">
              <Smartphone className="w-4 h-4 text-[#d97706] dark:text-[#f2b544]" />
              <span>iPhone (Safari) ile Yükleme:</span>
            </div>
            <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-2 pl-1">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#d97706] dark:text-[#f2b544]">1.</span>
                <span>Safari ekranının altındaki <strong className="text-slate-900 dark:text-white inline-flex items-center gap-1">Paylaş <Share className="w-3.5 h-3.5 inline text-[#d97706] dark:text-[#f2b544]" /></strong> butonuna dokunun.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#d97706] dark:text-[#f2b544]">2.</span>
                <span>Açılan menüde aşağı kaydırıp <strong className="text-slate-900 dark:text-white inline-flex items-center gap-1">Ana Ekrana Ekle <PlusSquare className="w-3.5 h-3.5 inline text-[#d97706] dark:text-[#f2b544]" /></strong> seçeneğine basın.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#d97706] dark:text-[#f2b544]">3.</span>
                <span>Sağ üstteki <strong className="text-slate-900 dark:text-white">Ekle</strong> tuşuna basarak işlemi tamamlayın.</span>
              </li>
            </ol>
          </div>

          {/* Android Guide */}
          <div className={`p-3.5 rounded-2xl border ${!isIOS && !isInstallable ? 'border-amber-400 dark:border-[#f2b544] bg-amber-50/50 dark:bg-[#f2b544]/10' : 'border-slate-200 dark:border-[#274858] bg-slate-50 dark:bg-[#0e1f2b]/60'}`}>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-2">
              <Smartphone className="w-4 h-4 text-[#059669] dark:text-[#5fd3b3]" />
              <span>Android (Chrome) ile Yükleme:</span>
            </div>
            <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-2 pl-1">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#059669] dark:text-[#5fd3b3]">1.</span>
                <span>Chrome tarayıcısında sağ üstteki <strong className="text-slate-900 dark:text-white inline-flex items-center gap-0.5">Üç Nokta <MoreVertical className="w-3.5 h-3.5 inline" /></strong> menüsüne dokunun.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#059669] dark:text-[#5fd3b3]">2.</span>
                <span><strong className="text-slate-900 dark:text-white">"Uygulamayı Yükle"</strong> veya <strong className="text-slate-900 dark:text-white">"Ana Ekrana Ekle"</strong> seçeneğini seçin.</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Benefits notice */}
        <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#0e1f2b] p-2.5 rounded-xl border border-slate-200 dark:border-[#274858] text-center">
          ✨ Telefona yüklendiğinde tarayıcı adres çubuğu gizlenir, tam ekran yerel uygulama gibi hızlıca açılır.
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-[#274858] text-slate-700 dark:text-white font-bold text-xs hover:bg-slate-200 dark:hover:bg-[#345d73] transition-colors"
        >
          Anladım, Kapat
        </button>
      </div>
    </div>
  );
};
