import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Check, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { getUIText } from '../../services/translationService';
import { MediaImage } from '../common/MediaImage';

export function SpotlightHero({ media }) {
  const navigate = useNavigate();

  const { watchlist, toggleWatchlist, language } = useAppStore();
  const { playSound } = useSoundEffects();

  const isInWatchlist = media ? watchlist.includes(media.id) : false;

  if (!media) return null;

  const handlePlay = () => {
    playSound('click');
    navigate(`/watch/${media.id}`);
  };

  const handleWatchlist = () => {
    playSound('save');
    toggleWatchlist(media.id);
  };

  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[92vh] flex items-center justify-start overflow-hidden pt-20 sm:pt-24 pb-12">
      {/* Background Image / Ambient Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <MediaImage
          src={media.backdrop || media.poster}
          fallbackSrc={media.poster}
          alt={media.title}
          loading="eager"
          size="w1280"
          placeholderLabel={media.title}
          className="w-full h-full object-cover object-center filter brightness-[0.78] sm:brightness-[0.7] contrast-[1.08] scale-105 transition-transform duration-1000"
        />

        {/* Ambient Gradient Overlays for Cinematic Depth with High Visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080B14] via-[#080B14]/70 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-[#080B14]/25 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#080B14]/80 to-transparent pointer-events-none" />

        {/* Subtle Ambient Glowing Mesh */}
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#22D3EE]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Hero Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full pt-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black text-white tracking-tight leading-[1.05] mb-3">
            {media.title}
          </h1>

          {/* Tagline */}
          {media.tagline && (
            <p className="text-sm sm:text-base text-[#22D3EE] font-medium tracking-wide mb-3 italic">
              "{media.tagline}"
            </p>
          )}

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-gray-300 line-clamp-3 leading-relaxed max-w-xl mb-6 font-normal">
            {media.synopsis}
          </p>

          {/* Metadata Row */}
          <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-400 mb-8 font-medium">
            <span>{media.year}</span>
            <span>•</span>
            <span>{media.runtime}</span>
            <span>•</span>
            <div className="flex items-center gap-1.5 text-gray-300">
              {media.genres?.slice(0, 3).map((g, i) => (
                <span key={g}>
                  {g}{i < Math.min(2, media.genres.length - 1) ? ', ' : ''}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePlay}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#22D3EE] via-[#06B6D4] to-[#8B5CF6] text-[#080B14] font-display font-bold text-sm sm:text-base shadow-xl shadow-[#22D3EE]/25 hover:shadow-[#22D3EE]/40 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{getUIText('watchNow', language)}</span>
            </button>

            <button
              onClick={handleWatchlist}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#101626]/80 hover:bg-[#172033] text-white border border-white/15 hover:border-white/30 text-sm font-medium backdrop-blur-md active:scale-95 transition-all cursor-pointer"
            >
              {isInWatchlist ? (
                <>
                  <Check className="w-4 h-4 text-[#34D399]" />
                  <span>{getUIText('inWatchlist', language)}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{getUIText('addWatchlist', language)}</span>
                </>
              )}
            </button>

            <button
              onClick={() => navigate(`/title/${media.id}`)}
              className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:border-white/20 backdrop-blur-md active:scale-95 transition-all cursor-pointer"
              title="More info"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
