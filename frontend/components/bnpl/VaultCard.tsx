'use client';

interface Position {
  collateral: number;
  borrowed: number;
  creditScore: number;
}

export default function VaultCard({ position }: { position: Position }) {
  const maxBorrow = (position.collateral * 100) / 150;
  const available = maxBorrow - position.borrowed;

  return (
    <div className="bg-background-dark border border-white/5 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Your Vault</h2>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-primary/10 border border-blue-800 rounded-lg p-4">
          <div className="text-primary text-sm mb-1">Collateral</div>
          <div className="text-3xl font-bold">{position.collateral.toFixed(2)}</div>
          <div className="text-slate-400 text-sm">BNB</div>
        </div>
        
        <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4">
          <div className="text-purple-400 text-sm mb-1">Borrowed</div>
          <div className="text-3xl font-bold">{position.borrowed.toFixed(2)}</div>
          <div className="text-slate-400 text-sm">BNB</div>
        </div>
        
        <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
          <div className="text-green-400 text-sm mb-1">Available</div>
          <div className="text-3xl font-bold">{available.toFixed(2)}</div>
          <div className="text-slate-400 text-sm">BNB</div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Credit Score</span>
          <span className="text-2xl font-bold text-primary">{position.creditScore}</span>
        </div>
      </div>
    </div>
  );
}
