import { ethers } from "hardhat";

async function main() {
  const riskEngineAddress = "YOUR_RISK_ENGINE_ADDRESS";
  const userAddress = "USER_ADDRESS";
  const creditScore = 750;

  const RiskEngine = await ethers.getContractAt("RiskEngine", riskEngineAddress);
  
  console.log(`Updating credit score for ${userAddress} to ${creditScore}`);
  const tx = await RiskEngine.updateCreditScore(userAddress, creditScore);
  await tx.wait();
  
  console.log("Credit score updated successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
