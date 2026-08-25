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
    <div className="relative w-full h-full bg-white text-slate-900 flex flex-col items-center justify-between px-6 pt-9 pb-4 select-none overflow-hidden font-sans">
      {/* Top Corporate Branding: Cinitec Logo Asset */}
      <div className="w-full flex justify-center shrink-0 pt-2">
        <CinitecLogo maxWidth={180} />
      </div>

      {/* Main Launcher Content Area: ONLY TellerBud App Icon & Label with generous vertical breathing room */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto pt-6 pb-2">
        <button
          onClick={handleAppTap}
          disabled={isLaunching}
          className={`
            group relative flex flex-col items-center justify-center focus:outline-none
            transition-all duration-200 ease-out active:scale-95 cursor-pointer p-2 rounded-2xl
            ${isLaunching ? 'scale-105 opacity-85' : 'hover:scale-105'}
          `}
          aria-label="Launch TellerBud"
        >
          {/* App Icon Container: TellerBud Agent Logo (~115px) */}
          <div className="relative flex items-center justify-center w-[115px] h-[115px]">
            <TellerBudLogo
              size="xl"
              className="w-[115px] h-[115px] transition-all drop-shadow-xs"
            />
            {/* Subtle tap highlight shimmer */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-active:opacity-100 transition-opacity rounded-2xl" />
          </div>

          {/* Application Name Label: Deep navy / near-black */}
          <span className="mt-3.5 text-[15px] font-bold text-[#001A41] tracking-normal">
            TellerBud
          </span>
        </button>
      </div>

      {/* Footer Branding */}
      <PoweredByCinitecFooter className="shrink-0 py-2" />

      {/* Opening App Overlay Transition Effect */}
      {isLaunching && (
        <div className="absolute inset-0 bg-white animate-fadeIn z-50 flex flex-col items-center justify-center gap-3">
          <TellerBudLogo size="xl" className="w-[115px] h-[115px] animate-pulse" />
          <span className="text-[#001A41] text-lg font-bold tracking-tight">TellerBud</span>
        </div>
      )}
    </div>
  );
};
