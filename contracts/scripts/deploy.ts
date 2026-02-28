import { ethers } from "hardhat";

async function main() {
  console.log("Deploying OmniFi contracts...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Deploy RiskEngine
  const RiskEngine = await ethers.getContractFactory("RiskEngine");
  const riskEngine = await RiskEngine.deploy();
  await riskEngine.waitForDeployment();
  console.log("RiskEngine deployed to:", await riskEngine.getAddress());

  // Deploy CollateralVault
  const CollateralVault = await ethers.getContractFactory("CollateralVault");
  const vault = await CollateralVault.deploy(await riskEngine.getAddress());
  await vault.waitForDeployment();
  console.log("CollateralVault deployed to:", await vault.getAddress());

  // Deploy PredictionMarket
  const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
  const predictionMarket = await PredictionMarket.deploy(await vault.getAddress());
  await predictionMarket.waitForDeployment();
  console.log("PredictionMarket deployed to:", await predictionMarket.getAddress());

  // Deploy OmniAMM
  const OmniAMM = await ethers.getContractFactory("OmniAMM");
  const amm = await OmniAMM.deploy();
  await amm.waitForDeployment();
  console.log("OmniAMM deployed to:", await amm.getAddress());

  // Deploy Launchpad
  const Launchpad = await ethers.getContractFactory("Launchpad");
  const launchpad = await Launchpad.deploy(await amm.getAddress());
  await launchpad.waitForDeployment();
  console.log("Launchpad deployed to:", await launchpad.getAddress());

  // Deploy Mock Tokens
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const usdt = await MockERC20.deploy("Mock USDT", "USDT", 1000000);
  await usdt.waitForDeployment();
  console.log("Mock USDT deployed to:", await usdt.getAddress());

  console.log("\n=== Deployment Summary ===");
  console.log("RiskEngine:", await riskEngine.getAddress());
  console.log("CollateralVault:", await vault.getAddress());
  console.log("PredictionMarket:", await predictionMarket.getAddress());
  console.log("OmniAMM:", await amm.getAddress());
  console.log("Launchpad:", await launchpad.getAddress());
  console.log("Mock USDT:", await usdt.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
