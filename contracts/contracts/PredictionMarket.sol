// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PredictionMarket {
    struct Market {
        string question;
        uint256 endTime;
        bool resolved;
        bool outcome; // true = YES wins
    }

    Market[] public markets;

    mapping(uint256 => mapping(address => uint256)) public yesBets;
    mapping(uint256 => mapping(address => uint256)) public noBets;

    address public admin;

    // Kept to not break deployment scripts
    address public vault;

    event MarketCreated(uint256 indexed marketId, string question, uint256 endTime);
    event BetPlaced(uint256 indexed marketId, address indexed user, bool isYes, uint256 amount);
    event MarketFunded(uint256 indexed marketId, uint256 amount);
    event MarketResolved(uint256 indexed marketId, bool outcome);
    event Claimed(uint256 indexed marketId, address indexed user, uint256 payout);

    constructor(address _vault) {
        admin = msg.sender;
        vault = _vault;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    function createMarket(string memory question, uint256 duration) external onlyAdmin returns (uint256) {
        uint256 marketId = markets.length;
        markets.push(Market({
            question: question,
            endTime: block.timestamp + duration,
            resolved: false,
            outcome: false
        }));
        emit MarketCreated(marketId, question, block.timestamp + duration);
        return marketId;
    }

    // Admin funds liquidity so winners can be paid 2x
    function fundMarket(uint256 marketId) external payable onlyAdmin {
        require(marketId < markets.length, "Invalid market");
        emit MarketFunded(marketId, msg.value);
    }

    function buyYes(uint256 marketId) external payable {
        require(marketId < markets.length, "Invalid market");
        Market storage market = markets[marketId];
        require(block.timestamp < market.endTime, "Market ended");
        require(!market.resolved, "Market already resolved");
        
        yesBets[marketId][msg.sender] += msg.value;
        emit BetPlaced(marketId, msg.sender, true, msg.value);
    }

    function buyNo(uint256 marketId) external payable {
        require(marketId < markets.length, "Invalid market");
        Market storage market = markets[marketId];
        require(block.timestamp < market.endTime, "Market ended");
        require(!market.resolved, "Market already resolved");

        noBets[marketId][msg.sender] += msg.value;
        emit BetPlaced(marketId, msg.sender, false, msg.value);
    }

    function resolveMarket(uint256 marketId, bool outcome) external onlyAdmin {
        require(marketId < markets.length, "Invalid market");
        Market storage market = markets[marketId];
        require(!market.resolved, "Already resolved");
        
        market.resolved = true;
        market.outcome = outcome;
        emit MarketResolved(marketId, outcome);
    }

    function claim(uint256 marketId) external {
        require(marketId < markets.length, "Invalid market");
        Market storage market = markets[marketId];
        require(market.resolved, "Market not resolved yet");

        uint256 payout = 0;

        if (market.outcome == true) { // YES wins
            uint256 bet = yesBets[marketId][msg.sender];
            require(bet > 0, "No winning bet");
            yesBets[marketId][msg.sender] = 0; // Prevent double claiming
            payout = bet * 2;
        } else { // NO wins
            uint256 bet = noBets[marketId][msg.sender];
            require(bet > 0, "No winning bet");
            noBets[marketId][msg.sender] = 0; // Prevent double claiming
            payout = bet * 2;
        }

        require(address(this).balance >= payout, "Insufficient liquidity");
        payable(msg.sender).transfer(payout);
        emit Claimed(marketId, msg.sender, payout);
    }

    // To allow receiving BNB directly
    receive() external payable {}
}
