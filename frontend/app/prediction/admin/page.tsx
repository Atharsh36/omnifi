'use client';
import { useState } from 'react';
import Link from 'next/link';
import PredictionNav from '@/components/prediction/PredictionNav';
import { usePredictionStore } from '@/store/usePredictionStore';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'create' | 'markets' | 'trades' | 'resolution' | 'analytics'>('markets');
    const { markets, trades, addMarket, updateMarket, resolveMarketAndDistribute } = usePredictionStore();
    const [notification, setNotification] = useState('');

    // Create Market States
    const [newQuestion, setNewQuestion] = useState('');
    const [newCategory, setNewCategory] = useState('Crypto');
    const [newDate, setNewDate] = useState('');
    const [newOracle, setNewOracle] = useState('');

    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(''), 4000);
    };

    const handleCreateMarket = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newQuestion || !newDate) return;

        const newMarket: any = {
            id: markets.length,
            question: newQuestion,
            category: newCategory,
            yesPool: 0,
            noPool: 0,
            volume: 0,
            endTime: new Date(newDate).getTime(),
            resolved: false,
            status: 'Open'
        };

        addMarket(newMarket);
        showNotification(`Successfully created market: ${newQuestion}`);

        setNewQuestion('');
        setNewDate('');
        setNewOracle('');
        setActiveTab('markets');
    };

    const handleCloseMarket = (id: number) => {
        updateMarket(id, { status: 'Closed' });
        showNotification(`Market #${id} has been closed. Trading is now stopped.`);
    };

    const handleResolveMarket = async (id: number, outcome: boolean) => {
        showNotification(`Processing resolutions and 2x payouts for Market #${id}...`);
        await resolveMarketAndDistribute(id, outcome);
        showNotification(`Market #${id} successfully resolved to ${outcome ? 'YES' : 'NO'}. Winners have been credited 2x!`);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-8">
            {/* Top Navbar */}
            <PredictionNav />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-white">Market Operator Panel</h1>
                    <p className="text-slate-400">Manage predictive scenarios and handle resolutions as the administrative Oracle.</p>
                </div>
            </div>

            {notification && (
                <div className="bg-purple-900/60 border border-purple-500 text-purple-200 px-6 py-4 rounded-xl mb-6 shadow-lg flex items-center gap-3 animate-fade-in">
                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {notification}
                </div>
            )}

            {/* Admin Tabs */}
            <div className="flex gap-2 mb-8 border-b border-white/5 pb-3">
                {['markets', 'create', 'trades', 'resolution', 'analytics'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition ${activeTab === tab ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        {tab.replace('markets', 'Manage Markets').replace('create', 'Create Market').replace('trades', 'Trades & Activity').replace('resolution', 'Resolve Outcomes')}
                    </button>
                ))}
            </div>

            {/* 1. VIEW MARKETS (MANAGE) */}
            {activeTab === 'markets' && (
                <div className="bg-background-dark border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                    <table className="w-full text-left">
                        <thead className="bg-background-dark/50">
                            <tr className="text-slate-500 uppercase text-xs tracking-wider">
                                <th className="px-6 py-4 font-semibold">ID</th>
                                <th className="px-6 py-4 font-semibold">Question</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Pool Size</th>
                                <th className="px-6 py-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-sm">
                            {markets.map(market => (
                                <tr key={market.id} className="hover:bg-white/10 transition">
                                    <td className="px-6 py-4 font-mono text-slate-400">#{market.id}</td>
                                    <td className="px-6 py-4 text-white font-medium max-w-sm truncate">{market.question}</td>
                                    <td className="px-6 py-4 text-slate-400">{market.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${market.status === 'Open' ? 'bg-green-900/40 text-green-400' :
                                            market.status === 'Closed' ? 'bg-yellow-900/40 text-yellow-400' :
                                                'bg-purple-900/40 text-purple-400'
                                            }`}>
                                            {market.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-gray-300">{(market.yesPool + market.noPool).toFixed(2)} BNB</td>
                                    <td className="px-6 py-4 text-center">
                                        {market.status !== 'Resolved' ? (
                                            <div className="flex gap-2">
                                                {market.status === 'Open' && (
                                                    <button onClick={() => handleCloseMarket(market.id)} className="bg-white/5 hover:bg-yellow-600 hover:text-white text-gray-300 px-3 py-1.5 rounded transition text-xs font-bold whitespace-nowrap">Close</button>
                                                )}
                                                <button onClick={() => handleResolveMarket(market.id, true)} className="bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded transition text-xs font-bold whitespace-nowrap">Resolve YES</button>
                                                <button onClick={() => handleResolveMarket(market.id, false)} className="bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded transition text-xs font-bold whitespace-nowrap">Resolve NO</button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-600 text-xs font-bold">Resolved {market.outcome ? '(YES)' : '(NO)'}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 2. CREATE MARKET */}
            {activeTab === 'create' && (
                <div className="max-w-2xl bg-background-dark border border-white/5 rounded-2xl p-8 shadow-xl">
                    <h2 className="text-xl font-bold mb-6 border-b border-white/5 pb-4">Deploy New Market Contract</h2>
                    <form onSubmit={handleCreateMarket}>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-400 mb-2">Market Question</label>
                            <input type="text" value={newQuestion} onChange={e => setNewQuestion(e.target.value)} required placeholder="e.g. Will BTC hit $60,000 before Feb 2026?" className="w-full bg-background-dark border border-white/5 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition" />
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-400 mb-2">Category</label>
                                <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full bg-background-dark border border-white/5 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition">
                                    {['Crypto', 'Sports', 'Politics', 'Finance', 'Tech', 'Entertainment'].map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-400 mb-2">End Date & Time</label>
                                <input type="datetime-local" value={newDate} onChange={e => setNewDate(e.target.value)} required className="w-full bg-background-dark border border-white/5 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition [color-scheme:dark]" />
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-slate-400 mb-2">Resolution Oracle Source</label>
                            <input type="text" value={newOracle} onChange={e => setNewOracle(e.target.value)} placeholder="e.g. CoinMarketCap BTC Price" className="w-full bg-background-dark border border-white/5 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition" />
                        </div>

                        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/40 transition">
                            Deploy Market to Blockchain
                        </button>
                    </form>
                </div>
            )}

            {/* 3. TRADES & ACTIVITY */}
            {activeTab === 'trades' && (
                <div className="bg-background-dark border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                    <table className="w-full text-left">
                        <thead className="bg-background-dark/50">
                            <tr className="text-slate-500 uppercase text-xs tracking-wider">
                                <th className="px-6 py-4 font-semibold">Wallet</th>
                                <th className="px-6 py-4 font-semibold">Market</th>
                                <th className="px-6 py-4 font-semibold">Position</th>
                                <th className="px-6 py-4 font-semibold">Amount (BNB)</th>
                                <th className="px-6 py-4 font-semibold">Time</th>
                                <th className="px-6 py-4 font-semibold text-right">Tx Hash</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-sm">
                            {trades.map(trade => (
                                <tr key={trade.id} className="hover:bg-white/10 transition">
                                    <td className="px-6 py-4 font-mono text-primary">{trade.user}</td>
                                    <td className="px-6 py-4 text-gray-300 max-w-xs truncate">{trade.marketQ}</td>
                                    <td className="px-6 py-4">
                                        {(!trade.type || trade.type === 'Trade') ? (
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${trade.position === 'YES' ? 'bg-green-900/30 text-green-500' : 'bg-red-900/30 text-red-500'}`}>Bet {trade.position}</span>
                                        ) : trade.type === 'Payout' ? (
                                            <span className="px-2 py-1 rounded text-xs font-bold bg-primary/10 text-primary">Payout Won</span>
                                        ) : (
                                            <span className="px-2 py-1 rounded text-xs font-bold bg-white/5 text-slate-500">Loss</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-mono">
                                        <span className={trade.type === 'Payout' ? 'text-green-400 font-bold' : trade.type === 'Loss' ? 'text-gray-600' : 'text-white'}>
                                            {trade.type === 'Payout' ? '+' : trade.type === 'Loss' ? '-' : ''}{trade.amount.toFixed(4)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{trade.timestamp}</td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-500">{trade.txHash}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 4. MARKET RESOLUTION */}
            {activeTab === 'resolution' && (
                <div className="space-y-6">
                    {markets.filter(m => m.status === 'Closed').length === 0 ? (
                        <div className="text-center py-16 text-slate-500 bg-background-dark rounded-2xl border border-white/5/50">
                            <div className="text-4xl mb-3">✅</div>
                            <p>No markets currently awaiting resolution.</p>
                        </div>
                    ) : markets.filter(m => m.status === 'Closed').map(market => (
                        <div key={market.id} className="bg-background-dark border-2 border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">AWAITING ORACLE</div>
                            <h3 className="text-xl font-bold mb-4 text-white pr-20">{market.question}</h3>

                            <div className="flex flex-wrap gap-8 mb-6 text-sm">
                                <div>
                                    <p className="text-slate-500 mb-1">Total Pool Output</p>
                                    <p className="font-mono text-lg text-white">{(market.yesPool + market.noPool).toFixed(2)} BNB</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 mb-1">YES Side</p>
                                    <p className="font-mono text-green-400">{market.yesPool.toFixed(2)} BNB</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 mb-1">NO Side</p>
                                    <p className="font-mono text-red-400">{market.noPool.toFixed(2)} BNB</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 mb-1">Ended On</p>
                                    <p className="text-gray-300">{new Date(market.endTime).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="bg-background-dark p-4 rounded-xl border border-white/5">
                                <p className="text-center text-sm text-slate-400 font-semibold mb-3 uppercase tracking-wider">Determine Official Outcome</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => handleResolveMarket(market.id, true)} className="bg-green-600/10 hover:bg-green-600 border border-green-600 border-dashed hover:border-solid text-green-500 hover:text-white py-4 rounded-xl font-bold transition flex flex-col items-center justify-center">
                                        <span className="text-2xl mb-1">✅</span>
                                        YES Outcome Happened
                                    </button>
                                    <button onClick={() => handleResolveMarket(market.id, false)} className="bg-red-600/10 hover:bg-red-600 border border-red-600 border-dashed hover:border-solid text-red-500 hover:text-white py-4 rounded-xl font-bold transition flex flex-col items-center justify-center">
                                        <span className="text-2xl mb-1">❌</span>
                                        NO Outcome Happened
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Recently Resolved Log */}
                    {markets.filter(m => m.status === 'Resolved').length > 0 && (
                        <div className="mt-12">
                            <h3 className="text-lg font-bold text-slate-400 mb-4 uppercase tracking-wider text-sm">Recently Resolved Markets</h3>
                            <div className="space-y-3">
                                {markets.filter(m => m.status === 'Resolved').map(m => (
                                    <div key={m.id} className="bg-background-dark border border-white/5 rounded-xl p-4 flex justify-between items-center opacity-75">
                                        <span className="font-medium text-gray-300">{m.question}</span>
                                        <span className={`font-bold px-3 py-1 rounded text-sm ${m.outcome ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>WINNER: {m.outcome ? 'YES' : 'NO'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 5. ANALYTICS */}
            {activeTab === 'analytics' && (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-background-dark border border-white/5 rounded-2xl p-6 shadow-xl">
                            <p className="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Total Platform Volume</p>
                            <h3 className="text-3xl font-bold text-white font-mono">1,425.80 BNB</h3>
                            <p className="text-green-400 text-sm mt-2 font-medium">+12.4% this week</p>
                        </div>
                        <div className="bg-background-dark border border-white/5 rounded-2xl p-6 shadow-xl">
                            <p className="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Active Markets</p>
                            <h3 className="text-3xl font-bold text-white font-mono">{markets.filter(m => m.status === 'Open').length}</h3>
                            <p className="text-slate-400 text-sm mt-2 font-medium">Currently taking trades</p>
                        </div>
                        <div className="bg-background-dark border border-white/5 rounded-2xl p-6 shadow-xl">
                            <p className="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Total Traders</p>
                            <h3 className="text-3xl font-bold text-white font-mono">2,104</h3>
                            <p className="text-green-400 text-sm mt-2 font-medium">+84 new today</p>
                        </div>
                        <div className="bg-background-dark border border-white/5 rounded-2xl p-6 shadow-xl">
                            <p className="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Total Transactions</p>
                            <h3 className="text-3xl font-bold text-white font-mono">18,942</h3>
                            <p className="text-slate-400 text-sm mt-2 font-medium">Over 30 days</p>
                        </div>
                    </div>

                    <div className="bg-background-dark border border-white/5 rounded-2xl p-6 shadow-xl h-64 flex items-center justify-center text-slate-500 text-sm flex-col">
                        <svg className="w-12 h-12 mb-4 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                        <p>Interactive charts would be rendered here via library like Recharts</p>
                    </div>
                </div>
            )}

        </div>
    );
}
