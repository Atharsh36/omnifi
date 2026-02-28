'use client';

import React from 'react';

interface Market {
  id: number;
  question: string;
  category: string;
  yesPool: number;
  noPool: number;
  volume: number;
  endTime: number;
  resolved: boolean;
  status: 'Open' | 'Closed' | 'Resolved';
  icon?: string;
}

const FallbackIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" className="w-full h-full rounded-md" style={{ background: '#181A20' }}>
    <defs>
      <linearGradient id="gBar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0ECB81" /><stop offset="100%" stopColor="#0AA06A" /></linearGradient>
      <linearGradient id="rBar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F6465D" /><stop offset="100%" stopColor="#CF3750" /></linearGradient>
      <linearGradient id="bBar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FCD535" /><stop offset="100%" stopColor="#D4B12C" /></linearGradient>
    </defs>
    <path d="M 0 33 H 100 M 0 66 H 100 M 33 0 V 100 M 66 0 V 100" stroke="#2B3139" strokeWidth="2" strokeOpacity="0.5" />
    <rect x="14" y="38" width="18" height="70" rx="3" fill="url(#gBar)" />
    <rect x="41" y="55" width="18" height="50" rx="3" fill="url(#rBar)" />
    <rect x="68" y="28" width="18" height="80" rx="3" fill="url(#bBar)" />
  </svg>
);

const NewSVG = () => (
  <span className="flex items-center gap-1.5 mr-2 text-primary text-xs font-bold tracking-wide">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M12 1L14.7 9.3L23 12L14.7 14.7L12 23L9.3 14.7L1 12L9.3 9.3L12 1Z" fill="#FCD535" />
      <path d="M5 3L6 6L9 7L6 8L5 11L4 8L1 7L4 6L5 3Z" fill="#FCD535" />
    </svg>
    NEW
  </span>
);

const LiveSVG = () => (
  <span className="flex items-center gap-1.5 mr-2 text-green-500 text-xs font-bold tracking-wide">
    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_6px_rgba(14,203,129,0.6)]"></span>
    LIVE
  </span>
);

export default function MarketCard({ market, onSelect }: { market: Market; onSelect: () => void }) {
  const total = market.yesPool + market.noPool;
  const yesPercent = total > 0 ? Math.round((market.yesPool / total) * 100) : 50;

  // Decide if we should show Yes/No or Up/Down based on question text
  const isUpDown = market.question.toLowerCase().includes('up or down');
  const optionA = isUpDown ? 'Up' : 'Yes';
  const optionB = isUpDown ? 'Down' : 'No';

  return (
    <div
      onClick={onSelect}
      className="bg-white/5 hover:bg-[#1E2329] border border-white/10 hover:border-primary rounded-xl p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-[0_0_20px_rgba(252,213,53,0.08)] hover:-translate-y-0.5 min-h-[180px] group"
    >
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 rounded-lg bg-background-dark border border-white/10 flex items-center justify-center shrink-0 overflow-hidden text-2xl group-hover:scale-105 transition-transform duration-300">
          {market.icon ? market.icon : <FallbackIcon />}
        </div>
        <h3 className="text-base font-semibold leading-snug flex-1 text-white pr-1 group-hover:text-white transition-colors">
          {market.question}
        </h3>
        <div className="flex flex-col items-end shrink-0 pl-2">
          <span className="text-lg font-bold text-white leading-none mb-1 group-hover:text-primary transition-colors">{yesPercent}%</span>
          <span className="text-xs text-slate-400 font-medium">{isUpDown ? 'Up' : 'chance'}</span>
        </div>
      </div>

      <div className="flex gap-3 mb-5 mt-auto">
        <button className="flex-1 bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20 hover:border-green-500/40 font-bold py-2.5 rounded-lg text-sm transition-all focus:outline-none">
          {optionA}
        </button>
        <button className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 font-bold py-2.5 rounded-lg text-sm transition-all focus:outline-none">
          {optionB}
        </button>
      </div>

      <div className="flex justify-between items-center text-xs text-slate-400 font-medium pt-2 border-t border-white/10">
        <div className="flex items-center hover:text-white transition">
          {market.status === 'Open' ? (
            market.volume > 20 ? <LiveSVG /> : <NewSVG />
          ) : null}
          <span>${market.volume.toFixed(1)}M Vol.</span>
          <svg className="w-3.5 h-3.5 ml-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <div className="flex items-center gap-3">
          {/* Gift Icon */}
          <svg className="w-4 h-4 hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          {/* Bookmark Icon */}
          <svg className="w-4 h-4 hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
