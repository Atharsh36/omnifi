// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RiskEngine {
    mapping(address => uint256) public creditScores;
    mapping(address => bool) public authorized;
    address public owner;

    event CreditScoreUpdated(address indexed user, uint256 score);

    constructor() {
        owner = msg.sender;
        authorized[msg.sender] = true;
    }

    modifier onlyAuthorized() {
        require(authorized[msg.sender], "Not authorized");
        _;
    }

    function authorize(address account) external {
        require(msg.sender == owner, "Only owner");
        authorized[account] = true;
    }

    function updateCreditScore(address user, uint256 score) external onlyAuthorized {
        require(score <= 1000, "Score too high");
        creditScores[user] = score;
        emit CreditScoreUpdated(user, score);
    }

    function getCreditScore(address user) external view returns (uint256) {
        return creditScores[user];
    }

    function getCreditMultiplier(address user) external view returns (uint256) {
        uint256 score = creditScores[user];
        if (score >= 800) return 150;
        if (score >= 600) return 125;
        if (score >= 400) return 110;
        return 100;
    }
}
