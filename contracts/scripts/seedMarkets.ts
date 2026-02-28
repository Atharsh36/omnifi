import { ethers } from "hardhat";

async function main() {
  const predictionMarketAddress = "YOUR_PREDICTION_MARKET_ADDRESS";
  const PredictionMarket = await ethers.getContractAt("PredictionMarket", predictionMarketAddress);

  console.log("Creating prediction markets...");

  const markets = [
    { question: "Will BTC reach $100k by end of 2024?", duration: 30 * 24 * 60 * 60 },
    { question: "Will ETH flip BTC in market cap?", duration: 90 * 24 * 60 * 60 },
    { question: "Will BNB reach $1000 this year?", duration: 60 * 24 * 60 * 60 }
  ];

  for (const market of markets) {
    const tx = await PredictionMarket.createMarket(market.question, market.duration);
    await tx.wait();
    console.log(`Created market: ${market.question}`);
  }

  console.log("Markets seeded successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
