'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PlayCircle, Users, Activity, Loader2 } from 'lucide-react';
import { ClusterHealthCard } from '@/components/ClusterHealthCard';
import { PrivacyShield } from '@/components/PrivacyShield';
import { TxHashLink } from '@/components/TxHashLink';
import { dbOps, Organization, PayRun } from '@/lib/db';
import { useWallet } from '@solana/wallet-adapter-react';

export default function DashboardPage() {
  const { connected, publicKey } = useWallet();
  const [org, setOrg] = useState<Organization | null>(null);
  const [payRuns, setPayRuns] = useState<PayRun[]>([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const orgId = "org_demo"; // Linked to current workspace

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const storedOrgId = localStorage.getItem('arxpay_org_id') || "org_demo";
      const [orgData, runData, empData] = await Promise.all([
        dbOps.getOrganization(storedOrgId),
        dbOps.getPayRunsByOrg(storedOrgId),
        dbOps.getEmployeesByOrg(storedOrgId)
      ]);
      
      setOrg(orgData || { id: storedOrgId, name: 'Demo Workspace', adminWallet: publicKey?.toBase58() || '', clusterId: 'CLS-89XQ' });
      setPayRuns(runData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      setEmployeeCount(empData.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return (
    <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-amber" size={32} />
      <p className="text-[10px] uppercase tracking-widest text-white/40">Synchronizing Privacy Cluster...</p>
    </div>
  );

  const currentMonthRun = payRuns.length > 0 ? payRuns[0] : null;
  const totalSpendStr = currentMonthRun 
    ? (currentMonthRun.aggregateUsdc).toLocaleString() 
    : '0';

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-playfair italic text-amber tracking-tight mb-2">Employer Dashboard</h1>
          <p className="text-[10px] uppercase text-white/40 tracking-widest">Organization: <span className="font-dm-mono text-white/80">{org?.name}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/payroll/run" className="text-[11px] uppercase tracking-widest border border-amber text-amber px-6 py-4 flex items-center justify-center gap-3 hover:bg-amber/10 transition-colors w-full sm:w-auto">
            <PlayCircle size={14} />
            Run Payroll Now
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-6 border-l border-amber relative overflow-hidden">
          <div className="absolute top-4 right-4"><PrivacyShield /></div>
          <h3 className="text-[10px] uppercase text-white/40 tracking-widest mb-2">Total Payroll This Period</h3>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-amber text-lg">◎</span>
            <span className="text-4xl font-dm-mono text-white font-light">{totalSpendStr}</span>
            <span className="text-white/40 text-[10px] uppercase">USDC</span>
          </div>
          <p className="text-[10px] text-teal/80 mt-2 italic">Aggregate revealed via MPC. No individual amounts exposed.</p>
        </div>

        <div className="bg-gray-800 p-6 border-l border-white/10">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-[10px] uppercase text-white/40 tracking-widest">Active Employees</h3>
            <div className="text-white/40"><Users size={14} /></div>
          </div>
          <p className="text-4xl font-dm-mono text-white font-light mb-2">{employeeCount}</p>
          <div className="text-[10px] uppercase text-white/40 italic">Next payday in 5 days</div>
        </div>

        <div className="bg-gray-800 p-6 border-l border-white/10">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-[10px] uppercase text-white/40 tracking-widest">MXE Status</h3>
            <div className="text-teal"><Activity size={14} /></div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            <span className="text-xl text-white font-light">Active</span>
          </div>
          <p className="text-[10px] uppercase text-white/40 font-dm-mono tracking-widest">Cluster: {org?.clusterId}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Pay Runs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-playfair italic text-white flex-shrink-0">Recent Pay Runs</h2>
            <div className="h-[1px] flex-1 mx-8 bg-gradient-to-r from-white/20 to-transparent hidden sm:block"></div>
            <Link href="/payroll/history" className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">View All</Link>
          </div>
          
          <div className="bg-gray-900 border border-white/5 overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300 min-w-[600px]">
              <thead className="text-[10px] uppercase tracking-widest text-white/40 border-b border-white/5 bg-gray-950/50">
                <tr>
                  <th className="px-6 py-4 font-normal">Period</th>
                  <th className="px-6 py-4 font-normal text-right">Employees</th>
                  <th className="px-6 py-4 font-normal text-right">Aggregate (USDC)</th>
                  <th className="px-6 py-4 font-normal">Tx Hash</th>
                  <th className="px-6 py-4 font-normal">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payRuns.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-white/40 italic">No historical pay runs found.</td>
                  </tr>
                ) : (
                  payRuns.slice(0, 5).map((run) => (
                    <tr key={run.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-white/90">{run.period}</td>
                      <td className="px-6 py-4 text-right font-dm-mono">{run.employeeCount}</td>
                      <td className="px-6 py-4 text-right font-dm-mono text-amber">
                        {run.aggregateUsdc.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">{run.txHash ? <TxHashLink hash={run.txHash} /> : 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 text-[10px] uppercase tracking-widest ${run.status === 'complete' ? 'text-teal border-teal/20' : 'text-amber border-amber/20'} border`}>
                          {run.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cluster Health Sidebar */}
        <div>
          <ClusterHealthCard />
        </div>
      </div>
    </div>
  );
}
