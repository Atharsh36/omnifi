import { ethers } from "ethers";

export const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL || "https://data-seed-prebsc-1-s1.binance.org:8545"
);
