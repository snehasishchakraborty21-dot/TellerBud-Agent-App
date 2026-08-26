import React, { useState } from 'react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import { CinitecLogo } from '../components/CinitecLogo';
import { PoweredByCinitecFooter } from '../components/PoweredByCinitecFooter';

interface AgentDeviceHomeScreenProps {
  onLaunchTellerBud: () => void;
}

export const AgentDeviceHomeScreen: React.FC<AgentDeviceHomeScreenProps> = ({
  onLaunchTellerBud,
}) => {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleAppTap = () => {
    if (isLaunching) return;
    setIsLaunching(true);
    setTimeout(() => {
      onLaunchTellerBud();
    }, 280);
  };

  return (
    <div className="relative w-full h-full bg-[#FCF8F1] text-slate-900 flex flex-col justify-between px-6 pt-10 pb-8 select-none overflow-hidden font-sans">
      {/* Decorative Layer: Elegant Subtle Flowing Waves (SVG) */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
        aria-hidden="true"
      >
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 390 844"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Subtle warm gradients for wave ribbons */}
            <linearGradient id="waveGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DFCDB6" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#EADBCA" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#F5EFE6" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="waveGrad2" x1="0%" y1="80%" x2="100%" y2="20%">
              <stop offset="0%" stopColor="#D8C4AA" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#EADBCA" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#FAF5ED" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="waveStroke1" x1="0%" y1="100%" x2="100%" y2="30%">
              <stop offset="0%" stopColor="#D5C0A4" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#E4D5C1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F4ECE0" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="waveStroke2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#CCA882" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#DDBFA0" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#FAF5ED" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="topRightWave" x1="100%" y1="15%" x2="35%" y2="55%">
              <stop offset="0%" stopColor="#DFCDB6" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#EDE0D0" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#FCF8F1" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Upper-Right Soft Flowing Waves (Refined Visibility) */}
          <path
            d="M420,120 C320,160 270,240 330,340 C370,410 430,440 430,440 L430,120 Z"
            fill="url(#topRightWave)"
          />
          <path
            d="M400,80 C290,145 240,250 305,360 C350,435 410,475 425,485"
            stroke="url(#waveStroke2)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M415,120 C325,175 270,270 325,370 C365,440 410,480 430,500"
            stroke="url(#waveStroke2)"
            strokeWidth="1.5"
            strokeDasharray="5 2.5"
            fill="none"
            opacity="0.85"
          />
          <path
            d="M390,160 C320,215 290,290 335,385 C370,435 420,475 430,490"
            stroke="url(#waveStroke2)"
            strokeWidth="1.25"
            fill="none"
          />

          {/* Lower-Left to Lower-Right Diagonal Flowing Waves */}
          <path
            d="M-50,680 C60,630 140,650 230,730 C300,790 370,800 440,780 L440,880 L-50,880 Z"
            fill="url(#waveGrad1)"
          />
          <path
            d="M-60,730 C40,690 120,700 200,770 C270,830 350,840 440,820 L440,880 L-60,880 Z"
            fill="url(#waveGrad2)"
          />
          <path
            d="M-50,620 C70,570 160,590 260,680 C330,740 390,750 440,730"
            stroke="url(#waveStroke1)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M-40,650 C70,610 150,620 240,700 C310,760 380,770 430,750"
            stroke="url(#waveStroke1)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M-30,680 C80,640 160,650 240,730 C300,780 370,790 420,780"
            stroke="url(#waveStroke1)"
            strokeWidth="1.2"
            strokeDasharray="6 3"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M-20,720 C80,680 150,690 230,760 C290,810 360,820 420,810"
            stroke="url(#waveStroke1)"
            strokeWidth="1.25"
            fill="none"
          />
        </svg>
      </div>

      {/* 1. Top Section: Cinitec Corporate Logo (Transparent PNG asset) */}
      <div className="relative z-10 w-full flex justify-center shrink-0 pt-3">
        <CinitecLogo
          src="assets/cinitec_transparent_logo.png"
          maxWidth={180}
        />
      </div>

      {/* 2. Center / Lower-Middle Section: TellerBud Agent Logo & Name */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto pt-2 pb-1">
        <button
          onClick={handleAppTap}
          disabled={isLaunching}
          className={`
            group relative flex flex-col items-center justify-center focus:outline-none
            transition-all duration-200 ease-out active:scale-95 cursor-pointer p-2 rounded-3xl
            ${isLaunching ? 'scale-105 opacity-90' : 'hover:scale-105'}
          `}
          aria-label="Launch TellerBud"
        >
          {/* App Icon Container: TellerBud Agent Logo (~125px) */}
          <div className="relative flex items-center justify-center w-[126px] h-[126px]">
            <TellerBudLogo
              size={126}
              className="w-[126px] h-[126px] transition-all drop-shadow-sm"
            />
            {/* Subtle tap highlight */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-active:opacity-100 transition-opacity rounded-3xl" />
          </div>

          {/* Application Name Label: Bold Dark Navy Typography with tightened spacing */}
          <span className="mt-2 text-[23px] font-bold text-[#002244] tracking-tight">
            TellerBud
          </span>
        </button>
      </div>

      {/* 3. Bottom Section: Powered by Cinitec Footer (Red, Bold, ~30px above bottom) */}
      <div className="relative z-10 shrink-0 pb-1">
        <PoweredByCinitecFooter className="py-1 text-[13px] font-extrabold" />
      </div>

      {/* Opening App Overlay Transition Effect */}
      {isLaunching && (
        <div className="absolute inset-0 bg-[#FCF8F1] animate-fadeIn z-50 flex flex-col items-center justify-center gap-2">
          <TellerBudLogo size={126} className="w-[126px] h-[126px] animate-pulse" />
          <span className="text-[#002244] text-xl font-bold tracking-tight">TellerBud</span>
        </div>
      )}
    </div>
  );
};

