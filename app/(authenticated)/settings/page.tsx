'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Save, AlertTriangle, Key, Network, Users, Loader2 } from 'lucide-react';
import { mockArxNodes } from '@/lib/mockData';
import { dbOps, Organization } from '@/lib/db';
import { useWallet } from '@solana/wallet-adapter-react';

export default function SettingsPage() {
  const { connected, publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState('mxe');
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const orgId = "org_demo"; // Linked to current org

  const fetchOrg = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dbOps.getOrganization(orgId);
      if (data) {
        setOrg(data);
      } else {
        // Create demo org if not exists
        const demoOrg = {
          name: 'Demo Workspace',
          adminWallet: publicKey?.toBase58() || '7xKwY6V8vW9R1pW2yS3mB4vN5pZ6rT7uU8xY9zR0',
          mxeAddress: 'MXE7f3k9pQr',
          clusterId: 'CLS-89XQ'
        };
        await dbOps.createOrganization(demoOrg, orgId);
        setOrg({ id: orgId, ...demoOrg });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [orgId, publicKey]);

  useEffect(() => {
    fetchOrg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs = [
    { id: 'general', label: 'Organization' },
    { id: 'mxe', label: 'MXE Config' },
    { id: 'security', label: 'Security' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'danger', label: 'Danger Zone' },
  ];

  if (loading) return (
    <div className="p-24 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-amber" size={32} />
      <p className="text-[10px] uppercase tracking-widest text-white/40">Loading settings...</p>
    </div>
  );

  if (!org) return <div className="p-12 text-white/40">Failed to load organization settings.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-playfair italic text-amber tracking-tight mb-2">Settings</h1>
        <p className="text-[10px] uppercase text-white/40 tracking-widest">Manage your protocol configurations and MXE parameters.</p>
      </div>

      <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-4 text-[11px] uppercase tracking-widest border-b-[3px] transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? tab.id === 'danger' ? 'border-red-500 text-red-500' : 'border-amber text-amber'
                : 'border-transparent text-white/40 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-900 border border-white/5 p-12">
        
        {activeTab === 'general' && (
          <div className="space-y-8 animate-in fade-in">
            <h2 className="text-xl font-playfair italic text-white tracking-tight mb-6">Organization Profile</h2>
            <div className="max-w-md space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3">Organization Name</label>
                <input type="text" defaultValue={org.name} className="w-full bg-gray-800 border border-white/5 p-4 text-white focus:border-amber outline-none transition-colors text-sm" />
              </div>
              <button className="px-8 py-4 border border-amber text-amber hover:bg-amber/10 text-[11px] uppercase tracking-widest transition-colors flex items-center gap-3">
                <Save size={14} /> Save Changes
              </button>
            </div>
          </div>
        )}

        {activeTab === 'mxe' && (
          <div className="space-y-12 animate-in fade-in">
            <div>
              <h2 className="text-xl font-playfair italic text-white tracking-tight flex items-center gap-3 mb-4"><Network size={18} className="text-teal" /> MXE Configuration</h2>
              <p className="text-[11px] uppercase tracking-widest text-white/40 leading-loose max-w-2xl">Your Master Execution Environment runs securely across multiple Arx nodes using Threshold Signature Schemes.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3">Current Cluster ID</label>
                  <input readOnly value={org.clusterId} className="w-full bg-gray-950/50 border border-white/5 p-4 text-white/40 font-dm-mono cursor-not-allowed outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3">Jurisdictional Blacklist</label>
                  <select className="w-full bg-gray-800 border border-white/5 p-4 text-white focus:border-amber outline-none transition-colors text-sm appearance-none">
                    <option>None (Global computing)</option>
                    <option>Exclude US Nodes</option>
                    <option>Exclude EU Nodes</option>
                  </select>
                  <p className="text-[10px] uppercase tracking-widest text-white/20 mt-3 leading-relaxed">Exclude nodes in specific regions from processing your MPC computations.</p>
                </div>
                <button className="px-8 py-4 border border-white/20 text-white hover:bg-white hover:text-black text-[11px] uppercase tracking-widest transition-colors">Update Preferences</button>
              </div>

              <div className="bg-gray-800 border border-white/5 p-8">
                <h3 className="text-[10px] uppercase tracking-widest text-white/60 mb-6 pb-4 border-b border-white/5">Assigned Arx Nodes</h3>
                <div className="space-y-3">
                  {mockArxNodes.map((n, i) => (
                    <div key={n.id} className="flex justify-between items-center p-3 bg-gray-900 border border-white/5 text-[11px] uppercase tracking-widest text-white/60 font-dm-mono">
                      <span>{i+1}. {n.id}</span>
                      <span className="px-2 py-1 bg-obsidian border border-white/5">{n.jurisdiction}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8 animate-in fade-in">
            <h2 className="text-xl font-playfair italic text-white tracking-tight flex items-center gap-3"><Key size={18} className="text-amber" /> Security</h2>
            
            <div className="p-8 border-l border-amber bg-amber/5 max-w-2xl">
              <h3 className="text-[11px] uppercase tracking-widest text-amber mb-4">Master Signing Wallet</h3>
              <p className="font-dm-mono text-sm text-amber/80 bg-obsidian p-3 border border-amber/20 mb-6 inline-block truncate max-w-full">
                {publicKey?.toBase58() || org.adminWallet}
              </p>
              <p className="text-[11px] leading-loose text-amber/60">This wallet signature is required to authorize any on-chain MPC computation for <strong>{org.name}</strong>.</p>
            </div>

            <div className="space-y-6 max-w-md pt-4">
              <div className="flex items-center justify-between p-6 border border-white/5 bg-gray-800">
                <div>
                  <p className="text-white text-[11px] uppercase tracking-widest mb-1">Require 2FA</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">For settings changes</p>
                </div>
                <div className="w-10 h-6 bg-teal rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-obsidian rounded-full" />
                </div>
              </div>
              <button className="px-8 py-4 border border-white/20 hover:bg-white hover:text-black text-white text-[11px] uppercase tracking-widest transition-colors w-full">Rotate Signing Key</button>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-8 animate-in fade-in">
            <h2 className="text-xl font-playfair italic text-white tracking-tight mb-8">Accounting Integrations</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
              <div className="p-8 border border-white/5 bg-gray-800 hover:border-amber/30 transition-colors">
                <h3 className="font-playfair italic text-white mb-4 text-xl tracking-tight">QuickBooks</h3>
                <p className="text-[11px] leading-loose text-white/60 mb-8 max-w-[200px]">Export MPC aggregated totals to QuickBooks journal entries automatically.</p>
                <button className="px-8 py-3 border border-white/20 hover:bg-white hover:text-black text-white text-[11px] transition-colors uppercase tracking-widest">Connect</button>
              </div>
              <div className="p-8 border border-white/5 bg-gray-800 hover:border-amber/30 transition-colors">
                <h3 className="font-playfair italic text-white mb-4 text-xl tracking-tight">Xero</h3>
                <p className="text-[11px] leading-loose text-white/60 mb-8 max-w-[200px]">Sync private payroll spend directly into your Xero accounting flow.</p>
                <button className="px-8 py-3 border border-white/20 hover:bg-white hover:text-black text-white text-[11px] transition-colors uppercase tracking-widest">Connect</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'danger' && (
          <div className="space-y-6 max-w-xl animate-in fade-in">
            <div className="p-8 border border-red-500/20 bg-red-500/5">
              <div className="flex items-center gap-3 text-red-500 mb-6">
                <AlertTriangle size={20} />
                <h3 className="text-lg font-playfair italic tracking-tight">Revoke MXE</h3>
              </div>
              <p className="text-[11px] leading-loose text-red-200/70 mb-8 uppercase tracking-widest">
                Revoking your Multi-Party Computation environment will permanently destroy the decentralized key shares. You will not be able to process future payrolls or decrypt past on-chain payslips without them.
              </p>
              <button className="px-8 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 text-[11px] uppercase tracking-widest transition-colors">
                Permanently Revoke MXE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
