'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WalletConnect from './WalletConnect';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname === '/') return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-background-dark/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3'
        : 'bg-background-dark border-b border-white/5 py-4'
        }`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-12">

          <Link href="/" className="group flex items-center gap-2">
            <div className="flex items-center gap-3 transform group-hover:scale-105 transition-all duration-300">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary">
                <circle cx="45" cy="55" r="35" stroke="currentColor" strokeWidth="4" strokeDasharray="45 5" />
                <circle cx="45" cy="55" r="15" stroke="currentColor" strokeWidth="4" strokeDasharray="15 5" />
                <path d="M45 5 V20 M45 90 V105 M-5 55 H10 M80 55 H95" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />

                <path d="M15 80 L35 60 L50 70 L85 20" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M65 20 H85 V40" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

                <g fill="currentColor" stroke="currentColor" strokeWidth="2">
                  <line x1="35" y1="60" x2="35" y2="85" />
                  <rect x="31" y="65" width="8" height="12" rx="1" />

                  <line x1="50" y1="70" x2="50" y2="95" />
                  <rect x="46" y="75" width="8" height="12" rx="1" />

                  <line x1="70" y1="40" x2="70" y2="75" />
                  <rect x="66" y="45" width="8" height="20" rx="1" />
                </g>
              </svg>
              <div className="flex flex-col justify-center mt-1">
                <h1 className="text-2xl font-black bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent leading-none pb-0.5">
                  OmniFi
                </h1>
                <span className="text-[7px] tracking-[0.2em] text-slate-300 font-semibold">PREDICTION MARKET</span>
              </div>
            </div>
          </Link>

          <div className="hidden md:flex gap-1 items-center bg-white/5 border border-white/10 p-1.5 rounded-xl">
            {[
              { name: 'Home', path: '/' },
              { name: 'Predictions', path: '/prediction' }
            ].map((link) => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${isActive
                    ? 'text-primary bg-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(252,213,53,0.8)]"></span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
}
