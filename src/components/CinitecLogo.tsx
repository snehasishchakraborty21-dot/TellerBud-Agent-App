import React from 'react';
import cinitecLogo from '../../assets/cinitec-logo.jpeg';

interface CinitecLogoProps {
  className?: string;
  alt?: string;
  maxWidth?: number;
}

export const CinitecLogo: React.FC<CinitecLogoProps> = ({
  className = '',
  alt = 'Cinitec',
  maxWidth = 190,
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ maxWidth: `${maxWidth}px`, width: '100%' }}
      aria-label="Cinitec Logo"
    >
      <img
        src={cinitecLogo}
        alt={alt}
        referrerPolicy="no-referrer"
        className="w-full h-auto object-contain pointer-events-none"
        style={{ maxHeight: '110px' }}
      />
    </div>
  );
};
