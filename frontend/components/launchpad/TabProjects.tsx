import React, { useState } from 'react';

import Link from 'next/link';

const liveProjects = [
    { id: 'cdx-protocol', name: 'Codex Protocol', theme: 'Protocol', raise: '1.2M', goal: '1.5M', percent: 80, price: '0.05', tiker: 'CDX', color: 'bg-indigo-500', icon: 'C' },
    { id: 'nebula-dex', name: 'Nebula DEX', theme: 'DEX', raise: '450K', goal: '600K', percent: 75, price: '0.12', tiker: 'NBL', color: 'bg-purple-500', icon: 'N' },
    { id: 'aether-finance', name: 'Aether Finance', theme: 'DeFi', raise: '2.1M', goal: '2.1M', percent: 100, price: '0.50', tiker: 'ATH', color: 'bg-green-500', icon: 'A' },
];

export default function TabProjects() {
    // Replaced modal state with standard Launchpad page navigation

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Active IDOs</h2>
                    <p className="text-slate-400 font-medium text-sm mt-2">Discover, analyze, and participate in high-tier token launches.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveProjects.map((p, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10/50 rounded-[2rem] p-8 relative overflow-hidden group hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.3)]">
                        {p.percent < 100 ? (
                            <div className="absolute top-6 right-6 bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                LIVE NOW
                            </div>
                        ) : (
                            <div className="absolute top-6 right-6 bg-gray-500/10 border border-gray-500/30 text-slate-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                                FILLED
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-14 h-14 rounded-2xl ${p.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-[#0B0E14] group-hover:scale-110 transition-transform`}>
                                {p.icon}
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">{p.name}</h3>
                        <p className="text-slate-400 text-sm mb-6 flex justify-between font-mono bg-background-dark/40 p-3 rounded-xl border border-white/5 shadow-inner">
                            <span>Token: <span className="text-primary font-bold">${p.tiker}</span></span>
                            <span>Price: <span className="text-primary font-bold">${p.price}</span></span>
                        </p>

                        <div className="space-y-3 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400 font-medium">Total Raised</span>
                                <span className="text-white font-bold">${p.raise} <span className="text-slate-500 font-normal">/ ${p.goal}</span></span>
                            </div>
                            <div className="w-full bg-background-dark h-2.5 rounded-full overflow-hidden border border-white/5 relative">
                                <div className="bg-gradient-to-r from-primary to-amber-600 h-full rounded-full relative" style={{ width: `${p.percent}%` }}>
                                    {p.percent < 100 && <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 blur-[2px]"></div>}
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-primary font-bold pt-1">
                                <span>{p.percent}% Filled</span>
                            </div>
                        </div>

                        <Link
                            href={`/launchpad/${p.id}`}
                            className={`w-full block text-center border font-bold py-3.5 rounded-xl transition-all font-mono tracking-wide ${p.percent >= 100 ? 'bg-background-dark border-white/10/80 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-primary to-amber-600 hover:from-primary hover:to-amber-600 border-transparent text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}
                        >
                            {p.percent >= 100 ? 'Sale Closed' : 'View Sale \u2192'}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
