import dotenv from 'dotenv';

dotenv.config();

export const settings = {
    rpcUrl: process.env.RPC_URL || 'https://bsc-testnet-rpc.publicnode.com',
    privateKey: process.env.PRIVATE_KEY || '',
    contractAddress: process.env.CONTRACT_ADDRESS || '',
    botTradeAmount: parseFloat(process.env.BOT_TRADE_AMOUNT || '0.0001'),
    arbitrageThreshold: parseFloat(process.env.ARBITRAGE_THRESHOLD || '0.005'),
    confidenceThreshold: parseInt(process.env.CONFIDENCE_THRESHOLD || '70'),
    scanIntervalSeconds: parseInt(process.env.SCAN_INTERVAL_SECONDS || '30'),
    maxTradesPerDay: parseInt(process.env.MAX_TRADES_PER_DAY || '50'),
    activeUserAddress: null as string | null,
};

export const updateSettings = (newSettings: Partial<typeof settings>) => {
    Object.assign(settings, newSettings);
};
