import React from 'react';
import { Lock } from 'lucide-react';

export function EncryptedInput({ 
  label, 
  placeholder,
  value,
  onChange,
  type = "text",
  required = false
}: { 
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-3">
      <label className="block text-[10px] uppercase tracking-widest text-white/40">
        {label} {required && <span className="text-amber">*</span>}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Lock size={14} className="text-amber" />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          className="bg-gray-800 border border-white/5 text-white/90 text-sm focus:border-amber block w-full pl-10 p-4 font-dm-mono outline-none transition-colors"
          placeholder={placeholder || "Encrypted before saving"}
        />
        <div className="absolute top-full left-0 mt-2 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none z-10 w-full md:w-64">
          <div className="bg-gray-950 border border-amber/20 text-[10px] uppercase tracking-widest leading-loose text-amber/80 p-4 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            This value will be encrypted client-side using your MXE&apos;s public key before leaving your browser.
          </div>
        </div>
      </div>
    </div>
  );
}
