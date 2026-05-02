'use client';
import React, { useCallback } from 'react';
import { Wallet } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export function WalletButton() {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnect = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);
  
  if (connected && publicKey) {
    const address = publicKey.toBase58();
    const truncated = `${address.slice(0, 4)}...${address.slice(-4)}`;

    return (
      <button 
        onClick={handleDisconnect}
        className="flex items-center gap-3 px-6 py-3 border border-white/10 bg-gray-800 hover:border-amber/50 text-[11px] uppercase tracking-widest font-dm-mono text-white transition-colors"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-teal shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
        {truncated}
      </button>
    );
  }

  return (
    <button 
      onClick={handleConnect}
      className="flex items-center gap-3 px-6 py-3 border border-white/20 hover:bg-white hover:text-black text-[11px] uppercase tracking-widest text-white transition-colors group"
    >
      <Wallet size={16} className="group-hover:text-black" />
      <span>Connect Wallet</span>
    </button>
  );
}
