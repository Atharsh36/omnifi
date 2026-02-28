// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Launchpad {
    struct Project {
        address creator;
        address token;
        uint256 targetAmount;
        uint256 raisedAmount;
        uint256 tokenPrice;
        uint256 startTime;
        uint256 endTime;
        uint256 liquidityUnlockTime;
        bool liquidityAdded;
        bool cancelled;
    }

    mapping(uint256 => Project) public projects;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    uint256 public projectCount;
    address public ammRouter;

    event ProjectCreated(uint256 indexed projectId, address indexed creator, address token, uint256 target);
    event Contributed(uint256 indexed projectId, address indexed user, uint256 amount);
    event LiquidityAdded(uint256 indexed projectId, uint256 tokenAmount, uint256 bnbAmount);
    event TokensClaimed(uint256 indexed projectId, address indexed user, uint256 amount);

    constructor(address _ammRouter) {
        ammRouter = _ammRouter;
    }

    function createProject(
        address token,
        uint256 targetAmount,
        uint256 tokenPrice,
        uint256 duration,
        uint256 lockDuration
    ) external returns (uint256) {
        uint256 projectId = projectCount++;
        projects[projectId] = Project({
            creator: msg.sender,
            token: token,
            targetAmount: targetAmount,
            raisedAmount: 0,
            tokenPrice: tokenPrice,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            liquidityUnlockTime: block.timestamp + duration + lockDuration,
            liquidityAdded: false,
            cancelled: false
        });
        emit ProjectCreated(projectId, msg.sender, token, targetAmount);
        return projectId;
    }

    function contribute(uint256 projectId) external payable {
        Project storage project = projects[projectId];
        require(block.timestamp >= project.startTime && block.timestamp <= project.endTime, "Not active");
        require(!project.cancelled, "Cancelled");
        require(project.raisedAmount + msg.value <= project.targetAmount, "Target exceeded");
        
        project.raisedAmount += msg.value;
        contributions[projectId][msg.sender] += msg.value;
        emit Contributed(projectId, msg.sender, msg.value);
    }

    function addLiquidity(uint256 projectId) external {
        Project storage project = projects[projectId];
        require(msg.sender == project.creator, "Only creator");
        require(block.timestamp > project.endTime, "Not ended");
        require(!project.liquidityAdded, "Already added");
        require(project.raisedAmount >= project.targetAmount / 2, "Minimum not reached");
        
        project.liquidityAdded = true;
        uint256 liquidityBNB = project.raisedAmount / 2;
        uint256 liquidityTokens = (liquidityBNB * 1e18) / project.tokenPrice;
        
        emit LiquidityAdded(projectId, liquidityTokens, liquidityBNB);
    }

    function claimTokens(uint256 projectId) external {
        Project storage project = projects[projectId];
        require(project.liquidityAdded, "Liquidity not added");
        uint256 contribution = contributions[projectId][msg.sender];
        require(contribution > 0, "No contribution");
        
        uint256 tokenAmount = (contribution * 1e18) / project.tokenPrice;
        contributions[projectId][msg.sender] = 0;
        
        IERC20(project.token).transfer(msg.sender, tokenAmount);
        emit TokensClaimed(projectId, msg.sender, tokenAmount);
    }

    function refund(uint256 projectId) external {
        Project storage project = projects[projectId];
        require(block.timestamp > project.endTime, "Not ended");
        require(!project.liquidityAdded, "Liquidity added");
        uint256 contribution = contributions[projectId][msg.sender];
        require(contribution > 0, "No contribution");
        
        contributions[projectId][msg.sender] = 0;
        payable(msg.sender).transfer(contribution);
    }

    function getProjectProgress(uint256 projectId) external view returns (uint256) {
        Project memory project = projects[projectId];
        return (project.raisedAmount * 100) / project.targetAmount;
    }
}
