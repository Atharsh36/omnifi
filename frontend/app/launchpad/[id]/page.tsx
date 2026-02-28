'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProjectDetails() {
    const { id } = useParams();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    // Mock data representing a fetched complete LaunchpadSale contract state
    const project = {
        name: 'Codex Protocol',
        symbol: 'CDX',
        raised: 1125,
        hardCap: 2500,
        softCap: 1000,
        price: 0.001,
        status: 'ACTIVE',
        liquidity: '40%',
        endsIn: '3d 14h',
        invested: 0 // Mock user invested BNB
    };

    const progress = (project.raised / project.hardCap) * 100;

    const handleBuy = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert(`Successfully invested ${amount} BNB into ${project.name}!`);
            setAmount('');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-background-dark text-gray-200 font-sans pt-32 pb-24">
            <div className="max-w-6xl mx-auto px-6 animate-fade-in-up">

                <Link href="/launchpad" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 mb-8 w-max">
                    <span>&larr;</span> Back to Launches
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Col - Info */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Header Card */}
                        <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 border border-white/10/50 flex flex-col sm:flex-row gap-6 items-start">
                            <div className="w-24 h-24 rounded-2xl bg-indigo-500 flex items-center justify-center text-white font-bold text-4xl shadow-xl ring-8 ring-gray-900 shrink-0">
                                C
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-extrabold text-white">{project.name}</h1>
                                    <span className="bg-background-dark border border-white/10 text-xs px-3 py-1 rounded-md font-mono text-slate-400">${project.symbol}</span>
                                    <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-md tracking-wider">LIVE SALE</span>
                                </div>
                                <p className="text-slate-400 mb-6 leading-relaxed">Next-generation AI driven smart contracts that automatically generate optimal yield strategies on the Binance Smart Chain.</p>

                                <div className="flex gap-4">
                                    <div className="bg-background-dark/80 px-4 py-2 rounded-xl border border-white/5 shadow-inner">
                                        <div className="text-xs text-slate-500 font-bold mb-1">Contract Address</div>
                                        <div className="text-primary font-mono text-xs cursor-pointer hover:underline">0x4F0B...A89E</div>
                                    </div>
                                    <div className="bg-background-dark/80 px-4 py-2 rounded-xl border border-white/5 shadow-inner">
                                        <div className="text-xs text-slate-500 font-bold mb-1">Creator</div>
                                        <div className="text-gray-300 font-mono text-xs">0x71C...43A</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="bg-white/10 backdrop-blur-md border border-white/10/50 rounded-3xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Sale Metrics</h3>
                                <div className="space-y-3 font-mono text-sm max-w-sm">
                                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500">Token Price</span><span className="text-white font-bold">{project.price} BNB</span></div>
                                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500">Soft Cap</span><span className="text-white font-bold">{project.softCap} BNB</span></div>
                                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500">Hard Cap</span><span className="text-white font-bold">{project.hardCap} BNB</span></div>
                                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500">Liquidity Add</span><span className="text-white font-bold">{project.liquidity}</span></div>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md border border-white/10/50 rounded-3xl p-6 relative overflow-hidden group">
                                <div className="absolute -right-4 -bottom-4 text-7xl opacity-5 transition-transform group-hover:scale-110">🔒</div>
                                <h3 className="text-lg font-bold text-white mb-4">Security</h3>
                                <ul className="space-y-3 text-sm font-medium text-slate-400">
                                    <li className="flex items-center gap-2"><span className="text-green-500">✅</span> Audited Smart Contracts</li>
                                    <li className="flex items-center gap-2"><span className="text-green-500">✅</span> Liquidity Locked via PLU</li>
                                    <li className="flex items-center gap-2"><span className="text-green-500">✅</span> Team KYC Verified</li>
                                    <li className="flex items-center gap-2"><span className="text-green-500">✅</span> Dev Tokens Vested</li>
                                </ul>
                            </div>
                        </div>

                    </div>

                    {/* Right Col - Checkout Widget */}
                    <div>
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800/90 backdrop-blur-xl border border-primary/30 rounded-[2rem] p-6 lg:p-8 shadow-[0_0_50px_rgba(59,130,246,0.1)] sticky top-32">

                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Join Sale</h3>
                                <div className="bg-red-500/10 text-red-500 text-xs font-bold px-3 py-1 rounded-md animate-pulse">
                                    Ends in {project.endsIn}
                                </div>
                            </div>

                            {/* Funding Progress Bar */}
                            <div className="mb-8">
                                <div className="flex justify-between text-sm mb-3">
                                    <span className="text-slate-400 font-bold">Progress</span>
                                    <span className="text-white font-bold">{project.raised} <span className="text-slate-500 font-normal">/ {project.hardCap} BNB</span></span>
                                </div>
                                <div className="w-full bg-background-dark h-3 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                    <div className="bg-gradient-to-r from-primary to-amber-600 h-full rounded-full relative" style={{ width: `${progress}%` }}>
                                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/20 blur-md"></div>
                                    </div>
                                </div>
                                <div className="mt-2 text-right text-xs text-primary font-bold drop-shadow">{progress.toFixed(1)}% Filled</div>
                            </div>

                            {/* Investment Form */}
                            <form onSubmit={handleBuy} className="space-y-4">
                                <div className="bg-background-dark border border-white/5 rounded-2xl p-4 transition-colors focus-within:border-primary shadow-inner">
                                    <div className="flex justify-between text-xs text-slate-500 font-bold uppercase mb-2">
                                        <span>Amount</span>
                                        <span>Bal: 12.5 BNB</span>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="bg-transparent text-2xl font-bold text-white w-full focus:outline-none"
                                            required
                                        />
                                        <span className="text-slate-400 font-bold uppercase ml-2 bg-background-dark px-3 py-1.5 rounded-lg border border-white/10">BNB</span>
                                    </div>
                                </div>

                                {amount && !isNaN(parseFloat(amount)) && (
                                    <div className="flex justify-between items-center px-2 py-1 text-sm">
                                        <span className="text-slate-500 font-medium">You will get approx:</span>
                                        <span className="text-primary font-bold font-mono">{(parseFloat(amount) / project.price).toLocaleString()} {project.symbol}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !amount}
                                    className="w-full bg-gradient-to-r from-primary to-amber-600 hover:from-primary hover:to-amber-600 text-white font-bold py-4 rounded-xl shadow-[0_5px_20px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex justify-center items-center gap-2"
                                >
                                    {loading ? 'Processing Transaction...' : 'Buy Tokens'}
                                </button>
                            </form>

                            <p className="text-[10px] text-slate-500 text-center mt-6 font-medium px-4">Tokens are locked within the smart contract until the sale successfully ends and liquidity is established.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
