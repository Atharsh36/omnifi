'use client';

export default function StatsCard({ title, value, change }: { title: string; value: string; change: string }) {
  const isPositive = change.startsWith('+');

  return (
    <div className="bg-background-dark border border-white/5 rounded-xl p-6">
      <div className="text-slate-400 text-sm mb-2">{title}</div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {change}
      </div>
    </div>
  );
}
