import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { SpinResult } from '../types';
import { formatTimeCountdown, getServerNow } from '../services/api';
import { Sparkles, Gift, Clock, AlertCircle } from 'lucide-react';

interface SliceDefinition {
  index: number;
  label: string;
  subLabel: string;
  isJoker: boolean;
  prob: string;
  bgColor: string;
  textColor: string;
}

export const WheelTab: React.FC = () => {
  const { user, spinWheel } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [spinning, setSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<SpinResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nextFreeRemainingMs, setNextFreeRemainingMs] = useState(0);

  // 7 slices with swapped positions (index 2: 2 çevirme, index 5: 0,3 akçe) and bold distinctive colors
  const slices: SliceDefinition[] = [
    { index: 0, label: '0,1', subLabel: 'akçe', isJoker: false, prob: '%50', bgColor: '#0f766e', textColor: '#ffffff' },
    { index: 1, label: '0,2', subLabel: 'akçe', isJoker: false, prob: '%25', bgColor: '#1d4ed8', textColor: '#ffffff' },
    { index: 2, label: '2', subLabel: 'çevirme', isJoker: true, prob: '%6', bgColor: '#0f172a', textColor: '#f2b544' },
    { index: 3, label: '0,5', subLabel: 'akçe', isJoker: false, prob: '%5', bgColor: '#c026d3', textColor: '#ffffff' },
    { index: 4, label: '1', subLabel: 'akçe', isJoker: false, prob: '%1', bgColor: '#f59e0b', textColor: '#0f172a' },
    { index: 5, label: '0,3', subLabel: 'akçe', isJoker: false, prob: '%10', bgColor: '#b91c1c', textColor: '#ffffff' },
    { index: 6, label: '3', subLabel: 'çevirme', isJoker: true, prob: '%3', bgColor: '#020617', textColor: '#fbbf24' },
  ];

  const spinsAvailable = user?.wheel.spinsAvailable ?? 0;
  const lastDailySpinTime = user?.wheel.lastDailySpinTime ?? 0;

  // 24h countdown to next free spin
  useEffect(() => {
    const timer = setInterval(() => {
      const now = getServerNow();
      const DAY_MS = 24 * 60 * 60 * 1000;
      const nextTime = lastDailySpinTime + DAY_MS;
      if (now < nextTime) {
        setNextFreeRemainingMs(nextTime - now);
      } else {
        setNextFreeRemainingMs(0);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lastDailySpinTime]);

  // Draw wheel on canvas
  const drawWheel = useCallback((rotationAngle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const outerRadius = width / 2 - 12;
    const sliceAngle = (2 * Math.PI) / slices.length;

    ctx.clearRect(0, 0, width, height);

    // Save context for rotation
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotationAngle);

    // Draw slices
    slices.forEach((slice, i) => {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, outerRadius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = slice.bgColor;
      ctx.fill();

      // Slice borders
      ctx.strokeStyle = '#274858';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Text in slice
      ctx.save();
      const midAngle = startAngle + sliceAngle / 2;
      ctx.rotate(midAngle);
      ctx.translate(outerRadius * 0.65, 0);
      ctx.rotate(Math.PI / 2); // Orient text inward

      if (slice.isJoker) {
        // Joker slice: dark background with gold text ("2 çevirme" or "3 çevirme")
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f2b544';
        ctx.font = 'bold 15px "Bricolage Grotesque", sans-serif';
        ctx.fillText(`${slice.label} çevirme`, 0, -4);

        ctx.fillStyle = '#f2b544';
        ctx.font = 'bold 9px "Bricolage Grotesque", sans-serif';
        ctx.fillText('JOKER', 0, 9);
      } else {
        // Akçe slice: number with small "akçe" text underneath
        ctx.textAlign = 'center';
        ctx.fillStyle = slice.textColor;
        ctx.font = 'bold 19px "Bricolage Grotesque", sans-serif';
        ctx.fillText(slice.label, 0, -3);

        ctx.fillStyle = slice.textColor === '#0f172a' ? '#1e293b' : 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 11px "Bricolage Grotesque", sans-serif';
        ctx.fillText('akçe', 0, 12);
      }

      ctx.restore();
    });

    // Outer decorative ring
    ctx.beginPath();
    ctx.arc(0, 0, outerRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#f2b544';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.restore();
  }, [slices]);

  // Initial render of canvas
  useEffect(() => {
    drawWheel(currentRotation);
  }, [drawWheel, currentRotation]);

  // Spin handler
  const handleSpin = async () => {
    if (spinning || spinsAvailable <= 0) return;
    try {
      setSpinning(true);
      setErrorMsg(null);
      setWonPrize(null);

      // 1. Get winning slice from server
      const result = await spinWheel();
      const targetIndex = result.sliceIndex;

      // 2. Animate wheel to the winning slice
      // Pointer is fixed at top (270 deg / -90 deg, which in canvas is -Math.PI / 2)
      const sliceAngle = (2 * Math.PI) / slices.length;
      
      const topAngle = -Math.PI / 2;
      const targetSliceCenter = targetIndex * sliceAngle + sliceAngle / 2;
      
      // Calculate final rotation with 6 full extra turns (12 * Math.PI)
      const currentMod = currentRotation % (2 * Math.PI);
      const targetNormalized = (topAngle - targetSliceCenter + 4 * Math.PI) % (2 * Math.PI);
      
      let deltaAngle = targetNormalized - currentMod;
      if (deltaAngle < 0) deltaAngle += 2 * Math.PI;
      
      // 6 extra full spins for suspense
      const totalSpinAngle = deltaAngle + 6 * (2 * Math.PI);
      const startAngle = currentRotation;
      const finalAngle = startAngle + totalSpinAngle;

      const duration = 4500; // ms
      const startTime = performance.now();

      // Ease out quartic function
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easedProgress = easeOut(progress);
        const newAngle = startAngle + totalSpinAngle * easedProgress;

        setCurrentRotation(newAngle);
        drawWheel(newAngle);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setSpinning(false);
          setCurrentRotation(finalAngle);
          drawWheel(finalAngle);
          setWonPrize(result);
        }
      };

      requestAnimationFrame(animate);
    } catch (err: unknown) {
      setSpinning(false);
      setErrorMsg(err instanceof Error ? err.message : 'Çevirme sırasında bir hata oluştu.');
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-24 pt-2">
      {/* Title & Status */}
      <div className="flex items-center justify-between bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] p-3 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-[#e8616b]/20 text-rose-600 dark:text-[#e8616b] flex items-center justify-center">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Günlük Şans Çarkı</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Her 24 saatte 1 ücretsiz hak</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#0e1f2b] border border-slate-200 dark:border-[#274858]">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Kalan Hak:</span>
          <span className="text-sm font-black text-[#d97706] dark:text-[#f2b544] font-mono">{spinsAvailable}</span>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 dark:bg-[#e8616b]/20 border border-rose-200 dark:border-[#e8616b] text-rose-800 dark:text-white px-3 py-2 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-[#e8616b] shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Wheel Area with Canvas */}
      <div className="flex flex-col items-center justify-center my-1 relative">
        {/* Fixed Top Pointer (Ok) */}
        <div className="absolute top-0 z-20 flex flex-col items-center pointer-events-none transform -translate-y-2">
          <div className="w-6 h-6 bg-[#f2b544] shadow-lg rounded-sm rotate-45 border-2 border-white dark:border-[#0e1f2b] -mb-3" />
          <div className="w-3 h-3 bg-[#e8616b] rounded-full z-10 border border-white" />
        </div>

        {/* Canvas Wheel container */}
        <div className="relative w-[300px] h-[300px] flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="w-[300px] h-[300px] rounded-full drop-shadow-xl"
          />

          {/* Center circular coral button: exactly says "Çevir" */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button
              onClick={handleSpin}
              disabled={spinning || spinsAvailable <= 0}
              className={`pointer-events-auto w-[76px] h-[76px] rounded-full bg-[#e8616b] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center shadow-lg border-4 border-white dark:border-[#16303f] hover:bg-[#ef4444] active:scale-95 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-[#e8616b]/50 ${
                spinning || spinsAvailable <= 0
                  ? 'opacity-85 cursor-not-allowed bg-slate-400 border-slate-200 dark:bg-slate-600 dark:border-slate-700'
                  : 'cursor-pointer animate-pulse'
              }`}
              aria-label="Çarkı çevir"
            >
              Çevir
            </button>
          </div>
        </div>

        {/* Countdown if no spins available */}
        {spinsAvailable <= 0 && nextFreeRemainingMs > 0 && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#16303f] border border-slate-200 dark:border-[#274858] text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#d97706] dark:text-[#f2b544]" />
            <span>Yeni hak için kalan:</span>
            <span className="font-mono text-[#d97706] dark:text-[#f2b544] font-bold">
              {formatTimeCountdown(nextFreeRemainingMs)}
            </span>
          </div>
        )}
      </div>

      {/* Prize Won Banner / Modal */}
      {wonPrize && (
        <div className="bg-white dark:bg-gradient-to-r dark:from-[#16303f] dark:via-[#1f4357] dark:to-[#16303f] border-2 border-amber-400 dark:border-[#f2b544] rounded-2xl p-4 text-center shadow-lg animate-scale-in">
          <div className="inline-flex items-center gap-1.5 text-[#d97706] dark:text-[#f2b544] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Tebrikler! Kazandınız</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white my-1 font-mono">
            {wonPrize.prizeType === 'akce'
              ? `+${wonPrize.prizeValue} akçe`
              : `+${wonPrize.prizeValue} Ekstra Çevirme!`}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            {wonPrize.prizeType === 'akce'
              ? 'Kazanılan akçe anında bakiyenize eklendi.'
              : 'Joker hakkı ile çarkı tekrar çevirebilirsiniz!'}
          </div>
        </div>
      )}
    </div>
  );
};
