import React from 'react';

export function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const variants = {
    default: 'bg-white/10 text-[#F8FAFC] border-white/10',
    violet: 'bg-[#8B5CF6]/15 text-[#C4B5FD] border-[#8B5CF6]/30',
    cyan: 'bg-[#22D3EE]/15 text-[#67E8F9] border-[#22D3EE]/30',
    coral: 'bg-[#FB7185]/15 text-[#FDA4AF] border-[#FB7185]/30',
    gold: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
    emerald: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
    maturity: 'bg-[#101626] text-[#94A3B8] border-white/15 font-mono'
  };

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5 rounded tracking-wider',
    sm: 'text-xs px-2.5 py-1 rounded-md',
    md: 'text-sm px-3 py-1 rounded-lg'
  };

  return (
    <span className={`inline-flex items-center justify-center font-medium border uppercase tracking-wider backdrop-blur-sm ${variants[variant] || variants.default} ${sizes[size] || sizes.sm} ${className}`}>
      {children}
    </span>
  );
}
