export const calculateConfidence = (
    priceGap: number,
    yesPool: number,
    noPool: number,
    recentTradesCount: number
): number => {
    // Inputs: priceGap, yesPool, noPool, recentTradesCount
    let score = 0;

    const absPriceGap = Math.abs(priceGap);

    // Base score from gap (e.g. 5% gap -> score=50, 10% gap -> score=100)
    score += absPriceGap * 1000;

    // Liquidity Imbalance
    const totalPool = yesPool + noPool;
    if (totalPool > 0) {
        const imbalance = Math.abs(yesPool - noPool) / totalPool;
        // Reward lower imbalance or higher, depending on the strategy.
        // Let's add up to 20 points for high total pool size to ensure it's not a shallow market
        const poolSizeFactor = Math.min(20, totalPool);
        score += poolSizeFactor;

        // Small penalty if imbalance is too high (volatile market)
        if (imbalance > 0.8) score -= 10;
    }

    // Trade momentum (activity proxy)
    const momentumScore = Math.min(30, recentTradesCount * 2);
    score += momentumScore;

    // Output: confidenceScore (0–100)
    return Math.min(100, Math.max(0, Math.round(score)));
};
