import React from 'react';
import { Link } from 'react-router-dom';
import { MediaImage } from '../common/MediaImage';

export function RankedCard({ media, rank }) {
  if (!media) return null;

  return (
    <Link
      to={`/title/${media.id}`}
      className="group flex items-center gap-4 p-3 rounded-2xl bg-[#101626]/70 hover:bg-[#172033] border border-white/5 hover:border-[#22D3EE]/30 transition-all cursor-pointer"
    >
      <div className="w-12 text-center shrink-0">
        <span className="font-display font-black text-4xl text-gray-600 group-hover:text-[#22D3EE] transition-colors">
          0{rank}
        </span>
      </div>

      <div className="w-16 sm:w-20 aspect-[2/3] rounded-xl overflow-hidden shrink-0 bg-[#080B14] border border-white/10">
        <MediaImage
          src={media.poster || media.backdrop}
          fallbackSrc={media.backdrop}
          alt={media.title}
          size="w500"
          placeholderLabel={media.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-display font-semibold text-sm sm:text-base text-white group-hover:text-[#22D3EE] transition-colors truncate">
          {media.title}
        </h4>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
          <span>{media.year}</span>
          <span>•</span>
          <span className="text-[#34D399] font-mono">{media.matchScore}% Match</span>
        </div>
        <span className="inline-block mt-2 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">
          {media.genres?.[0] || 'Featured'}
        </span>
      </div>
    </Link>
  );
}
