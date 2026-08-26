import React, { useEffect } from 'react';
import { TellerBudLogo } from '../components/TellerBudLogo';

interface AgentSplashScreenProps {
  onSplashComplete?: () => void;
  autoTransition?: boolean;
}

export const AgentSplashScreen: React.FC<AgentSplashScreenProps> = ({
  onSplashComplete,
  autoTransition = true,
}) => {
  useEffect(() => {
    if (!autoTransition || !onSplashComplete) return;

    const timer = setTimeout(() => {
      onSplashComplete();
    }, 1800);

    return () => clearTimeout(timer);
  }, [autoTransition, onSplashComplete]);

  return (
    <div
      id="screen-01-splash"
      onClick={() => onSplashComplete?.()}
      role="button"
      tabIndex={0}
      title="Tap to continue"
      className="relative w-full h-full bg-white text-slate-900 flex flex-col items-center justify-between px-6 pt-8 pb-10 select-none overflow-hidden font-sans cursor-pointer"
    >
      {/* Top spacing */}
      <div className="w-full h-6 shrink-0" />

      {/* Center Branding Section: Prominent TellerBud Agent Logo */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto">
        <div className="relative flex items-center justify-center w-[120px] h-[120px] mb-3.5">
          <TellerBudLogo
            size="xl"
            maxWidth={125}
            className="w-[120px] h-[120px] drop-shadow-xs transition-transform duration-700 ease-out animate-fadeIn"
          />
        </div>

        {/* TellerBud Primary Wordmark */}
        <h1 className="text-[#001A41] text-[26px] font-bold tracking-tight">
          TellerBud
        </h1>
        <p className="text-slate-400 text-xs font-medium tracking-wide mt-1">
          Agency Banking Partner
        </p>
      </div>

      {/* Lower Section: Secondary "Powered by Cinitec" Branding (RED, BOLD, centered) */}
      <div className="w-full flex flex-col items-center justify-center shrink-0 z-10 pb-6 sm:pb-8">
        <span className="text-xs font-bold text-red-600 tracking-wide select-none">
          Powered by Cinitec
        </span>
      </div>
    </div>
  );
};
