import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../layouts/AppShell';
import { useAppStore } from '../store/useAppStore';
import { Play, Plus, Check, Star, Layers, Volume2, Globe, Share2, LoaderCircle } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { EpisodeCard } from '../components/cards/EpisodeCard';
import { MediaCard } from '../components/cards/MediaCard';
import { MediaImage } from '../components/common/MediaImage';
import { CastAvatar } from '../components/common/CastAvatar';
import { useCatalog, useMediaDetails } from '../hooks/useCatalog';

export function TitleDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: media, isLoading, error } = useMediaDetails(id);
  const { data: catalog } = useCatalog();

  const { watchlist, toggleWatchlist } = useAppStore();
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [copied, setCopied] = useState(false);

  const isInWatchlist = media ? watchlist.includes(media.id) : false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading && !media) return <div className="flex min-h-screen items-center justify-center bg-[#080B14]"><LoaderCircle className="h-8 w-8 animate-spin text-[#22D3EE]" /></div>;
  if (!media) return <div className="flex min-h-screen items-center justify-center bg-[#080B14] text-white">{error ? 'This title could not be loaded.' : 'Title not found.'}</div>;

  const firstSeasonNumber = media.seasons?.[0]?.seasonNumber || 1;
  const activeSeason = media.seasons?.some((season) => season.seasonNumber === selectedSeason) ? selectedSeason : firstSeasonNumber;
  const currentSeasonData = media.seasons?.find(s => s.seasonNumber === activeSeason) || media.seasons?.[0];
  const seasonEpisodes = (currentSeasonData?.episodes && currentSeasonData.episodes.length > 0)
    ? currentSeasonData.episodes
    : Array.from({ length: currentSeasonData?.episodesCount || 10 }, (_, i) => ({
        episodeNumber: i + 1,
        title: `Episode ${i + 1}`,
        runtime: '48m',
        thumbnail: media.backdrop || media.poster,
        synopsis: `${media.title} Season ${currentSeasonData?.seasonNumber || activeSeason} Episode ${i + 1}. Full streaming.`
      }));

  const similarTitles = catalog.filter(m => m.id !== media.id && m.genres?.some(g => media.genres?.includes(g))).slice(0, 6);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AppShell>
      {/* Editorial Backdrop Hero */}
      <section className="relative w-full min-h-[65vh] sm:min-h-[75vh] flex items-end pt-24 sm:pt-28 pb-8 sm:pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <MediaImage
            src={media.backdrop || media.poster}
            fallbackSrc={media.poster}
            alt={media.title}
            loading="eager"
            size="w1280"
            placeholderLabel={media.title}
            className="w-full h-full object-cover brightness-[0.78] sm:brightness-[0.72] contrast-[1.05]"
          />
          {/* Gradients tuned for high picture visibility and text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-[#080B14]/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080B14]/85 via-[#080B14]/30 to-transparent hidden sm:block" />
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#080B14]/80 to-transparent pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full flex flex-col sm:flex-row items-start sm:items-end gap-5 sm:gap-8">
          {/* Poster Artwork - prominently visible on BOTH mobile and desktop */}
          <div className="w-28 sm:w-52 md:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20 shrink-0 shadow-black/80 bg-[#101626]">
            <MediaImage
              src={media.poster || media.backdrop}
              fallbackSrc={media.backdrop}
              alt={media.title}
              size="w500"
              placeholderLabel={media.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Heading */}
          <div className="flex-1 max-w-3xl min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <Badge variant="cyan" size="sm">VIDSRC</Badge>
              <Badge variant="coral" size="sm">MULTI-SUBTITLE</Badge>
              <Badge variant="maturity" size="sm">{media.maturityRating}</Badge>
              <span className="text-xs font-mono font-bold text-[#34D399] ml-1">
                {Number(media.matchScore) > 0 ? `${media.matchScore}% rating` : 'Available on VidSrc'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-display font-black text-white tracking-tight leading-tight mb-2">
              {media.title}
            </h1>

            {media.tagline && (
              <p className="text-xs sm:text-base text-[#22D3EE] italic mb-2.5">
                "{media.tagline}"
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400 mb-5">
              <span>{media.year}</span>
              <span>•</span>
              <span>{media.runtime}</span>
              <span>•</span>
              <span className="truncate max-w-[200px] sm:max-w-none">{media.genres?.join(', ')}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" /> {media.rating} ({media.votes})
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate(`/watch/${media.id}`)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#22D3EE] via-[#06B6D4] to-[#8B5CF6] text-[#080B14] font-bold text-sm shadow-xl shadow-[#22D3EE]/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Stream</span>
              </button>

              <button
                onClick={() => toggleWatchlist(media.id)}
                className="flex items-center justify-center gap-2 px-4 sm:px-5 py-3.5 rounded-xl bg-[#101626]/85 hover:bg-[#172033] text-white border border-white/15 text-xs sm:text-sm font-medium backdrop-blur-md active:scale-95 transition-all cursor-pointer"
              >
                {isInWatchlist ? <Check className="w-4 h-4 text-[#34D399]" /> : <Plus className="w-4 h-4" />}
                <span>{isInWatchlist ? 'In My Space' : 'Add to My Space'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0"
                title="Share title"
              >
                <Share2 className="w-4 h-4" />
              </button>
              {copied && <span className="text-xs font-mono text-[#34D399] ml-1">Copied link!</span>}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Details Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left 2 Cols: Synopsis, Episodes (if TV), Cast */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h3 className="text-xl font-display font-bold text-white mb-3">
                Synopsis
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                {media.synopsis}
              </p>
            </div>

            {/* TV Show Episodes Explorer */}
            {media.type === 'series' && media.seasons && (
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#22D3EE]" />
                    <h3 className="text-xl font-display font-bold text-white">
                      Episodes
                    </h3>
                  </div>

                  {/* Season switcher */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {media.seasons.map((s) => (
                      <button
                        key={s.seasonNumber}
                        onClick={() => setSelectedSeason(s.seasonNumber)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                          activeSeason === s.seasonNumber
                            ? 'bg-[#22D3EE] text-[#080B14] border-[#22D3EE]'
                            : 'bg-white/5 text-gray-300 hover:text-white border-white/10'
                        }`}
                      >
                        Season {s.seasonNumber}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Episode Cards */}
                <div className="space-y-3">
                  {seasonEpisodes.map((ep) => (
                    <EpisodeCard
                      key={ep.episodeNumber}
                      episode={ep}
                      seasonNumber={currentSeasonData?.seasonNumber || activeSeason}
                      onPlay={(s, e) => navigate(`/watch/${media.id}?season=${s}&episode=${e}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Cast & Creators */}
            {media.cast?.length > 0 && (
              <div>
                <h3 className="text-xl font-display font-bold text-white mb-4">
                  Cast & Characters
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {media.cast.map((person) => (
                    <CastAvatar key={`${person.name}-${person.role}`} src={person.image} name={person.name} role={person.role} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Audio, Subtitles, Studio Specs */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#22D3EE]">
                Audio & Subtitle Specifications
              </h4>

              <div>
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  Available Audio Tracks
                </div>
                <div className="text-xs text-white font-medium">
                  {media.audioLanguages?.join(', ') || 'Provider audio'}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#22D3EE]" />
                  Subtitle Request Languages
                </div>
                <div className="text-xs text-white font-medium">
                  {media.subtitleLanguages?.join(', ') || 'Select a language in the player'}
                </div>
              </div>

              <div className="border-t border-white/10 pt-3 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Director:</span>
                  <span className="text-white font-medium">{media.director}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Content Rating:</span>
                  <span className="text-white font-medium">{media.maturityRating}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">IMDb Identifier:</span>
                  <span className="text-[#22D3EE] font-mono">{media.imdbId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Titles Shelf */}
        <section className="pt-6 border-t border-white/10">
          <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-6">
            Titles in Similar Orbit
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similarTitles.map((item) => (
              <MediaCard key={item.id} media={item} variant="poster" />
            ))}
          </div>
        </section>

      </div>
    </AppShell>
  );
}
