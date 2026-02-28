// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LaunchpadSale.sol";

contract LaunchpadFactory {
    address[] public allLaunches;
    address public pancakeRouter;
    
    event LaunchCreated(address indexed creator, address launchpadSale, address token);
    
    constructor(address _pancakeRouter) {
        pancakeRouter = _pancakeRouter;
    }
    
    function createLaunch(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        uint256 tokenPriceBNB,
        uint256 softCap,
        uint256 hardCap,
        uint256 saleStart,
        uint256 saleEnd,
        uint256 liquidityPercent
    ) external returns (address) {
        require(liquidityPercent > 0 && liquidityPercent <= 100, "Invalid liquidity%");
        require(softCap > 0 && hardCap >= softCap, "Invalid caps");
        require(saleEnd > saleStart, "Invalid time");

        LaunchpadSale newSale = new LaunchpadSale(
            msg.sender,
            name,
            symbol,
            totalSupply,
            tokenPriceBNB,
            softCap,
            hardCap,
            saleStart,
            saleEnd,
            liquidityPercent,
            pancakeRouter
        );
        
        allLaunches.push(address(newSale));
        emit LaunchCreated(msg.sender, address(newSale), address(newSale.token()));
        
        return address(newSale);
    }
    
    function getAllLaunches() external view returns (address[] memory) {
        return allLaunches;
    }
}
