import React, { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { DualPlayer } from '../components/player/DualPlayer';
import { useAppStore } from '../store/useAppStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { Layers, Info, Check, Plus, LoaderCircle, ExternalLink, Download } from 'lucide-react';
import { MediaCard } from '../components/cards/MediaCard';
import { Badge } from '../components/common/Badge';
import { useCatalog, useMediaDetails } from '../hooks/useCatalog';
import { getDirectDownloadUrl, getStreamUrl } from '../services/vidsrcService';

export function WatchPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const seasonParam = parseInt(searchParams.get('season') || '1', 10);
  const episodeParam = parseInt(searchParams.get('episode') || '1', 10);

  const { data: media, isLoading, error } = useMediaDetails(id);
  const { data: catalog } = useCatalog();
  const { watchlist, toggleWatchlist, language } = useAppStore();
  const { activeServer, season, episode, setDrawerOpen, subtitleLanguage } = usePlayerStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, seasonParam, episodeParam]);

  if (isLoading && !media) {
    return <div className="flex min-h-screen items-center justify-center bg-[#080B14]"><LoaderCircle className="h-8 w-8 animate-spin text-[#22D3EE]" /></div>;
  }

  if (!media) {
    return (
      <div className="min-h-screen bg-[#080B14] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-display font-bold text-white mb-2">{error ? 'Title Could Not Be Loaded' : 'Title Not Found'}</h2>
        <button
          onClick={() => navigate('/home')}
          className="px-4 py-2 rounded-xl bg-[#22D3EE] text-[#080B14] font-bold text-sm"
        >
          Return to Orbit
        </button>
      </div>
    );
  }

  const isInWatchlist = watchlist.includes(media.id);
  const similarTitles = catalog.filter(m => m.id !== media.id && m.genres?.some(g => media.genres?.includes(g))).slice(0, 6);
  const effectiveServerId = (!activeServer || ['vsembed', 'vidsrcme', 'vidsrcsu'].includes(activeServer))
    ? 'autoembed'
    : activeServer;
  const providerUrl = getStreamUrl({
    serverId: effectiveServerId,
    mediaType: media.type,
    tmdbId: media.tmdbId,
    imdbId: media.imdbId,
    season,
    episode,
    lang: subtitleLanguage === 'auto' || subtitleLanguage === 'other' ? language : subtitleLanguage
  });
  const downloadUrl = getDirectDownloadUrl({ serverId: effectiveServerId, downloadUrl: media.downloadUrl });
  const downloadName = `${media.title}${media.type === 'series' ? `-S${season}E${episode}` : ''}`.replace(/[^a-z0-9-_]+/gi, '-');

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F8FAFC]">
      {/* Player Section */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 pt-2 sm:pt-6">
        <DualPlayer
          media={media}
          initialSeason={seasonParam}
          initialEpisode={episodeParam}
        />
      </div>

      {/* Stream Details & Metadata */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 pb-8 border-b border-white/10">
          
          <div className="flex-1 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-[#8B5CF6]/30 to-[#22D3EE]/30 text-[#22D3EE] text-xs font-mono border border-[#22D3EE]/30">
                VIDSRC STREAM READY
              </span>
              <Badge variant="cyan" size="xs">PROVIDER HD</Badge>
              <Badge variant="coral" size="xs">MULTI-SUBTITLE</Badge>
              <Badge variant="maturity" size="xs">{media.maturityRating}</Badge>
              <span className="text-xs font-mono text-[#34D399] font-medium ml-1">
                {Number(media.matchScore) > 0 ? `${media.matchScore}% rating` : 'Available on VidSrc'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight mb-2">
              {media.title}
            </h1>

            {media.type === 'series' && (
              <div className="flex items-center gap-3 text-sm text-[#22D3EE] font-mono mb-4">
                <span>Playing Season {season}, Episode {episode}</span>
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span>Switch Episode</span>
                </button>
              </div>
            )}

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6 font-normal">
              {media.synopsis}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => toggleWatchlist(media.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-medium transition-colors cursor-pointer"
              >
                {isInWatchlist ? <Check className="w-4 h-4 text-[#34D399]" /> : <Plus className="w-4 h-4" />}
                <span>{isInWatchlist ? 'In My Space' : 'Add to My Space'}</span>
              </button>

              <button
                onClick={() => navigate(`/title/${media.id}`)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-medium transition-colors cursor-pointer"
              >
                <Info className="w-4 h-4" />
                <span>Full Cast & Details</span>
              </button>

              <a
                href={providerUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open this stream on the provider website"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open Provider</span>
              </a>

              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  download={`${downloadName}.mp4`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-medium text-emerald-200 transition-colors hover:bg-emerald-400/20"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  title="VidSrc provides an embed stream but no direct downloadable file for this title."
                  className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-2 text-xs font-medium text-gray-600"
                >
                  <Download className="h-4 w-4" />
                  <span>Download unavailable</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Specifications Box */}
          <div className="w-full lg:w-72 glass-panel p-5 rounded-2xl border border-white/10 space-y-3 shrink-0">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#22D3EE] mb-2">
              Stream Information
            </h4>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Release:</span>
                <span className="text-white font-medium">{media.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Runtime:</span>
                <span className="text-white font-medium">{media.runtime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Director:</span>
                <span className="text-white font-medium truncate max-w-[140px]">{media.director}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Audio:</span>
                <span className="text-white font-medium truncate max-w-[140px]">{media.audioLanguages?.[0] || 'Provider audio'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">IMDb ID:</span>
                <span className="text-[#22D3EE] font-mono">{media.imdbId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Titles in Orbit */}
        <section className="mt-10">
          <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-6">
            More in this Orbit
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similarTitles.map((item) => (
              <MediaCard key={item.id} media={item} variant="poster" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
