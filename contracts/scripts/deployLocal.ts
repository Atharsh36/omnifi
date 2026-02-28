import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying OmniFi contracts to local network...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy RiskEngine
  console.log("📝 Deploying RiskEngine...");
  const RiskEngine = await ethers.getContractFactory("RiskEngine");
  const riskEngine = await RiskEngine.deploy();
  await riskEngine.waitForDeployment();
  const riskEngineAddress = await riskEngine.getAddress();
  console.log("✅ RiskEngine deployed to:", riskEngineAddress);

  // Deploy CollateralVault
  console.log("\n📝 Deploying CollateralVault...");
  const CollateralVault = await ethers.getContractFactory("CollateralVault");
  const vault = await CollateralVault.deploy(riskEngineAddress);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("✅ CollateralVault deployed to:", vaultAddress);

  // Deploy PredictionMarket
  console.log("\n📝 Deploying PredictionMarket...");
  const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
  const predictionMarket = await PredictionMarket.deploy(vaultAddress);
  await predictionMarket.waitForDeployment();
  const predictionAddress = await predictionMarket.getAddress();
  console.log("✅ PredictionMarket deployed to:", predictionAddress);

  // Deploy OmniAMM
  console.log("\n📝 Deploying OmniAMM...");
  const OmniAMM = await ethers.getContractFactory("OmniAMM");
  const amm = await OmniAMM.deploy();
  await amm.waitForDeployment();
  const ammAddress = await amm.getAddress();
  console.log("✅ OmniAMM deployed to:", ammAddress);

  // Deploy Launchpad
  console.log("\n📝 Deploying Launchpad...");
  const Launchpad = await ethers.getContractFactory("Launchpad");
  const launchpad = await Launchpad.deploy(ammAddress);
  await launchpad.waitForDeployment();
  const launchpadAddress = await launchpad.getAddress();
  console.log("✅ Launchpad deployed to:", launchpadAddress);

  // Deploy Mock USDT
  console.log("\n📝 Deploying Mock USDT...");
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const usdt = await MockERC20.deploy("Mock USDT", "USDT", 1000000);
  await usdt.waitForDeployment();
  const usdtAddress = await usdt.getAddress();
  console.log("✅ Mock USDT deployed to:", usdtAddress);

  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("RiskEngine:       ", riskEngineAddress);
  console.log("CollateralVault:  ", vaultAddress);
  console.log("PredictionMarket: ", predictionAddress);
  console.log("OmniAMM:          ", ammAddress);
  console.log("Launchpad:        ", launchpadAddress);
  console.log("Mock USDT:        ", usdtAddress);
  console.log("=".repeat(60));

  console.log("\n📋 Update frontend/lib/contracts.ts with these addresses:");
  console.log(`
export const contracts = {
  CollateralVault: "${vaultAddress}",
  RiskEngine: "${riskEngineAddress}",
  PredictionMarket: "${predictionAddress}",
  Launchpad: "${launchpadAddress}",
  OmniAMM: "${ammAddress}"
};
  `);

  console.log("\n📋 Update backend/.env with these addresses:");
  console.log(`RISK_ENGINE_ADDRESS=${riskEngineAddress}`);
  console.log(`COLLATERAL_VAULT_ADDRESS=${vaultAddress}`);
  console.log(`PREDICTION_MARKET_ADDRESS=${predictionAddress}`);
  console.log(`LAUNCHPAD_ADDRESS=${launchpadAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
