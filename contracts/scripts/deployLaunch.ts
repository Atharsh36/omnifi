import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying LaunchpadFactory with account:", deployer.address);

    // PancakeSwap V2 Router (Standard BSC Testnet: 0xD99D1c33F9fC3444f8101754aBC46c52416550D1 or 0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3)
    // We'll use the standard one usually active on BSC Testnet. 0xD99D1c33F9fC3444f8101754aBC46c52416550D1
    const pancakeRouterAddress = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1";

    const Factory = await ethers.getContractFactory("LaunchpadFactory");
    const factory = await Factory.deploy(pancakeRouterAddress);

    await factory.waitForDeployment();

    console.log("LaunchpadFactory deployed to:", await factory.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
