'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[9999] bg-obsidian flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background atmosphere */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber/10 via-transparent to-transparent"
          />

          <div className="relative">
            {/* Out of world rings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.5, 0],
                  scale: [0, 1.5 + i * 0.5],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  delay: i * 0.4,
                  ease: "linear"
                }}
                className="absolute inset-0 border border-amber/20 rounded-full"
                style={{ width: 120, height: 120, left: -60, top: -60 }}
              />
            ))}

            {/* Core logo animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative">
                <motion.div
                  animate={{ 
                    rotate: [0, 90, 180, 270, 360],
                    borderColor: ['rgba(212,175,55,0.2)', 'rgba(212,175,55,1)', 'rgba(212,175,55,0.2)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 border border-amber flex items-center justify-center rotate-45"
                >
                  <span className="-rotate-45 font-playfair text-amber font-bold text-2xl">H</span>
                </motion.div>
                
                {/* Floating particles around H */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      x: [0, Math.cos(i) * 30, 0],
                      y: [0, Math.sin(i) * 30, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    className="absolute top-1/2 left-1/2 w-1 h-1 bg-amber rounded-full"
                  />
                ))}
              </div>

              <div className="flex flex-col items-center">
                <motion.h2 
                  initial={{ letterSpacing: "0.2em", opacity: 0 }}
                  animate={{ letterSpacing: "0.5em", opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="font-playfair italic text-amber text-2xl tracking-[0.5em] pr-[0.5em]"
                >
                  HUSH HUSH
                </motion.h2>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 1 }}
                  className="h-[1px] bg-amber/30 mt-2"
                />
                <p className="text-[9px] uppercase tracking-widest text-white/40 mt-3 font-dm-mono">
                  Initializing MPC Environment
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-12 flex flex-col items-center gap-2"
          >
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1 h-1 bg-amber rounded-full"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
