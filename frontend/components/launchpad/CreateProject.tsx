'use client';
import { useState } from 'react';

export default function CreateProject({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    target: '',
    price: '',
    duration: '30'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Project creation submitted!');
    onClose();
  };

  return (
    <div className="max-w-2xl mx-auto bg-background-dark border border-white/5 rounded-xl p-8">
      <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Project Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Token Symbol</label>
          <input
            type="text"
            value={formData.symbol}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Target Amount (BNB)</label>
            <input
              type="number"
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Token Price (BNB)</label>
            <input
              type="number"
              step="0.001"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Duration (days)</label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium"
          >
            Create Project
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-lg font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
