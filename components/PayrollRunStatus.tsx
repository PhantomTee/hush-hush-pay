'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Database, Shield, Link as LinkIcon, Cpu } from 'lucide-react';

type Status = 'pending' | 'processing' | 'complete' | 'failed';

const steps = [
  { id: 'mempool', label: 'Mempool', icon: Database },
  { id: 'cluster', label: 'Arx Cluster picked up', icon: Shield },
  { id: 'mpc', label: 'MPC Execution', icon: Cpu },
  { id: 'callback', label: 'Callback tx', icon: LinkIcon },
];

export function PayrollRunStatus({ status, progressIndex }: { status: Status, progressIndex: number }) {
  return (
    <div className="bg-gray-900 border border-white/5 p-12">
      <h3 className="text-xl font-playfair italic text-white tracking-tight mb-8">Computation Status</h3>
      
      <div className="relative">
        <div className="absolute top-[20px] left-[19px] bottom-[20px] w-px bg-white/10" />
        
        <div className="space-y-8">
          {steps.map((step, idx) => {
            const isCompleted = idx < progressIndex || status === 'complete';
            const isCurrent = idx === progressIndex && status === 'processing';
            const Icon = step.icon;

            return (
              <div key={step.id} className="relative flex items-center gap-8">
                <div className={`w-10 h-10 flex border items-center justify-center z-10 ${
                  isCompleted ? 'bg-teal/10 border-teal/40 text-teal' :
                  isCurrent ? 'bg-amber/10 border-amber/40 text-amber' :
                  'bg-gray-800 border-white/5 text-white/20'
                }`}>
                  {isCompleted ? <Check size={16} /> : 
                   isCurrent ? <Loader2 size={16} className="animate-spin" /> : 
                   <Icon size={16} />}
                </div>
                
                <div>
                  <p className={`text-[11px] uppercase tracking-widest ${isCompleted || isCurrent ? 'text-white' : 'text-white/40'}`}>
                    {step.label}
                  </p>
                  {isCurrent && step.id === 'mpc' && (
                    <p className="text-[10px] uppercase tracking-widest text-amber font-dm-mono mt-2">
                      3 of 5 nodes confirmed
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
