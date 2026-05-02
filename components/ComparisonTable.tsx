import React from 'react';
import { Check, X, Minus } from 'lucide-react';

const options = [
  { feature: 'On-chain Privacy', hush: 'Full', bitwage: 'None', request: 'None', superfluid: 'None' },
  { feature: 'MPC Computation', hush: 'Yes', bitwage: 'No', request: 'No', superfluid: 'No' },
  { feature: 'Employee-only decryption', hush: 'Yes', bitwage: 'No', request: 'No', superfluid: 'No' },
  { feature: 'Solana Native', hush: 'Yes', bitwage: 'No', request: 'No', superfluid: 'Partial' },
  { feature: 'No gas for employees', hush: 'Yes', bitwage: 'Yes', request: 'No', superfluid: 'No' }
];

export function ComparisonTable() {
  return (
    <div className="w-full overflow-x-auto border border-white/10 bg-gray-900">
      <table className="w-full text-left text-sm text-white/80">
        <thead className="bg-gray-950/50 border-b border-white/10 text-[10px] uppercase tracking-widest text-white/40">
          <tr>
            <th scope="col" className="px-6 py-4 font-normal">Feature</th>
            <th scope="col" className="px-6 py-4 text-amber font-playfair italic normal-case text-base tracking-tight">HushHush Pay</th>
            <th scope="col" className="px-6 py-4 font-normal">Bitwage</th>
            <th scope="col" className="px-6 py-4 font-normal">Request Finance</th>
            <th scope="col" className="px-6 py-4 font-normal">Superfluid</th>
          </tr>
        </thead>
        <tbody>
          {options.map((opt, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 text-white text-xs uppercase tracking-widest">{opt.feature}</td>
              <td className="px-6 py-4 text-[11px] uppercase tracking-widest text-amber flex items-center gap-2">
                {opt.hush === 'Yes' || opt.hush === 'Full' ? <Check size={14} /> : <X size={14} />}
                {opt.hush}
              </td>
              <td className="px-6 py-4 text-[11px] uppercase tracking-widest text-white/40">
                <div className="flex items-center gap-2">
                  {opt.bitwage === 'Yes' ? <Check size={14} /> : <Minus size={14} />}
                  <span>{opt.bitwage}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-[11px] uppercase tracking-widest text-white/40">
                <div className="flex items-center gap-2">
                  {opt.request === 'Yes' ? <Check size={14} /> : <Minus size={14} />}
                  <span>{opt.request}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-[11px] uppercase tracking-widest text-white/40">
                <div className="flex items-center gap-2">
                  {opt.superfluid === 'Yes' ? <Check size={14} /> : <Minus size={14} />}
                  <span>{opt.superfluid}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
