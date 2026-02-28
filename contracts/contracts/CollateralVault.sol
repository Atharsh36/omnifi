// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CollateralVault {
    struct Position {
        uint256 collateral;
        uint256 borrowed;
        uint256 creditScore;
    }

    mapping(address => Position) public positions;
    address public riskEngine;
    uint256 public constant COLLATERAL_RATIO = 150;
    uint256 public constant LIQUIDATION_THRESHOLD = 120;

    event Deposited(address indexed user, uint256 amount);
    event Borrowed(address indexed user, uint256 amount);
    event Repaid(address indexed user, uint256 amount);
    event Liquidated(address indexed user, uint256 collateral, uint256 debt);

    constructor(address _riskEngine) {
        riskEngine = _riskEngine;
    }

    function deposit() external payable {
        positions[msg.sender].collateral += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    function borrow(uint256 amount) external {
        Position storage pos = positions[msg.sender];
        uint256 maxBorrow = (pos.collateral * 100) / COLLATERAL_RATIO;
        require(pos.borrowed + amount <= maxBorrow, "Insufficient collateral");
        pos.borrowed += amount;
        payable(msg.sender).transfer(amount);
        emit Borrowed(msg.sender, amount);
    }

    function repay() external payable {
        Position storage pos = positions[msg.sender];
        require(msg.value <= pos.borrowed, "Overpayment");
        pos.borrowed -= msg.value;
        emit Repaid(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        Position storage pos = positions[msg.sender];
        uint256 required = (pos.borrowed * COLLATERAL_RATIO) / 100;
        require(pos.collateral - amount >= required, "Would break collateral ratio");
        pos.collateral -= amount;
        payable(msg.sender).transfer(amount);
    }

    function liquidate(address user) external {
        Position storage pos = positions[user];
        uint256 healthFactor = getHealthFactor(user);
        require(healthFactor < LIQUIDATION_THRESHOLD, "Position healthy");
        uint256 debt = pos.borrowed;
        uint256 collateral = pos.collateral;
        pos.borrowed = 0;
        pos.collateral = 0;
        payable(msg.sender).transfer(collateral);
        emit Liquidated(user, collateral, debt);
    }

    function getHealthFactor(address user) public view returns (uint256) {
        Position memory pos = positions[user];
        if (pos.borrowed == 0) return type(uint256).max;
        return (pos.collateral * 100) / pos.borrowed;
    }

    function getMaxBorrow(address user) public view returns (uint256) {
        Position memory pos = positions[user];
        uint256 maxBorrow = (pos.collateral * 100) / COLLATERAL_RATIO;
        return maxBorrow > pos.borrowed ? maxBorrow - pos.borrowed : 0;
    }

    function updateCreditScore(address user, uint256 score) external {
        require(msg.sender == riskEngine, "Only risk engine");
        positions[user].creditScore = score;
    }
}
