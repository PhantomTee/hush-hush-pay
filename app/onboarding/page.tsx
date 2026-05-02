'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
    setTimeout(() => setStep(4), 5500);
  };

  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] border border-amber/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] border border-teal/20 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="grid md:grid-cols-[1fr_2fr] gap-0 bg-gray-950 border border-white/10 shadow-2xl overflow-hidden min-h-[600px]">
          {/* Sidebar / Progress */}
          <div className="bg-gray-900/50 p-12 border-r border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-12">
                <div className="w-8 h-8 border border-amber flex items-center justify-center rotate-45">
                  <span className="-rotate-45 font-playfair text-amber font-bold">H</span>
                </div>
                <span className="font-playfair italic text-amber text-lg tracking-tight">HushHush</span>
              </div>

              <div className="space-y-8">
                {steps.map((s) => (
                  <div key={s.id} className="flex items-center gap-4 group">
                    <div className={`w-6 h-6 flex items-center justify-center text-[10px] font-dm-mono border transition-all duration-500 ${
                      step >= s.id ? 'border-amber text-amber' : 'border-white/10 text-white/20'
                    }`}>
                      {step > s.id ? '✓' : `0${s.id}`}
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest transition-colors duration-500 ${
                      step >= s.id ? 'text-white' : 'text-white/20'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[9px] uppercase tracking-widest text-white/30 leading-loose">
              Security Protocol Level: MPC-V4<br />
              Environment: Encrypted
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-12 md:p-16 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-3xl font-playfair italic mb-4">Identity Verification</h2>
                    <p className="text-sm text-white/40 leading-loose">Connect your Solana wallet to establish your role as the Organization Administrator. This key will sign all future payroll computations.</p>
                  </div>
                  
                  <div className="p-8 border border-white/5 bg-white/5 flex flex-col items-center gap-6">
                    <WalletButton />
                  </div>

                  <div className="flex justify-end">
                    <button 
                      onClick={() => setStep(2)} 
                      disabled={!connected}
                      className={`px-10 py-3 text-[11px] uppercase tracking-widest transition-all ${connected ? 'border border-amber text-amber hover:bg-amber/10' : 'border border-white/5 text-white/10 cursor-not-allowed'}`}
                    >
                      Authenticate & Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-3xl font-playfair italic mb-4">Organization Profile</h2>
                    <p className="text-sm text-white/40 leading-loose">Define your organization&apos;s presence on the Arcium network.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/40">Legal Entity Name</label>
                      <input 
                        type="text" 
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-amber outline-none transition-colors font-dm-mono text-sm" 
                        placeholder="ACME GLOBAL LTD" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/40">Primary Jurisdiction</label>
                      <select className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-amber outline-none transition-colors font-dm-mono text-sm appearance-none">
                        <option>United States (US-EAST)</option>
                        <option>European Union (EU-CENTRAL)</option>
                        <option>Singapore (SG-SOUTHEAST)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button onClick={handleCreateOrg} className="px-10 py-4 border border-amber text-amber text-[11px] uppercase tracking-widest hover:bg-amber/10 transition-all">
                      Confirm Profile
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col items-center text-center space-y-12 py-8"
                >
                  <div className="relative">
                    <div className="w-32 h-32 flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        {deployState === 'active' ? (
                          <motion.div 
                            key="active" 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            className="w-16 h-16 border border-teal flex items-center justify-center"
                          >
                            <CheckCircle className="text-teal" size={24} />
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="deploying"
                            animate={{ 
                              rotate: 360,
                              borderColor: ['rgba(0,201,177,0.2)', 'rgba(0,201,177,1)', 'rgba(0,201,177,0.2)']
                            }} 
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }} 
                            className="w-20 h-20 border border-teal rounded-full border-t-transparent"
                          />
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* Arx Node visualization */}
                    {deployState !== 'idle' && deployState !== 'active' && (
                      <div className="absolute inset-0">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ 
                              opacity: [0.2, 1, 0.2],
                              scale: [0.8, 1.2, 0.8]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                            className="absolute w-2 h-2 bg-teal rounded-full"
                            style={{ 
                              top: `${50 + Math.sin(i * 1.2) * 60}%`, 
                              left: `${50 + Math.cos(i * 1.2) * 60}%` 
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="h-20">
                    {deployState === 'idle' && (
                      <>
                        <h2 className="text-2xl font-playfair italic mb-3">Provision Arcium MXE</h2>
                        <p className="text-[11px] text-white/40 uppercase tracking-[0.2em] leading-loose max-w-sm mx-auto">Deploy your dedicated MPC execution environment on the Solana network.</p>
                      </>
                    )}
                    {deployState === 'selecting' && (
                      <p className="text-amber font-dm-mono text-sm animate-pulse tracking-[0.3em] uppercase">Selecting Cluster Nodes...</p>
                    )}
                    {deployState === 'generating' && (
                      <p className="text-amber font-dm-mono text-sm animate-pulse tracking-[0.3em] uppercase">Generating Key Shares (TEE)...</p>
                    )}
                    {deployState === 'active' && (
                      <div className="space-y-4">
                        <p className="text-teal font-dm-mono text-sm uppercase tracking-widest">Environment Active ✓</p>
                        <p className="text-[10px] uppercase tracking-widest text-white/30">Arx Cluster ID: CLS-A92-DELTA</p>
                      </div>
                    )}
                  </div>

                  {deployState === 'idle' && (
                    <button onClick={handleDeployMxe} className="px-12 py-4 border border-teal text-teal text-[11px] uppercase tracking-widest hover:bg-teal/5 transition-all">
                      Initialize Environment
                    </button>
                  )}
                </motion.div>
              )}

              {step === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-3xl font-playfair italic mb-4">Payroll Schedule</h2>
                    <p className="text-sm text-white/40 leading-loose">Configure how and when your MPC circuits will execute payroll runs.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/40">Frequency</label>
                      <select className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-amber outline-none transition-colors font-dm-mono text-sm appearance-none">
                        <option>MONTHLY</option>
                        <option>BI-WEEKLY</option>
                        <option>WEEKLY</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/40">Currency</label>
                      <select className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-amber outline-none transition-colors font-dm-mono text-sm appearance-none">
                        <option>USDC (SOLANA)</option>
                        <option>SOL</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button onClick={() => setStep(5)} className="px-10 py-4 border border-amber text-amber text-[11px] uppercase tracking-widest hover:bg-amber/10 transition-all">
                      Apply Configuration
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div 
                  key="step5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-10"
                >
                  <div className="text-center">
                    <h2 className="text-3xl font-playfair italic mb-4">Invitation Ready</h2>
                    <p className="text-sm text-white/40 leading-loose">Securely share this encrypted initialization payload with your employees.</p>
                  </div>

                  <div className="p-8 bg-white/5 border border-white/10 space-y-6">
                    <div className="bg-obsidian border border-amber/10 p-4 font-dm-mono text-[10px] text-amber/80 break-all leading-relaxed">
                      {typeof window !== 'undefined' ? window.location.origin : 'https://pay.hushhush'}
                      /invite/{createdOrgId || 'org_8127'}#payload=6x7B9...a2F1
                    </div>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest text-center">Expires in 72 hours</p>
                  </div>

                  <button 
                    onClick={() => router.push('/dashboard')} 
                    className="w-full py-4 bg-amber text-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-amber/90 transition-all"
                  >
                    Enter Private Dashboard
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
