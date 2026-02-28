// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./LiquidityLockerPLU.sol";
import "./OmniToken.sol";

interface IPancakeRouter02 {
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    
    function factory() external pure returns (address);
    function WETH() external pure returns (address);
}

interface IPancakeFactory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}

contract LaunchpadSale {
    address public creator;
    OmniToken public token;
    
    uint256 public tokenPriceBNB;
    uint256 public softCap;
    uint256 public hardCap;
    uint256 public saleStart;
    uint256 public saleEnd;
    uint256 public liquidityPercent;
    
    uint256 public totalRaisedBNB;
    bool public saleFinalized;
    bool public enableRefunds;
    bool public liquidityAdded;
    
    mapping(address => uint256) public investedBNB;
    mapping(address => uint256) public purchasedTokens;
    
    IPancakeRouter02 public pancakeRouter;
    LiquidityLockerPLU public pluLocker;
    
    string public name;
    string public symbol;
    
    event TokensPurchased(address indexed buyer, uint256 bnbAmount, uint256 tokenAmount);
    event SaleFinalized(bool success, uint256 totalRaised);
    event LiquidityAdded(uint256 bnbAmount, uint256 tokenAmount, address locker);
    event TokensClaimed(address indexed buyer, uint256 amount);
    event RefundClaimed(address indexed buyer, uint256 amount);

    constructor(
        address _creator,
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        uint256 _tokenPriceBNB,
        uint256 _softCap,
        uint256 _hardCap,
        uint256 _saleStart,
        uint256 _saleEnd,
        uint256 _liquidityPercent,
        address _pancakeRouter
    ) {
        creator = _creator;
        name = _name;
        symbol = _symbol;
        tokenPriceBNB = _tokenPriceBNB;
        softCap = _softCap;
        hardCap = _hardCap;
        saleStart = _saleStart;
        saleEnd = _saleEnd;
        liquidityPercent = _liquidityPercent;
        pancakeRouter = IPancakeRouter02(_pancakeRouter);
        
        token = new OmniToken(_name, _symbol, _totalSupply, address(this));
    }
    
    function buyTokens() external payable {
        require(block.timestamp >= saleStart && block.timestamp <= saleEnd, "Sale is not active");
        require(!saleFinalized, "Sale already finalized");
        require(totalRaisedBNB + msg.value <= hardCap, "Hard cap exceeded");
        require(msg.value > 0, "Must invest BNB");
        
        uint256 tokenAmount = (msg.value * 1e18) / tokenPriceBNB;
        
        investedBNB[msg.sender] += msg.value;
        purchasedTokens[msg.sender] += tokenAmount;
        totalRaisedBNB += msg.value;
        
        emit TokensPurchased(msg.sender, msg.value, tokenAmount);
    }
    
    function finalizeSale() external {
        require(block.timestamp > saleEnd || totalRaisedBNB == hardCap, "Sale not ended yet");
        require(!saleFinalized, "Already finalized");
        require(msg.sender == creator || msg.sender == address(this), "Not creator");
        
        saleFinalized = true;
        
        if (totalRaisedBNB < softCap) {
            enableRefunds = true;
            emit SaleFinalized(false, totalRaisedBNB);
        } else {
            _addLiquidity();
            emit SaleFinalized(true, totalRaisedBNB);
        }
    }
    
    function _addLiquidity() internal {
        uint256 liquidityBNB = (totalRaisedBNB * liquidityPercent) / 100;
        uint256 tokensForLiquidity = (liquidityBNB * 1e18) / tokenPriceBNB;
        
        token.approve(address(pancakeRouter), tokensForLiquidity);
        
        (, , uint liquidity) = pancakeRouter.addLiquidityETH{value: liquidityBNB}(
            address(token),
            tokensForLiquidity,
            0,
            0,
            address(this),
            block.timestamp + 15 minutes
        );
        
        liquidityAdded = true;
        
        address factory = pancakeRouter.factory();
        address pair = IPancakeFactory(factory).getPair(address(token), pancakeRouter.WETH());
        
        pluLocker = new LiquidityLockerPLU(
            pair,
            block.timestamp,
            180 days
        );
        
        IERC20(pair).transfer(address(pluLocker), liquidity);
        pluLocker.transferOwnership(creator);
        
        uint256 remainingBNB = address(this).balance;
        if (remainingBNB > 0) {
            payable(creator).transfer(remainingBNB);
        }
        
        uint256 remainingTokens = token.balanceOf(address(this)) - _totalPurchasedTokens();
        if (remainingTokens > 0) {
             token.transfer(creator, remainingTokens);
        }
        
        emit LiquidityAdded(liquidityBNB, tokensForLiquidity, address(pluLocker));
    }
    
    function _totalPurchasedTokens() internal view returns (uint256) {
        return (totalRaisedBNB * 1e18) / tokenPriceBNB;
    }
    
    function claimTokens() external {
        require(saleFinalized && !enableRefunds, "Sale not successful");
        require(liquidityAdded, "Liquidity not added yet");
        
        uint256 amount = purchasedTokens[msg.sender];
        require(amount > 0, "No tokens to claim");
        
        purchasedTokens[msg.sender] = 0;
        token.transfer(msg.sender, amount);
        
        emit TokensClaimed(msg.sender, amount);
    }
    
    function claimRefund() external {
        require(saleFinalized && enableRefunds, "Refunds not enabled");
        
        uint256 amountBNB = investedBNB[msg.sender];
        require(amountBNB > 0, "No BNB to refund");
        
        investedBNB[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: amountBNB}("");
        require(success, "Refund failed");
        
        emit RefundClaimed(msg.sender, amountBNB);
    }
    
    receive() external payable {}
}
