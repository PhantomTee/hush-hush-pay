import React from 'react';
import { motion } from 'framer-motion';

export function ArciumStatusIndicator({ 
  status, 
  nodes 
}: { 
  status: 'healthy' | 'degraded'; 
  nodes: number;
}) {
  const isHealthy = status === 'healthy';
  const color = isHealthy ? 'bg-teal' : 'bg-red-500';
  const bgColor = isHealthy ? 'bg-teal/20' : 'bg-red-500/20';

  return (
    <div className="flex items-center gap-2 text-xs font-dm-mono text-gray-400">
      <div className="relative flex h-2 w-2">
        <motion.span 
          animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute inline-flex h-full w-full rounded-full ${bgColor}`} 
        />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${color}`} />
      </div>
      <span>{isHealthy ? 'Active' : 'Degraded'}</span>
      <span>•</span>
      <span>{nodes} Nodes</span>
    </div>
  );
}
