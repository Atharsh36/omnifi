'use client';

interface Position {
  collateral: number;
  borrowed: number;
  creditScore: number;
}

export default function HealthFactor({ position }: { position: Position }) {
  const healthFactor = position.borrowed > 0 ? (position.collateral / position.borrowed) * 100 : 999;
  const isHealthy = healthFactor >= 150;
  const isWarning = healthFactor >= 120 && healthFactor < 150;
  const isDanger = healthFactor < 120;

  return (
    <div className="bg-background-dark border border-white/5 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Health Factor</h2>
      
      <div className={`rounded-lg p-6 text-center ${
        isHealthy ? 'bg-green-900/20 border border-green-800' :
        isWarning ? 'bg-yellow-900/20 border border-yellow-800' :
        'bg-red-900/20 border border-red-800'
      }`}>
        <div className={`text-6xl font-bold mb-2 ${
          isHealthy ? 'text-green-400' :
          isWarning ? 'text-yellow-400' :
          'text-red-400'
        }`}>
          {healthFactor.toFixed(0)}%
        </div>
        <div className="text-slate-400">
          {isHealthy ? 'Healthy Position' :
           isWarning ? 'Warning: Low Collateral' :
           'Danger: Risk of Liquidation'}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Safe Zone:</span>
          <span className="text-green-400">&gt; 150%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Warning Zone:</span>
          <span className="text-yellow-400">120% - 150%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Liquidation:</span>
          <span className="text-red-400">&lt; 120%</span>
        </div>
      </div>
    </div>
  );
}
