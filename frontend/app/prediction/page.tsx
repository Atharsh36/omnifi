'use client';
import { useEffect } from 'react';
import MarketCard from '@/components/prediction/MarketCard';
import PredictionNav from '@/components/prediction/PredictionNav';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePredictionStore } from '@/store/usePredictionStore';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';



const CATEGORIES = ['All Markets', 'Crypto', 'Sports', 'Politics', 'Finance', 'Technology', 'Entertainment'];
const SPECIAL_SECTIONS = ['Trending', 'Ending Soon', 'Resolved'];

export default function PredictionPage() {
  const router = useRouter();
  const { markets } = usePredictionStore();
  const [activeFilter, setActiveFilter] = require('react').useState('All Markets');

  const { address } = useWeb3ModalAccount();



  const filteredMarkets = markets.filter(m => {
    if (activeFilter === 'All Markets') return true;
    if (activeFilter === 'Trending') return m.volume > 20;
    if (activeFilter === 'Ending Soon') return (m.endTime - Date.now()) < 15 * 24 * 60 * 60 * 1000;
    if (activeFilter === 'Resolved') return m.resolved;
    return m.category === activeFilter;
  });

  return (
    <div className="min-h-screen relative w-full overflow-hidden">

      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 bg-background-dark">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-green-500/5 blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-red-500/3 blur-[100px] animate-blob" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[length:40px_40px] opacity-[0.01]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-12 relative z-10 animate-fade-in-up">
        {/* Top Navbar specifically for Prediction section */}
        <PredictionNav />

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <div className="lg:w-64 shrink-0 space-y-8">
            <div className="relative">
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search markets..."
                className="w-full bg-background-dark border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              />
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 ml-2">Categories</h3>
              <ul className="space-y-1">
                {CATEGORIES.map(cat => (
                  <li key={cat}>
                    <button
                      onClick={() => setActiveFilter(cat)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition flex justify-between items-center ${activeFilter === cat ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 ml-2">Special Sections</h3>
              <ul className="space-y-1">
                {SPECIAL_SECTIONS.map(sec => (
                  <li key={sec}>
                    <button
                      onClick={() => setActiveFilter(sec)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition flex justify-between items-center ${activeFilter === sec ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
                    >
                      <span>{sec}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content Areas */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">{activeFilter}</h2>
              <div className="flex gap-2 items-center">
                <span className="text-sm text-slate-400">Sort by:</span>
                <select className="bg-white/5 border border-white/10 text-sm rounded-lg px-2 py-1 text-white outline-none focus:border-primary">
                  <option>Volume</option>
                  <option>Ending Soon</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredMarkets.length > 0 ? filteredMarkets.map(market => (
                <MarketCard
                  key={market.id}
                  market={market}
                  onSelect={() => router.push(`/prediction/${market.id}`)}
                />
              )) : (
                <div className="text-center py-16 text-slate-400 bg-white/5 rounded-xl border border-white/10 col-span-full">
                  <div className="text-4xl mb-3">🔍</div>
                  <p>No markets found in this category.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
