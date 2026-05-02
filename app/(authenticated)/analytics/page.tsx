'use client';
import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PrivacyShield } from '@/components/PrivacyShield';

const monthlySpend = [
  { month: 'Oct', amount: 38000 },
  { month: 'Nov', amount: 41000 },
  { month: 'Dec', amount: 41000 },
  { month: 'Jan', amount: 44000 },
  { month: 'Feb', amount: 43100 },
  { month: 'Mar', amount: 45200 },
];

const headcountData = [
  { month: 'Oct', count: 10 },
  { month: 'Nov', count: 11 },
  { month: 'Dec', count: 11 },
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 11 },
  { month: 'Mar', count: 12 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="md:flex items-end justify-between border-b border-gray-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-playfair italic text-white tracking-tight mb-2">Privacy-Preserving Analytics</h1>
          <p className="text-[10px] uppercase tracking-widest text-white/40 max-w-2xl leading-loose">
            All data below is computed over encrypted inputs via Arcium&apos;s MPC network. 
            Individual salaries are never revealed to generate these insights.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Total Spend Chart */}
        <div className="bg-gray-900 border border-white/5 p-8 hover:border-amber/30 transition-colors">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-white text-lg tracking-tight font-playfair italic mb-2">Total Payroll Spend (USDC)</h3>
              <p className="text-[10px] uppercase tracking-widest text-white/40">Trailing 6 months aggregate</p>
            </div>
            <PrivacyShield />
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySpend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
                <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'monospace' }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0A0F', borderColor: '#2a2a35', borderRadius: '8px' }}
                  itemStyle={{ color: '#D4AF37', fontFamily: 'monospace' }}
                  formatter={(value: any) => [Number(value).toLocaleString(), 'USDC']}
                />
                <Line type="monotone" dataKey="amount" stroke="#D4AF37" strokeWidth={3} dot={{ r: 4, fill: '#0A0A0F', stroke: '#D4AF37', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Headcount Chart */}
        <div className="bg-gray-900 border border-white/5 p-8 transition-colors">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-white text-lg tracking-tight font-playfair italic mb-2">Employee Headcount</h3>
              <p className="text-[10px] uppercase tracking-widest text-white/40">Active employees per period</p>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={headcountData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
                <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#1a1a24' }}
                  contentStyle={{ backgroundColor: '#0A0A0F', borderColor: '#2a2a35', borderRadius: '8px' }}
                  itemStyle={{ color: '#00C9B1', fontFamily: 'monospace' }}
                />
                <Bar dataKey="count" fill="#00C9B1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* KPI Cards */}
        <div className="col-span-full grid md:grid-cols-3 gap-8 mt-4">
          <div className="col-span-full mb-[-12px]">
            <h3 className="text-xl font-playfair italic tracking-tight text-white">Aggregated Metrics (YTD)</h3>
          </div>
          
          <div className="bg-gray-900 border border-white/5 p-8 relative overflow-hidden group hover:border-teal/50 transition-colors">
            <div className="absolute right-0 top-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity"><PrivacyShield /></div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3">Average Sub-Deduction Rate</p>
            <p className="text-3xl font-dm-mono text-white/90 font-light">18.4%</p>
          </div>

          <div className="bg-gray-900 border border-white/5 p-8 relative overflow-hidden group hover:border-teal/50 transition-colors">
            <div className="absolute right-0 top-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity"><PrivacyShield /></div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3">Total Voluntary Deductions</p>
            <p className="text-3xl font-dm-mono text-white/90 font-light">12,450 <span className="text-[10px] uppercase tracking-widest text-white/20">USDC</span></p>
          </div>

          <div className="bg-gray-900 border border-white/5 p-8 relative overflow-hidden group hover:border-teal/50 transition-colors">
            <div className="absolute right-0 top-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity"><PrivacyShield /></div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3">Total Gross Processed</p>
            <p className="text-3xl font-dm-mono text-white/90 font-light">252,300 <span className="text-[10px] uppercase tracking-widest text-white/20">USDC</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
