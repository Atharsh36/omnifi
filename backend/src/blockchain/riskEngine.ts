import { ethers } from 'ethers';
import { provider } from '../config/provider';

const RISK_ENGINE_ABI = [
  'function updateCreditScore(address user, uint256 score) external',
  'function getCreditScore(address user) external view returns (uint256)'
];

export class RiskEngineService {
  private contract: ethers.Contract | null = null;

  constructor() {
    const contractAddress = process.env.RISK_ENGINE_ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;

    if (contractAddress && privateKey) {
      const wallet = new ethers.Wallet(privateKey, provider);
      this.contract = new ethers.Contract(contractAddress, RISK_ENGINE_ABI, wallet);
    }
  }

  async updateScore(address: string, score: number): Promise<boolean> {
    try {
      if (!this.contract) {
        console.log('Contract not initialized, simulating update');
        return true;
      }

      const tx = await this.contract.updateCreditScore(address, score);
      await tx.wait();
      console.log(`Credit score updated for ${address}: ${score}`);
      return true;
    } catch (error) {
      console.error('Error updating credit score:', error);
      return false;
    }
  }

  async getScore(address: string): Promise<number> {
    try {
      if (!this.contract) return 0;
      const score = await this.contract.getCreditScore(address);
      return Number(score);
    } catch (error) {
      console.error('Error getting credit score:', error);
      return 0;
    }
  }
}
