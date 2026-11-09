import React from 'react';

interface KeseIconProps {
  className?: string;
  size?: number;
}

/**
 * Klasik Tarihi Akçe Simgesi (Antique Hammered Ottoman/Seljuk Akçe Coin)
 */
export const KlasikAkce: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={`shrink-0 select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="akceGoldGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#f59e0b" />
          <stop offset="75%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </radialGradient>
        <linearGradient id="akceRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="50%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>

      {/* Hammered slightly irregular coin body */}
      <circle cx="20" cy="20" r="18.5" fill="url(#akceGoldGrad)" stroke="url(#akceRimGrad)" strokeWidth="1.5" />

      {/* Classical Beaded Denticle Rim (İnci Bordür) */}
      <circle
        cx="20"
        cy="20"
        r="15.8"
        stroke="#78350f"
        strokeWidth="1.2"
        strokeDasharray="1.2 2"
        fill="none"
        opacity="0.85"
      />

      {/* Inner Inscription Ring */}
      <circle cx="20" cy="20" r="13" stroke="#92400e" strokeWidth="0.8" fill="none" opacity="0.6" />

      {/* Classical Ottoman Calligraphic Motif / Tuğra Stylization */}
      {/* Central curved tuğra bows */}
      <path
        d="M 12 25 C 13 17, 18 13, 23 13 C 27 13, 29 16, 26 21 C 23 25, 17 26, 13 25 Z"
        stroke="#78350f"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Tuğra upright strokes (tuğlar) */}
      <path
        d="M 21 11 L 21 27 M 24 12 L 24 25 M 18 14 L 18 24"
        stroke="#78350f"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Historical crescent & star flourish */}
      <path
        d="M 16 16.5 C 15 18, 15 20, 17 21 C 15.5 20.5, 15 18.5, 16 16.5 Z"
        fill="#78350f"
      />
      <circle cx="27.5" cy="15.5" r="1" fill="#78350f" />

      {/* Bottom classical date / mint flourish */}
      <path
        d="M 14 27 C 17 28.5, 23 28.5, 26 27"
        stroke="#78350f"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * Klasik Kese İkonu (Traditional Drawstring Pouch Icon)
 */
export const KeseIcon: React.FC<KeseIconProps> = ({ className = 'w-5 h-5', size }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
    >
      {/* Ruffled throat / pleated top folds */}
      <path
        d="M8 3.5C8.8 4.8 9.5 5.5 12 5.5C14.5 5.5 15.2 4.8 16 3.5C15.5 5.2 14.8 6.2 12 6.2C9.2 6.2 8.5 5.2 8 3.5Z"
        fill="currentColor"
        fillOpacity="0.35"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />

      {/* Braided neck cord with tied knot */}
      <path
        d="M7.8 7C9.2 8.2 14.8 8.2 16.2 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="7.2" r="1.3" fill="currentColor" />

      {/* Hanging cords with traditional tassels (püsküller) */}
      <path
        d="M10.8 7.8L9 11.2M13.2 7.8L15 11.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M8.2 11.2L9.8 11.2L9 13.5ZM14.2 11.2L15.8 11.2L15 13.5Z"
        fill="currentColor"
      />

      {/* Main classic leather / brocade pouch body */}
      <path
        d="M8 7.2C5.6 9 4.2 12 4.2 15C4.2 18.8 7.7 21.2 12 21.2C16.3 21.2 19.8 18.8 19.8 15C19.8 12 18.4 9 16 7.2"
        fill="currentColor"
        fillOpacity="0.22"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* Classical embossed Akçe medallion on pouch belly */}
      <circle cx="12" cy="14.8" r="3.2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="14.8" r="2.2" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1 1" />
      <path
        d="M11.2 14.8C11.5 13.8 12.5 13.8 12.8 14.8M12 13.8V15.8"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
};

interface AnimatedKeseProps {
  isActive: boolean;
  className?: string;
}

/**
 * Zengin Klasik Kese ve Tarihi Akçe Dökülme Animasyonu
 */
export const AnimatedKese: React.FC<AnimatedKeseProps> = ({ isActive, className = 'w-24 h-24' }) => {
  return (
    <div className={`relative ${className} flex items-center justify-center select-none pointer-events-none`}>
      {/* Klasik Akçe Yağmuru (Falling Classical Akçe Coins when active) */}
      {isActive && (
        <div className="absolute inset-0 overflow-visible pointer-events-none z-10">
          {/* Falling Akçe 1 */}
          <div
            className="absolute left-[36%] -top-4 shadow-lg animate-bounce"
            style={{ animationDuration: '1.2s' }}
          >
            <KlasikAkce size={22} className="drop-shadow-md rotate-[-12deg]" />
          </div>

          {/* Falling Akçe 2 */}
          <div
            className="absolute left-[54%] -top-2 shadow-md"
            style={{
              animation: 'bounce 1.5s infinite ease-in-out',
              animationDelay: '0.45s',
            }}
          >
            <KlasikAkce size={18} className="drop-shadow-sm rotate-[18deg]" />
          </div>

          {/* Falling Akçe 3 */}
          <div
            className="absolute left-[44%] -top-5"
            style={{
              animation: 'bounce 1.8s infinite ease-in-out',
              animationDelay: '0.9s',
            }}
          >
            <KlasikAkce size={15} className="drop-shadow-sm rotate-[4deg]" />
          </div>

          {/* Antique golden sparkles */}
          <span className="absolute -left-2 top-3 text-amber-500 text-xs animate-ping">✦</span>
          <span className="absolute -right-2 top-5 text-amber-400 text-xs animate-pulse">✦</span>
          <span className="absolute left-[48%] top-2 text-yellow-300 text-[10px] animate-pulse">✧</span>
        </div>
      )}

      {/* Klasik Kese SVG (Traditional Ottoman / Anatolian Drawstring Money Pouch) */}
      <svg
        viewBox="0 0 120 120"
        className={`w-full h-full drop-shadow-md transition-transform duration-300 ${
          isActive ? 'scale-105' : 'group-hover:scale-105'
        }`}
      >
        <defs>
          {/* Leather / Brocade body gradient */}
          <radialGradient id="klasikKeseBody" cx="42%" cy="46%" r="58%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="35%" stopColor="#d97706" />
            <stop offset="70%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>

          {/* Ruffle neck gradient */}
          <linearGradient id="klasikKeseRuffle" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          {/* Braided cord gold gradient */}
          <linearGradient id="klasikCordGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          {/* Coin medallion radial gradient */}
          <radialGradient id="medallionGold" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="35%" stopColor="#fde047" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>

          {/* Soft shadow */}
          <filter id="pouchShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3" floodColor="#451a03" />
          </filter>
        </defs>

        {/* --- POUCH TOP RUFFLE / BÜZGÜLÜ AĞIZ --- */}
        <path
          d="M 40 25 
             C 44 32, 50 23, 60 23 
             C 70 23, 76 32, 80 25 
             C 76 36, 70 38, 60 38 
             C 50 38, 44 36, 40 25 Z"
          fill="url(#klasikKeseRuffle)"
          stroke="#78350f"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Pleat folds inside ruffle */}
        <path
          d="M 49 26 Q 52 35 55 38 M 65 38 Q 68 35 71 26 M 60 23 L 60 38"
          stroke="#78350f"
          strokeWidth="1.2"
          opacity="0.6"
          strokeLinecap="round"
        />

        {/* --- COINS OVERFLOWING FROM POUCH MOUTH (When Active) --- */}
        {isActive && (
          <g>
            {/* Peeking Akçe Left */}
            <circle cx="51" cy="27" r="6.5" fill="url(#medallionGold)" stroke="#78350f" strokeWidth="1" />
            <circle cx="51" cy="27" r="5" stroke="#92400e" strokeWidth="0.6" strokeDasharray="1 1" fill="none" />
            
            {/* Peeking Akçe Right */}
            <circle cx="69" cy="28" r="6" fill="url(#medallionGold)" stroke="#78350f" strokeWidth="1" />
            <circle cx="69" cy="28" r="4.5" stroke="#92400e" strokeWidth="0.6" strokeDasharray="1 1" fill="none" />

            {/* Peeking Akçe Center (in front) */}
            <circle cx="60" cy="24" r="7.5" fill="url(#medallionGold)" stroke="#78350f" strokeWidth="1.2" />
            <circle cx="60" cy="24" r="6" stroke="#92400e" strokeWidth="0.8" strokeDasharray="1 1" fill="none" />
            {/* Tuğra emblem on center peeking coin */}
            <path
              d="M 57 26 C 58 22, 60 21, 62 21 M 60 20 L 60 27"
              stroke="#78350f"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* --- MAIN POUCH PLUMP LEATHER BODY --- */}
        <path
          d="M 46 38 
             C 30 46, 20 60, 20 78 
             C 20 98, 38 107, 60 107 
             C 82 107, 100 98, 100 78 
             C 100 60, 90 46, 74 38 
             Z"
          fill="url(#klasikKeseBody)"
          stroke="#5c2406"
          strokeWidth="2.5"
          filter="url(#pouchShadow)"
        />

        {/* Decorative Leather Stitching along outer curve */}
        <path
          d="M 32 76 C 32 90, 44 98, 60 98 C 76 98, 88 90, 88 76"
          stroke="#fef3c7"
          strokeWidth="1.3"
          strokeDasharray="2.5 3"
          fill="none"
          opacity="0.65"
        />

        {/* --- BRAIDED DRAWSTRING CORD & TASSELS --- */}
        {/* Horizontal Neck Cord Wraps */}
        <path
          d="M 44 38 Q 60 42 76 38"
          stroke="url(#klasikCordGold)"
          strokeWidth="3.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 44 38 Q 60 42 76 38"
          stroke="#78350f"
          strokeWidth="1"
          strokeDasharray="2 2"
          fill="none"
        />

        {/* Classical Tie Knot in Center */}
        <ellipse cx="60" cy="40" rx="4.5" ry="3.5" fill="url(#klasikCordGold)" stroke="#78350f" strokeWidth="1.5" />
        <circle cx="60" cy="40" r="1.5" fill="#fef08a" />

        {/* Hanging braided cords */}
        <path
          d="M 57 42 Q 53 50 50 58 M 63 42 Q 67 50 70 58"
          stroke="url(#klasikCordGold)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Tassel Knots & Fringe (Püsküller) */}
        {/* Left Tassel */}
        <path
          d="M 48 58 L 52 58 L 54 66 L 46 66 Z"
          fill="#f59e0b"
          stroke="#78350f"
          strokeWidth="1.2"
        />
        <path d="M 47 66 L 47 70 M 50 66 L 50 71 M 53 66 L 53 70" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
        <circle cx="50" cy="58" r="1.8" fill="#fef08a" stroke="#78350f" strokeWidth="1" />

        {/* Right Tassel */}
        <path
          d="M 68 58 L 72 58 L 74 66 L 66 66 Z"
          fill="#f59e0b"
          stroke="#78350f"
          strokeWidth="1.2"
        />
        <path d="M 67 66 L 67 70 M 70 66 L 70 71 M 73 66 L 73 70" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
        <circle cx="70" cy="58" r="1.8" fill="#fef08a" stroke="#78350f" strokeWidth="1" />

        {/* --- EMBOSSED CLASSICAL AKÇE MEDALLION (Tarihi Akçe Mührü) --- */}
        <g transform="translate(42, 60)">
          {/* Base hammered gold medallion */}
          <circle cx="18" cy="18" r="16" fill="url(#medallionGold)" stroke="#78350f" strokeWidth="2" />
          
          {/* İnci Bordür (Classical beaded rim) */}
          <circle
            cx="18"
            cy="18"
            r="13.5"
            stroke="#78350f"
            strokeWidth="1.2"
            strokeDasharray="1.2 1.8"
            fill="none"
            opacity="0.85"
          />

          {/* Inner ring */}
          <circle cx="18" cy="18" r="11" stroke="#92400e" strokeWidth="0.8" fill="none" opacity="0.6" />

          {/* Historical Ottoman Calligraphic Seal (Tuğra Motifi) */}
          <path
            d="M 11 22 C 12 15, 16 12, 21 12 C 24 12, 26 14, 24 18 C 21 22, 16 23, 12 22 Z"
            stroke="#5c2406"
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
          />
          {/* Upright Tuğra Strokes */}
          <path
            d="M 19 10 L 19 24 M 22 11 L 22 22 M 16 13 L 16 21"
            stroke="#5c2406"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Antique Crescent Accent */}
          <path
            d="M 14 15 C 13.5 16.5, 13.5 18, 15 19 C 14 18.5, 13.8 17, 14 15 Z"
            fill="#5c2406"
          />
          <circle cx="24.5" cy="14" r="1" fill="#5c2406" />

          {/* Mint/Year arabesque curve */}
          <path
            d="M 13 24 Q 18 26 23 24"
            stroke="#5c2406"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};
