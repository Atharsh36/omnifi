'use client';
import { useState } from 'react';
import StatsCard from '@/components/dashboard/StatsCard';
import ActivityTable from '@/components/dashboard/ActivityTable';

export default function DashboardPage() {
  const [stats] = useState({
    totalCollateral: 2.5,
    totalBorrowed: 1.2,
    activeTrades: 3,
    launchpadInvested: 5.5,
    creditScore: 750
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Collateral" value={`${stats.totalCollateral} BNB`} change="+12%" />
        <StatsCard title="Total Borrowed" value={`${stats.totalBorrowed} BNB`} change="-5%" />
        <StatsCard title="Active Trades" value={stats.activeTrades.toString()} change="+2" />
        <StatsCard title="Credit Score" value={stats.creditScore.toString()} change="+50" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-background-dark border border-white/5 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Portfolio Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Prediction Markets</span>
              <span className="text-white font-medium">3.2 BNB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Launchpad Investments</span>
              <span className="text-white font-medium">5.5 BNB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Available Credit</span>
              <span className="text-green-400 font-medium">0.45 BNB</span>
            </div>
          </div>
        </div>

        <div className="bg-background-dark border border-white/5 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">AI Credit Analysis</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Wallet Age</span>
              <span className="text-white">245 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Transaction Count</span>
              <span className="text-white">1,234</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Risk Level</span>
              <span className="text-green-400">Low</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ActivityTable />
      </div>
    </div>
  );
}
