import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { MediaImage } from '../common/MediaImage';

export function EpisodeCard({ episode, seasonNumber = 1, isCurrent = false, onPlay }) {
  if (!episode) return null;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
        isCurrent
          ? 'bg-[#172033] border-[#22D3EE]/50 shadow-lg shadow-[#22D3EE]/10'
          : 'bg-[#101626]/70 hover:bg-[#172033] border-white/5 hover:border-white/15'
      }`}
      onClick={() => onPlay && onPlay(seasonNumber, episode.episodeNumber)}
    >
      <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
        {/* Episode Thumbnail */}
        <div className="relative w-28 sm:w-36 aspect-video rounded-xl overflow-hidden shrink-0 bg-[#080B14] border border-white/10">
          <MediaImage
            src={episode.thumbnail}
            alt={episode.title}
            size="w500"
            placeholderLabel={episode.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-[#080B14]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-[#22D3EE] text-[#080B14] flex items-center justify-center shadow-lg">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
          </div>
          {isCurrent && (
            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#22D3EE] text-[#080B14] text-[10px] font-bold">
              Playing
            </div>
          )}
        </div>

        {/* Title & Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-[#22D3EE] font-semibold">
              EP {episode.episodeNumber}
            </span>
            <span className="text-xs text-gray-400">• {episode.runtime}</span>
          </div>
          <h4 className="text-sm sm:text-base font-display font-semibold text-white group-hover:text-[#22D3EE] transition-colors line-clamp-1">
            {episode.title}
          </h4>
          <p className="text-xs text-gray-400 line-clamp-2 mt-1 max-w-xl">
            {episode.synopsis}
          </p>
        </div>
      </div>

      {/* Play Action Trigger */}
      <div className="self-end sm:self-center shrink-0">
        <button
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            isCurrent
              ? 'bg-[#22D3EE] text-[#080B14] shadow-md'
              : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Play</span>
        </button>
      </div>
    </motion.div>
  );
}

export function MoodCard({ mood, isSelected = false, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative p-4 rounded-2xl text-left border transition-all cursor-pointer overflow-hidden ${
        isSelected
          ? 'bg-[#172033] border-[#22D3EE] shadow-lg shadow-[#22D3EE]/20 ring-1 ring-[#22D3EE]'
          : 'bg-[#101626]/80 hover:bg-[#172033] border-white/10 hover:border-white/20'
      }`}
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-20"
        style={{ backgroundColor: mood.color }}
      />
      <div className="text-2xl mb-2">{mood.emoji || '✨'}</div>
      <div className="font-display font-semibold text-sm text-white">{mood.name}</div>
      <div className="text-[11px] text-gray-400 mt-0.5">Explore Vibe</div>
    </motion.button>
  );
}
