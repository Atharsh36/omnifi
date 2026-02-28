import React, { useState } from 'react';

export default function TabStaking() {
    const [staked, setStaked] = useState(0);
    const [inputVal, setInputVal] = useState('');
    const [loading, setLoading] = useState(false);

    const handleStake = () => {
        if (!inputVal) return;
        setLoading(true);
        setTimeout(() => {
            setStaked((prev) => prev + parseFloat(inputVal));
            setInputVal('');
            setLoading(false);
            alert('Successfully staked BNB tokens! Tier updated.');
        }, 1500);
    }

    // tier calculation
    let tier = 'None';
    let tierColor = 'text-slate-500';
    if (staked >= 50) { tier = 'Platinum'; tierColor = 'text-gray-200'; }
    else if (staked >= 15) { tier = 'Gold'; tierColor = 'text-yellow-400'; }
    else if (staked >= 5) { tier = 'Silver'; tierColor = 'text-slate-400'; }
    else if (staked >= 1) { tier = 'Bronze'; tierColor = 'text-orange-400'; }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 md:p-12 border border-white/10/50 flex flex-col items-center relative overflow-hidden shadow-2xl">
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/10 blur-[80px] rounded-full mix-blend-screen"></div>
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full mix-blend-screen"></div>

                <div className="w-20 h-20 bg-gradient-to-br from-primary to-amber-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg ring-8 ring-[#0B0E14] z-10">
                    💎
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 z-10 text-center">Stake BNB for Access</h2>
                <p className="text-slate-400 mb-10 text-center max-w-lg z-10 leading-relaxed font-medium text-sm">Lock your native BNB tokens to earn high-yield APY and elevate your Launchpad Tier for guaranteed IDO allocations.</p>

                <div className="grid grid-cols-2 gap-4 md:gap-8 w-full mb-10 z-10">
                    <div className="bg-background-dark/80 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/10/50 shadow-inner">
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Staked</div>
                        <div className="text-3xl md:text-4xl font-extrabold text-primary drop-shadow-md">{staked} <span className="text-lg text-slate-500 font-medium">BNB</span></div>
                    </div>
                    <div className="bg-background-dark/80 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/10/50 shadow-inner">
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Current Tier</div>
                        <div className={`text-3xl md:text-4xl font-extrabold drop-shadow-md ${tierColor}`}>{tier}</div>
                    </div>
                </div>

                <div className="w-full max-w-md space-y-4 z-10 bg-background-dark/50 p-6 flex flex-col rounded-3xl border border-white/5/80">
                    <div className="relative">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block ml-2">Amount to Stake</label>
                        <input
                            type="number"
                            value={inputVal}
                            onChange={e => setInputVal(e.target.value)}
                            className="w-full bg-background-dark rounded-xl py-4 px-6 text-white border border-white/10 focus:border-primary focus:outline-none transition-colors"
                            placeholder="0.00"
                        />
                        <button onClick={() => setInputVal('10')} className="absolute right-4 bottom-3 text-primary font-bold text-xs bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors">MAX</button>
                    </div>

                    <button
                        onClick={handleStake}
                        disabled={loading || !inputVal}
                        className="w-full bg-gradient-to-r from-primary to-amber-600 hover:from-primary hover:to-amber-600 disabled:from-gray-800 disabled:to-gray-800 disabled:text-slate-500 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] disabled:shadow-none hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : 'Lock BNB Tokens'}
                    </button>
                </div>
            </div>
        </div>
    )
}
