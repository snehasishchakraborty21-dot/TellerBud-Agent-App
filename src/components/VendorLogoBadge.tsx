import React from 'react';
import { getVendorLogo, getVendorLogoDisplayConfig } from '../config/walkInConfig';

interface VendorLogoBadgeProps {
  vendorName: string;
  size?: 'dropdown-trigger' | 'option-row' | 'card' | 'compact';
  className?: string;
}

export const VendorLogoBadge: React.FC<VendorLogoBadgeProps> = ({
  vendorName,
  size = 'option-row',
  className = '',
}) => {
  const logoSrc = getVendorLogo(vendorName);
  const displayConfig = getVendorLogoDisplayConfig(vendorName);
  const isBank = displayConfig.isBank;

  // Frame sizing according to requirements:
  // - option-row (sheet / dropdown option): 40x40 for MNO, 52x40 for Bank
  // - dropdown-trigger (closed field): 36x36 for MNO, 46x34 for Bank
  // - card / compact: scalable variants
  let frameClasses = 'w-10 h-10'; // default 40x40

  if (size === 'option-row') {
    frameClasses = isBank ? 'w-[54px] h-10' : 'w-10 h-10';
  } else if (size === 'dropdown-trigger') {
    frameClasses = isBank ? 'w-12 h-8' : 'w-8 h-8';
  } else if (size === 'compact') {
    frameClasses = isBank ? 'w-10 h-7' : 'w-7 h-7';
  } else if (size === 'card') {
    frameClasses = isBank ? 'w-14 h-10' : 'w-11 h-11';
  }

  return (
    <div
      className={`relative rounded-xl border border-slate-200/90 flex items-center justify-center p-0 overflow-hidden shrink-0 shadow-2xs ${frameClasses} ${className}`}
      style={{
        backgroundColor: displayConfig.bgColor || '#ffffff',
      }}
    >
      {logoSrc ? (
        <img
          src={logoSrc}
          alt={vendorName}
          className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-150"
          style={{
            transform: `scale(${displayConfig.scale})`,
            transformOrigin: 'center',
          }}
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="w-3 h-3 rounded-full bg-[#0052CC]" />
      )}
    </div>
  );
};
