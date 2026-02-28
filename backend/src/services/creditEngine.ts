export class CreditEngine {
  calculateScore(data: any): number {
    let score = 300; // Base score

    // Balance factor (max 200 points)
    if (data.balance > 10) score += 200;
    else if (data.balance > 5) score += 150;
    else if (data.balance > 1) score += 100;
    else if (data.balance > 0.1) score += 50;

    // Transaction count factor (max 200 points)
    if (data.transactionCount > 500) score += 200;
    else if (data.transactionCount > 200) score += 150;
    else if (data.transactionCount > 50) score += 100;
    else if (data.transactionCount > 10) score += 50;

    // Wallet age factor (max 200 points)
    if (data.walletAge > 365) score += 200;
    else if (data.walletAge > 180) score += 150;
    else if (data.walletAge > 90) score += 100;
    else if (data.walletAge > 30) score += 50;

    // Risk level factor (max 100 points)
    if (data.riskLevel === 'low') score += 100;
    else if (data.riskLevel === 'medium') score += 50;

    // Cap at 1000
    return Math.min(score, 1000);
  }

  getCreditMultiplier(score: number): number {
    if (score >= 800) return 1.5;
    if (score >= 600) return 1.25;
    if (score >= 400) return 1.1;
    return 1.0;
  }
}
