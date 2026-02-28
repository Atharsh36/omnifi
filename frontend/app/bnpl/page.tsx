'use client';
import { useState, useEffect } from 'react';
import VaultCard from '@/components/bnpl/VaultCard';
import BorrowPanel from '@/components/bnpl/BorrowPanel';
import HealthFactor from '@/components/bnpl/HealthFactor';

export default function BNPLPage() {
  const [position, setPosition] = useState({ collateral: 0, borrowed: 0, creditScore: 0 });

  useEffect(() => {
    // Mock data
    setPosition({ collateral: 2.5, borrowed: 1.2, creditScore: 750 });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold mb-8">Smart-Collateral BNPL Credit</h1>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <VaultCard position={position} />
          <HealthFactor position={position} />
        </div>
        
        <div className="lg:col-span-1">
          <BorrowPanel position={position} onUpdate={setPosition} />
        </div>
      </div>
    </div>
  );
}
