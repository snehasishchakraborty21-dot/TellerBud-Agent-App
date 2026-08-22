import React, { useEffect } from 'react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import { CinitecLogo } from '../components/CinitecLogo';

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
      className="relative w-full h-full bg-white text-slate-900 flex flex-col items-center justify-between px-6 pt-8 pb-0 select-none overflow-hidden font-sans cursor-pointer"
    >
      {/* Top Branding Section: Prominent TellerBud Agent Logo */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center pt-6 sm:pt-8">
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

      {/* Lower-Middle Section: Secondary "Powered by Cinitec" Branding (Elevated with ~80-90px bottom whitespace) */}
      <div className="w-full flex flex-col items-center justify-center shrink-0 z-10 pb-20 sm:pb-22">
        <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
          Powered by
        </span>
        <CinitecLogo maxWidth={120} alt="Cinitec" />
      </div>
    </div>
  );
};
