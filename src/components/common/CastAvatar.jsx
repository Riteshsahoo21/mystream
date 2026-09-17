import { useState } from 'react';

export function CastAvatar({ src, name = '', role = '', className = '' }) {
  const [failedSrc, setFailedSrc] = useState('');
  const showImage = Boolean(src) && failedSrc !== src;

  // Derive initials
  const initials = name
    .split(' ')
    .map(part => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'RP';

  return (
    <div className={`flex items-center gap-3 p-3 rounded-2xl bg-[#101626]/80 hover:bg-[#172033] border border-white/5 hover:border-white/15 transition-all group ${className}`}>
      <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-white/10 bg-[#172033] flex items-center justify-center">
        {showImage ? (
          <img
            src={src}
            alt={name}
            onError={() => setFailedSrc(src)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center text-xs font-display font-bold text-[#080B14]">
            {initials}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="text-xs sm:text-sm font-display font-semibold text-white group-hover:text-[#22D3EE] transition-colors truncate">
          {name}
        </h4>
        <p className="text-[11px] text-gray-400 truncate">
          {role}
        </p>
      </div>
    </div>
  );
}
