export const fetchExternalPrice = (marketId: number, localYesPrice: number) => {
    // Logic: externalPrice = localPrice + random(-0.08 to +0.08)
    const drift = (Math.random() * 0.16) - 0.08;
    let externalYesPrice = localYesPrice + drift;

    // Keep prices between 0 and 1
    externalYesPrice = Math.max(0.01, Math.min(0.99, externalYesPrice));
    const externalNoPrice = 1 - externalYesPrice;

    return {
        externalYesPrice,
        externalNoPrice
    };
};
