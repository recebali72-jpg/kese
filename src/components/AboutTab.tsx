import React, { useState } from 'react';
import { Disc, Flame, Users, AlertTriangle, ShieldCheck, HelpCircle, Smartphone, Download } from 'lucide-react';
import { KeseIcon } from './KeseIcon';
import { PWAInstallModal } from './PWAInstallModal';

export const AboutTab: React.FC = () => {
  const [installModalOpen, setInstallModalOpen] = useState(false);
  return (
    <div className="flex flex-col gap-4 pb-28 pt-2">
      {/* Intro Hero */}
      <div className="bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] rounded-2xl p-4 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-[#f2b544]/20 border border-amber-200 dark:border-[#f2b544]/40 text-[#d97706] dark:text-[#f2b544] flex items-center justify-center mx-auto mb-2.5">
          <KeseIcon className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Kese Nedir?</h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
          Kese, her gün düzenli olarak tek bir dokunuşla kesenize akçe doldurabileceğiniz,
          çark çevirebileceğiniz ve topluluk sıralamasında yerinizi alabileceğiniz mobil öncelikli
          günlük sadakat ve birikim simülasyonudur.
        </p>
      </div>

      {/* 1. Mining & Formula */}
      <div className="bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <KeseIcon className="w-4 h-4 text-[#d97706] dark:text-[#f2b544]" />
          <span>Keseye Akçe Dolumu ve Günlük Kazanç Formülü</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Keseye akçe dolumu 24 saat sürer. Bu süreçte kazancınız kesenize her saniye canlı olarak dolar ve
          24 saat tamamlandığında kesinleşir.
        </p>
        <div className="bg-slate-50 dark:bg-[#0e1f2b] p-3 rounded-xl border border-slate-200 dark:border-[#274858] text-xs space-y-1.5">
          <div className="font-mono text-[#059669] dark:text-[#5fd3b3] font-bold">
            Formül: 1 + (1 - 0.9^(seri - 1))
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Eklenen seri bonusu her gün %10 küçülerek 2,00 akçeye yaklaşır:
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] font-mono">
            <div className="text-slate-700 dark:text-slate-300">• 1. Gün: <span className="text-[#d97706] dark:text-[#f2b544] font-bold">1,00 akçe</span></div>
            <div className="text-slate-700 dark:text-slate-300">• 2. Gün: <span className="text-[#d97706] dark:text-[#f2b544] font-bold">1,10 akçe</span></div>
            <div className="text-slate-700 dark:text-slate-300">• 3. Gün: <span className="text-[#d97706] dark:text-[#f2b544] font-bold">1,19 akçe</span></div>
            <div className="text-slate-700 dark:text-slate-300">• 4. Gün: <span className="text-[#d97706] dark:text-[#f2b544] font-bold">1,27 akçe</span></div>
          </div>
        </div>
      </div>

      {/* 2. Streak Grace Rule */}
      <div className="bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Flame className="w-4 h-4 text-[#e8616b]" />
          <span>Seri Koruma Kuralı</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Kese dolumu bittikten sonraki <strong className="text-slate-900 dark:text-white">24 saatlik ek tolerans süresi</strong> içinde
          yeni bir dolum başlatırsanız seriniz kesintisiz devam eder. Bu süre kaçırılırsa seri sıfırlanır ve
          günlük kazanç yeniden 1,00 akçeden başlar.
        </p>
      </div>

      {/* 3. Wheel of Fortune */}
      <div className="bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Disc className="w-4 h-4 text-[#059669] dark:text-[#5fd3b3]" />
          <span>Şans Çarkı ve Jokerler</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Her kullanıcı günde 1 ücretsiz çevirme hakkına sahiptir. Çarkta 0,1 ile 1 akçe arası ödüllerin
          yanı sıra 2 ve 3 ekstra çevirme hakkı sağlayan joker dilimleri yer alır. Çark sonucu güvenli biçimde
          sunucu tarafından belirlenir.
        </p>
      </div>

      {/* 4. Referral System */}
      <div className="bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Users className="w-4 h-4 text-[#d97706] dark:text-[#f2b544]" />
          <span>Davet Sistemi</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Profilinizde yer alan davet kodunuzla katılan her arkadaşınız için bakiyenize <strong className="text-[#d97706] dark:text-[#f2b544]">+5 akçe</strong>,
          kodunuzu giren arkadaşınıza ise anında <strong className="text-[#059669] dark:text-[#5fd3b3]">+2 akçe</strong> hoş geldin bonusu verilir.
        </p>
      </div>

      {/* 5. How to install on phone (PWA Guide) */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-[#16303f] dark:to-[#1a384b] border-2 border-amber-300 dark:border-[#f2b544]/50 rounded-2xl p-4 flex flex-col gap-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
            <Smartphone className="w-4 h-4 text-[#d97706] dark:text-[#f2b544]" />
            <span>Telefona Nasıl İndirilir?</span>
          </div>
          <span className="text-[10px] font-bold uppercase text-[#d97706] dark:text-[#f2b544] bg-amber-100 dark:bg-[#f2b544]/20 px-2 py-0.5 rounded-full border border-amber-300 dark:border-[#f2b544]/30">
            PWA
          </span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          Kese uygulamasını mağaza (App Store / Play Store) aramadan telefonunuzun ana ekranına uygulama simgesi olarak ekleyebilirsiniz:
        </p>
        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div className="bg-white/80 dark:bg-[#0e1f2b]/80 p-2.5 rounded-xl border border-slate-200 dark:border-[#274858]">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">📱 iPhone (Safari):</span>
            <span>Alt kısımdaki <strong>Paylaş</strong> simgesine dokunun ve <strong>"Ana Ekrana Ekle"</strong>yi seçin.</span>
          </div>
          <div className="bg-white/80 dark:bg-[#0e1f2b]/80 p-2.5 rounded-xl border border-slate-200 dark:border-[#274858]">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">🤖 Android (Chrome):</span>
            <span>Sağ üstteki <strong>üç nokta (⋮)</strong> menüsünden <strong>"Uygulamayı Yükle"</strong>yi seçin.</span>
          </div>
        </div>
        <button
          onClick={() => setInstallModalOpen(true)}
          className="mt-1 w-full py-2.5 rounded-xl bg-[#f2b544] text-[#0e1f2b] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-[#f2b544]/20 hover:bg-[#e0a435] active:scale-95 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Telefona İndirme Rehberini Aç</span>
        </button>
      </div>

      {/* PWA Install Modal within AboutTab */}
      <PWAInstallModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
      />

      {/* MANDATORY Bottom Warning Box */}
      <div className="bg-rose-50 dark:bg-[#e8616b]/15 border-2 border-rose-300 dark:border-[#e8616b] rounded-2xl p-4 flex items-start gap-3 mt-1 shadow-sm">
        <AlertTriangle className="w-6 h-6 text-[#e8616b] shrink-0 mt-0.5" />
        <div className="flex flex-col">
          <span className="text-xs font-black text-[#e8616b] uppercase tracking-wider mb-1">
            Önemli Yasal Bildirim
          </span>
          <p className="text-xs font-semibold text-rose-950 dark:text-white leading-relaxed">
            Akçe uygulama içi bir puandır. Para veya kripto para değildir.
          </p>
        </div>
      </div>
    </div>
  );
};
