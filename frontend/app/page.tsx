import Link from 'next/link';
import FloatingBNBCoins from '@/components/FloatingBNBCoins';

export default function Home() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased font-display min-h-screen">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 transform group-hover:scale-105 transition-all duration-300">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary">
                <circle cx="45" cy="55" r="35" stroke="currentColor" strokeWidth="4" strokeDasharray="45 5" />
                <circle cx="45" cy="55" r="15" stroke="currentColor" strokeWidth="4" strokeDasharray="15 5" />
                <path d="M45 5 V20 M45 90 V105 M-5 55 H10 M80 55 H95" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />

                <path d="M15 80 L35 60 L50 70 L85 20" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M65 20 H85 V40" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

                <g fill="currentColor" stroke="currentColor" strokeWidth="2">
                  <line x1="35" y1="60" x2="35" y2="85" />
                  <rect x="31" y="65" width="8" height="12" rx="1" />

                  <line x1="50" y1="70" x2="50" y2="95" />
                  <rect x="46" y="75" width="8" height="12" rx="1" />

                  <line x1="70" y1="40" x2="70" y2="75" />
                  <rect x="66" y="45" width="8" height="20" rx="1" />
                </g>
              </svg>
              <div className="flex flex-col justify-center mt-1">
                <h1 className="text-2xl font-black bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent leading-none pb-0.5">
                  OmniFi
                </h1>
                <span className="text-[7px] tracking-[0.2em] text-slate-300 font-semibold">PREDICTION MARKET</span>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link className="text-sm font-semibold text-primary border-b-2 border-primary pb-1" href="/prediction">Markets</Link>
              <Link className="text-sm font-medium text-slate-400 hover:text-white transition-colors" href="#">Stats</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-primary hover:bg-primary/90 text-background-dark px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20">
              Connect Wallet
            </button>
          </div>
        </div>
      </header>
      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 px-6 overflow-hidden">
          <FloatingBNBCoins />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none"></div>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Live on Testnet
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-8">Predict the Future. <br /><span className="text-primary">Trade on Anything.</span></h2>
              <p className="text-lg text-slate-400 mb-10 max-w-xl leading-relaxed">The world's leading decentralized prediction market. Put your knowledge to the test on crypto, politics, and sports with instant settlements and zero limits.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/prediction" className="inline-block bg-primary hover:bg-primary/90 text-background-dark px-8 py-4 rounded-xl font-bold text-lg transition-all">
                  Explore Markets
                </Link>
              </div>
            </div>
            {/* Hero Graphic Mockup */}
            <div className="relative">
              <div className="relative z-10 glass-panel p-8 rounded-3xl border border-primary/20 shadow-2xl" style={{ background: 'rgba(52, 44, 24, 0.6)', backdropFilter: 'blur(12px)' }}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-amber-600 flex items-center justify-center text-background-dark font-black">
                      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-background-dark">
                        <circle cx="45" cy="55" r="35" stroke="currentColor" strokeWidth="6" strokeDasharray="45 5" />
                        <circle cx="45" cy="55" r="15" stroke="currentColor" strokeWidth="6" strokeDasharray="15 5" />
                        <path d="M45 5 V20 M45 90 V105 M-5 55 H10 M80 55 H95" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />

                        <path d="M15 80 L35 60 L50 70 L85 20" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M65 20 H85 V40" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div><div className="text-xs text-slate-400 font-bold uppercase">Your Portfolio</div><div className="text-white font-bold">+12.5% This Week</div></div>
                  </div>
                  <div className="text-primary text-sm font-bold">Top 5% Trader</div>
                </div>
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-background-dark border border-white/5">
                    <div className="flex justify-between mb-4">
                      <span className="text-white font-bold">Will BTC exceed $100k?</span>
                      <span className="text-xs text-slate-500">Ends in 4d 12h</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="py-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 font-bold hover:bg-green-500/20 transition-all">YES $0.62</button>
                      <button className="py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 font-bold hover:bg-red-500/20 transition-all">NO $0.38</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-2"><span className="text-slate-400 text-sm">Wallet Balance</span><div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden"><div className="bg-primary w-[75%] h-full"></div></div><span className="text-white text-sm font-bold">4.25 ETH</span></div>
                </div>
              </div>
              {/* Decorative blobs */}
              <div className="absolute -top-10 -right-10 size-64 bg-primary/20 blur-[100px] rounded-full -z-10"></div>
              <div className="absolute -bottom-10 -left-10 size-64 bg-amber-600/20 blur-[100px] rounded-full -z-10"></div>
            </div>
          </div>
        </section>
        {/* Value Props Section */}
        <section className="py-24 px-6 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl glass-panel group hover:bg-primary/5 transition-all" style={{ background: 'rgba(52, 44, 24, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(243, 188, 48, 0.1)' }}>
                <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-primary text-3xl">security</span></div>
                <h3 className="text-xl font-bold text-white mb-4">Non-Custodial Trading</h3>
                <p className="text-slate-400 leading-relaxed">Keep full control of your funds. Trade directly from your wallet with no middleman and institutional-grade security.</p>
              </div>
              <div className="p-8 rounded-2xl glass-panel group hover:bg-primary/5 transition-all" style={{ background: 'rgba(52, 44, 24, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(243, 188, 48, 0.1)' }}>
                <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-primary text-3xl">public</span></div>
                <h3 className="text-xl font-bold text-white mb-4">Global Markets</h3>
                <p className="text-slate-400 leading-relaxed">Access hundreds of markets across crypto, politics, and culture. If it's happening in the world, you can trade it here.</p>
              </div>
              <div className="p-8 rounded-2xl glass-panel group hover:bg-primary/5 transition-all" style={{ background: 'rgba(52, 44, 24, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(243, 188, 48, 0.1)' }}>
                <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-primary text-3xl">bolt</span></div>
                <h3 className="text-xl font-bold text-white mb-4">Instant Settlements</h3>
                <p className="text-slate-400 leading-relaxed">No more waiting for oracle resolutions. Our hybrid resolution system ensures you get paid the second an event is verified.</p>
              </div>
            </div>
          </div>
        </section>
        {/* Featured Markets */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Live Prediction Markets</h2>
                <p className="text-slate-400">Put your knowledge to the test in our top-trending markets.</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg bg-white/5 text-white text-sm font-semibold border border-white/10 hover:bg-white/10">Crypto</button>
                <button className="px-4 py-2 rounded-lg bg-white/5 text-slate-400 text-sm font-semibold border border-transparent hover:text-white">Politics</button>
                <button className="px-4 py-2 rounded-lg bg-white/5 text-slate-400 text-sm font-semibold border border-transparent hover:text-white">Sports</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Market Card 1 */}
              <div className="hover:border-[#f3bc3080] p-6 rounded-2xl glass-panel border border-white/5 transition-all" style={{ background: 'rgba(52, 44, 24, 0.6)', backdropFilter: 'blur(12px)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex -space-x-2">
                    <div className="size-8 rounded-full border-2 border-background-dark bg-yellow-500 flex items-center justify-center text-[10px] font-bold text-black">BNB</div>
                    <div className="size-8 rounded-full border-2 border-background-dark bg-primary flex items-center justify-center text-[10px] font-bold text-white">USD</div>
                  </div>
                  <span className="text-xs font-bold text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">trending_up</span> Hot Market
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mb-6">Will BNB hit $800 before June 2024?</h4>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-xs text-slate-500 uppercase font-bold tracking-wider">
                    <span>Yes Odds</span>
                    <span>No Odds</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
                    <div className="h-full bg-primary w-[68%]"></div>
                    <div className="h-full bg-slate-700 w-[32%]"></div>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white">
                    <span>68%</span>
                    <span>32%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2.5 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm font-bold hover:bg-primary transition-all hover:text-background-dark">Buy Yes</button>
                  <button className="py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-bold hover:bg-white/10 transition-all">Buy No</button>
                </div>
              </div>
              {/* Market Card 2 */}
              <div className="hover:border-[#f3bc3080] p-6 rounded-2xl glass-panel border border-white/5 transition-all" style={{ background: 'rgba(52, 44, 24, 0.6)', backdropFilter: 'blur(12px)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex -space-x-2">
                    <div className="size-8 rounded-full border-2 border-background-dark bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white">BTC</div>
                    <div className="size-8 rounded-full border-2 border-background-dark bg-slate-600 flex items-center justify-center text-[10px] font-bold text-white">HAL</div>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Halving Events</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-6">Next Bitcoin Halving: Will the block reward reduce on April 20th?</h4>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-xs text-slate-500 uppercase font-bold tracking-wider">
                    <span>Yes Odds</span>
                    <span>No Odds</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
                    <div className="h-full bg-primary w-[91%]"></div>
                    <div className="h-full bg-slate-700 w-[9%]"></div>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white">
                    <span>91%</span>
                    <span>9%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2.5 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm font-bold hover:bg-primary transition-all hover:text-background-dark">Buy Yes</button>
                  <button className="py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-bold hover:bg-white/10 transition-all">Buy No</button>
                </div>
              </div>
              {/* Market Card 3 */}
              <div className="hover:border-[#f3bc3080] p-6 rounded-2xl glass-panel border border-white/5 transition-all" style={{ background: 'rgba(52, 44, 24, 0.6)', backdropFilter: 'blur(12px)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex -space-x-2">
                    <div className="size-8 rounded-full border-2 border-background-dark bg-primary flex items-center justify-center text-xs font-bold text-white">
                      <span className="material-symbols-outlined text-sm">public</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">timer</span> Ending Soon
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mb-6">Will Global GDP growth exceed 3% in 2024?</h4>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-xs text-slate-500 uppercase font-bold tracking-wider">
                    <span>Yes Odds</span>
                    <span>No Odds</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
                    <div className="h-full bg-primary w-[45%]"></div>
                    <div className="h-full bg-slate-700 w-[55%]"></div>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white">
                    <span>45%</span>
                    <span>55%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2.5 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm font-bold hover:bg-primary transition-all hover:text-background-dark">Buy Yes</button>
                  <button className="py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-bold hover:bg-white/10 transition-all">Buy No</button>
                </div>
              </div>
            </div>
            <div className="mt-12 text-center">
              <Link className="inline-flex items-center text-primary font-bold hover:gap-2 transition-all" href="/prediction">
                View all 248 active markets <span className="material-symbols-outlined ml-2">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
        {/* How it Works Section */}
        <section className="py-24 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Trade Smarter in 3 Steps</h2>
              <p className="text-slate-400">The most intuitive prediction platform ever built.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Progress Line (Desktop) */}
              <div className="hidden md:block absolute top-[40px] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10"></div>
              <div className="flex flex-col items-center text-center">
                <div className="size-16 rounded-full bg-background-dark border-4 border-primary/20 flex items-center justify-center text-primary text-2xl font-black mb-8 shadow-[0_0_20px_rgba(243,188,48,0.2)]">1</div>
                <h4 className="text-xl font-bold text-white mb-3">Connect Wallet</h4>
                <p className="text-slate-400 text-sm leading-relaxed max-w-[240px]">Support for MetaMask, WalletConnect, and Coinbase Wallet.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="size-16 rounded-full bg-background-dark border-4 border-primary/20 flex items-center justify-center text-primary text-2xl font-black mb-8 shadow-[0_0_20px_rgba(243,188,48,0.2)]">2</div>
                <h4 className="text-xl font-bold text-white mb-3">Verify Reputation</h4>
                <p className="text-slate-400 text-sm leading-relaxed max-w-[240px]">Our AI scans your on-chain history to generate a custom credit score instantly.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="size-16 rounded-full bg-background-dark border-4 border-primary/20 flex items-center justify-center text-primary text-2xl font-black mb-8 shadow-[0_0_20px_rgba(243,188,48,0.2)]">3</div>
                <h4 className="text-xl font-bold text-white mb-3">Analyze &amp; Predict</h4>
                <p className="text-slate-400 text-sm leading-relaxed max-w-[240px]">Browse hundreds of live markets and use real-time data to place your predictions.</p>
              </div>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto rounded-[2.5rem] bg-gradient-to-br from-primary to-amber-600 p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-background-dark/20 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-background-dark mb-6">Ready to predict the future?</h2>
              <p className="text-background-dark/80 text-lg font-medium mb-10 max-w-xl mx-auto">Join over 50,000 traders using the world's most advanced decentralized prediction engine.</p>
              <Link href="/prediction" className="inline-block bg-background-dark text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-900 transition-all shadow-xl">
                Start Trading Now
              </Link>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-background-dark border-t border-white/5 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6 transform group-hover:scale-105 transition-all duration-300">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary">
                  <circle cx="45" cy="55" r="35" stroke="currentColor" strokeWidth="4" strokeDasharray="45 5" />
                  <circle cx="45" cy="55" r="15" stroke="currentColor" strokeWidth="4" strokeDasharray="15 5" />
                  <path d="M45 5 V20 M45 90 V105 M-5 55 H10 M80 55 H95" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />

                  <path d="M15 80 L35 60 L50 70 L85 20" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M65 20 H85 V40" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

                  <g fill="currentColor" stroke="currentColor" strokeWidth="2">
                    <line x1="35" y1="60" x2="35" y2="85" />
                    <rect x="31" y="65" width="8" height="12" rx="1" />

                    <line x1="50" y1="70" x2="50" y2="95" />
                    <rect x="46" y="75" width="8" height="12" rx="1" />

                    <line x1="70" y1="40" x2="70" y2="75" />
                    <rect x="66" y="45" width="8" height="20" rx="1" />
                  </g>
                </svg>
                <div className="flex flex-col justify-center">
                  <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent leading-none pb-0.5">
                    OmniFi
                  </h1>
                  <span className="text-[9px] tracking-[0.2em] text-slate-300 font-semibold">PREDICTION MARKET</span>
                </div>
              </div>
              <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
                Leading the decentralized future of prediction markets with institutional-grade risk management and credit facilities.
              </p>
              <div className="flex gap-4">
                <a className="size-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white/10 transition-all" href="#">
                  <span className="material-symbols-outlined">alternate_email</span>
                </a>
                <a className="size-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white/10 transition-all" href="#">
                  <span className="material-symbols-outlined">hub</span>
                </a>
                <a className="size-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white/10 transition-all" href="#">
                  <span className="material-symbols-outlined">public</span>
                </a>
              </div>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Ecosystem</h5>
              <ul className="space-y-4">
                <li><Link className="text-slate-500 hover:text-primary transition-colors text-sm" href="/prediction">Markets</Link></li>
                <li><Link className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">Staking</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Developers</h5>
              <ul className="space-y-4">
                <li><Link className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">Documentation</Link></li>
                <li><Link className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">API Reference</Link></li>
                <li><Link className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">Github</Link></li>
                <li><Link className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">Bug Bounty</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Company</h5>
              <ul className="space-y-4">
                <li><Link className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">About Us</Link></li>
                <li><Link className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">Careers</Link></li>
                <li><Link className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">Privacy Policy</Link></li>
                <li><Link className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">Legal</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">

            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <span className="size-2 bg-green-500 rounded-full animate-pulse"></span> Network Status: Operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
