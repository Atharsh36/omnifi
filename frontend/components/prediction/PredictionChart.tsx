'use client';
import { useEffect, useRef } from 'react';

export default function PredictionChart({ marketId }: { marketId: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mock data for chart
    const data = Array.from({ length: 20 }, (_, i) => ({
      x: i * 20,
      yes: 40 + Math.random() * 20,
      no: 60 - Math.random() * 20
    }));

    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (canvas.height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw YES line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((point, i) => {
      const x = point.x;
      const y = canvas.height - (point.yes / 100) * canvas.height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw NO line
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    data.forEach((point, i) => {
      const x = point.x;
      const y = canvas.height - (point.no / 100) * canvas.height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [marketId]);

  return (
    <div className="bg-background-dark border border-white/5 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Market Odds History</h3>
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        className="w-full"
      />
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span>YES</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span>NO</span>
        </div>
      </div>
    </div>
  );
}
