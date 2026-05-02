'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Lock, Cpu, EyeOff } from 'lucide-react';
import { ComparisonTable } from '@/components/ComparisonTable';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-obsidian text-white overflow-hidden selection:bg-amber/30">
      {/* Navbar */}
      <nav className="flex flex-col sm:flex-row items-center justify-between p-6 md:p-8 max-w-7xl mx-auto relative z-10 border-b border-white/5 gap-6">
        <div className="flex items-center gap-4 group">
          <div className="w-8 h-8 border border-amber flex items-center justify-center rotate-45 shrink-0">
            <span className="-rotate-45 font-playfair text-amber font-bold">H</span>
          </div>
          <span className="font-playfair italic text-amber text-xl tracking-tight">HushHush Pay</span>
        </div>
        <div className="flex items-center gap-4 md:gap-8 flex-wrap justify-center">
          <Link href="/onboarding" className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">Setup</Link>
          <Link href="/employee" className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">Employee Portal</Link>
          <Link href="/dashboard" className="px-4 py-2 md:px-6 md:py-2 border border-white/20 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber/5 via-transparent to-transparent -z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-teal/20 bg-teal/5 text-teal text-[10px] uppercase tracking-widest mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            Powered by Arcium MPC
          </div>
          <h1 className="text-6xl md:text-8xl font-playfair font-light mb-6 tracking-tighter leading-tight">
            Your payroll.<br />
            <span className="italic text-amber">Yours alone.</span>
          </h1>
          <p className="text-sm md:text-base text-white/40 max-w-2xl mx-auto font-light leading-loose mb-10">
            The first payroll system where salary amounts are <strong className="text-white">never visible on-chain</strong>. Cryptographically enforced privacy via decentralized Multi-Party Computation.
          </p>
          <div className="flex bg-transparent items-center justify-center gap-4">
            <Link href="/onboarding" className="px-8 py-4 border border-amber/50 hover:border-amber hover:bg-amber/5 text-amber text-[11px] uppercase tracking-widest transition-all">
              Launch Your Private Payroll
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <div className="py-24 bg-gray-950 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-4">
          {[
            { title: "MPC-Encrypted Payments", icon: Cpu, desc: "Computations run on encrypted inputs across Arx nodes without revealing data." },
            { title: "Zero On-Chain Exposure", icon: EyeOff, desc: "Amounts remain Enc<Shared, T>. Nothing is stored in plaintext on Solana." },
            { title: "Employee-Only Decryption", icon: Lock, desc: "Only the intended recipient can decrypt their payslip with their private key." },
            { title: "Arcium-Powered Security", icon: Shield, desc: "Backed by Solana's computational speed and Arcium's TEE-secured cluster network." }
          ].map((Feature, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 bg-gray-800 border-l border-white/10 hover:border-amber transition-colors group"
            >
              <div className="w-10 h-10 border border-amber/20 flex items-center justify-center mb-8 group-hover:border-amber transition-colors">
                <Feature.icon className="text-amber" size={16} />
              </div>
              <h3 className="text-lg font-playfair italic tracking-tight mb-4">{Feature.title}</h3>
              <p className="text-[11px] text-white/40 leading-loose">{Feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="py-32 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-playfair italic tracking-tight text-center mb-20 text-white">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-12 relative">
          <div className="hidden md:block absolute top-[20px] left-[10%] right-[10%] h-[1px] bg-white/10 -z-10" />
          {[
            { step: '01', title: 'Connect Wallet', desc: 'Securely link your Solana wallet.' },
            { step: '02', title: 'Deploy MXE', desc: 'Provision your dedicated MPC environment.' },
            { step: '03', title: 'Run Payroll', desc: 'Process encrypted salaries privately.' },
            { step: '04', title: 'Employees Decrypt', desc: 'Payslips decrypted locally by staff.' },
          ].map((s, i) => (
            <div key={i} className="text-center relative">
              <div className="w-10 h-10 mx-auto bg-obsidian border border-amber flex items-center justify-center text-xs font-dm-mono text-amber mb-6 z-10 transition-colors hover:bg-amber/10">
                {s.step}
              </div>
              <h3 className="text-lg font-playfair italic tracking-tight mb-2 text-white">{s.title}</h3>
              <p className="text-[11px] text-white/40">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison */}
      <div className="py-24 bg-gray-950 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-playfair italic tracking-tight text-center mb-16 text-white">The Privacy Standard</h2>
          <ComparisonTable />
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-12 bg-obsidian border-t border-white/10 text-center text-[10px] uppercase tracking-widest text-white/40">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <Link href="/onboarding" className="hover:text-white transition-colors">Onboarding</Link>
          <Link href="/employee" className="hover:text-white transition-colors">Employee Portal</Link>
        </div>
        <p>© 2026 HushHush Pay. Built on Solana & Arcium.</p>
      </footer>
    </div>
  );
}
