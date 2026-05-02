'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  PlayCircle, 
  History, 
  LineChart, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { ArciumStatusIndicator } from './ArciumStatusIndicator';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Employees', href: '/employees', icon: Users },
  { label: 'Run Payroll', href: '/payroll/run', icon: PlayCircle },
  { label: 'History', href: '/payroll/history', icon: History },
  { label: 'Analytics', href: '/analytics', icon: LineChart },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/10 bg-gray-950 flex flex-col h-screen fixed md:relative top-0 left-0">
      <div className="p-6 flex items-center justify-between">
        <Link href="/" onClick={onClose} className="flex items-center gap-3 group overflow-hidden">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber group-hover:drop-shadow-[0_0_8px_rgba(197,160,89,0.5)] transition-all shrink-0">
            <path d="M2 12c0 0 4-4 10-4s10 4 10 4-4 4-10 4-10-4-10-4Z" />
            <line x1="2" y1="12" x2="22" y2="12" />
          </svg>
          <span className="font-playfair text-xl text-amber italic tracking-tight truncate">HushHush Pay</span>
        </Link>
        {onClose && (
          <button 
            type="button" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }} 
            className="md:hidden text-white/40 hover:text-white shrink-0 ml-2 p-2 -mr-2 relative z-50 cursor-pointer"
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto w-full overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm text-[11px] uppercase tracking-widest transition-colors ${
                isActive 
                  ? 'border-l-2 border-amber/70 text-amber bg-white/5' 
                  : 'border-l-2 border-transparent text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} className={isActive ? "opacity-100" : "opacity-60"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 bg-gray-950">
        <div className="mb-4 px-2">
          <ArciumStatusIndicator status="healthy" nodes={5} />
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-sm bg-gray-800 border border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-white/40">Active Wallet</span>
            <span className="text-sm font-dm-mono text-white/80">7xKw...3pR1</span>
          </div>
          <button className="p-2 text-white/40 hover:text-white transition-colors" title="Disconnect">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
