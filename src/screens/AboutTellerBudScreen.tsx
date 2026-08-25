import React from 'react';
import {
  ChevronLeft,
  Info,
  Smartphone,
  CreditCard,
  Building2,
  Coins,
  Wallet,
  Clock,
  MessageSquare,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  FileSpreadsheet,
  Globe2,
  Layers,
  ArrowRightLeft,
  Package,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import { PoweredByCinitecFooter } from '../components/PoweredByCinitecFooter';
import {
  AGENT_APP_VERSION,
  AGENT_APP_BUILD,
  AGENT_APP_NAME,
  AGENT_APP_PLATFORM,
  AGENT_APP_MARKET,
  AGENT_APP_CURRENCY,
  AGENT_APP_CALLING_CODE,
} from '../config/appConfig';
import { AboutTellerBudPreviewState } from '../types';

export interface AboutTellerBudScreenProps {
  previewState?: AboutTellerBudPreviewState;
  onBack?: () => void;
}

export const AboutTellerBudScreen: React.FC<AboutTellerBudScreenProps> = ({
  previewState = 'default',
  onBack,
}) => {
  const features = [
    {
      id: 'feature-pickup',
      title: 'Customer Pickup Requests',
      icon: Package,
      iconBg: 'bg-blue-50 text-[#0052CC] border-blue-100',
      description:
        'Receive and manage incoming customer Pickup requests, accept offers within the response window, and proceed through Assigned Service.',
    },
    {
      id: 'feature-walkin',
      title: 'Walk-In Transactions',
      icon: CreditCard,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      description:
        'Perform over-the-counter Deposit, Withdrawal, and Purchase transactions for walk-in booth customers.',
    },
    {
      id: 'feature-mno',
      title: 'MNO Transactions',
      icon: Smartphone,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      description:
        'Supported USSD and system dialler-based transaction flows for MTN, Airtel, and Zamtel mobile money networks.',
    },
    {
      id: 'feature-bank',
      title: 'Bank Transactions',
      icon: Building2,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      description:
        'Supported agency banking vendor selection for Zanaco, FNB, INDO, Stanbic, and Access Bank.',
    },
    {
      id: 'feature-liquidity',
      title: 'Liquidity Management',
      icon: ArrowRightLeft,
      iconBg: 'bg-sky-50 text-[#0052CC] border-sky-100',
      description:
        'Request Cash or Float, submit Business Owner liquidity requests, perform Agent-to-Agent liquidity exchanges, and track request status.',
    },
    {
      id: 'feature-wallet',
      title: 'TellerBud Wallet',
      icon: Wallet,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      description:
        'View TellerBud Wallet balance, track platform service-fee credits, and request admin Top-Up where applicable.',
    },
    {
      id: 'feature-transactions',
      title: 'Transactions',
      icon: Layers,
      iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
      description:
        'View complete Agent transaction history, filter by category, and access detailed transaction information.',
    },
    {
      id: 'feature-earnings',
      title: 'Agent Earnings',
      icon: Coins,
      iconBg: 'bg-blue-50 text-[#0052CC] border-blue-100',
      description:
        'Review TellerBud Commission Summary, view daily earning totals, and monitor approved commission amounts.',
    },
    {
      id: 'feature-attendance',
      title: 'Attendance',
      icon: Clock,
      iconBg: 'bg-teal-50 text-teal-600 border-teal-100',
      description:
        'Track active workday sessions, review historical attendance records, and verify shift durations.',
    },
    {
      id: 'feature-reports',
      title: 'Reports',
      icon: FileSpreadsheet,
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200/70',
      description:
        'Access SMS Inbox, generate Daily Summary Reports by partner, and review customer and agent chats.',
    },
    {
      id: 'feature-communication',
      title: 'Communication',
      icon: MessageSquare,
      iconBg: 'bg-blue-50 text-[#0052CC] border-blue-100',
      description:
        'Direct customer chat during active assignments and Agent-to-Agent communication during liquidity coordination.',
    },
    {
      id: 'feature-profile-security',
      title: 'Agent Profile & Security',
      icon: ShieldCheck,
      iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      description:
        'Manage Agent Profile information and update your secure 4-digit numeric Agent sign-in passcode.',
    },
    {
      id: 'feature-balance-enquiry',
      title: 'Balance Enquiry',
      icon: PhoneCall,
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      description:
        'Launch system dialler with pre-formatted vendor balance codes for fast mobile-money balance verification.',
    },
    {
      id: 'feature-end-of-day',
      title: 'End-of-Day',
      icon: CheckCircle2,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      description:
        'Declare physical Cash on Hand, submit End-of-Day shift declarations, and securely close out the workday.',
    },
  ];

  return (
    <div
      id="screen-29-about-tellerbud"
      className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden font-sans text-slate-900 select-none h-full min-h-full"
    >
      {/* 1. Header with Back to More & TellerBud branding */}
      <header className="bg-white border-b border-slate-200/80 px-4 py-3 shrink-0 flex items-center justify-between z-10 shadow-2xs">
        <button
          type="button"
          id="about-back-to-more-btn"
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 active:text-[#0052CC] transition-colors py-1 pr-2 -ml-1"
          aria-label="Back to More"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
          <span>More</span>
        </button>

        <h1 className="text-sm font-extrabold text-[#002244] text-center tracking-tight">
          About TellerBud
        </h1>

        <div className="flex items-center justify-end w-10">
          <TellerBudLogo size="sm" />
        </div>
      </header>

      {/* 2. Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-3.5 space-y-3.5">
        {/* Branding Hero Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 text-center shadow-2xs space-y-2.5">
          <div className="flex justify-center">
            <TellerBudLogo size="lg" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#002244] tracking-tight">
              TellerBud
            </h2>
            <p className="text-xs font-bold text-[#0052CC] uppercase tracking-wider mt-0.5">
              Agency Banking Partner
            </p>
          </div>
        </div>

        {/* Platform Overview Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#0052CC] flex items-center justify-center border border-blue-100">
              <Info className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-extrabold text-[#002244] uppercase tracking-wider">
              About TellerBud
            </h3>
          </div>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            TellerBud is an agency banking and assisted financial-services platform that connects customers, agents and business owners through a secure and convenient service network.
          </p>
          <p className="text-xs text-slate-600 font-normal leading-relaxed">
            The TellerBud Agent App enables authorized agents to manage customer service requests, perform supported transactions, manage liquidity, handle walk-in customers and access operational tools from one application.
          </p>
        </div>

        {/* Agent App Features Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#0052CC] flex items-center justify-center border border-blue-100">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-extrabold text-[#002244] uppercase tracking-wider">
              Agent App Features
            </h3>
          </div>

          <div className="space-y-2.5">
            {features.map((feature, idx) => {
              const IconComp = feature.icon;
              return (
                <div
                  key={feature.id}
                  id={feature.id}
                  className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3 flex items-start gap-3 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 ${feature.iconBg}`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-extrabold text-[#002244] leading-tight">
                        {feature.title}
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-slate-400 shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-normal leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service Information Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Globe2 className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-extrabold text-[#002244] uppercase tracking-wider">
              Service Information
            </h3>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Market</span>
              <span className="font-extrabold text-slate-900">{AGENT_APP_MARKET}</span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Currency</span>
              <span className="font-extrabold font-mono text-[#0052CC]">{AGENT_APP_CURRENCY}</span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Phone Country Code</span>
              <span className="font-extrabold font-mono text-slate-900">{AGENT_APP_CALLING_CODE}</span>
            </div>
          </div>
        </div>

        {/* App Information / Version Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-extrabold text-[#002244] uppercase tracking-wider">
              App Information
            </h3>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Application</span>
              <span className="font-extrabold text-slate-900">{AGENT_APP_NAME}</span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Version</span>
              <span className="font-extrabold font-mono text-[#0052CC]">
                Version {AGENT_APP_VERSION}
              </span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Build</span>
              <span className="font-semibold font-mono text-slate-500">
                Build {AGENT_APP_BUILD}
              </span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Platform</span>
              <span className="font-extrabold text-slate-900">{AGENT_APP_PLATFORM}</span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Market</span>
              <span className="font-extrabold text-slate-900">{AGENT_APP_MARKET}</span>
            </div>
          </div>
        </div>

        {/* 3. Approved Global Footer */}
        <PoweredByCinitecFooter className="py-3" />
      </div>
    </div>
  );
};
