import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserData {
    balance: number;
    depositAddress: string;
}

export interface Market {
    id: number;
    question: string;
    category: string;
    yesPool: number;
    noPool: number;
    volume: number;
    endTime: number;
    resolved: boolean;
    status: 'Open' | 'Closed' | 'Resolved';
    outcome?: boolean; // true = YES, false = NO
    icon?: string;
}

export interface Trade {
    id: string;
    user: string;
    marketQ: string;
    position: 'YES' | 'NO';
    amount: number;
    txHash: string;
    timestamp: string;
    type?: 'Trade' | 'Payout' | 'Loss';
}

interface PredictionStore {
    users: Record<string, UserData>;
    markets: Market[];
    trades: Trade[];
    initializeUser: (address: string) => Promise<void>;
    tradeFromUser: (address: string, amount: number) => Promise<boolean>;
    withdrawFromVault: (address: string, amount: number) => Promise<boolean>;
    syncBalanceFromChain: (address: string) => Promise<void>;
    addMarket: (market: Market) => void;
    updateMarket: (id: number, data: Partial<Market>) => void;
    addTrade: (trade: Trade) => void;
    resolveMarketAndDistribute: (marketId: number, outcome: boolean) => Promise<void>;
}

export const usePredictionStore = create<PredictionStore>()(
    persist(
        (set, get) => ({
            users: {},
            markets: [
                { id: 0, icon: '₿', category: 'Crypto', question: "Will BTC reach $100k before March?", yesPool: 15.2, noPool: 8.8, volume: 24.0, endTime: Date.now() + 5 * 24 * 60 * 60 * 1000, resolved: false, status: 'Open' },
                { id: 1, icon: '🏛️', category: 'Politics', question: "Will the current party win the next election?", yesPool: 12.1, noPool: 17.3, volume: 29.4, endTime: Date.now() + 90 * 24 * 60 * 60 * 1000, resolved: false, status: 'Open' },
                { id: 2, icon: '📈', category: 'Finance', question: "Will the Fed cut interest rates in Q2?", yesPool: 40.5, noPool: 14.2, volume: 54.7, endTime: Date.now() + 60 * 24 * 60 * 60 * 1000, resolved: false, status: 'Open' },
                { id: 3, icon: '🤖', category: 'Technology', question: "Will OpenAI release GPT-5 this year?", yesPool: 50.1, noPool: 5.3, volume: 55.4, endTime: Date.now() + 120 * 24 * 60 * 60 * 1000, resolved: false, status: 'Open' },
                { id: 4, icon: '🏏', category: 'Sports', question: "Will India win the next Cricket World Cup?", yesPool: 8.2, noPool: 6.8, volume: 15.0, endTime: Date.now() + 200 * 24 * 60 * 60 * 1000, resolved: false, status: 'Open' },
                { id: 5, icon: '🎬', category: 'Entertainment', question: "Will 'Dune: Part Two' win Best Picture?", yesPool: 2.5, noPool: 12.2, volume: 14.7, endTime: Date.now() + 10 * 24 * 60 * 60 * 1000, resolved: false, status: 'Open' },
                { id: 6, icon: '👽', category: 'Crypto', question: "Will the US confirm that aliens exist before 2027?", yesPool: 1.6, noPool: 8.4, volume: 8.0, endTime: Date.now() + 600 * 24 * 60 * 60 * 1000, resolved: false, status: 'Open' },
                { id: 7, icon: '📉', category: 'Finance', question: "S&P 500 (SPX) Opens Up or Down on February 25?", yesPool: 5.3, noPool: 4.7, volume: 22.0, endTime: Date.now() + 1 * 24 * 60 * 60 * 1000, resolved: false, status: 'Open' }
            ],
            trades: [
                { id: '1', user: '0x123...abc', marketQ: "Will BTC reach $100k before March?", position: 'YES', amount: 0.5, txHash: '0xabc...123', timestamp: '2 mins ago' },
                { id: '2', user: '0x456...def', marketQ: "Will the Fed cut interest rates in Q2?", position: 'NO', amount: 1.2, txHash: '0xdef...456', timestamp: '5 mins ago' },
                { id: '3', user: '0x789...ghi', marketQ: "Will BTC reach $100k before March?", position: 'YES', amount: 0.1, txHash: '0xghi...789', timestamp: '12 mins ago' },
            ],

            addMarket: (market) => set((state) => ({ markets: [...state.markets, market] })),
            updateMarket: (id, data) => set((state) => ({
                markets: state.markets.map(m => m.id === id ? { ...m, ...data } : m)
            })),
            addTrade: (trade) => set((state) => ({ trades: [trade, ...state.trades] })),

            resolveMarketAndDistribute: async (marketId: number, outcome: boolean) => {
                const state = get();
                const market = state.markets.find(m => m.id === marketId);
                if (!market || market.status === 'Resolved') return;

                // outcome: true = YES, false = NO
                const winningPosition = outcome ? 'YES' : 'NO';

                // Find all trades for this market to record resolutions
                const marketTrades = state.trades.filter(t => t.marketQ === market.question && (!t.type || t.type === 'Trade'));

                for (const trade of marketTrades) {
                    if (trade.position === winningPosition) {
                        const payout = trade.amount * 2; // 2X payout
                        try {
                            // Call backend to add balance
                            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vault/add-balance`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ userAddress: trade.user, amount: payout })
                            });
                            // sync balance from chain to update active user balance in UI if needed
                            await get().syncBalanceFromChain(trade.user);

                            // Explicitly Add this Payout to the Activity Ledger for the Admin
                            get().addTrade({
                                id: Math.random().toString(36).substr(2, 9),
                                user: trade.user,
                                marketQ: market.question,
                                position: trade.position,
                                amount: payout,
                                txHash: '0x' + Math.random().toString(16).substr(2, 64).padEnd(64, '0'), // mock tx hash
                                timestamp: 'Just now',
                                type: 'Payout'
                            });
                        } catch (e) {
                            console.error("Failed to distribute payout to", trade.user, e);
                        }
                    } else {
                        // Record the total loss of the wager in Activity Ledger
                        get().addTrade({
                            id: Math.random().toString(36).substr(2, 9),
                            user: trade.user,
                            marketQ: market.question,
                            position: trade.position,
                            amount: trade.amount,
                            txHash: '0x' + Math.random().toString(16).substr(2, 64).padEnd(64, '0'), // mock tx hash
                            timestamp: 'Just now',
                            type: 'Loss'
                        });
                    }
                }

                // Update market state globally
                get().updateMarket(marketId, { status: 'Resolved', resolved: true, outcome });
            },

            initializeUser: async (address) => {
                const normalizedAddress = address.toLowerCase();
                if (!normalizedAddress) return;

                try {
                    // Call backend to get or create custodial vault
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vault/get-or-create-vault`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ userAddress: normalizedAddress })
                    });

                    const data = await res.json();
                    if (data.vaultAddress) {
                        set((state) => ({
                            users: {
                                ...state.users,
                                [normalizedAddress]: {
                                    balance: state.users[normalizedAddress]?.balance || 0.0,
                                    depositAddress: data.vaultAddress
                                }
                            }
                        }));

                        // Now sync balance
                        await get().syncBalanceFromChain(normalizedAddress);
                    }
                } catch (e) {
                    console.error("Failed to initialize user vault:", e);
                }
            },

            tradeFromUser: async (address, amount) => {
                const normalizedAddress = address.toLowerCase();

                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vault/deduct`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ userAddress: normalizedAddress, amount })
                    });

                    const data = await res.json();
                    if (data.success) {
                        set((state) => ({
                            users: {
                                ...state.users,
                                [normalizedAddress]: {
                                    ...state.users[normalizedAddress],
                                    balance: data.balance // Use updated balance from backend
                                }
                            }
                        }));
                        return true;
                    }
                } catch (e) {
                    console.error("Trade failed on backend:", e);
                }
                return false;
            },

            withdrawFromVault: async (address, amount) => {
                const normalizedAddress = address.toLowerCase();

                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vault/withdraw`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ userAddress: normalizedAddress, amount })
                    });

                    const data = await res.json();
                    if (data.success) {
                        set((state) => ({
                            users: {
                                ...state.users,
                                [normalizedAddress]: {
                                    ...state.users[normalizedAddress],
                                    balance: data.balance
                                }
                            }
                        }));
                        alert(`Withdrawal successful! TX: ${data.txHash}`);
                        return true;
                    } else {
                        alert(data.error || "Withdrawal failed");
                    }
                } catch (e) {
                    console.error("Withdrawal failed on backend:", e);
                    alert("A network error occurred while withdrawing.");
                }
                return false;
            },

            syncBalanceFromChain: async (address) => {
                if (!address) return;
                const normalizedAddress = address.toLowerCase();

                try {
                    // Fetch balance from the backend system which is monitoring the vault
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vault/balance/${normalizedAddress}`);
                    const data = await res.json();

                    if (typeof data.balance === 'number') {
                        set((state) => ({
                            users: {
                                ...state.users,
                                [normalizedAddress]: {
                                    ...state.users[normalizedAddress],
                                    balance: data.balance
                                }
                            }
                        }));
                    }
                } catch (e) {
                    console.error("Failed to sync prediction balance from backend", e);
                }
            }
        }),
        {
            name: 'omnifi-prediction-storage', // name of the item in the storage (must be unique)
            partialize: (state) => ({ markets: state.markets, trades: state.trades, users: state.users }), // Only store these properties
        }
    ));
