import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { usePredictionStore } from '@/store/usePredictionStore';

interface Market {
  id: number;
  question: string;
  category: string;
  yesPool: number;
  noPool: number;
  volume: number;
  endTime: number;
  resolved: boolean;
  status: 'Open' | 'Closed' | 'Resolved';
}

interface TradePanelProps {
  market: Market;
  balance: number;
  onTrade: (amount: number, side: 'yes' | 'no') => void;
}

export default function TradePanel({ market, balance, onTrade }: TradePanelProps) {
  const [amount, setAmount] = useState('');
  const [side, setSide] = useState<'yes' | 'no'>('yes');
  const [mode, setMode] = useState<'trade' | 'deposit'>('trade');
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);

  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const users = usePredictionStore(state => state.users);
  const normalizedAddress = address?.toLowerCase() || '';
  const predictionDepositAddress = users[normalizedAddress]?.depositAddress || '';
  const syncBalanceFromChain = usePredictionStore(state => state.syncBalanceFromChain);

  const total = market.yesPool + market.noPool;
  const daysLeft = Math.ceil((market.endTime - Date.now()) / (1000 * 60 * 60 * 24));

  // Calculate potential return and loss based on exact 2x payout
  const calculateReturnInfo = () => {
    if (!amount || isNaN(parseFloat(amount))) return { return: '0.00', loss: '0.00' };
    const val = parseFloat(amount);
    return {
      return: (val * 2).toFixed(4),
      loss: val.toFixed(4)
    };
  };
  const { return: potentialReturn, loss: potentialLoss } = calculateReturnInfo();

  const handleTrade = async () => {
    if (!amount) return;
    const tradeValue = parseFloat(amount);
    if (tradeValue > balance) {
      alert("Insufficient deposited balance! Please deposit tBNB first.");
      return;
    }
    // Deduct from internal Prediction Balance
    onTrade(tradeValue, side);
    alert(`Successfully placed trade of ${amount} BNB on ${side.toUpperCase()} for market: ${market.question}`);
    setAmount('');
  };

  const handleDeposit = async () => {
    if (!depositAmount || !isConnected || !walletProvider) {
      alert("Please connect your wallet first.");
      return;
    }
    const depValue = parseFloat(depositAmount);
    if (!depValue || depValue <= 0) return;

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
        value: ethers.parseEther(depValue.toString())
      });

      // Wait for 1 block confirmation
      await tx.wait(1);

      if (address) {
        // Trigger blockchain re-sync
        await syncBalanceFromChain(address);
      }

      alert(`Successfully deposited ${depositAmount} tBNB to your Prediction Wallet! Hash: ${tx.hash}`);
      setDepositAmount('');
      setMode('trade'); // Switch back to trade mode seamlessly!
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
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-xl">
      <div className="mb-6 pb-6 border-b border-white/10">
        <div className="flex gap-0 mb-4 border-b border-white/10">
          <button
            onClick={() => setMode('trade')}
            className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 ${mode === 'trade' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-white'
              }`}
          >
            Trade
          </button>
          <button
            onClick={() => setMode('deposit')}
            className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 ${mode === 'deposit' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-white'
              }`}
          >
            Deposit
          </button>
        </div>
        <h3 className="text-xl font-bold mb-4 text-white leading-tight">{market.question}</h3>
        <div className="flex flex-col gap-2 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Ends in {daysLeft} days</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Source: API / Internal Oracle</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Liquidity: {total.toFixed(2)} BNB</span>
          </div>
        </div>
      </div>

      {mode === 'trade' ? (
        <>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setSide('yes')}
              className={`py-3.5 rounded-lg font-bold transition-all flex justify-center items-center gap-2 ${side === 'yes' ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(14,203,129,0.3)]' : 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20'
                }`}
            >
              YES
            </button>
            <button
              onClick={() => setSide('no')}
              className={`py-3.5 rounded-lg font-bold transition-all flex justify-center items-center gap-2 ${side === 'no' ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(246,70,93,0.3)]' : 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'
                }`}
            >
              NO
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-slate-400">Amount</label>
              <span className="text-sm text-slate-400">Balance: <span className="text-white font-medium">{parseFloat(balance.toFixed(6))} tBNB</span></span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-background-dark border border-white/10 text-white rounded-lg pl-4 pr-16 py-3.5 font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">BNB</span>
            </div>
          </div>

          <div className="bg-background-dark rounded-lg p-4 mb-6 border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400 text-sm">Potential Return</span>
              <span className="text-white font-bold text-lg">{potentialReturn} BNB</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400 text-sm">Potential Loss</span>
              <span className="text-red-500 font-bold text-lg">-{potentialLoss} BNB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">ROI</span>
              <span className="text-green-500 font-medium">+100.00%</span>
            </div>
          </div>

          <button
            onClick={handleTrade}
            disabled={market.status !== 'Open' || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${market.status === 'Open' && amount && parseFloat(amount) > 0 && parseFloat(amount) <= balance
              ? 'bg-primary hover:bg-primary/90 text-black shadow-[0_0_20px_rgba(252,213,53,0.2)]'
              : 'bg-white/10 text-slate-400 cursor-not-allowed'
              }`}
          >
            {market.status === 'Open' ? (amount ? (parseFloat(amount) > balance ? 'Insufficient Balance' : 'Place Trade') : 'Enter an amount') : 'Market Closed'}
          </button>
        </>
      ) : (
        <>
          <div className="mb-4 text-left">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Your Prediction Wallet Address</label>
            <div className="flex bg-background-dark border border-white/10 rounded-lg p-3 text-sm text-slate-400 font-mono items-center justify-between">
              <span>{predictionDepositAddress || 'Please connect wallet...'}</span>
              <button
                onClick={() => {
                  if (!predictionDepositAddress) return;
                  navigator.clipboard.writeText(predictionDepositAddress);
                  alert("Copied Prediction Wallet Address!");
                }}
                className="bg-white/10 hover:bg-[#3B4149] text-white px-2 py-1 text-xs rounded transition"
              >
                Copy
              </button>
            </div>
            <p className="text-slate-400 text-xs mt-2">Required for fast, gasless trades. Deposit will automatically sync from blockchain.</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-slate-400">Deposit Amount (from Wallet)</label>
              <span className="text-sm text-slate-400">Current Deposit: <span className="text-white font-medium">{parseFloat(balance.toFixed(6))} tBNB</span></span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-background-dark border border-white/10 text-white rounded-lg pl-4 pr-16 py-3.5 font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">BNB</span>
            </div>
          </div>

          <div className="bg-background-dark rounded-lg p-4 mb-6 border border-white/10 text-sm">
            <p className="text-slate-400 mb-2">
              Fund your OmniFi Prediction account directly from your connected wallet. This internal balance is fast and gasless for placing multiple consecutive trades!
            </p>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
              <span className="text-slate-400">Network</span>
              <span className="text-primary font-medium">BNB Smart Chain Testnet</span>
            </div>
          </div>

          <button
            onClick={handleDeposit}
            disabled={isDepositing || !depositAmount || parseFloat(depositAmount) <= 0}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex justify-center items-center ${depositAmount && parseFloat(depositAmount) > 0
              ? 'bg-primary hover:bg-primary/90 text-black shadow-[0_0_20px_rgba(252,213,53,0.2)]'
              : 'bg-white/10 text-slate-400 cursor-not-allowed'
              }`}
          >
            {isDepositing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : depositAmount ? 'Deposit Funds' : 'Enter deposit amount'}
          </button>
        </>
      )}

      <p className="text-center text-xs text-slate-400 mt-5">
        By trading, you agree to the Terms of Service.
      </p>
    </div>
  );
}
