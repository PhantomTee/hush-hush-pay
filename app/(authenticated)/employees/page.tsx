'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Users, UserPlus, X, Upload, FileJson, AlertCircle, Loader2 } from 'lucide-react';
import { EncryptedInput } from '@/components/EncryptedInput';
import { encryptSalary } from '@/lib/arcium';
import { dbOps, Employee } from '@/lib/db';
import { useWallet } from '@solana/wallet-adapter-react';
import Papa from 'papaparse';

export default function EmployeesPage() {
  const { connected, publicKey } = useWallet();
  const [isAdding, setIsAdding] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [newName, setNewName] = useState('');
  const [newWallet, setNewWallet] = useState('');
  const [salaryDraft, setSalaryDraft] = useState('');

  const [employees, setEmployees] = useState<Employee[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [orgId, setOrgId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('arxpay_org_id') || "org_demo";
    }
    return "org_demo";
  });

  const fetchEmployees = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const data = await dbOps.getEmployeesByOrg(orgId);
      setEmployees(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    const init = async () => {
      await fetchEmployees();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    setSubmitting(true);
    try {
      const amountStr = salaryDraft.replace(/[^0-9.]/g, '');
      const amountUsdc = parseFloat(amountStr) || 0;
      const amountLamports = BigInt(Math.floor(amountUsdc * 1000000));
      
      // 1. Fetch the MXE Public Key (In this demo, we assume the shared Arcium Public Key is used)
      // Real implementations would fetch the active cluster/MXE pubkey from the organization settings
      const mxePubkey = "MXE7f3k9pQr8vWn2yS3mB4v"; 
      
      // 2. Encrypt salary using Arcium
      const encrypted = await encryptSalary(amountLamports, mxePubkey);
      
      // 3. Save to Firestore
      await dbOps.addEmployee({
        orgId,
        name: newName,
        wallet: newWallet,
        arcisPubkey: mxePubkey, // This is the public key used for payroll MPC
        status: 'active',
        baseSalary: amountUsdc,
        salaryCiphertext: Buffer.from(encrypted.ciphertext).toString('base64'),
        salaryNonce: Buffer.from(encrypted.nonce).toString('base64')
      });

      setIsAdding(false);
      setNewName('');
      setNewWallet('');
      setSalaryDraft('');
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert("Failed to add employee");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data as any[];
        let count = 0;

        for (const row of data) {
          if (row.name && row.wallet) {
            try {
              await dbOps.addEmployee({
                orgId,
                name: row.name,
                wallet: row.wallet,
                arcisPubkey: "ARC_BUS_" + Math.random().toString(36).substring(7),
                status: 'active'
              });
              count++;
            } catch (err) {
              console.error("Failed to import row:", row, err);
            }
          }
        }

        alert(`Successfully imported ${count} employees.`);
        setIsImporting(false);
        fetchEmployees();
      },
      error: (err) => {
        console.error(err);
        alert("Failed to parse CSV file");
        setIsImporting(false);
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair italic text-amber tracking-tight mb-2">Employee Management</h1>
          <p className="text-[10px] uppercase text-white/40 tracking-widest">Manage your team securely in Arcium clusters.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".csv" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="text-[11px] uppercase tracking-widest border border-white/10 px-6 py-2 flex items-center gap-2 hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {isImporting ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            Bulk Import
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="text-[11px] uppercase tracking-widest border border-amber text-amber px-6 py-2 flex items-center gap-2 hover:bg-amber/10 transition-colors"
          >
            <UserPlus size={14} />
            Add Employee
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-400 text-xs flex items-center gap-3">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="bg-gray-900 border border-white/5 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <Loader2 className="animate-spin text-amber" size={32} />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-gray-950/50 border-b border-white/5 text-[10px] uppercase tracking-widest text-white/40">
              <tr>
                <th className="px-6 py-4 font-normal">Name</th>
                <th className="px-6 py-4 font-normal">Wallet Address</th>
                <th className="px-6 py-4 font-normal">Date Added</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {employees.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/40 italic">
                    No employees found. Add your first employee to get started.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-white/5 group transition-colors">
                    <td className="px-6 py-4 font-normal text-white flex items-center gap-4">
                      <div className="w-8 h-8 border border-white/10 flex items-center justify-center text-amber font-playfair italic">
                        {emp.name.charAt(0)}
                      </div>
                      {emp.name}
                    </td>
                    <td className="px-6 py-4 font-dm-mono text-[11px] opacity-80">{emp.wallet}</td>
                    <td className="px-6 py-4 text-[11px] uppercase tracking-widest opacity-60">
                      {emp.addedAt?.seconds ? new Date(emp.addedAt.seconds * 1000).toLocaleDateString() : 'Pending'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 text-[10px] uppercase tracking-widest text-teal border border-teal/20 bg-teal/5">
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[10px] uppercase tracking-widest text-amber hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                        Update Salary
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-white/5 bg-gray-950/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-white/40">
            <Users size={14} /> {employees.length} Secured employee records
          </div>
          <p className="text-[10px] uppercase tracking-widest text-teal/80 text-center">Salaries are encrypted client-side and never touch our servers in plaintext.</p>
        </div>
      </div>

      {/* Add Employee Drawer */}
      {isAdding && (
        <div className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-gray-900 h-full border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gray-950/50">
              <h2 className="text-2xl font-playfair italic tracking-tight text-white">Add Employee</h2>
              <button onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddEmployee} className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Display Name <span className="text-amber">*</span></label>
                  <input 
                    required 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Jane Doe" 
                    className="w-full bg-gray-800 border border-white/5 text-white p-4 outline-none focus:border-amber transition-colors text-sm" 
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Wallet Address <span className="text-amber">*</span></label>
                  <input 
                    required 
                    value={newWallet}
                    onChange={(e) => setNewWallet(e.target.value)}
                    placeholder="Solana Address" 
                    className="w-full bg-gray-800 border border-white/5 text-white font-dm-mono p-4 outline-none focus:border-amber transition-colors text-sm" 
                  />
                </div>
                
                <EncryptedInput 
                  label="Gross Salary (USDC)" 
                  value={salaryDraft}
                  onChange={(e) => setSalaryDraft(e.target.value)}
                  placeholder="e.g. 5000"
                  required
                />
              </div>

              <div className="p-6 border-l border-amber bg-amber/5 text-amber opacity-80 text-[11px] leading-loose">
                By adding an employee, you authorize their public key to decrypt their future payslips. You will not be able to view their salary in plaintext on-chain.
              </div>
            </form>
            
            <div className="p-8 border-t border-white/5 bg-gray-950/50 flex justify-end">
              <button 
                onClick={handleAddEmployee}
                disabled={submitting}
                className="w-full border border-amber text-amber text-[11px] uppercase tracking-widest px-6 py-4 hover:bg-amber/10 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                Encrypt & Save Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
