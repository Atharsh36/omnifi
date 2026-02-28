'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { createWeb3Modal, defaultConfig, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';

// 1. Get Project ID
const projectId = 'b2d0752f90a88af6704d80a1841762cc';

// 2. Set BNB Testnet Chain Config
const bnbTestnet = {
  chainId: 97,
  name: 'BNB Smart Chain Testnet',
  currency: 'tBNB',
  explorerUrl: 'https://testnet.bscscan.com',
  rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
};

// 3. Create Metadata configuration for the Modal
const metadata = {
  name: 'OmniFi',
  description: 'A decentralized prediction trading platform',
  url: 'https://omnifi-predection-market.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// 4. Create internal configuration block
const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: false,
});

// 5. Initialize generalized Web3 Modal outside component mounting
createWeb3Modal({
  ethersConfig,
  chains: [bnbTestnet],
  projectId,
  enableAnalytics: false,
  defaultChain: bnbTestnet,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#FCD535',
    '--w3m-border-radius-master': '1px'
  },
  enableOnramp: false
});

import { usePredictionStore } from '@/store/usePredictionStore';

export default function WalletConnect() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [balance, setBalance] = useState<string>('0.00');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositInput, setDepositInput] = useState('');

  const initializeUser = usePredictionStore(state => state.initializeUser);
  const syncBalanceFromChain = usePredictionStore(state => state.syncBalanceFromChain);
  const users = usePredictionStore(state => state.users);

  const normalizedAddress = address?.toLowerCase() || '';
  const predictionBalance = users[normalizedAddress]?.balance || 0.0;
  const predictionDepositAddress = users[normalizedAddress]?.depositAddress || '';

  useEffect(() => {
    if (address) {
      initializeUser(address);
    }
  }, [address, initializeUser]);

  useEffect(() => {
    if (isConnected && walletProvider && address) {
      const fetchBalance = async () => {
        try {
          const provider = new ethers.BrowserProvider(walletProvider as any);
          const bal = await provider.getBalance(address);
          setBalance(Number(ethers.formatEther(bal)).toFixed(4));
        } catch (error) {
          console.error("Failed to fetch balance", error);
        }
      };

      fetchBalance();
      syncBalanceFromChain(address);

      // Refetch both balances safely every 15s to keep them accurate
      const interval = setInterval(() => {
        fetchBalance();
        syncBalanceFromChain(address);
      }, 15000);

      return () => clearInterval(interval);

    } else {
      setBalance('0.00');
    }
  }, [isConnected, walletProvider, address]);

  const [isDepositing, setIsDepositing] = useState(false);

  const handleDepositSubmit = async () => {
    const amt = parseFloat(depositInput);
    if (!amt || amt <= 0 || !walletProvider) return;

    setIsDepositing(true);
    try {
      const provider = new ethers.BrowserProvider(walletProvider as any);
      const signer = await provider.getSigner();

      if (!predictionDepositAddress) {
        throw new Error("No localized deposit address generated.");
      }

      // Send the deposit transaction directly to the User's Generated Prediction Wallet
      const tx = await signer.sendTransaction({
        to: predictionDepositAddress,
        value: ethers.parseEther(amt.toString())
      });

      // Wait for 1 block confirmation
      await tx.wait(1);

      if (address) {
        await syncBalanceFromChain(address);
      }
      setDepositInput('');
      setIsDepositModalOpen(false);
      alert(`Successfully deposited ${amt} tBNB to Prediction Account! Transaction: ${tx.hash}`);
    } catch (error: any) {
      console.error("Deposit failed", error);
      if (error?.code !== 4001) {
        alert("Deposit transaction failed. Please ensure you have enough BNB for gas fees.");
      }
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        {isConnected && address && (
          <>
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-bold px-4 py-1.5 rounded-lg text-sm transition flex items-center gap-2"
            >
              Deposit
              <span className="bg-primary/15 text-primary px-1.5 rounded text-xs font-mono">{parseFloat(predictionBalance.toFixed(6))}</span>
            </button>
            <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm font-medium cursor-pointer hover:border-primary/50 transition" onClick={() => open()}>
              <span className="text-primary mr-2 font-mono">{balance} BNB</span>
              <span className="text-slate-400 border-l border-white/10 pl-2 font-mono">{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
            </div>
          </>
        )}
        {!isConnected && (
          <button
            onClick={() => open()}
            className="px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg bg-primary hover:bg-primary/90 text-black shadow-[0_0_15px_rgba(252,213,53,0.2)]"
          >
            Connect Wallet
          </button>
        )}
      </div>

      {isDepositModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setIsDepositModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-xl font-bold mb-2 text-white">Deposit to OmniFi</h3>
            <p className="text-slate-400 text-sm mb-6">Load tBNB from your wallet to place fast, gasless trades on Prediction Markets.</p>

            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Your Prediction Wallet Address</label>
              <div className="flex bg-background-dark border border-white/10 rounded-lg p-3 text-sm text-slate-400 font-mono items-center justify-between">
                <span>{predictionDepositAddress || 'Generating...'}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(predictionDepositAddress);
                    alert("Copied Prediction Wallet Address!");
                  }}
                  className="bg-white/10 hover:bg-[#3B4149] text-white px-2 py-1 text-xs rounded transition"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="mb-6 mt-4">
              <div className="flex justify-between text-sm mb-2 text-slate-400">
                <span>Fast Deposit Amount</span>
                <span>Wallet Balance: <span className="text-white">{balance} BNB</span></span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={depositInput}
                  onChange={e => setDepositInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">tBNB</span>
              </div>
            </div>

            <button
              onClick={handleDepositSubmit}
              disabled={isDepositing || !depositInput || parseFloat(depositInput) <= 0 || parseFloat(depositInput) > parseFloat(balance)}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-white/10 disabled:text-slate-400 text-black font-bold py-3.5 rounded-lg transition-all flex justify-center items-center shadow-[0_0_15px_rgba(252,213,53,0.15)]"
            >
              {isDepositing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Depositing...
                </>
              ) : (
                `Deposit ${depositInput || '0'} tBNB`
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
