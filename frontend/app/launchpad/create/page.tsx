'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';

export default function CreateLaunch() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        symbol: '',
        totalSupply: '',
        tokenPriceBNB: '',
        softCap: '',
        hardCap: '',
        saleDuration: '3',
        liquidityPercent: '51'
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
            return;
        }

        setLoading(true);
        try {
            if (!(window as any).ethereum) {
                alert("Please install MetaMask or another Web3 wallet to deploy contracts.");
                setLoading(false);
                return;
            }

            const provider = new ethers.BrowserProvider((window as any).ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();

            // Factory Contract Address on BNB Testnet
            // You will need to replace this with the actual deployed address from scripts/deployLaunch.ts
            const FACTORY_ADDRESS = "0x8920D4FaA47230155bB57E4eC9CB4A62dcB172b8"; // Example Placeholder

            const ABI = [
                "function createLaunch(string name, string symbol, uint256 totalSupply, uint256 tokenPriceBNB, uint256 softCap, uint256 hardCap, uint256 saleStart, uint256 saleEnd, uint256 liquidityPercent) external returns (address)"
            ];

            const factoryContract = new ethers.Contract(FACTORY_ADDRESS, ABI, signer);

            const priceWei = ethers.parseEther(formData.tokenPriceBNB || "0");
            const softCapWei = ethers.parseEther(formData.softCap || "0");
            const hardCapWei = ethers.parseEther(formData.hardCap || "0");

            const saleStart = Math.floor(Date.now() / 1000) + 300; // starts in 5 minutes
            const saleEnd = saleStart + parseInt(formData.saleDuration) * 86400; // days

            const tx = await factoryContract.createLaunch(
                formData.name,
                formData.symbol,
                formData.totalSupply || "0",
                priceWei,
                softCapWei,
                hardCapWei,
                saleStart,
                saleEnd,
                formData.liquidityPercent
            );

            await tx.wait(); // Wait for confirmation on BNB Testnet

            alert('Launchpad Factory: Token deployed and Sale created successfully on BNB Testnet!');
            window.location.href = '/launchpad';
        } catch (error: any) {
            console.error(error);
            alert(`Deployment Failed: ${error.reason || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-background-dark text-gray-200 font-sans pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6 animate-fade-in-up">

                <div className="flex items-center justify-between mb-8">
                    <Link href="/launchpad" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                        <span>&larr;</span> Back to Launchpad
                    </Link>
                    <div className="text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                        Step {step} of 3
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800/80 backdrop-blur-xl border border-white/10/50 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    {/* Animated BG line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                        <div className="h-full bg-gradient-to-r from-primary to-amber-600 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
                    </div>

                    <div className="mb-10 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary font-extrabold text-3xl flex items-center justify-center mx-auto mb-4 ring-4 ring-gray-900 shadow-lg">
                            🚀
                        </div>
                        <h1 className="text-4xl font-extrabold text-white mb-3">Create New Launch</h1>
                        <p className="text-slate-400 max-w-lg mx-auto">Deploy a fresh ERC20 token and standard IDO contract bound with PLU locked liquidity on PancakeSwap automatically.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Step 1: Token Info */}
                        <div className={step === 1 ? 'block' : 'hidden'}>
                            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-3">1. Token Metadata</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-slate-400 text-sm font-bold mb-2">Token Name</label>
                                    <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Omni Protocol" className="w-full bg-background-dark border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm font-bold mb-2">Token Symbol</label>
                                    <input required type="text" name="symbol" value={formData.symbol} onChange={handleChange} placeholder="e.g. OMNI" className="w-full bg-background-dark border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm font-bold mb-2">Total Supply</label>
                                    <input required type="number" name="totalSupply" value={formData.totalSupply} onChange={handleChange} placeholder="e.g. 1000000" className="w-full bg-background-dark border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Sale Presets */}
                        <div className={step === 2 ? 'block' : 'hidden'}>
                            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-3">2. IDO Parameters</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-slate-400 text-sm font-bold mb-2">Token Price (in BNB)</label>
                                    <input required type="number" step="0.000001" name="tokenPriceBNB" value={formData.tokenPriceBNB} onChange={handleChange} placeholder="e.g. 0.001" className="w-full bg-background-dark border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-400 text-sm font-bold mb-2">Soft Cap (BNB)</label>
                                        <input required type="number" name="softCap" value={formData.softCap} onChange={handleChange} placeholder="e.g. 50" className="w-full bg-background-dark border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm font-bold mb-2">Hard Cap (BNB)</label>
                                        <input required type="number" name="hardCap" value={formData.hardCap} onChange={handleChange} placeholder="e.g. 100" className="w-full bg-background-dark border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm font-bold mb-2">Sale Duration (Days)</label>
                                    <select name="saleDuration" value={formData.saleDuration} onChange={handleChange} className="w-full bg-background-dark border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors">
                                        <option value="1">1 Day</option>
                                        <option value="3">3 Days</option>
                                        <option value="5">5 Days</option>
                                        <option value="7">7 Days</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Liquidity Setup */}
                        <div className={step === 3 ? 'block' : 'hidden'}>
                            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-3">3. Liquidity & PLU</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <label className="block text-slate-400 text-sm font-bold">Liquidity Percentage</label>
                                        <span className="text-primary font-mono font-bold text-sm bg-background-dark px-2 py-1 rounded-md">{formData.liquidityPercent}%</span>
                                    </div>
                                    <input required type="range" name="liquidityPercent" min="51" max="100" value={formData.liquidityPercent} onChange={handleChange} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500" />
                                    <p className="text-xs text-slate-500 mt-2 font-medium">Minimum 51% of raised funds are automatically sent to PancakeSwap. Remaining {100 - parseInt(formData.liquidityPercent)}% unlocks to creator dev wallet.</p>
                                </div>

                                <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-start gap-4">
                                    <span className="text-2xl">🔐</span>
                                    <div>
                                        <h4 className="text-primary font-bold text-sm mb-1">PLU Auto-Lock Enabled</h4>
                                        <p className="text-slate-400 text-xs leading-relaxed">Generated LP tokens will be instantly bound to a Progressive Liquidity Unlock (PLU) contract preventing rugs. Liquid unlock mapped over 6 months linearly.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6 border-t border-white/5 mt-10">
                            {step > 1 ? (
                                <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-xl font-bold text-slate-400 bg-background-dark hover:text-white hover:bg-white/5 border border-white/10 transition-colors">
                                    Previous
                                </button>
                            ) : <div></div>}

                            <button type="submit" disabled={loading} className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-amber-600 hover:from-primary hover:to-amber-600 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2">
                                {loading ? 'Processing...' : step === 3 ? 'Deploy Launchpad \u2192' : 'Next Step \u2192'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
