'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { StepWizard } from '@/components/StepWizard';
import { WalletButton } from '@/components/WalletButton';
import { Cpu, CheckCircle } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { dbOps } from '@/lib/db';

const steps = [
  { id: 1, label: 'Wallet' },
  { id: 2, label: 'Organization' },
  { id: 3, label: 'Deploy MXE' },
  { id: 4, label: 'Payroll' },
  { id: 5, label: 'Invite' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  
  // MXE deploy state
  const [deployState, setDeployState] = useState<'idle' | 'selecting' | 'generating' | 'active'>('idle');

  const [orgName, setOrgName] = useState('');
  const [createdOrgId, setCreatedOrgId] = useState<string | null>(null);

  const handleCreateOrg = async () => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      const id = "org_" + Math.random().toString(36).substring(7);
      await dbOps.createOrganization({
        name: orgName || 'Acme Corp',
        adminWallet: publicKey.toBase58(),
        mxeAddress: 'MXE' + Math.random().toString(36).substring(2, 10),
        clusterId: 'CLS-' + Math.random().toString(36).substring(2, 6).toUpperCase()
      }, id);
      
      localStorage.setItem('arxpay_org_id', id);
      setCreatedOrgId(id);
      setStep(3);
    } catch (e) {
      console.error(e);
      alert("Failed to create organization");
    }
  };

  const handleDeployMxe = () => {
    setDeployState('selecting');
    setTimeout(() => setDeployState('generating'), 1500);
    setTimeout(() => setDeployState('active'), 3500);
    setTimeout(() => setStep(4), 5000);
  };

  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-2xl bg-gray-900 border border-white/5 p-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-playfair italic text-amber tracking-tight mb-3">Setup Organization</h1>
          <p className="text-[10px] uppercase tracking-widest text-white/40">Configure your privacy-first payroll environment.</p>
        </div>

        <StepWizard steps={steps} currentStep={step} />

        <div className="mt-12 min-h-[300px]">
          {step === 1 && (
            <div className="flex flex-col items-center justify-center space-y-6 h-[250px]">
              <div className="p-6 border border-white/5 bg-gray-800">
                <WalletButton />
              </div>
              <p className="text-[11px] text-white/60 leading-loose">Connect your Solana wallet to act as the Organization Administrator.</p>
              <button 
                onClick={() => setStep(2)} 
                disabled={!connected}
                className={`border px-8 py-3 text-[11px] uppercase tracking-widest transition-colors ${connected ? 'border-amber text-amber hover:bg-amber/10' : 'border-white/10 text-white/20 cursor-not-allowed'}`}
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Organization Name</label>
                <input 
                  type="text" 
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full bg-gray-800 border border-white/5 p-4 text-white focus:border-amber outline-none transition-colors text-sm" 
                  placeholder="Acme Corp" 
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Jurisdiction</label>
                <select className="w-full bg-gray-800 border border-white/5 p-4 text-white focus:border-amber outline-none transition-colors text-sm appearance-none">
                  <option>United States (US)</option>
                  <option>European Union (EU)</option>
                  <option>Singapore (SG)</option>
                </select>
              </div>
              <button onClick={handleCreateOrg} className="w-full mt-8 px-6 py-4 border border-amber text-amber text-[11px] uppercase tracking-widest hover:bg-amber/10 transition-colors">Create Organization</button>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center text-center space-y-6 pt-4">
              <div className="w-20 h-20 bg-teal/5 flex items-center justify-center border border-teal/20 relative">
                {deployState !== 'idle' && deployState !== 'active' && (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border border-teal border-t-transparent" />
                )}
                {deployState === 'active' ? <CheckCircle className="text-teal" size={24} /> : <Cpu className="text-teal" size={24} />}
              </div>
              
              <div className="h-24">
                {deployState === 'idle' && (
                  <>
                    <h3 className="text-xl font-playfair italic text-white mb-2">Provision Arcium MXE</h3>
                    <p className="text-[11px] text-white/40 leading-loose">Deploy your dedicated MPC execution environment on Solana.</p>
                  </>
                )}
                {deployState === 'selecting' && <p className="text-amber font-dm-mono text-sm animate-pulse tracking-widest">Selecting Arx nodes for Cluster...</p>}
                {deployState === 'generating' && <p className="text-amber font-dm-mono text-sm animate-pulse tracking-widest">Generating key shares (TEE-secured)...</p>}
                {deployState === 'active' && <p className="text-teal font-dm-mono text-sm">Cluster activated ✓<br/><span className="text-[10px] uppercase tracking-widest text-white/40 mt-4 block">Cluster ID: CLS-89XQ</span></p>}
              </div>

              {deployState === 'idle' && (
                <button onClick={handleDeployMxe} className="px-8 py-3 border border-teal text-teal text-[11px] uppercase tracking-widest hover:bg-teal/10 transition-colors">
                  Deploy MXE
                </button>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Pay Frequency</label>
                <select className="w-full bg-gray-800 border border-white/5 p-4 text-white focus:border-amber outline-none transition-colors text-sm appearance-none">
                  <option>Monthly</option>
                  <option>Bi-weekly</option>
                  <option>Weekly</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Base Currency</label>
                <select className="w-full bg-gray-800 border border-white/5 p-4 text-white focus:border-amber outline-none transition-colors text-sm appearance-none">
                  <option>USDC (Solana)</option>
                  <option>SOL</option>
                </select>
              </div>
              <button onClick={() => setStep(5)} className="w-full mt-8 px-6 py-4 border border-amber text-amber text-[11px] uppercase tracking-widest hover:bg-amber/10 transition-colors">Save Settings</button>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="p-8 bg-gray-800 border border-white/5 text-center">
                <p className="text-[11px] leading-loose text-white/60 mb-6">Share this encrypted invitation link with your employees. They will use it to connect their wallets and generate their decryption keys.</p>
                <div className="p-4 bg-obsidian font-dm-mono text-xs text-amber break-all border border-amber/20">
                  {typeof window !== 'undefined' ? window.location.origin : 'https://hush-hush.pay'}/invite/{createdOrgId || 'org_01'}#key=8x...9p
                </div>
              </div>
              <button 
                onClick={() => router.push('/dashboard')} 
                className="w-full px-6 py-4 border border-amber text-amber text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-amber/10 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
