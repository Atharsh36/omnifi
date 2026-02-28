import { ethers } from 'ethers';
import { settings } from '../config/settings';

const ABI = [
    "function markets(uint256 id) view returns (string question, uint256 endTime, bool resolved, uint8 outcome)",
    "function totalYesPool(uint256 marketId) view returns (uint256)",
    "function totalNoPool(uint256 marketId) view returns (uint256)",
    "function buyYes(uint256 marketId) payable",
    "function buyNo(uint256 marketId) payable",
    "function getMarket(uint256 marketId) view returns (uint256 totalYesPool, uint256 totalNoPool, uint256 recentTrades)"
];

let provider: ethers.JsonRpcProvider | null = null;
let contract: ethers.Contract | null = null;
let wallet: ethers.Wallet | null = null;

export const initBlockchain = () => {
    if (!settings.rpcUrl || !settings.privateKey || !settings.contractAddress) {
        console.warn("⚠️ Blockchain configuration missing. Arbitrage bot won't work correctly without settings.");
        return false;
    }

    try {
        provider = new ethers.JsonRpcProvider(settings.rpcUrl);
        wallet = new ethers.Wallet(settings.privateKey, provider);
        contract = new ethers.Contract(settings.contractAddress, ABI, wallet);
        console.log(`✅ Connected to Blockchain (Wallet: ${wallet.address})`);
        return true;
    } catch (err: any) {
        console.error("❌ Failed to initialize blockchain:", err.message);
        return false;
    }
};

export const getContract = () => contract;
export const getWallet = () => wallet;

export const getMarketPrice = async (marketId: number) => {
    if (!contract) throw new Error("Contract not initialized");

    try {
        // Attempting to fetch pool data
        const totalYesPoolBn = await contract.totalYesPool(marketId);
        const totalNoPoolBn = await contract.totalNoPool(marketId);

        // Convert from wei if necessary, but ratio doesn't matter since it's Division
        // If it's pure numbers, BigInt is fine
        const totalYesStr = ethers.formatEther(totalYesPoolBn);
        const totalNoStr = ethers.formatEther(totalNoPoolBn);

        const totalYes = parseFloat(totalYesStr);
        const totalNo = parseFloat(totalNoStr);

        const totalPool = totalYes + totalNo;

        if (totalPool === 0) {
            return {
                yesPrice: 0.5,
                noPrice: 0.5,
                totalYesPool: 0,
                totalNoPool: 0
            };
        }

        return {
            yesPrice: totalYes / totalPool,
            noPrice: totalNo / totalPool,
            totalYesPool: totalYes,
            totalNoPool: totalNo
        };
    } catch (err: any) {
        if (settings.contractAddress && settings.contractAddress !== '0x0000000000000000000000000000000000000000') {
            console.error(`Error fetching price for market ${marketId}:`, err.message);
        }
        // Return mock data for testing/fallback if contract isn't deployed properly
        return {
            yesPrice: 0.5,
            noPrice: 0.5,
            totalYesPool: 10,
            totalNoPool: 10
        };
    }
};
