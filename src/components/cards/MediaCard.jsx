import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Plus, Check, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { Badge } from '../common/Badge';
import { MediaImage } from '../common/MediaImage';

export function MediaCard({
  media,
  variant = 'poster', // 'poster' | 'wide'
  rank = null,
  className = ''
}) {
  const navigate = useNavigate();
  const { watchlist, toggleWatchlist, watchProgress } = useAppStore();
  const { playSound } = useSoundEffects();

  if (!media) return null;

  const isInWatchlist = watchlist.includes(media.id);
  const savedProgress = watchProgress[media.id];
  const imageSrc = variant === 'wide' ? (media.backdrop || media.poster) : (media.poster || media.backdrop);
  const score = Number(media.matchScore) > 0 ? `${media.matchScore}%` : 'VidSrc';

  const handleWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    playSound('save');
    toggleWatchlist(media.id);
  };

  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    playSound('click');
    navigate(`/watch/${media.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`group relative h-full overflow-hidden rounded-2xl border border-white/5 bg-[#101626] shadow-lg transition-all duration-300 hover:border-[#8B5CF6]/40 hover:shadow-2xl hover:shadow-[#8B5CF6]/20 ${className}`}
    >
      <Link to={`/title/${media.id}`} className="relative flex h-full w-full flex-col">
        {/* Aspect Ratio Container */}
        <div className={`w-full relative overflow-hidden bg-[#172033] ${
          variant === 'wide' ? 'aspect-video' : 'aspect-[2/3]'
        }`}>
          <MediaImage
            src={imageSrc}
            fallbackSrc={variant === 'wide' ? media.poster : media.backdrop}
            alt={media.title}
            size={variant === 'wide' ? 'w1280' : 'w500'}
            placeholderLabel={media.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Rank Overlay for Top 10 */}
          {rank && (
            <div className="absolute top-2 left-2 flex items-center justify-center w-8 h-8 rounded-lg bg-[#080B14]/80 backdrop-blur-md border border-white/15">
              <span className="font-display font-black text-sm bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
                #{rank}
              </span>
            </div>
          )}

          {/* Quality Badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
            {media.quality?.includes('4K') && <Badge variant="cyan" size="xs">4K</Badge>}
            <Badge variant="maturity" size="xs">{media.maturityRating || 'NR'}</Badge>
          </div>

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-[#080B14]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

          {/* Continue Watching Progress Bar */}
          {savedProgress && savedProgress.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 z-10">
              <div
                className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] shadow-[0_0_8px_#22D3EE]"
                style={{ width: `${Math.min(100, Math.round(savedProgress.progress * 100))}%` }}
              />
            </div>
          )}
        </div>

        {/* Info & Overlay on Hover */}
        <div className="relative z-10 flex min-h-[128px] min-w-0 flex-1 flex-col p-3 sm:min-h-[136px] sm:p-4">
          <div className="min-w-0">
            <div className="mb-1 flex min-w-0 items-start justify-between gap-2">
              <h3 className="min-w-0 flex-1 truncate font-display text-sm font-semibold leading-5 text-white transition-colors group-hover:text-[#22D3EE] sm:text-base">
                {media.title}
              </h3>
              <div className="flex items-center gap-1 text-[11px] font-mono text-[#34D399] shrink-0 font-medium">
                <span>{score}</span>
              </div>
            </div>

            <div className="mb-3 flex min-w-0 items-center gap-1.5 overflow-hidden text-xs text-gray-400">
              <span>{media.year?.split(' ')[0] || '—'}</span>
              <span>•</span>
              <span className="min-w-0 truncate">{media.runtime || 'Runtime pending'}</span>
              {media.genres?.[0] && (
                <>
                  <span>•</span>
                  <span className="hidden truncate sm:inline">{media.genres[0]}</span>
                </>
              )}
            </div>
          </div>

          {/* Card Hover Action Bar */}
          <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-2">
            <button
              onClick={handlePlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-[#080B14] text-xs font-semibold shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{savedProgress ? 'Resume' : 'Play'}</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={handleWatchlist}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                title={isInWatchlist ? 'Remove from Space' : 'Add to My Space'}
              >
                {isInWatchlist ? (
                  <Check className="w-3.5 h-3.5 text-[#34D399]" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/title/${media.id}`);
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                title="View details"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
