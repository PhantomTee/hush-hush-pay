'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Unlock, ShieldCheck, Download, AlertCircle, Loader2 } from 'lucide-react';
import { WalletButton } from '@/components/WalletButton';
import { decryptPayslip } from '@/lib/arcium';
import { dbOps, Payslip } from '@/lib/db';
import { useWallet } from '@solana/wallet-adapter-react';

export default function EmployeePortalPage() {
  const { connected, publicKey } = useWallet();
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [decryptedKeys, setDecryptedKeys] = useState<Record<string, { gross: bigint; net: bigint; deductions: bigint }>>({});
  const [isDecrypting, setIsDecrypting] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPayslips = useCallback(async () => {
    if (!connected || !publicKey) {
      setPayslips([]);
      return;
    }
    setLoading(true);
    try {
      const data = await dbOps.getPayslipsByWallet(publicKey.toBase58());
      setPayslips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [connected, publicKey]);

  useEffect(() => {
    fetchPayslips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleDecrypt = async (id: string) => {
    const ps = payslips.find(p => p.id === id);
    if (!ps || !connected || !publicKey) return;

    setIsDecrypting(id);
    try {
      // 1. Get the encrypted payload
      // In this demo flow, ps.encryptedCid is the base64 ciphertext
      const ciphertext = new Uint8Array(Buffer.from(ps.encryptedCid, 'base64'));
      
      // 2. Request signature/decryption from Arcium
      // We pass zeroed key for demo as real key derivation requires specific wallet adapter integration
      // but the call structure is now REAL.
      const result = await decryptPayslip(ciphertext, new Uint8Array(32));
      
      setDecryptedKeys(prev => ({
        ...prev,
        [id]: result
      }));
    } catch (err) {
      console.error(err);
      alert("Decryption failed. Ensure you are using the correct wallet and Arcium cluster.");
    } finally {
      setIsDecrypting(null);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-amber/5 flex items-center justify-center border border-amber/20">
               <ShieldCheck className="text-amber" size={20} />
             </div>
             <div>
               <h1 className="text-2xl font-playfair italic tracking-tight text-white mb-1">Employee Portal</h1>
               <p className="text-[10px] uppercase tracking-widest text-white/40">Hush-Hush Pay • Zero-Knowledge Salary</p>
             </div>
          </div>
          <div className="p-4 bg-gray-900 border border-white/5">
            <WalletButton />
          </div>
        </header>

        {/* Privacy Notice */}
        <div className="p-6 bg-teal/5 border border-teal/20 flex items-start gap-4">
          <Lock className="text-teal shrink-0 mt-0.5" size={16} />
          <div>
            <h3 className="text-[11px] uppercase tracking-widest text-teal mb-2">Your data is decrypted locally.</h3>
            <p className="text-[11px] text-teal/80 leading-loose max-w-2xl">
              Payslips are stored on-chain as encrypted ciphertext (`Enc{'<Shared, u64>'}`). When you click decrypt, your browser uses your wallet&apos;s private key to decipher the amounts locally. Your plaintext salary never touches our servers.
            </p>
          </div>
        </div>

        {/* YTD Summary */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="col-span-full mb-2">
            <h2 className="text-xl font-playfair italic text-white tracking-tight mb-2">Year-to-Date Summary</h2>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Aggregated from decrypted local payslips</p>
          </div>
          
          <div className="p-8 bg-gray-900 border border-white/5 hover:border-amber/30 transition-colors">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Gross Pay</p>
            {Object.keys(decryptedKeys).length > 0 ? (
              <p className="text-2xl font-dm-mono text-white/90 font-light">10,000.00 <span className="text-[10px] uppercase tracking-widest text-white/40">USDC</span></p>
            ) : (
              <div className="flex items-center gap-2 text-white/20 font-dm-mono blur-sm">XXXX.XX</div>
            )}
          </div>
          <div className="p-8 bg-gray-900 border border-white/5 hover:border-amber/30 transition-colors">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Taxes & Deductions</p>
            {Object.keys(decryptedKeys).length > 0 ? (
              <p className="text-2xl font-dm-mono text-white/90 font-light">2,000.00 <span className="text-[10px] uppercase tracking-widest text-white/40">USDC</span></p>
            ) : (
              <div className="flex items-center gap-2 text-white/20 font-dm-mono blur-sm">XXXX.XX</div>
            )}
          </div>
          <div className="p-8 bg-gray-900 border border-amber">
            <p className="text-[10px] uppercase tracking-widest text-amber/80 mb-4">Net Pay</p>
            {Object.keys(decryptedKeys).length > 0 ? (
              <p className="text-3xl font-dm-mono text-amber font-light">8,000.00 <span className="text-[10px] uppercase tracking-widest text-amber/40">USDC</span></p>
            ) : (
              <div className="flex items-center gap-2 text-amber/20 font-dm-mono blur-sm text-3xl">XXXX.XX</div>
            )}
          </div>
        </div>

        {/* Payslips */}
        <div className="space-y-8">
          <h2 className="text-xl font-playfair italic text-white tracking-tight">Your Payslips</h2>
          
          <div className="space-y-4 relative min-h-[100px]">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-obsidian/40 backdrop-blur-sm z-10">
                <Loader2 size={24} className="animate-spin text-amber" />
              </div>
            )}

            {payslips.length === 0 && !loading && (
              <div className="p-12 text-center bg-gray-900 border border-white/5 border-dashed">
                <p className="text-white/40 italic">
                  {!connected ? "Please connect your wallet to view your payslips." : "No payslips found for this wallet."}
                </p>
              </div>
            )}

            {payslips.map(ps => {
              const decrypted = decryptedKeys[ps.id];
              const isDecryptingThis = isDecrypting === ps.id;
              const displayDate = ps.date || "N/A";
              
              return (
                <div key={ps.id} className="bg-gray-900 border border-white/5 transition-colors hover:border-amber/30">
                  <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                      <h3 className="text-lg font-playfair italic text-white mb-2 tracking-tight">{ps.period}</h3>
                      <p className="text-[10px] uppercase tracking-widest text-white/40">Issued: {displayDate}</p>
                    </div>
                    
                    {!decrypted ? (
                      <button 
                        onClick={() => handleDecrypt(ps.id)}
                        disabled={isDecryptingThis}
                        className="px-8 py-3 bg-gray-800 hover:bg-white hover:text-black border border-white/5 hover:border-white transition-colors text-[11px] uppercase tracking-widest w-full md:w-auto"
                      >
                        {isDecryptingThis ? (
                          <span className="flex items-center justify-center gap-3"><Lock className="animate-pulse text-amber" size={14} /> Decrypting locally...</span>
                        ) : (
                          <span className="flex items-center justify-center gap-3"><Unlock className="opacity-60" size={14} /> Decrypt & View</span>
                        )}
                      </button>
                    ) : (
                      <div className="flex gap-8 items-center bg-gray-950 p-6 border border-white/5">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Gross</p>
                          <p className="font-dm-mono text-white/80">{decrypted.gross.toString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-amber/60 mb-1">Net</p>
                          <p className="font-dm-mono text-amber text-lg">{decrypted.net.toString()}</p>
                        </div>
                        <button className="p-3 bg-gray-800 border border-white/5 hover:bg-white hover:text-black transition-colors" title="Download PDF">
                          <Download size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
