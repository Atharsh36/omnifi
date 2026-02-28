'use client';
import { useState } from 'react';

interface Position {
  collateral: number;
  borrowed: number;
  creditScore: number;
}

export default function BorrowPanel({ position, onUpdate }: { position: Position; onUpdate: (p: Position) => void }) {
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState<'deposit' | 'borrow' | 'repay'>('deposit');

  const handleAction = async () => {
    if (!amount) return;
    const value = parseFloat(amount);
    
    if (action === 'deposit') {
      onUpdate({ ...position, collateral: position.collateral + value });
    } else if (action === 'borrow') {
      onUpdate({ ...position, borrowed: position.borrowed + value });
    } else if (action === 'repay') {
      onUpdate({ ...position, borrowed: Math.max(0, position.borrowed - value) });
    }
    
    setAmount('');
  };

  return (
    <div className="bg-background-dark border border-white/5 rounded-xl p-6 sticky top-6">
      <h3 className="text-xl font-bold mb-6">Manage Position</h3>
      
      <div className="grid grid-cols-3 gap-2 mb-6">
        <button
          onClick={() => setAction('deposit')}
          className={`py-2 rounded-lg text-sm font-medium transition ${
            action === 'deposit' ? 'bg-primary text-white' : 'bg-white/5 text-slate-400'
          }`}
        >
          Deposit
        </button>
        <button
          onClick={() => setAction('borrow')}
          className={`py-2 rounded-lg text-sm font-medium transition ${
            action === 'borrow' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400'
          }`}
        >
          Borrow
        </button>
        <button
          onClick={() => setAction('repay')}
          className={`py-2 rounded-lg text-sm font-medium transition ${
            action === 'repay' ? 'bg-green-600 text-white' : 'bg-white/5 text-slate-400'
          }`}
        >
          Repay
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-slate-400 mb-2">Amount (BNB)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
        />
      </div>

      <button
        onClick={handleAction}
        className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium mb-4"
      >
        {action.charAt(0).toUpperCase() + action.slice(1)}
      </button>

      <div className="bg-white/5 rounded-lg p-4 text-sm text-slate-400">
        <div className="flex justify-between mb-2">
          <span>Collateral Ratio:</span>
          <span className="text-white">150%</span>
        </div>
        <div className="flex justify-between">
          <span>Liquidation Threshold:</span>
          <span className="text-red-400">120%</span>
        </div>
      </div>
    </div>
  );
}
