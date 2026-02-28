'use client';
import Link from 'next/link';
import PredictionNav from '@/components/prediction/PredictionNav';
import { useState } from 'react';

interface Notification {
    id: number;
    type: 'resolved' | 'ending' | 'reward' | 'trending';
    message: string;
    time: string;
    isRead: boolean;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: 1, type: 'reward', message: 'You have 0.85 BNB rewards ready to claim from "Will Dune Win Best Picture?".', time: '10 mins ago', isRead: false },
        { id: 2, type: 'resolved', message: 'Market "Will the Fed cut interest rates in Q2?" has been resolved to NO.', time: '2 hours ago', isRead: false },
        { id: 3, type: 'ending', message: 'Hurry! Market "Will BTC reach $100k before March?" is ending in 5 days.', time: '1 day ago', isRead: true },
        { id: 4, type: 'trending', message: 'New trending market up: "Will OpenAI release GPT-5 this year?"', time: '2 days ago', isRead: true },
    ]);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'reward': return '💰';
            case 'resolved': return '✅';
            case 'ending': return '⏳';
            case 'trending': return '🔥';
            default: return '🔔';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-8">
            {/* Top Navbar */}
            <PredictionNav />

            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Notifications</h1>
                    <button
                        onClick={markAllRead}
                        className="text-sm text-primary hover:text-blue-300 transition"
                    >
                        Mark all as read
                    </button>
                </div>

                <div className="space-y-4">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`flex items-start gap-4 p-5 rounded-2xl border transition hover:bg-white/5 ${notif.isRead ? 'bg-background-dark border-white/5' : 'bg-white/10 border-primary/30'
                                }`}
                        >
                            <div className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-full text-xl ${notif.type === 'reward' ? 'bg-green-900/30 text-green-500' :
                                notif.type === 'resolved' ? 'bg-primary/10 text-primary' :
                                    notif.type === 'ending' ? 'bg-orange-900/30 text-orange-500' :
                                        'bg-red-900/30 text-red-500'
                                }`}>
                                {getIcon(notif.type)}
                            </div>

                            <div className="flex-1">
                                <p className={`mb-1 ${notif.isRead ? 'text-gray-300' : 'text-white font-medium'}`}>
                                    {notif.message}
                                </p>
                                <div className="text-sm text-slate-500">{notif.time}</div>
                            </div>

                            {!notif.isRead && (
                                <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
