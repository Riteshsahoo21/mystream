import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { MediaImage } from '../common/MediaImage';

export function EditorialCard({ collection, className = '' }) {
  if (!collection) return null;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className={`group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 ${className}`}
    >
      <Link to={`/discover?genre=${encodeURIComponent(collection.genre || '')}`} className="relative block aspect-[16/9] w-full overflow-hidden sm:aspect-[21/9]">
        <MediaImage
          src={collection.bannerImage}
          alt={collection.title}
          size="w1280"
          placeholderLabel={collection.title}
          className="h-full w-full object-cover brightness-75 transition-all duration-700 group-hover:scale-105 group-hover:brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-[#080B14]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080B14]/80 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 max-w-2xl p-6 sm:p-8">
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/20 px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider text-[#C4B5FD]">
            <Sparkles className="h-3 w-3 text-[#22D3EE]" /> Curated collection
          </span>
          <h3 className="mb-2 text-xl font-bold leading-tight text-white transition-colors group-hover:text-[#22D3EE] sm:text-3xl">{collection.title}</h3>
          <p className="mb-4 line-clamp-2 max-w-xl text-xs text-gray-300 sm:text-sm">{collection.subtitle}</p>
          <span className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] px-4 py-2 text-xs font-bold text-[#080B14] shadow-lg shadow-[#8B5CF6]/30">
            <Play className="h-3.5 w-3.5 fill-current" /> Explore collection
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
