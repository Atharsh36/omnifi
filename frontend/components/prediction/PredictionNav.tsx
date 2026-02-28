'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
    { name: 'Prediction Market', path: '/prediction', exact: true },
    { name: 'Portfolio', path: '/prediction/portfolio' },
    { name: 'Leaderboard', path: '/prediction/leaderboard' },
    { name: 'Notifications', path: '/prediction/notifications' },
    { name: 'AI Agent', path: '/prediction/ai-agent', special: 'ai' },
    { name: 'Admin', path: '/prediction/admin', special: 'admin' },
];

export default function PredictionNav() {
    const pathname = usePathname();

    const isActive = (tab: typeof tabs[0]) => {
        if (tab.exact) return pathname === tab.path;
        return pathname.startsWith(tab.path);
    };

    return (
        <div className="flex gap-6 mb-8 border-b border-white/10 pb-4 overflow-x-auto whitespace-nowrap">
            {tabs.map((tab) => {
                const active = isActive(tab);

                if (tab.special === 'ai') {
                    return (
                        <Link
                            key={tab.path}
                            href={tab.path}
                            className={`font-bold px-2 flex items-center gap-1 transition-all border-b-2 pb-4 -mb-4 ${active
                                    ? 'text-green-500 border-green-500'
                                    : 'text-green-500/60 hover:text-green-500 border-transparent'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {tab.name}
                        </Link>
                    );
                }

                if (tab.special === 'admin') {
                    return (
                        <Link
                            key={tab.path}
                            href={tab.path}
                            className={`font-bold px-2 flex items-center gap-1 transition-all border-b-2 pb-4 -mb-4 ${active
                                    ? 'text-primary border-primary'
                                    : 'text-slate-400 hover:text-white border-transparent'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {tab.name}
                        </Link>
                    );
                }

                return (
                    <Link
                        key={tab.path}
                        href={tab.path}
                        className={`font-medium px-2 transition-all border-b-2 pb-4 -mb-4 ${active
                                ? 'text-primary font-bold border-primary'
                                : 'text-slate-400 hover:text-white border-transparent'
                            }`}
                    >
                        {tab.name}
                    </Link>
                );
            })}
        </div>
    );
}
