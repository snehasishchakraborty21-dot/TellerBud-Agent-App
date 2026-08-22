import React from 'react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import { Building2, ArrowLeft } from 'lucide-react';

interface AgentBoothConfirmationScreenProps {
  agentId?: string;
  onReturnToLogin: () => void;
}

export const AgentBoothConfirmationScreen: React.FC<
  AgentBoothConfirmationScreenProps
> = ({ agentId, onReturnToLogin }) => {
  return (
    <div className="w-full h-full min-h-full bg-slate-50 flex flex-col justify-between overflow-y-auto px-6 py-8 sm:px-8 sm:py-10 text-slate-900 select-none">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center pt-6">
        <TellerBudLogo size="lg" className="mb-6 drop-shadow" />

        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mb-5 shadow-sm">
          <Building2 className="w-7 h-7 stroke-[2]" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 text-center mb-2">
          Work Session Authenticated
        </h2>

        <p className="text-[13.5px] text-slate-600 text-center leading-relaxed mb-6">
          Agent ID <span className="font-semibold text-slate-900">{agentId || 'Authenticated'}</span> is ready for booth assignment confirmation.
        </p>

        <div className="w-full p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs mb-6 text-left">
          <p className="text-[12px] font-semibold tracking-wider text-slate-400 uppercase mb-1">
            Canonical Contract Status
          </p>
          <p className="text-[13px] font-medium text-slate-700 leading-snug">
            Authentication successfully verified. Proceeding to Agent booth confirmation flow.
          </p>
        </div>

        <button
          onClick={onReturnToLogin}
          className="w-full h-[48px] px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-[14px] font-semibold flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Sign Out / Return to Sign In</span>
        </button>
      </div>

      <div className="w-full max-w-sm mx-auto text-center pt-8 pb-2">
        <p className="text-[12px] font-medium text-slate-400">
          TellerBud Operations &bull; Secure Agent Portal
        </p>
      </div>
    </div>
  );
};
