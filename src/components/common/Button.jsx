import React from 'react';
import { motion } from 'framer-motion';
import { useSoundEffects } from '../../hooks/useSoundEffects';

export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}, ref) => {
  const { playSound } = useSoundEffects();

  const handleClick = (e) => {
    if (disabled || loading) return;
    playSound('click');
    if (onClick) onClick(e);
  };

  const variants = {
    primary: 'bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6366F1] text-white shadow-lg shadow-[#8B5CF6]/25 hover:shadow-[#8B5CF6]/40 hover:brightness-110 border border-white/10',
    secondary: 'bg-[#172033] hover:bg-[#1E293B] text-[#F8FAFC] border border-white/10 hover:border-white/20',
    cyan: 'bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#080B14] font-semibold shadow-lg shadow-[#22D3EE]/20 hover:brightness-110',
    ghost: 'bg-white/5 hover:bg-white/10 text-[#F8FAFC] border border-white/5 hover:border-white/15 backdrop-blur-md',
    glass: 'glass-pill text-[#F8FAFC] hover:bg-white/10 hover:border-white/20',
    coral: 'bg-gradient-to-r from-[#FB7185] to-[#F43F5E] text-white shadow-lg shadow-[#FB7185]/25 hover:brightness-110',
    danger: 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2 font-medium',
    lg: 'px-6 py-3.5 text-base rounded-2xl gap-2.5 font-semibold',
    icon: 'p-2.5 rounded-xl'
  };

  return (
    <motion.button
      ref={ref}
      whileTap={disabled || loading ? undefined : { scale: 0.97 }}
      whileHover={disabled || loading ? undefined : { y: -1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`inline-flex items-center justify-center transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children && <span>{children}</span>}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';
