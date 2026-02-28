'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { usePredictionStore } from '@/store/usePredictionStore';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import TradePanel from '@/components/prediction/TradePanel';

const RealLineChart = ({ yesPercent, noPercent }: { yesPercent: number, noPercent: number }) => {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const arr = [];
        const steps = 150;
        let currentYes = 0;
        let currentNo = 0;
        const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

        for (let i = 0; i <= steps; i++) {
            const interval = Math.floor(steps / (months.length - 1));
            const timeLabel = (i % interval === 0 && i < steps) ? months[Math.floor(i / interval)] : '';

            const remainingSteps = steps - i;
            if (remainingSteps === 0) {
                currentYes = yesPercent;
                currentNo = noPercent;
            } else {
                const driftYes = (yesPercent - currentYes) / remainingSteps;
                const driftNo = (noPercent - currentNo) / remainingSteps;
                const volatility = 4;

                currentYes += driftYes + (Math.random() - 0.5) * volatility;
                currentNo += driftNo + (Math.random() - 0.5) * volatility;

                currentYes = Math.max(0, Math.min(100, currentYes));
                currentNo = Math.max(0, Math.min(100, currentNo));
            }

            arr.push({
                index: i,
                time: timeLabel,
                Yes: Math.round(currentYes),
                No: Math.round(currentNo)
            });
        }
        setData(arr);
    }, [yesPercent, noPercent]);

    const renderCustomDot = (props: any, color: string) => {
        const { cx, cy, index } = props;
        if (index === data.length - 1) {
            return (
                <g key={`dot-${index}`}>
                    <circle cx={cx} cy={cy} r={4} fill={color} />
                </g>
            );
        }
        return null;
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background-dark border border-[#2d343c] p-3 rounded-lg shadow-xl text-sm font-bold">
                    <p className="text-[#ef4444] mb-1">YES: {payload[0].value}%</p>
                    <p className="text-[#3b82f6]">NO: {payload[1].value}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 60, left: 0, bottom: 0 }}>
                    <XAxis
                        dataKey="index"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        ticks={[0, 25, 50, 75, 100, 125, 150]}
                        tickFormatter={(val) => {
                            if (val === 0) return 'Apr';
                            if (val === 25) return 'May';
                            if (val === 50) return 'Jun';
                            if (val === 75) return 'Jul';
                            if (val === 100) return 'Aug';
                            if (val === 125) return 'Sep';
                            if (val === 150) return 'Oct';
                            return '';
                        }}
                        dy={10}
                    />
                    <YAxis
                        domain={[0, 100]}
                        orientation="right"
                        axisLine={false}
                        tickLine={false}
                        ticks={[0, 20, 40, 60, 80, 100]}
                        tickFormatter={(value) => `${value}%`}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        dx={5}
                    />
                    <ReferenceLine y={0} stroke="#2d3748" strokeWidth={1} />
                    <ReferenceLine y={20} stroke="#2d3748" strokeWidth={1} strokeDasharray="3 3" />
                    <ReferenceLine y={40} stroke="#2d3748" strokeWidth={1} strokeDasharray="3 3" />
                    <ReferenceLine y={60} stroke="#2d3748" strokeWidth={1} strokeDasharray="3 3" />
                    <ReferenceLine y={80} stroke="#2d3748" strokeWidth={1} strokeDasharray="3 3" />
                    <ReferenceLine y={100} stroke="#2d3748" strokeWidth={1} strokeDasharray="3 3" />

                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4a5568', strokeWidth: 1, strokeDasharray: '3 3' }} />
                    <Line type="linear" dataKey="Yes" stroke="#ef4444" strokeWidth={2} dot={(props) => renderCustomDot(props, '#ef4444')} isAnimationActive={true} />
                    <Line type="linear" dataKey="No" stroke="#3b82f6" strokeWidth={2} dot={(props) => renderCustomDot(props, '#3b82f6')} isAnimationActive={true} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};


export default function MarketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const marketId = parseInt(params.id as string);
    const { markets, updateMarket, addTrade } = usePredictionStore();
    const market = markets.find(m => m.id === marketId);

    const { address } = useWeb3ModalAccount();
    const users = usePredictionStore(state => state.users);
    const normalizedAddress = address?.toLowerCase() || '';
    const predictionBalance = users[normalizedAddress]?.balance || 0.0;
    const tradeAction = usePredictionStore(state => state.tradeFromUser);

    if (!market) {
        return <div className="p-8 text-center text-white text-xl">Market not found...</div>;
    }

    const total = market.yesPool + market.noPool;
    const yesPercent = total > 0 ? Math.round((market.yesPool / total) * 100) : 50;
    const noPercent = total > 0 ? Math.round((market.noPool / total) * 100) : 50;

    return (
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-8">
            <button onClick={() => router.back()} className="text-slate-400 hover:text-white mb-6 flex items-center gap-2 transition font-medium">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Markets
            </button>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side: Chart & Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-[#2d343c] rounded-lg flex items-center justify-center text-4xl shrink-0">
                            {market.icon || '📊'}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{market.question}</h1>
                            <div className="flex gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1 font-medium bg-background-dark px-3 py-1 rounded-full">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    ${market.volume.toFixed(2)}M Vol.
                                </span>
                                <span className="flex items-center gap-1 font-medium bg-background-dark px-3 py-1 rounded-full">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Ends {new Date(market.endTime).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-background-dark border border-[#2d343c] rounded-2xl p-6 mb-6 shadow-xl">
                        <div className="h-[350px] w-full relative">
                            <RealLineChart yesPercent={yesPercent} noPercent={noPercent} />
                        </div>
                        <div className="flex justify-start gap-4 text-xs font-bold tracking-widest text-[#565f6c] mt-4 border-t border-[#2d343c] pt-4">
                            <span className="hover:text-white cursor-pointer transition">1H</span>
                            <span className="hover:text-white cursor-pointer transition">6H</span>
                            <span className="hover:text-white cursor-pointer transition">1D</span>
                            <span className="hover:text-white cursor-pointer transition">1W</span>
                            <span className="hover:text-white cursor-pointer transition">1M</span>
                            <span className="bg-[#2d343c] text-white px-3 py-1 -mt-1 rounded-md cursor-pointer transition">ALL</span>
                        </div>
                    </div>

                    <div className="bg-background-dark border border-[#2d343c] rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
                        <div className="text-xs text-slate-500 font-bold tracking-wider uppercase mb-2">Outcomes</div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#252b32] border border-[#2d343c] p-5 rounded-xl flex justify-between items-center transition hover:border-gray-500">
                                <span className="font-bold text-lg text-white">Yes</span>
                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-green-600">
                                    {yesPercent}%
                                </span>
                            </div>
                            <div className="bg-[#252b32] border border-[#2d343c] p-5 rounded-xl flex justify-between items-center transition hover:border-gray-500">
                                <span className="font-bold text-lg text-white">No</span>
                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-red-400 to-red-600">
                                    {noPercent}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Trade Panel */}
                <div className="w-full lg:w-[420px] shrink-0 pt-4">
                    <TradePanel
                        market={market as any}
                        balance={predictionBalance}
                        onTrade={async (amount, side) => {
                            if (address) {
                                const success = await tradeAction(address, amount);
                                if (success) {
                                    const updatedVolume = market.volume + amount;
                                    if (side === 'yes') {
                                        updateMarket(market.id, { yesPool: market.yesPool + amount, volume: updatedVolume });
                                    } else {
                                        updateMarket(market.id, { noPool: market.noPool + amount, volume: updatedVolume });
                                    }

                                    // Add trade to global activity string
                                    addTrade({
                                        id: Math.random().toString(36).substr(2, 9),
                                        user: address,
                                        marketQ: market.question,
                                        position: side.toUpperCase() as 'YES' | 'NO',
                                        amount: amount,
                                        txHash: '0x' + Math.random().toString(16).substr(2, 64).padEnd(64, '0'),
                                        timestamp: 'Just now'
                                    });
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
