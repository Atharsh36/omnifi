import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contracts } from '@/lib/contracts';

const VAULT_ABI = [
  'function deposit() external payable',
  'function borrow(uint256 amount) external',
  'function repay() external payable',
  'function withdraw(uint256 amount) external',
  'function positions(address) external view returns (uint256 collateral, uint256 borrowed, uint256 creditScore)',
  'function getHealthFactor(address) external view returns (uint256)',
  'function getMaxBorrow(address) external view returns (uint256)'
];

export function useVault() {
  const [position, setPosition] = useState({ collateral: 0, borrowed: 0, creditScore: 0 });
  const [loading, setLoading] = useState(false);

  const getContract = async () => {
    if (typeof window.ethereum === 'undefined') return null;
    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const signer = await provider.getSigner();
    return new ethers.Contract(contracts.CollateralVault, VAULT_ABI, signer);
  };

  const deposit = async (amount: string) => {
    setLoading(true);
    try {
      const contract = await getContract();
      if (!contract) throw new Error('No wallet connected');
      const tx = await contract.deposit({ value: ethers.parseEther(amount) });
      await tx.wait();
      await loadPosition();
    } catch (error) {
      console.error('Deposit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const borrow = async (amount: string) => {
    setLoading(true);
    try {
      const contract = await getContract();
      if (!contract) throw new Error('No wallet connected');
      const tx = await contract.borrow(ethers.parseEther(amount));
      await tx.wait();
      await loadPosition();
    } catch (error) {
      console.error('Borrow error:', error);
    } finally {
      setLoading(false);
    }
  };

  const repay = async (amount: string) => {
    setLoading(true);
    try {
      const contract = await getContract();
      if (!contract) throw new Error('No wallet connected');
      const tx = await contract.repay({ value: ethers.parseEther(amount) });
      await tx.wait();
      await loadPosition();
    } catch (error) {
      console.error('Repay error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPosition = async () => {
    try {
      if (typeof window.ethereum === 'undefined') return;
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const contract = await getContract();
      if (!contract) return;

      const pos = await contract.positions(address);
      setPosition({
        collateral: parseFloat(ethers.formatEther(pos.collateral)),
        borrowed: parseFloat(ethers.formatEther(pos.borrowed)),
        creditScore: Number(pos.creditScore)
      });
    } catch (error) {
      console.error('Load position error:', error);
    }
  };

  return { position, deposit, borrow, repay, loading, loadPosition };
}
