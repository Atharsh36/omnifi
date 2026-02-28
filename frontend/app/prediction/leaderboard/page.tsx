'use client';
import Link from 'next/link';
import PredictionNav from '@/components/prediction/PredictionNav';
import { useState } from 'react';

interface Trader {
    rank: number;
    address: string;
    profit: number;
    volume: number;
    winRate: number;
    trades: number;
}

export default function LeaderboardPage() {
    const [filter, setFilter] = useState('profit');

    const leaders: Trader[] = [
        { rank: 1, address: '0x12..34abcd', profit: 45.2, volume: 120.5, winRate: 78.5, trades: 142 },
        { rank: 2, address: '0xab..99xyz1', profit: 38.4, volume: 95.2, winRate: 81.2, trades: 89 },
        { rank: 3, address: '0x55..11beef', profit: 21.7, volume: 310.4, winRate: 54.1, trades: 450 },
        { rank: 4, address: '0x88..77cafe', profit: 15.6, volume: 65.8, winRate: 66.7, trades: 60 },
        { rank: 5, address: '0x99..ffff44', profit: 12.1, volume: 45.2, winRate: 72.0, trades: 45 },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-8">
            {/* Top Navbar */}
            <PredictionNav />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Top Traders</h1>
                    <p className="text-slate-400">Ranked by profitability, volume, and win rate.</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('profit')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'profit' ? 'bg-primary text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                        Highest Profit
                    </button>
                    <button
                        onClick={() => setFilter('volume')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'volume' ? 'bg-primary text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                        Highest Volume
                    </button>
                    <button
                        onClick={() => setFilter('winrate')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'winrate' ? 'bg-primary text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                        Best Win Rate
                    </button>
                </div>
            </div>

            <div className="bg-background-dark border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-background-dark/50">
                        <tr className="text-slate-500 uppercase text-xs tracking-wider">
                            <th className="px-6 py-4 font-semibold">Rank</th>
                            <th className="px-6 py-4 font-semibold">Trader</th>
                            <th className="px-6 py-4 font-semibold text-right">Total Profit</th>
                            <th className="px-6 py-4 font-semibold text-right">Volume</th>
                            <th className="px-6 py-4 font-semibold text-center">Win Rate</th>
                            <th className="px-6 py-4 font-semibold text-center">Trades</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {leaders.map((trader) => (
                            <tr key={trader.rank} className="hover:bg-white/10 transition">
                                <td className="px-6 py-4">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${trader.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                                        trader.rank === 2 ? 'bg-gray-400/20 text-slate-400' :
                                            trader.rank === 3 ? 'bg-orange-700/20 text-orange-500' :
                                                'bg-white/5 text-slate-500'
                                        }`}>
                                        {trader.rank}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-sm text-primary">{trader.address}</td>
                                <td className="px-6 py-4 font-bold text-green-400 text-right">+{trader.profit.toFixed(2)} BNB</td>
                                <td className="px-6 py-4 font-medium text-gray-300 text-right">{trader.volume.toFixed(2)} BNB</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${trader.winRate > 75 ? 'bg-green-900/40 text-green-400' :
                                        trader.winRate > 50 ? 'bg-yellow-900/40 text-yellow-400' :
                                            'bg-red-900/40 text-red-400'
                                        }`}>
                                        {trader.winRate}%
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-center text-sm">{trader.trades}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
