// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LiquidityLockerPLU is Ownable {
    IERC20 public lpToken;
    uint256 public lockedAmount;
    uint256 public unlockStartTime;
    uint256 public unlockEndTime;
    uint256 public releasedAmount;
    
    constructor(address _lpToken, uint256 _unlockStartTime, uint256 _duration) Ownable(msg.sender) {
        lpToken = IERC20(_lpToken);
        unlockStartTime = _unlockStartTime;
        unlockEndTime = _unlockStartTime + _duration;
    }
    
    function releaseLiquidity() external onlyOwner {
        require(block.timestamp > unlockStartTime, "Unlock period has not started");
        
        uint256 totalLocks = lpToken.balanceOf(address(this)) + releasedAmount;
        uint256 vestedAmount = _calculateVestedAmount(totalLocks);
        uint256 unreleased = vestedAmount - releasedAmount;
        
        require(unreleased > 0, "No tokens to release");
        
        releasedAmount += unreleased;
        require(lpToken.transfer(owner(), unreleased), "Transfer failed");
    }
    
    function _calculateVestedAmount(uint256 totalLock) internal view returns (uint256) {
        if (block.timestamp >= unlockEndTime) {
            return totalLock;
        } else {
            return (totalLock * (block.timestamp - unlockStartTime)) / (unlockEndTime - unlockStartTime);
        }
    }
}
