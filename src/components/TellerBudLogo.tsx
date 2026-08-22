import React from 'react';

interface TellerBudLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  maxWidth?: number;
  className?: string;
  alt?: string;
}

const TELLERBUD_LOGO_SRC = '/tellerbud_agent_logo.png';

export const TellerBudLogo: React.FC<TellerBudLogoProps> = ({
  size = 'md',
  maxWidth,
  className = '',
  alt = 'TellerBud',
}) => {
  // Preset dimension configurations based on screen context
  let sizeStyles: React.CSSProperties = {};
  let defaultClass = '';

  if (typeof size === 'number') {
    sizeStyles = {
      maxWidth: `${size}px`,
      maxHeight: `${size}px`,
    };
  } else {
    switch (size) {
      case 'sm':
        // Header / Compact screen title bar (approx 34-38px, enlarged ~15-20%)
        defaultClass = 'w-9 h-9';
        sizeStyles = { maxWidth: '38px', maxHeight: '38px' };
        break;
      case 'md':
        defaultClass = 'w-11 h-11';
        sizeStyles = { maxWidth: '48px', maxHeight: '48px' };
        break;
      case 'lg':
        // Sign-in and prominent confirmation cards (approx 95-110px)
        defaultClass = 'w-24 h-24';
        sizeStyles = { maxWidth: '105px', maxHeight: '105px' };
        break;
      case 'xl':
        // Screen 00 Managed Device launcher & Screen 01 Splash (115-125px)
        defaultClass = 'w-[118px] h-[118px]';
        sizeStyles = { maxWidth: '125px', maxHeight: '125px' };
        break;
      default:
        defaultClass = 'w-10 h-10';
        sizeStyles = { maxWidth: '44px', maxHeight: '44px' };
    }
  }

  if (maxWidth) {
    sizeStyles.maxWidth = `${maxWidth}px`;
  }

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 select-none ${defaultClass} ${className}`}
      style={sizeStyles}
      aria-label={alt}
    >
      <img
        src={TELLERBUD_LOGO_SRC}
        alt={alt}
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain pointer-events-none transition-all duration-150"
      />
    </div>
  );
};
