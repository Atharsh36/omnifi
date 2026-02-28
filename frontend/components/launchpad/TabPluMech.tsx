import React from 'react';

export default function TabPluMech() {
    return (
        <div className="max-w-7xl mx-auto space-y-16 animate-fade-in-up">
            {/* Header section */}
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Full Launchpad Lifecycle</h2>
                <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">A launchpad is a platform where new crypto projects create a token, raise funds, add liquidity to a DEX, and distribute tokens to investors. It’s basically crowdfunding + automatic listing.</p>
            </div>

            {/* Grid of Stages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">

                {/* Connection paths (desktop) */}
                <div className="hidden lg:block absolute top-[100px] left-[16%] right-[16%] h-1 bg-white/5 -z-10 rounded-full"></div>
                <div className="hidden lg:block absolute top-[420px] left-[16%] right-[16%] h-1 bg-white/5 -z-10 rounded-full"></div>
                <div className="hidden lg:block absolute top-[740px] left-[16%] right-[16%] h-1 bg-white/5 -z-10 rounded-full"></div>

                {/* Stage 1 */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl hover:-translate-y-2 hover:border-primary/50 transition-all group">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary font-extrabold text-2xl flex items-center justify-center mb-6 ring-4 ring-gray-900 group-hover:scale-110 transition-transform">1</div>
                    <h3 className="text-2xl font-bold text-white mb-3">Project Applies to Launchpad</h3>
                    <p className="text-slate-400 text-sm mb-4">A team wants to launch a token. They submit project name, token symbol, whitepaper, tokenomics, and fundraising goal.</p>
                    <div className="bg-background-dark p-3 rounded-xl border border-white/5 font-mono text-xs text-slate-500">
                        On Binance &rarr; reviewed manually<br />
                        On our hackathon &rarr; auto-create.
                    </div>
                </div>

                {/* Stage 2 */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl hover:-translate-y-2 hover:border-purple-500/50 transition-all group">
                    <div className="w-16 h-16 rounded-2xl bg-purple-600/20 text-purple-400 font-extrabold text-2xl flex items-center justify-center mb-6 ring-4 ring-gray-900 group-hover:scale-110 transition-transform">2</div>
                    <h3 className="text-2xl font-bold text-white mb-3">Token Creation</h3>
                    <p className="text-slate-400 text-sm mb-4">Launchpad deploys token smart contract. Now the token exists entirely on-chain but is not trading yet.</p>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-400 bg-background-dark px-3 py-1.5 rounded-md"><span className="text-slate-500">Total Supply</span><span className="text-white">1,000,000</span></div>
                        <div className="flex justify-between text-xs font-bold text-slate-400 bg-background-dark px-3 py-1.5 rounded-md"><span className="text-slate-500">Sale Allocation</span><span className="text-purple-400">30%</span></div>
                        <div className="flex justify-between text-xs font-bold text-slate-400 bg-background-dark px-3 py-1.5 rounded-md"><span className="text-slate-500">Liquidity Allocation</span><span className="text-primary">40%</span></div>
                    </div>
                </div>

                {/* Stage 3 */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl hover:-translate-y-2 hover:border-yellow-500/50 transition-all group">
                    <div className="w-16 h-16 rounded-2xl bg-yellow-600/20 text-yellow-400 font-extrabold text-2xl flex items-center justify-center mb-6 ring-4 ring-gray-900 group-hover:scale-110 transition-transform">3</div>
                    <h3 className="text-2xl font-bold text-white mb-3">Token Sale (Fundraising)</h3>
                    <p className="text-slate-400 text-sm mb-4">Users invest BNB to buy tokens. All funds go directly into a deeply audited sale smart contract pool.</p>
                    <div className="bg-yellow-900/10 p-3 rounded-xl border border-yellow-700/30 text-xs">
                        <span className="text-slate-400 font-bold block mb-1">Example Investment:</span>
                        <span className="text-yellow-400 font-mono">1 token = 0.001 BNB</span><br />
                        <span className="text-white">User invests 0.5 BNB &rarr; gets 500 tokens.</span>
                    </div>
                </div>

                {/* Stage 4 */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl hover:-translate-y-2 hover:border-pink-500/50 transition-all group">
                    <div className="w-16 h-16 rounded-2xl bg-pink-600/20 text-pink-400 font-extrabold text-2xl flex items-center justify-center mb-6 ring-4 ring-gray-900 group-hover:scale-110 transition-transform">4</div>
                    <h3 className="text-2xl font-bold text-white mb-3">Soft Cap & Hard Cap</h3>
                    <p className="text-slate-400 text-sm mb-4">Every launchpad utilizes 2 specific capital funding targets.</p>
                    <div className="flex gap-2">
                        <div className="bg-background-dark p-2.5 rounded-lg border border-white/5 flex-1">
                            <div className="text-xs font-bold text-slate-500 uppercase">Soft Cap</div>
                            <div className="text-sm font-bold text-white mt-1">Minimum Raise</div>
                            <div className="text-xs text-slate-400 mt-0.5">If not reached, refund.</div>
                        </div>
                        <div className="bg-background-dark p-2.5 rounded-lg border border-white/5 flex-1">
                            <div className="text-xs font-bold text-slate-500 uppercase">Hard Cap</div>
                            <div className="text-sm font-bold text-pink-400 mt-1">Max Raise</div>
                            <div className="text-xs text-pink-500/80 mt-0.5">Sale stops on hit.</div>
                        </div>
                    </div>
                </div>

                {/* Stage 5 */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl hover:-translate-y-2 hover:border-red-500/50 transition-all group">
                    <div className="w-16 h-16 rounded-2xl bg-red-600/20 text-red-500 font-extrabold text-2xl flex items-center justify-center mb-6 ring-4 ring-gray-900 group-hover:scale-110 transition-transform">5</div>
                    <h3 className="text-2xl font-bold text-white mb-3">Sale Ends</h3>
                    <p className="text-slate-400 text-sm mb-4">Two highly deterministic outcomes execute immediately via smart contract trustlessly based on raise conditions.</p>
                    <div className="space-y-2">
                        <div className="bg-red-950/20 p-2.5 rounded-lg border border-red-900/30 flex items-center gap-2">
                            <span className="text-red-500 font-bold text-lg leading-none">❌</span>
                            <div>
                                <div className="text-xs font-bold text-red-400">Soft Cap NOT reached</div>
                                <div className="text-[10px] text-slate-500 uppercase">Sale fails / Refund claim</div>
                            </div>
                        </div>
                        <div className="bg-green-950/20 p-2.5 rounded-lg border border-green-900/30 flex items-center gap-2">
                            <span className="text-green-500 font-bold text-lg leading-none">✅</span>
                            <div>
                                <div className="text-xs font-bold text-green-400">Soft Cap reached</div>
                                <div className="text-[10px] text-slate-500 uppercase">Success / Liquidity Phase</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stage 6 */}
                <div className="bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] backdrop-blur-xl border border-indigo-500/50 rounded-3xl p-8 shadow-[0_0_40px_rgba(79,70,229,0.2)] hover:-translate-y-2 hover:border-indigo-400 transition-all group transform md:scale-105 z-10">
                    <div className="w-20 h-20 rounded-2xl bg-indigo-500 border border-indigo-400 text-white font-extrabold text-3xl flex items-center justify-center mb-6 shadow-xl ring-8 ring-[#0B0E14] group-hover:scale-110 transition-transform mx-auto">6</div>
                    <h3 className="text-3xl font-extrabold text-white mb-3 text-center">Add Liquidity to DEX</h3>
                    <p className="text-indigo-200 text-sm mb-6 text-center">This is the most important part. Launchpad automatically takes % of raised funds, pairs with tokens, and creates the liquidity pool on an AMM.</p>
                    <div className="bg-indigo-950/50 p-4 rounded-xl border border-indigo-500/30 text-sm">
                        <div className="flex justify-between font-bold mb-2">
                            <span className="text-indigo-300">Raised Funds</span>
                            <span className="text-white">100 BNB</span>
                        </div>
                        <div className="flex justify-between font-bold mb-4">
                            <span className="text-indigo-300">Liquidity Allocation</span>
                            <span className="text-white">40%</span>
                        </div>
                        <div className="bg-indigo-900/50 py-2.5 px-3 rounded-lg border border-indigo-500/40 text-center font-bold text-indigo-100 flex items-center justify-center gap-2 shadow-inner">
                            <span>40 BNB</span> <span className="text-amber-600">+</span> <span>Tokens</span> <span className="text-white animate-pulse">&rarr; PancakeSwap LP</span>
                        </div>
                    </div>
                </div>

                {/* Stage 7 */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl hover:-translate-y-2 hover:border-green-500/50 transition-all group">
                    <div className="w-16 h-16 rounded-2xl bg-green-600/20 text-green-500 font-extrabold text-2xl flex items-center justify-center mb-6 ring-4 ring-gray-900 group-hover:scale-110 transition-transform">7</div>
                    <h3 className="text-2xl font-bold text-white mb-3">Lock Liquidity (Rug Protection)</h3>
                    <p className="text-slate-400 text-sm mb-4">Liquidity is locked for months so creators cannot remove the baseline liquidity and rug pull investors.</p>
                    <div className="bg-green-900/10 border border-green-500/30 p-3 rounded-xl flex items-start gap-3">
                        <span className="text-2xl mt-1">🔐</span>
                        <div>
                            <div className="text-green-400 font-bold text-xs uppercase tracking-widest mb-1">OmniFi Feature</div>
                            <div className="text-white text-sm font-medium">Progressive Liquidity Unlock (PLU) handles this process natively and securely.</div>
                        </div>
                    </div>
                </div>

                {/* Stage 8 */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl hover:-translate-y-2 hover:border-primary/50 transition-all group">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary font-extrabold text-2xl flex items-center justify-center mb-6 ring-4 ring-gray-900 group-hover:scale-110 transition-transform">8</div>
                    <h3 className="text-2xl font-bold text-white mb-3">Distribute Tokens</h3>
                    <p className="text-slate-400 text-sm mb-4">Investors claim the tokens they successfully bought during the IDO via a specialized interface.</p>
                    <div className="mt-auto w-full group-hover:bg-primary text-center bg-white/5 text-slate-400 group-hover:text-white font-bold py-3 rounded-lg border border-white/10 transition-colors shadow-inner flex justify-center gap-2">
                        Claim Tokens &rarr;
                    </div>
                </div>

                {/* Stage 9 */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl hover:-translate-y-2 hover:border-orange-500/50 transition-all group">
                    <div className="w-16 h-16 rounded-2xl bg-orange-600/20 text-orange-500 font-extrabold text-2xl flex items-center justify-center mb-6 ring-4 ring-gray-900 group-hover:scale-110 transition-transform">9</div>
                    <h3 className="text-2xl font-bold text-white mb-3">Token Starts Trading</h3>
                    <p className="text-slate-400 text-sm mb-4">Now token is live on DEX. This is the listing moment.</p>
                    <div className="flex gap-2 font-mono text-xs mt-auto">
                        <div className="flex-1 bg-green-500/10 text-green-400 border border-green-500/20 p-2 text-center rounded-lg">Buy</div>
                        <div className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 p-2 text-center rounded-lg">Sell</div>
                        <div className="flex-1 bg-primary/10 text-primary border border-primary/20 p-2 text-center rounded-lg">Provide LP</div>
                    </div>
                </div>

                {/* Stage 10 */}
                <div className="md:col-span-2 lg:col-span-3 bg-gradient-to-br from-gray-900 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center gap-10 hover:border-gray-500 transition-colors group mt-4">
                    <div className="w-24 h-24 rounded-3xl bg-white/5 text-white font-extrabold text-4xl flex items-center justify-center shadow-lg ring-8 ring-[#0B0E14] group-hover:scale-110 transition-transform shrink-0">10</div>
                    <div>
                        <h3 className="text-3xl font-extrabold text-white mb-3">Post Launch Growth</h3>
                        <p className="text-slate-400 text-base mb-6 max-w-2xl leading-relaxed">Real launchpads add growth tools automatically accessible right after the generation event. This directly corresponds to the Post Launch Growth Tools feature set built into OmniFi.</p>
                        <div className="flex flex-wrap gap-3">
                            <span className="bg-background-dark border border-white/10 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2"><span className="text-primary">✨</span> Staking</span>
                            <span className="bg-background-dark border border-white/10 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2"><span className="text-green-500">🌾</span> Farming</span>
                            <span className="bg-background-dark border border-white/10 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2"><span className="text-purple-500">🪂</span> Airdrops</span>
                            <span className="bg-background-dark border border-white/10 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2"><span className="text-yellow-500">📣</span> Marketing Campaigns</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
