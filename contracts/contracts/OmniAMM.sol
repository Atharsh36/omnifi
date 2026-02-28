// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OmniAMM {
    mapping(address => mapping(address => uint256)) public liquidity;
    mapping(address => mapping(address => uint256)) public reserves;
    
    event LiquidityAdded(address indexed tokenA, address indexed tokenB, uint256 amountA, uint256 amountB);
    event LiquidityRemoved(address indexed tokenA, address indexed tokenB, uint256 amountA, uint256 amountB);
    event Swapped(address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB
    ) external returns (uint256) {
        reserves[tokenA][tokenB] += amountA;
        reserves[tokenB][tokenA] += amountB;
        uint256 liquidityMinted = amountA + amountB;
        liquidity[tokenA][tokenB] += liquidityMinted;
        emit LiquidityAdded(tokenA, tokenB, amountA, amountB);
        return liquidityMinted;
    }

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidityAmount
    ) external returns (uint256, uint256) {
        uint256 totalLiquidity = liquidity[tokenA][tokenB];
        require(totalLiquidity > 0, "No liquidity");
        
        uint256 amountA = (reserves[tokenA][tokenB] * liquidityAmount) / totalLiquidity;
        uint256 amountB = (reserves[tokenB][tokenA] * liquidityAmount) / totalLiquidity;
        
        reserves[tokenA][tokenB] -= amountA;
        reserves[tokenB][tokenA] -= amountB;
        liquidity[tokenA][tokenB] -= liquidityAmount;
        
        emit LiquidityRemoved(tokenA, tokenB, amountA, amountB);
        return (amountA, amountB);
    }

    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external returns (uint256) {
        uint256 reserveIn = reserves[tokenIn][tokenOut];
        uint256 reserveOut = reserves[tokenOut][tokenIn];
        require(reserveIn > 0 && reserveOut > 0, "No liquidity");
        
        uint256 amountOut = (amountIn * reserveOut) / (reserveIn + amountIn);
        reserves[tokenIn][tokenOut] += amountIn;
        reserves[tokenOut][tokenIn] -= amountOut;
        
        emit Swapped(tokenIn, tokenOut, amountIn, amountOut);
        return amountOut;
    }

    function getAmountOut(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view returns (uint256) {
        uint256 reserveIn = reserves[tokenIn][tokenOut];
        uint256 reserveOut = reserves[tokenOut][tokenIn];
        if (reserveIn == 0 || reserveOut == 0) return 0;
        return (amountIn * reserveOut) / (reserveIn + amountIn);
    }
}
