'use client';

export default function LiquidityProgress({ current, target }: { current: number; target: number }) {
  const progress = Math.min((current / target) * 100, 100);

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-slate-400">Progress</span>
        <span className="text-white font-medium">{progress.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary to-amber-600 h-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
