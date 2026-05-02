'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-obsidian flex text-white overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 flex flex-col h-screen md:w-[calc(100%-16rem)] w-full overflow-hidden">
        <header className="h-20 md:h-24 border-b border-white/10 flex items-center justify-between px-6 md:px-12 shrink-0 bg-obsidian">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-white/60 hover:text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="font-playfair text-xl md:text-2xl italic tracking-tight text-amber">HushHush Pay</h1>
              <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/40 hidden sm:block">Secure Executive Payroll</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 md:space-x-8">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase text-white/40 mb-1 tracking-widest">Active Session</p>
              <p className="font-dm-mono text-xs md:text-sm">ADM-992-DELTA</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-white/10 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-amber rounded-full shadow-[0_0_8px_rgba(197,160,89,0.5)]"></div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-12">
          <div className="max-w-6xl mx-auto flex flex-col h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
