import React from 'react';
import { ExternalLink } from 'lucide-react';

export function TxHashLink({ hash }: { hash: string }) {
  const truncated = `${hash.slice(0, 4)}...${hash.slice(-4)}`;
  
  return (
    <a 
      href={`https://explorer.solana.com/tx/${hash}?cluster=devnet`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-teal hover:text-teal/80 font-dm-mono text-sm transition-colors group"
      title={hash}
    >
      <span>{truncated}</span>
      <ExternalLink size={12} className="opacity-50 group-hover:opacity-100" />
    </a>
  );
}
