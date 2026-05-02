import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export function StepWizard({ 
  steps, 
  currentStep 
}: { 
  steps: { id: number; label: string }[];
  currentStep: number;
}) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-[10%] right-[10%] top-1/2 -mt-px h-0.5 bg-gray-800" />
        
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <motion.div 
                initial={false}
                animate={{
                  backgroundColor: isCompleted ? '#00C9B1' : isCurrent ? '#F5C842' : '#1a1a24',
                  borderColor: isCompleted ? '#00C9B1' : isCurrent ? '#F5C842' : '#2a2a35'
                }}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-dm-mono ${
                  isCompleted || isCurrent ? 'text-obsidian' : 'text-gray-500'
                }`}
              >
                {isCompleted ? <Check size={16} /> : step.id}
              </motion.div>
              <span className={`text-xs absolute -bottom-6 whitespace-nowrap ${
                isCompleted || isCurrent ? 'text-gray-200' : 'text-gray-600'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
