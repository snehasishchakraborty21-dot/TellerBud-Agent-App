import React from 'react';

interface PoweredByCinitecFooterProps {
  className?: string;
  id?: string;
}

export const PoweredByCinitecFooter: React.FC<PoweredByCinitecFooterProps> = ({
  className = '',
  id,
}) => {
  return (
    <div
      id={id}
      className={`w-full text-center text-xs font-bold text-red-600 tracking-wide select-none py-3 ${className}`}
    >
      Powered by Cinitec
    </div>
  );
};
