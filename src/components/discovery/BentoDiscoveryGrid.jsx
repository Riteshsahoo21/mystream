import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { MediaImage } from '../common/MediaImage';

export function BentoDiscoveryGrid({ items = [] }) {
  if (!items || items.length < 4) return null;

  const [leadItem, secondItem, thirdItem, fourthItem] = items;

  return (
    <section className="py-8 sm:py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-mono uppercase text-[#8B5CF6] tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" /> Editorial Bento Spotlight
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
            Curated Dimensions
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-[220px] sm:auto-rows-[260px]">
        
        {/* Large Tile (2 cols, 2 rows) */}
        {leadItem && (
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden glass-panel border border-white/10 group cursor-pointer"
          >
            <Link to={`/title/${leadItem.id}`} className="block w-full h-full relative">
              <MediaImage
                src={leadItem.backdrop || leadItem.poster}
                fallbackSrc={leadItem.poster}
                alt={leadItem.title}
                size="w1280"
                placeholderLabel={leadItem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75 group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-[#080B14]/40 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#8B5CF6]/30 border border-[#8B5CF6]/40 text-xs font-mono text-[#C4B5FD] backdrop-blur-md">
                  Spotlight Feature
                </span>
                <span className="text-xs font-mono text-[#34D399] font-semibold">{leadItem.matchScore}% Resonance</span>
              </div>
              <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                <h3 className="text-2xl sm:text-4xl font-display font-black text-white mb-2 leading-tight group-hover:text-[#22D3EE] transition-colors">
                  {leadItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 max-w-lg mb-4">
                  {leadItem.synopsis}
                </p>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-[#080B14] text-xs font-bold shadow-lg shadow-[#8B5CF6]/25">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Stream Now
                </span>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Second Tile (1 col, 2 rows - Tall) */}
        {secondItem && (
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-1 md:row-span-2 relative rounded-3xl overflow-hidden glass-panel border border-white/10 group cursor-pointer"
          >
            <Link to={`/title/${secondItem.id}`} className="block w-full h-full relative">
              <MediaImage
                src={secondItem.poster || secondItem.backdrop}
                fallbackSrc={secondItem.backdrop}
                alt={secondItem.title}
                size="w500"
                placeholderLabel={secondItem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75 group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-[#080B14]/30 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 rounded-full bg-[#22D3EE]/20 border border-[#22D3EE]/30 text-[11px] font-mono text-[#22D3EE] backdrop-blur-md">
                  {secondItem.type === 'series' ? 'TV Series' : 'Blockbuster'}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 p-5">
                <h4 className="text-lg sm:text-xl font-display font-bold text-white mb-1 group-hover:text-[#22D3EE] transition-colors">
                  {secondItem.title}
                </h4>
                <div className="text-xs text-gray-300 line-clamp-1 mb-2 font-mono">
                  {secondItem.runtime} • {secondItem.year}
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Third Tile (1 col, 1 row) */}
        {thirdItem && (
          <motion.div
            whileHover={{ y: -3 }}
            className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 group cursor-pointer"
          >
            <Link to={`/title/${thirdItem.id}`} className="block w-full h-full relative">
              <MediaImage
                src={thirdItem.backdrop || thirdItem.poster}
                fallbackSrc={thirdItem.poster}
                alt={thirdItem.title}
                size="w780"
                placeholderLabel={thirdItem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-70 group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <div className="text-[10px] font-mono uppercase text-[#FB7185] mb-0.5">Top Acclaimed</div>
                <h4 className="text-sm sm:text-base font-display font-bold text-white truncate group-hover:text-[#22D3EE] transition-colors">
                  {thirdItem.title}
                </h4>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Fourth Tile (1 col, 1 row) */}
        {fourthItem && (
          <motion.div
            whileHover={{ y: -3 }}
            className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 group cursor-pointer"
          >
            <Link to={`/title/${fourthItem.id}`} className="block w-full h-full relative">
              <MediaImage
                src={fourthItem.backdrop || fourthItem.poster}
                fallbackSrc={fourthItem.poster}
                alt={fourthItem.title}
                size="w780"
                placeholderLabel={fourthItem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-70 group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <div className="text-[10px] font-mono uppercase text-[#34D399] mb-0.5">Editor's Choice</div>
                <h4 className="text-sm sm:text-base font-display font-bold text-white truncate group-hover:text-[#22D3EE] transition-colors">
                  {fourthItem.title}
                </h4>
              </div>
            </Link>
          </motion.div>
        )}

      </div>
    </section>
  );
}
