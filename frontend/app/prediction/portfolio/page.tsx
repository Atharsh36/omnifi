'use client';
import Link from 'next/link';
import PredictionNav from '@/components/prediction/PredictionNav';
import { usePredictionStore } from '@/store/usePredictionStore';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useState, useEffect } from 'react';

export default function PortfolioPage() {
    const { address, isConnected } = useWeb3ModalAccount();
    const { trades, markets, users, withdrawFromVault } = usePredictionStore();

    // Normalize address
    const normalizedAddress = address?.toLowerCase() || '';
    const userBalance = users[normalizedAddress]?.balance || 0;
    const vaultAddress = users[normalizedAddress]?.depositAddress || '';

    const [holdings, setHoldings] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [agentLogs, setAgentLogs] = useState<any[]>([]);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [metrics, setMetrics] = useState({
        totalValue: 0,
        totalPnL: 0,
        activePositions: 0,
        claimableRewards: 0
    });

    useEffect(() => {
        if (!isConnected || !normalizedAddress) {
            setHoldings([]);
            setHistory([]);
            setAgentLogs([]);
            setMetrics({ totalValue: 0, totalPnL: 0, activePositions: 0, claimableRewards: 0 });
            return;
        }

        const fetchAgentActivity = async () => {
            try {
                // Poll the live vault balance
                const { syncBalanceFromChain } = usePredictionStore.getState();
                await syncBalanceFromChain(normalizedAddress);

                // Fetch Agent Logs
                const res = await fetch('http://localhost:3001/api/arbitrage/logs');
                const data = await res.json();
                if (data.success && data.data) {
                    setAgentLogs(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch live data for portfolio", err);
            }
        };

        fetchAgentActivity();
        const interval = setInterval(fetchAgentActivity, 5000); // Live poll balance and agent logs
        return () => clearInterval(interval);

    }, [address, isConnected, normalizedAddress]);

    // Live Aggregation Effect (Dependencies include both direct trades and polled agent logs)
    useEffect(() => {
        if (!isConnected || !normalizedAddress) return;

        // 1. Combine regular user trades + bot trades for mapping
        const manualUserTrades = trades.filter(t => t.user.toLowerCase() === normalizedAddress);

        // Convert bot logs into a Trade-like format
        const botUserTrades = agentLogs
            .filter(log => log.user === normalizedAddress)
            .map(log => {
                const mkt = markets.find(m => m.id === log.marketId);
                return {
                    id: `bot-${log.id}`,
                    action: 'Agent execution',
                    marketQ: mkt ? mkt.question : `Market #${log.marketId}`,
                    position: log.sideToBuy,
                    amount: log.amount,
                    timestamp: log.timestamp,
                    type: 'Trade',
                    profit: parseFloat(log.profit) || 0
                };
            });

        // 2. Calculate History
        const formattedManualHistory = manualUserTrades.map((t, idx) => ({
            id: t.id || `manual-${idx}`,
            action: t.type === 'Payout' ? 'Claim' : t.type === 'Loss' ? 'Loss' : 'Buy',
            market: t.marketQ,
            side: t.position,
            amount: t.amount.toFixed(4) + ' BNB',
            date: t.timestamp
        }));

        const formattedBotHistory = botUserTrades.map(t => ({
            id: t.id,
            action: 'Bot execution',
            market: t.marketQ,
            side: t.position,
            amount: t.amount.toFixed(4) + ' BNB',
            date: new Date(t.timestamp).toLocaleString()
        }));

        setHistory([...formattedBotHistory, ...formattedManualHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

        // 3. Aggregate Active Holdings
        const activeTrades = [...manualUserTrades.filter(t => !t.type || t.type === 'Trade'), ...botUserTrades];

        const holdingsMap = new Map();
        activeTrades.forEach(t => {
            const key = `${t.marketQ}-${t.position}`;
            if (!holdingsMap.has(key)) {
                // Find matching market definition
                const mkt = markets.find(m => m.question === t.marketQ);
                holdingsMap.set(key, {
                    marketQ: t.marketQ,
                    side: t.position,
                    totalInvested: 0,
                    totalBotProfits: 0,
                    status: mkt?.status || 'Unknown',
                    resolved: mkt?.resolved || false,
                    won: mkt?.outcome === true && t.position === 'YES' || mkt?.outcome === false && t.position === 'NO'
                });
            }
            holdingsMap.get(key).totalInvested += t.amount;
            if ((t as any).profit) {
                holdingsMap.get(key).totalBotProfits += (t as any).profit;
            }
        });

        // Calculate dynamic values for rendering
        let tv = userBalance; // Start Total Value with liquid deposit balance
        let activePosCount = 0;
        let claimable = 0;
        let totalHoldingsCost = 0;

        const computedHoldings = Array.from(holdingsMap.values()).map((h: any, idx) => {
            let pnlStr = '';
            let estValue = 0;
            let displayStatus = 'Active';

            if (h.status === 'Open') {
                activePosCount++;
                totalHoldingsCost += h.totalInvested;
                // Mock active fluctuations for demo: +/- 15% range from average
                const mockFluctuation = (Math.random() * 0.3) - 0.15;
                estValue = h.totalInvested * (1 + mockFluctuation) + (h.totalBotProfits || 0);
                tv += estValue; // Add live holdings to total value

                const percentDiff = ((estValue - h.totalInvested) / h.totalInvested) * 100;
                pnlStr = `${percentDiff >= 0 ? '+' : ''}${percentDiff.toFixed(1)}%`;

            } else if (h.status === 'Resolved') {
                if (h.won) {
                    displayStatus = 'Claimable';
                    estValue = h.totalInvested * 2; // Fixed 2x payout metric
                    claimable += estValue;
                    tv += estValue; // Add claimable winnings to total value
                    pnlStr = '+100.0%';
                } else {
                    displayStatus = 'Lost';
                    estValue = 0;
                    pnlStr = '-100.0%';
                }
            }

            return {
                id: idx,
                market: h.marketQ,
                side: h.side,
                tokens: (h.totalInvested * 100).toFixed(0), // Mock token amount based on bet size
                value: estValue.toFixed(4),
                cost: h.totalInvested,
                pnl: pnlStr,
                status: displayStatus
            };
        }).filter(h => h.status !== 'Lost'); // Hide completely resolved dead bets from holdings

        setHoldings(computedHoldings);

        // Global PnL: Total Current Value + Claimable - Original Total Cost
        const overallPnL = tv - userBalance - totalHoldingsCost;

        setMetrics({
            totalValue: tv,
            totalPnL: overallPnL,
            activePositions: activePosCount,
            claimableRewards: claimable
        });

    }, [trades, markets, userBalance, normalizedAddress, agentLogs, isConnected]);

    return (
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-8">
            {/* Top Navbar */}
            <PredictionNav />

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Overview Cards */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-background-dark border border-white/5 rounded-2xl p-6 relative">
                        <h3 className="text-slate-500 text-sm font-medium mb-2">Vault Balance + Portfolio</h3>
                        <div className="text-3xl font-bold text-white mb-4">{metrics.totalValue.toFixed(4)} BNB</div>
                        <div className="text-xs text-slate-400 mb-4 bg-white/5 p-2 rounded-lg inline-block">Liquid Vault: {userBalance.toFixed(4)} BNB</div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => alert(`Please send BNB to your Vault Address: ${vaultAddress}`)}
                                className="text-xs bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg transition font-medium"
                            >
                                Deposit
                            </button>
                            <button
                                onClick={() => setShowWithdraw(!showWithdraw)}
                                className="text-xs bg-primary/20 text-primary hover:bg-primary/30 px-3 py-1.5 rounded-lg transition font-medium"
                            >
                                Withdraw
                            </button>
                        </div>

                        {showWithdraw && (
                            <div className="absolute top-full left-0 mt-2 w-full bg-white/5 border border-white/10 rounded-xl p-4 shadow-xl z-10">
                                <label className="block text-xs font-medium text-slate-400 mb-1">Amount to Withdraw (BNB)</label>
                                <input
                                    type="number"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-background-dark border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none mb-3"
                                />
                                <div className="flex justify-between items-center text-xs text-slate-400 mb-3">
                                    <span>Max: {userBalance.toFixed(4)} BNB</span>
                                    <button onClick={() => setWithdrawAmount(userBalance.toString())} className="text-primary hover:underline">MAX</button>
                                </div>
                                <button
                                    onClick={async () => {
                                        if (!withdrawAmount || isNaN(Number(withdrawAmount))) return;
                                        setWithdrawLoading(true);
                                        await withdrawFromVault(address!, Number(withdrawAmount));
                                        setWithdrawLoading(false);
                                        setShowWithdraw(false);
                                        setWithdrawAmount('');
                                    }}
                                    disabled={withdrawLoading}
                                    className="w-full text-sm bg-primary hover:bg-primary text-white py-2 rounded-lg transition font-medium disabled:opacity-50"
                                >
                                    {withdrawLoading ? 'Processing...' : 'Confirm Withdrawal'}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="bg-background-dark border border-white/5 rounded-2xl p-6">
                        <h3 className="text-slate-500 text-sm font-medium mb-2">Total Est. Profit / Loss</h3>
                        <div className={`text-3xl font-bold ${metrics.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {metrics.totalPnL >= 0 ? '+' : ''}{metrics.totalPnL.toFixed(4)} BNB
                        </div>
                    </div>
                    <div className="bg-background-dark border border-white/5 rounded-2xl p-6">
                        <h3 className="text-slate-500 text-sm font-medium mb-2">Active Target Positions</h3>
                        <div className="text-3xl font-bold text-white">{metrics.activePositions}</div>
                    </div>
                    <div className="bg-background-dark border border-white/5 rounded-2xl p-6 border-l-4 border-l-blue-500">
                        <h3 className="text-slate-500 text-sm font-medium mb-2">Claimable Rewards</h3>
                        <div className="text-3xl font-bold text-primary mb-2">{metrics.claimableRewards.toFixed(4)} BNB</div>
                        <button
                            className="text-sm bg-primary hover:bg-primary text-white px-4 py-1.5 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={metrics.claimableRewards <= 0}
                        >
                            Claim All
                        </button>
                    </div>
                </div>

                {/* Holdings */}
                <div className="lg:col-span-2 bg-background-dark border border-white/5 rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-6">Current Holdings</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-500 border-b border-white/5">
                                    <th className="pb-3 font-medium">Market</th>
                                    <th className="pb-3 font-medium">Position</th>
                                    <th className="pb-3 font-medium">Tokens</th>
                                    <th className="pb-3 font-medium">Est. Value</th>
                                    <th className="pb-3 font-medium">PnL</th>
                                    <th className="pb-3 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {holdings.length > 0 ? holdings.map(h => (
                                    <tr key={h.id}>
                                        <td className="py-4 text-sm font-medium max-w-[200px] truncate pr-4" title={h.market}>{h.market}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${h.side === 'YES' ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                                                {h.side}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm">{h.tokens}</td>
                                        <td className="py-4 text-sm">{h.value} BNB</td>
                                        <td className={`py-4 text-sm font-medium ${h.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{h.pnl}</td>
                                        <td className="py-4">
                                            {h.status === 'Claimable' ? (
                                                <button className="text-xs font-bold bg-primary hover:bg-primary px-3 py-1.5 rounded-lg text-white transition">Claim</button>
                                            ) : (
                                                <button className="text-xs font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-white transition">Sell</button>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                                            {isConnected ? "No active positions found in your portfolio." : "Connect wallet to view portfolio."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* History */}
                <div className="lg:col-span-1 bg-background-dark border border-white/5 rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-6">Transaction History</h2>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {history.length > 0 ? history.map(item => (
                            <div key={item.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                <div className="flex justify-between mb-1">
                                    <span className="font-semibold text-sm">
                                        {item.action === 'Buy' ? 'Bought' : item.action} <span className={item.side === 'YES' ? 'text-green-500' : 'text-red-500'}>{item.side}</span>
                                    </span>
                                    <span className={`text-sm font-medium ${item.action === 'Loss' ? 'text-red-400' : item.action === 'Claim' ? 'text-primary' : 'text-gray-300'}`}>{item.amount}</span>
                                </div>
                                <div className="text-xs text-slate-400 truncate w-full mb-2">{item.market}</div>
                                <div className="text-xs text-gray-600">{item.date}</div>
                            </div>
                        )) : (
                            <div className="text-center text-slate-500 text-sm py-4">
                                {isConnected ? "No recent transaction history." : "-"}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
