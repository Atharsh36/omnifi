'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Investments() {
    const [loading, setLoading] = useState<string | null>(null);

    // Mock list of user's past investments in diverse states
    const investments = [
        { id: 1, project: 'Codex Protocol', symbol: 'CDX', invested: 10, status: 'ACTIVE', action: 'NONE', tokens: 10000 },
        { id: 2, project: 'Nebula DEX', symbol: 'NBL', invested: 5, status: 'SUCCESS', action: 'CLAIM', tokens: 50000 },
        { id: 3, project: 'Aether Finance', symbol: 'ATH', invested: 25, status: 'FAILED', action: 'REFUND', tokens: 0 },
    ];

    const handleAction = (id: number, actionType: string) => {
        setLoading(id.toString());
        setTimeout(() => {
            setLoading(null);
            alert(actionType === 'CLAIM' ? 'Tokens claimed successfully to wallet!' : 'BNB refunded successfully to wallet!');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-background-dark text-gray-200 font-sans pt-32 pb-24">
            <div className="max-w-5xl mx-auto px-6 animate-fade-in-up">

                <Link href="/launchpad" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 mb-8 w-max">
                    <span>&larr;</span> Back to Launchpad
                </Link>

                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white mb-2">My Investments</h1>
                        <p className="text-slate-400 max-w-lg leading-relaxed">View all your IDO contributions, track live sales, and execute token claims or BNB refunds directly from smart contracts.</p>
                    </div>
                    <div className="bg-background-dark border border-white/5 rounded-xl px-6 py-3 shadow-inner">
                        <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Total Value</span>
                        <span className="text-white font-mono font-bold text-xl">40.00 BNB</span>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/10/50 p-6 md:p-8 overflow-x-auto shadow-2xl">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="border-b border-white/10/50">
                                <th className="pb-4 text-sm font-bold text-slate-400 uppercase tracking-widest pl-4">Project</th>
                                <th className="pb-4 text-sm font-bold text-slate-400 uppercase tracking-widest text-right">Invested</th>
                                <th className="pb-4 text-sm font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="pb-4 text-sm font-bold text-slate-400 uppercase tracking-widest text-right">Expected Tokens</th>
                                <th className="pb-4 text-sm font-bold text-slate-400 uppercase tracking-widest text-center pr-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {investments.map(inv => (
                                <tr key={inv.id} className="hover:bg-white/10 transition-colors group">
                                    <td className="py-5 pl-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center font-bold text-white shadow-lg shrink-0">
                                                {inv.symbol[0]}
                                            </div>
                                            <div>
                                                <div className="text-white font-bold group-hover:text-primary transition-colors">{inv.project}</div>
                                                <div className="text-xs text-slate-500 font-mono">${inv.symbol}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 text-right font-mono font-bold text-white">
                                        {inv.invested} BNB
                                    </td>
                                    <td className="py-5 text-center">
                                        {inv.status === 'ACTIVE' && <span className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-3 py-1 rounded-md">LIVE</span>}
                                        {inv.status === 'SUCCESS' && <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold px-3 py-1 rounded-md">SUCCESS</span>}
                                        {inv.status === 'FAILED' && <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold px-3 py-1 rounded-md">FAILED</span>}
                                    </td>
                                    <td className="py-5 text-right font-mono text-gray-300">
                                        {inv.tokens > 0 ? `${inv.tokens.toLocaleString()}` : '-'}
                                    </td>
                                    <td className="py-5 text-center pr-4">
                                        {inv.action === 'NONE' && <span className="text-slate-500 text-xs font-bold underline cursor-not-allowed">Locked</span>}

                                        {inv.action === 'CLAIM' && (
                                            <button
                                                onClick={() => handleAction(inv.id, 'CLAIM')}
                                                disabled={loading === inv.id.toString()}
                                                className="bg-green-600 hover:bg-green-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)] disabled:opacity-50"
                                            >
                                                {loading === inv.id.toString() ? 'Claiming...' : 'Claim Tokens'}
                                            </button>
                                        )}

                                        {inv.action === 'REFUND' && (
                                            <button
                                                onClick={() => handleAction(inv.id, 'REFUND')}
                                                disabled={loading === inv.id.toString()}
                                                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)] disabled:opacity-50"
                                            >
                                                {loading === inv.id.toString() ? 'Refunding...' : 'Refund BNB'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
