'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, UserPlus } from 'lucide-react';
import { WalletButton } from '@/components/WalletButton';
import { useWallet } from '@solana/wallet-adapter-react';

export default function InvitePage() {
  const [joined, setJoined] = useState(false);
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="w-full max-w-xl bg-gray-900 border border-white/5 p-12">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 border border-amber flex items-center justify-center rotate-45">
            <span className="-rotate-45 font-playfair text-amber text-xl font-bold">H</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-playfair italic text-white tracking-tight mb-4">HushHush Pay Invitation</h1>
        <p className="text-[11px] leading-loose text-white/60 mb-8">
          You have been invited to join a privacy-preserving payroll workspace.
          Please connect your wallet to generate your Arcium decryption keys and accept the invitation.
        </p>

        {!joined ? (
          <div className="space-y-6 flex flex-col items-center">
            <WalletButton />
            <button 
              onClick={() => setJoined(true)} 
              disabled={!connected}
              className={`w-full max-w-xs px-6 py-4 border text-[11px] uppercase tracking-widest transition-colors flex items-center justify-center gap-3 ${connected ? 'border-amber text-amber hover:bg-amber/10' : 'border-white/10 text-white/20 cursor-not-allowed'}`}
            >
              <UserPlus size={16} /> Accept Invitation
            </button>
          </div>
        ) : (
          <div className="space-y-6 flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center text-teal border border-teal/20 mb-4">
              <ShieldCheck size={32} />
            </div>
            <p className="text-sm text-teal">Workspace Joined Successfully</p>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Your decryption keys have been generated and secured.</p>
            
            <Link href="/employee" className="mt-4 px-8 py-3 border border-white/20 text-white text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors inline-block">
              Go to Employee Portal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
