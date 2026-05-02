import React from 'react';
import { HeartPulse } from 'lucide-react';
import { mockArxNodes } from '@/lib/mockData';

export function ClusterHealthCard() {
  return (
    <div className="bg-gray-900 border border-white/5 p-6 border-l-2 border-l-amber">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 border border-amber text-amber">
          <HeartPulse size={16} />
        </div>
        <div>
          <h3 className="font-playfair text-lg italic text-white tracking-tight">Cluster Health</h3>
          <p className="text-[10px] uppercase text-white/40 tracking-widest">Active MXE Nodes</p>
        </div>
      </div>

      <div className="space-y-2">
        {mockArxNodes.map(node => (
          <div key={node.id} className="flex items-center justify-between p-3 bg-gray-800 border border-white/5 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-lg opacity-80" title={node.jurisdiction}>
                {node.jurisdiction === 'DE' ? '🇩🇪' : node.jurisdiction === 'US' ? '🇺🇸' : '🇸🇬'}
              </span>
              <div className="font-dm-mono text-xs text-white/80">{node.id}</div>
            </div>
            
            <div className="flex items-center gap-6 text-xs">
              <div className="flex flex-col items-end">
                <span className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Reputation</span>
                <span className="text-amber font-dm-mono">{node.reputation}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Uptime</span>
                <span className="text-teal font-dm-mono">{node.uptime}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
