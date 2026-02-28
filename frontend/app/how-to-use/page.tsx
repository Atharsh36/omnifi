import React from 'react';
import Link from 'next/link';
import PredictionNav from '@/components/prediction/PredictionNav';

export default function HowToUsePage() {
    return (
        <div className="max-w-4xl mx-auto px-6 pt-28 pb-8">
            {/* Top Navbar */}
            <PredictionNav />

            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent mb-8">
                How to Use OmniFi
            </h1>

            <p className="text-slate-400 mb-8 text-lg">
                Follow these steps to get started trading on OmniFi's decentralized prediction markets.
            </p>

            <div className="space-y-6">

                {/* Step 1 */}
                <div className="bg-background-dark border border-white/5 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">1</div>
                        <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
                    </div>
                    <p className="text-slate-400 ml-14">
                        Click the "Connect Wallet" button in the top right corner. You can use MetaMask or WalletConnect to connect your Web3 wallet securely.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="bg-background-dark border border-white/5 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">2</div>
                        <h2 className="text-2xl font-bold text-white">Switch to BNB Testnet</h2>
                    </div>
                    <p className="text-slate-400 ml-14">
                        Ensure your wallet is connected to the <strong>BNB Smart Chain Testnet</strong>. The platform will automatically prompt you to switch networks if needed.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="bg-background-dark border border-white/5 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">3</div>
                        <h2 className="text-2xl font-bold text-white">Get Faucet BNB</h2>
                    </div>
                    <p className="text-slate-400 ml-14">
                        You will need testnet BNB (tBNB) for gas fees and trading. Visit the official{' '}
                        <a
                            href="https://testnet.binance.org/faucet-smart"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                        >
                            BNB Smart Chain Faucet
                        </a>{' '}
                        to claim some free tBNB to your wallet address.
                    </p>
                </div>

                {/* Step 4 */}
                <div className="bg-background-dark border border-white/5 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">4</div>
                        <h2 className="text-2xl font-bold text-white">Deposit & Start Trading</h2>
                    </div>
                    <p className="text-slate-400 ml-14">
                        Head over to the Prediction Markets dashboard. Deposit your tBNB into the OmniFi Vault and start placing your bets on live markets!
                    </p>
                    <div className="ml-14 mt-6">
                        <Link
                            href="/prediction"
                            className="inline-block bg-primary text-black px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition shadow-md shadow-primary/20"
                        >
                            Go to Markets
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
