import React from 'react';
import { Shield } from 'lucide-react';

export function PrivacyShield({ className }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal/5 border border-teal/20 text-teal text-[10px] uppercase tracking-widest ${className}`}>
      <Shield size={12} className="text-teal" />
      <span>MPC Protected</span>
    </div>
  );
}
