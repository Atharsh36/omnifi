'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import PredictionNav from '@/components/prediction/PredictionNav';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

// You will likely have this somewhere in your config, hardcoding to 3001 as that's your backend
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/arbitrage`;

export default function AIAgentDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [insights, setInsights] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { address } = useWeb3ModalAccount();

    // Settings State
    const [botEnabled, setBotEnabled] = useState(false);
    const [tradeAmount, setTradeAmount] = useState('0.0001');
    const [threshold, setThreshold] = useState('0.005');
    const [confidenceTarget, setConfidenceTarget] = useState('70');

    useEffect(() => {
        fetchData();
        // Poll for updates every 5 seconds
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, insightsRes, logsRes] = await Promise.all([
                fetch(`${API_URL}/stats`),
                fetch(`${API_URL}/insights`),
                fetch(`${API_URL}/logs`)
            ]);

            const statsData = await statsRes.json();
            const insightsData = await insightsRes.json();
            const logsData = await logsRes.json();

            if (statsData.success) {
                setStats(statsData.data);
                // Only update local settings if we haven't tweaked them recently, to avoid overwriting user input
                // For simplicity, we just set the initial state from what's active
            }
            if (insightsData.success) setInsights(insightsData.data);
            if (logsData.success) setLogs(logsData.data);
        } catch (err) {
            console.error("Error fetching AI agent data:", err);
            setError("Backend waking up (Render cold start)... please wait");
        } finally {
            setLoading(false);
        }
    };

    const toggleBot = async () => {
        const newState = !botEnabled;
        try {
            const res = await fetch(`${API_URL}/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ botEnabled: newState, activeUserAddress: address || null })
            });
            const data = await res.json();
            if (data.success) {
                setBotEnabled(newState);
            }
        } catch (err) {
            console.error("Failed to toggle bot:", err);
        }
    };

    const updateSettings = async () => {
        try {
            const res = await fetch(`${API_URL}/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tradeAmount,
                    threshold
                })
            });
            const data = await res.json();
            if (data.success) {
                alert("Settings updated successfully!");
            }
        } catch (err) {
            console.error("Failed to update settings:", err);
        }
    };

    const forceScan = async () => {
        try {
            await fetch(`${API_URL}/scan`, { method: 'POST' });
            fetchData(); // refresh immediately
        } catch (err) {
            console.error("Failed to force scan:", err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-8">
            {/* Top Navbar specifically for Prediction section */}
            <PredictionNav />

            {loading && !error && <p className="text-yellow-400 text-center mb-4">Loading market data...</p>}
            {error && <p className="text-yellow-400 text-center mb-4 bg-yellow-500/10 py-2 rounded-lg">{error}</p>}

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-amber-600 bg-clip-text text-transparent">AI Arbitrage Agent</h1>
                    <p className="text-slate-400 mt-2">Autonomous agents scan markets and execute delta-neutral and yield-rotation strategies.</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={forceScan}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Force Scan
                    </button>

                    <button
                        onClick={toggleBot}
                        className={`px-6 py-2 rounded-lg font-bold transition flex items-center gap-2 ${botEnabled ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'}`}
                    >
                        <div className={`w-2 h-2 rounded-full ${botEnabled ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
                        {botEnabled ? 'Stop Agent' : 'Start Agent'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Stats Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-background-dark border border-white/5 rounded-xl p-6">
                            <h3 className="text-sm text-slate-400 font-medium">Total Trades</h3>
                            <p className="text-2xl font-bold text-white mt-2">{stats?.totalTrades || 0}</p>
                        </div>
                        <div className="bg-background-dark border border-white/5 rounded-xl p-6">
                            <h3 className="text-sm text-slate-400 font-medium">Trade Volume (BNB)</h3>
                            <p className="text-2xl font-bold text-white mt-2">{stats?.totalVolume ? stats.totalVolume.toFixed(4) : '0.00'}</p>
                        </div>
                        <div className="bg-background-dark border border-white/5 rounded-xl p-6">
                            <h3 className="text-sm text-slate-400 font-medium">Est. Yield (BNB)</h3>
                            <p className="text-2xl font-bold text-green-400 mt-2">+{stats?.estimatedProfit ? stats.estimatedProfit.toFixed(4) : '0.00'}</p>
                        </div>
                        <div className="bg-background-dark border border-white/5 rounded-xl p-6">
                            <h3 className="text-sm text-slate-400 font-medium">Status</h3>
                            <p className={`text-xl font-bold mt-2 ${botEnabled ? 'text-green-400' : 'text-slate-500'}`}>
                                {botEnabled ? '🟢 Listening' : '⏸️ Paused'}
                            </p>
                        </div>
                    </div>

                    <div className="bg-background-dark border border-white/5 rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-4 border-b border-white/5 pb-2">Live Arbitrage Opportunities</h2>
                        {insights.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-slate-500 text-sm border-b border-white/5">
                                            <th className="pb-3 px-2">Market ID</th>
                                            <th className="pb-3 px-2">Delta/Yield Gap</th>
                                            <th className="pb-3 px-2">Confidence</th>
                                            <th className="pb-3 px-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {insights.map((insight, idx) => (
                                            <tr key={idx} className="border-b border-white/5/50 hover:bg-white/10">
                                                <td className="py-3 px-2 text-gray-300">#{insight.marketId}</td>
                                                <td className="py-3 px-2 text-yellow-400">{(insight.priceDifference * 100).toFixed(2)}%</td>
                                                <td className="py-3 px-2">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${insight.confidenceScore > 80 ? 'bg-green-500/20 text-green-400' : insight.confidenceScore > 60 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                                        {insight.confidenceScore}/100
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <span className={`font-bold ${insight.recommendedAction === 'YES' ? 'text-green-500' : 'text-red-500'}`}>
                                                        BUY {insight.recommendedAction}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                {botEnabled ? 'Scanning for cross-market opportunities...' : 'Agent is paused. Start scanning to find insights.'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Configuration Column */}
                <div className="space-y-6">
                    <div className="bg-background-dark border border-white/5 rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Agent Configuration
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Trade Amount (BNB)</label>
                                <input
                                    type="number"
                                    step="0.0001"
                                    value={tradeAmount}
                                    onChange={(e) => setTradeAmount(e.target.value)}
                                    className="w-full bg-background-dark border border-white/5 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Delta Gap Threshold</label>
                                <input
                                    type="number"
                                    step="0.001"
                                    value={threshold}
                                    onChange={(e) => setThreshold(e.target.value)}
                                    className="w-full bg-background-dark border border-white/5 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                />
                                <p className="text-xs text-gray-600 mt-1">Minimum statistical edge required for arbitrage delta-neutral trades.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Minimum Confidence System Requirement</label>
                                <input
                                    type="range"
                                    min="50" max="100"
                                    value={confidenceTarget}
                                    onChange={(e) => setConfidenceTarget(e.target.value)}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                    <span>Reckless</span>
                                    <span className="text-green-400 font-bold">{confidenceTarget} / 100</span>
                                    <span>Conservative</span>
                                </div>
                            </div>

                            <button
                                onClick={updateSettings}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg mt-4 transition"
                            >
                                Save Settings
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Execution logs moved outside the grid to span full width efficiently */}
            <div className="bg-background-dark border border-white/5 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 border-b border-white/5 pb-2">Recent Execution Logs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[300px] overflow-y-auto pr-2">
                    {logs.length > 0 ? logs.map((log: any, i) => (
                        <div key={i} className="bg-background-dark p-3 rounded-lg border border-white/5 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${log.sideToBuy === 'YES' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {log.sideToBuy}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-300">
                                    Bot executed <span className="text-white font-medium">{log.amount} BNB</span> on Market #{log.marketId}
                                </p>
                            </div>
                            <p className="text-xs text-green-500 mt-3 font-medium">Est. Yield: +{log.profit} BNB</p>
                        </div>
                    )) : (
                        <div className="col-span-full py-4 text-center">
                            <p className="text-sm text-slate-500">No trades executed yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
