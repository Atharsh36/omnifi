'use client';
import LiquidityProgress from './LiquidityProgress';

interface Project {
  id: number;
  name: string;
  token: string;
  target: number;
  raised: number;
  price: number;
  endTime: number;
}

export default function LaunchCard({ project }: { project: Project }) {
  const progress = (project.raised / project.target) * 100;
  const daysLeft = Math.ceil((project.endTime - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-background-dark border border-white/5 rounded-xl p-6 hover:border-purple-500 transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1">{project.name}</h3>
          <div className="text-purple-400 font-mono">${project.token}</div>
        </div>
        <div className="bg-purple-900/30 px-3 py-1 rounded-full text-sm text-purple-400">
          Active
        </div>
      </div>

      <div className="mb-4">
        <LiquidityProgress current={project.raised} target={project.target} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-slate-400 text-sm">Token Price</div>
          <div className="text-lg font-bold">{project.price} BNB</div>
        </div>
        <div>
          <div className="text-slate-400 text-sm">Raised</div>
          <div className="text-lg font-bold">{project.raised.toFixed(1)} BNB</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 text-sm">
        <span className="text-slate-400">Target: {project.target} BNB</span>
        <span className="text-slate-400">{daysLeft} days left</span>
      </div>

      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium">
        Contribute
      </button>
    </div>
  );
}
