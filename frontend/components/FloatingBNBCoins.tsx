'use client';

import React from 'react';

const COINS = [
    { id: 1, size: 'w-16 h-16', left: '10%', duration: '25s', delay: '0s', blur: 'blur-[1px]' },
    { id: 2, size: 'w-24 h-24', left: '30%', duration: '35s', delay: '5s', blur: 'blur-[1.5px]' },
    { id: 3, size: 'w-12 h-12', left: '50%', duration: '28s', delay: '2s', blur: 'blur-[1px]' },
    { id: 4, size: 'w-20 h-20', left: '75%', duration: '40s', delay: '10s', blur: 'blur-[2px]' },
    { id: 5, size: 'w-14 h-14', left: '85%', duration: '32s', delay: '7s', blur: 'blur-[1px]' },
    { id: 6, size: 'w-18 h-18', left: '20%', duration: '38s', delay: '15s', blur: 'blur-[1.5px]', hiddenMobile: true },
    { id: 7, size: 'w-10 h-10', left: '60%', duration: '22s', delay: '12s', blur: 'blur-[0.5px]', hiddenMobile: true },
    { id: 8, size: 'w-28 h-28', left: '80%', duration: '45s', delay: '20s', blur: 'blur-[2.5px]', hiddenMobile: true },
];

export default function FloatingBNBCoins() {
    return (
        <div className="absolute inset-x-0 bottom-0 top-[0] pointer-events-none overflow-hidden z-0">
            <style>{`
        @keyframes floatBNB {
          0% {
            transform: translateY(20vh) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.15;
          }
          90% {
            opacity: 0.15;
          }
          100% {
            transform: translateY(-120vh) translateX(20px) rotate(180deg);
            opacity: 0;
          }
        }
        .bnb-coin {
          position: absolute;
          bottom: -10vh;
          opacity: 0;
          animation-name: floatBNB;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
          filter: drop-shadow(0 0 15px rgba(252, 213, 53, 0.25));
          will-change: transform, opacity;
        }
      `}</style>

            {COINS.map((coin) => (
                <div
                    key={coin.id}
                    className={`bnb-coin ${coin.size} flex items-center justify-center ${coin.blur} ${coin.hiddenMobile ? 'hidden md:flex' : ''}`}
                    style={{
                        left: coin.left,
                        animationDuration: coin.duration,
                        animationDelay: coin.delay,
                    }}
                >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" fill="#FCD535" fillOpacity="0.4" />
                        <path d="M9.13 8.35L12 5.4l2.87 2.95 2.05-2.1L12 1.25 7.08 6.25l2.05 2.1zm5.74 7.3L12 18.6l-2.87-2.95-2.05 2.1L12 22.75l4.92-5-2.05-2.1zM12 15.65l-2.87-2.95L12 9.75l2.87 2.95L12 15.65zm-4.92-5L4.25 12.7 7.08 15.6l2.05-2.05L6.3 10.65l2.83-2.9-2.05-2.1zM16.92 8.4l-2.05 2.1 2.83 2.9-2.83 2.9 2.05 2.05L21.84 12.7 16.92 8.4z" fill="#FCD535" fillOpacity="0.8" />
                    </svg>
                </div>
            ))}
        </div>
    );
}
