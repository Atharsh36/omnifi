import { useState } from 'react';
import { ethers } from 'ethers';
import { contracts } from '@/lib/contracts';

const PREDICTION_ABI = [
  'function createMarket(string question, uint256 duration) external returns (uint256)',
  'function buyYes(uint256 marketId) external payable',
  'function buyNo(uint256 marketId) external payable',
  'function claim(uint256 marketId) external',
  'function markets(uint256) external view returns (string question, uint256 endTime, uint256 yesPool, uint256 noPool, bool resolved, bool outcome, address creator)',
  'function getMarketOdds(uint256 marketId) external view returns (uint256 yesPrice, uint256 noPrice)'
];

export function usePrediction() {
  const [loading, setLoading] = useState(false);

  const getContract = async () => {
    if (typeof window.ethereum === 'undefined') return null;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contracts.PredictionMarket, PREDICTION_ABI, signer);
  };

  const buyYes = async (marketId: number, amount: string) => {
    setLoading(true);
    try {
      const contract = await getContract();
      if (!contract) throw new Error('No wallet connected');
      const tx = await contract.buyYes(marketId, { value: ethers.parseEther(amount) });
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Buy YES error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const buyNo = async (marketId: number, amount: string) => {
    setLoading(true);
    try {
      const contract = await getContract();
      if (!contract) throw new Error('No wallet connected');
      const tx = await contract.buyNo(marketId, { value: ethers.parseEther(amount) });
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Buy NO error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const claim = async (marketId: number) => {
    setLoading(true);
    try {
      const contract = await getContract();
      if (!contract) throw new Error('No wallet connected');
      const tx = await contract.claim(marketId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Claim error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { buyYes, buyNo, claim, loading };
}
