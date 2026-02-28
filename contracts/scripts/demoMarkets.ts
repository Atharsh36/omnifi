import { ethers } from "hardhat";

async function main() {
    const PREDICTION_MARKET_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "YOUR_DEPLOYED_CONTRACT_ADDRESS";

    if (PREDICTION_MARKET_ADDRESS === "YOUR_DEPLOYED_CONTRACT_ADDRESS") {
        console.error("Please set NEXT_PUBLIC_CONTRACT_ADDRESS in your .env or replace the placeholder.");
        return;
    }

    const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
    const predictionMarket = PredictionMarket.attach(PREDICTION_MARKET_ADDRESS);

    const duration = 24 * 60 * 60 * 10; // 10 days

    console.log("Creating 3 Demo Markets...");

    const tx1 = await predictionMarket.createMarket("Will BTC hit $100k?", duration);
    await tx1.wait();
    console.log("Market 1 Created: Will BTC hit $100k?");

    const tx2 = await predictionMarket.createMarket("Will ETH ETF be approved?", duration);
    await tx2.wait();
    console.log("Market 2 Created: Will ETH ETF be approved?");

    const tx3 = await predictionMarket.createMarket("Will India win World Cup?", duration);
    await tx3.wait();
    console.log("Market 3 Created: Will India win World Cup?");

    console.log("🎉 Demo Markets Successfully Created!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
