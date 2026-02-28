import { useState } from 'react';
import { ethers } from 'ethers';
import { contracts } from '@/lib/contracts';

const LAUNCHPAD_ABI = [
  'function createProject(address token, uint256 targetAmount, uint256 tokenPrice, uint256 duration, uint256 lockDuration) external returns (uint256)',
  'function contribute(uint256 projectId) external payable',
  'function claimTokens(uint256 projectId) external',
  'function projects(uint256) external view returns (address creator, address token, uint256 targetAmount, uint256 raisedAmount, uint256 tokenPrice, uint256 startTime, uint256 endTime, uint256 liquidityUnlockTime, bool liquidityAdded, bool cancelled)',
  'function getProjectProgress(uint256 projectId) external view returns (uint256)'
];

export function useLaunchpad() {
  const [loading, setLoading] = useState(false);

  const getContract = async () => {
    if (typeof window.ethereum === 'undefined') return null;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contracts.Launchpad, LAUNCHPAD_ABI, signer);
  };

  const contribute = async (projectId: number, amount: string) => {
    setLoading(true);
    try {
      const contract = await getContract();
      if (!contract) throw new Error('No wallet connected');
      const tx = await contract.contribute(projectId, { value: ethers.parseEther(amount) });
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Contribute error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const claimTokens = async (projectId: number) => {
    setLoading(true);
    try {
      const contract = await getContract();
      if (!contract) throw new Error('No wallet connected');
      const tx = await contract.claimTokens(projectId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Claim tokens error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { contribute, claimTokens, loading };
}
