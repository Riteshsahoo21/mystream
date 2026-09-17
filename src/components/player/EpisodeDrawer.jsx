import { useState } from 'react';
import { X, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaImage } from '../common/MediaImage';

export function EpisodeDrawer({
  media,
  currentSeason = 1,
  currentEpisode = 1,
  isOpen = false,
  onClose,
  onSelectEpisode
}) {
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState(currentSeason);

  if (!media || media.type !== 'series') return null;

  const seasons = media.seasons || [
    {
      seasonNumber: 1,
      title: 'Season 1',
      episodesCount: 10,
      episodes: []
    }
  ];

  const currentSeasonData = seasons.find(s => s.seasonNumber === selectedSeasonNumber) || seasons[0];

  const episodesList = (currentSeasonData?.episodes && currentSeasonData.episodes.length > 0)
    ? currentSeasonData.episodes
    : Array.from({ length: currentSeasonData?.episodesCount || 10 }, (_, i) => ({
        episodeNumber: i + 1,
        title: `Episode ${i + 1}`,
        runtime: '48m',
        thumbnail: media.backdrop || media.poster,
        synopsis: `${media.title} Season ${selectedSeasonNumber} Episode ${i + 1}.`
      }));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#080B14]/60 backdrop-blur-sm"
          />

          {/* Drawer Body */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#101626]/95 border-l border-white/10 h-full flex flex-col z-10 shadow-2xl p-6 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <h3 className="text-lg font-display font-bold text-white leading-tight">
                  Episodes & Seasons
                </h3>
                <span className="text-xs text-[#22D3EE] font-mono">{media.title}</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Season Selector Tabs */}
            {seasons.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-2">
                {seasons.map((season) => {
                  const isActive = season.seasonNumber === selectedSeasonNumber;
                  return (
                    <button
                      key={season.seasonNumber}
                      onClick={() => setSelectedSeasonNumber(season.seasonNumber)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                        isActive
                          ? 'bg-[#22D3EE] text-[#080B14] border-[#22D3EE] shadow-md shadow-[#22D3EE]/20'
                          : 'bg-white/5 text-gray-300 hover:text-white border-white/10'
                      }`}
                    >
                      {season.title || `Season ${season.seasonNumber}`}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Episode List */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
              {episodesList.map((ep) => {
                const isPlaying = currentSeason === currentSeasonData.seasonNumber && currentEpisode === ep.episodeNumber;

                return (
                  <div
                    key={ep.episodeNumber}
                    onClick={() => onSelectEpisode && onSelectEpisode(currentSeasonData.seasonNumber, ep.episodeNumber)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${
                      isPlaying
                        ? 'bg-[#172033] border-[#22D3EE] shadow-md'
                        : 'bg-white/5 hover:bg-white/10 border-white/5'
                    }`}
                  >
                    <div className="relative w-24 aspect-video rounded-lg overflow-hidden shrink-0 bg-black">
                      <MediaImage
                        src={ep.thumbnail || media.backdrop}
                        fallbackSrc={media.poster}
                        alt={ep.title}
                        size="w500"
                        placeholderLabel={ep.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-white fill-current" />
                      </div>
                      {isPlaying && (
                        <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-[#22D3EE] text-[#080B14] text-[9px] font-bold">
                          PLAYING
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono mb-0.5">
                        <span>EP {ep.episodeNumber}</span>
                        <span>{ep.runtime}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-display font-semibold text-white truncate group-hover:text-[#22D3EE] transition-colors">
                        {ep.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">
                        {ep.synopsis}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
