'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import WalletConnect from '@/components/WalletConnect';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TabProjects from '@/components/launchpad/TabProjects';
import TabStaking from '@/components/launchpad/TabStaking';
import TabPluMech from '@/components/launchpad/TabPluMech';

// Data for Progressive Liquidity Unlock Chart
const pluData = [
  { month: 'Month 1', unlock: 10 },
  { month: 'Month 3', unlock: 25 },
  { month: 'Month 6', unlock: 50 },
  { month: 'Month 12', unlock: 100 },
];

export default function LaunchpadPage() {
  const [activeTab, setActiveTab] = useState('plumech');
  const [ammCurve, setAmmCurve] = useState('Linear');
  const [swapFee, setSwapFee] = useState(0.3);
  const [concentratedLiq, setConcentratedLiq] = useState(true);

  return (
    <div className="min-h-screen bg-background-dark text-gray-200 font-sans pb-24 relative overflow-hidden">

      {/* 1. Header and Navigation (Local Sub-Header) */}
      <header className="fixed top-[72px] sm:top-[76px] left-0 right-0 z-40 bg-background-dark/90 backdrop-blur-xl border-b border-white/5/80 shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-[70px] flex items-center justify-between">
          <div className="flex items-center gap-3 lg:w-[200px]">
            {/* Logo removed as per request */}
          </div>

          <nav className="hidden lg:flex items-center gap-8 font-medium text-sm">
            <button onClick={() => setActiveTab('plumech')} className={`relative transition-colors ${activeTab === 'plumech' ? "text-white after:content-[''] after:absolute after:-bottom-[24px] after:left-0 after:w-full after:h-0.5 after:bg-primary" : "text-slate-400 hover:text-white"}`}>PLU Mech</button>
            <button onClick={() => setActiveTab('projects')} className={`relative transition-colors ${activeTab === 'projects' ? "text-white after:content-[''] after:absolute after:-bottom-[24px] after:left-0 after:w-full after:h-0.5 after:bg-primary" : "text-slate-400 hover:text-white"}`}>Projects</button>
            <button onClick={() => setActiveTab('staking')} className={`relative transition-colors ${activeTab === 'staking' ? "text-white after:content-[''] after:absolute after:-bottom-[24px] after:left-0 after:w-full after:h-0.5 after:bg-primary" : "text-slate-400 hover:text-white"}`}>Staking</button>
            <Link href="/launchpad/investments" className="text-slate-400 hover:text-white transition-colors">Investments</Link>
            <Link href="#" className="text-slate-400 hover:text-white transition-colors">About</Link>
          </nav>

          <div className="flex items-center justify-end lg:w-[200px]">
            <Link href="/launchpad/create" className="text-xs font-bold text-white bg-primary hover:bg-primary px-4 py-2 rounded-lg transition-colors shadow-lg shadow-primary/20">
              Create Launch
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 pt-[200px] space-y-28 relative z-10">

        {activeTab === 'plumech' && <TabPluMech />}

        {activeTab === 'projects' && <TabProjects />}
        {activeTab === 'staking' && <TabStaking />}

      </div>
    </div>
  );
}
