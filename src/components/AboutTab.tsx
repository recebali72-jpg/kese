import React from 'react';
import { Disc, Flame, Users, AlertTriangle } from 'lucide-react';
import { KeseIcon } from './KeseIcon';
import { useLanguage } from '../context/LanguageContext';

export const AboutTab: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 pb-28 pt-2">
      {/* Intro Hero */}
      <div className="bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] rounded-2xl p-4 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-[#f2b544]/20 border border-amber-200 dark:border-[#f2b544]/40 text-[#d97706] dark:text-[#f2b544] flex items-center justify-center mx-auto mb-2.5">
          <KeseIcon className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">{t.aboutTitle}</h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
          {t.aboutIntro}
        </p>
      </div>

      {/* 1. Mining & Formula */}
      <div className="bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <KeseIcon className="w-4 h-4 text-[#d97706] dark:text-[#f2b544]" />
          <span>{t.formulaTitle}</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {t.formulaDesc}
        </p>
        <div className="bg-slate-50 dark:bg-[#0e1f2b] p-3 rounded-xl border border-slate-200 dark:border-[#274858] text-xs space-y-1.5">
          <div className="font-mono text-[#059669] dark:text-[#5fd3b3] font-bold">
            {t.formulaLabel}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {t.formulaBonusDecay}
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] font-mono">
            <div className="text-slate-700 dark:text-slate-300">• 1. {t.day}: <span className="text-[#d97706] dark:text-[#f2b544] font-bold">1,00 {t.akce}</span></div>
            <div className="text-slate-700 dark:text-slate-300">• 2. {t.day}: <span className="text-[#d97706] dark:text-[#f2b544] font-bold">1,10 {t.akce}</span></div>
            <div className="text-slate-700 dark:text-slate-300">• 3. {t.day}: <span className="text-[#d97706] dark:text-[#f2b544] font-bold">1,19 {t.akce}</span></div>
            <div className="text-slate-700 dark:text-slate-300">• 4. {t.day}: <span className="text-[#d97706] dark:text-[#f2b544] font-bold">1,27 {t.akce}</span></div>
          </div>
        </div>
      </div>

      {/* 2. Streak Grace Rule */}
      <div className="bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Flame className="w-4 h-4 text-[#e8616b]" />
          <span>{t.streakRuleTitle}</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {t.streakRuleDesc}
        </p>
      </div>

      {/* 3. Wheel of Fortune */}
      <div className="bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Disc className="w-4 h-4 text-[#059669] dark:text-[#5fd3b3]" />
          <span>{t.wheelRuleTitle}</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {t.wheelRuleDesc}
        </p>
      </div>

      {/* 4. Referral System */}
      <div className="bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Users className="w-4 h-4 text-[#d97706] dark:text-[#f2b544]" />
          <span>{t.referralRuleTitle}</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {t.referralRuleDesc}
        </p>
      </div>

      {/* MANDATORY Bottom Warning Box - Exact legal statement preserved */}
      <div className="bg-rose-50 dark:bg-[#e8616b]/15 border-2 border-rose-300 dark:border-[#e8616b] rounded-2xl p-4 flex items-start gap-3 mt-1 shadow-sm">
        <AlertTriangle className="w-6 h-6 text-[#e8616b] shrink-0 mt-0.5" />
        <div className="flex flex-col">
          <span className="text-xs font-black text-[#e8616b] uppercase tracking-wider mb-1">
            {t.legalWarningTitle}
          </span>
          <p className="text-xs font-semibold text-rose-950 dark:text-white leading-relaxed">
            {t.legalWarningText}
          </p>
        </div>
      </div>
    </div>
  );
};
