import React from 'react';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function EncryptedBadge({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
        "bg-amber/10 border border-amber/30 text-amber text-[10px] font-dm-mono uppercase tracking-wider",
        className
      )}
    >
      <Lock size={12} className="text-amber" />
      <span>Encrypted</span>
    </motion.div>
  );
}
