import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle, ArrowLeft, Captions, Check, Layers, LoaderCircle,
  Maximize, Minimize, Pause, Play, RotateCcw, RotateCw, Server,
  Sparkles, Volume2, VolumeX
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { getStreamUrl, NATIVE_STREAMS, STREAM_SERVERS } from '../../services/vidsrcService';
import { EpisodeDrawer } from './EpisodeDrawer';

const SIMPLE_SUBTITLE_CHOICES = [
  { code: 'auto', name: 'Auto', flag: '🌐' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'other', name: 'Other languages', flag: '•••' }
];

function EmbedFrame({ src, title, onSwitchServer }) {
  const [status, setStatus] = useState('loading');

  if (!src) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-black p-8 text-center text-gray-300">
        <AlertCircle className="h-8 w-8 text-rose-400" />
        <p className="text-sm font-semibold">This title does not have a valid provider identifier.</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {status === 'loading' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <LoaderCircle className="h-7 w-7 animate-spin text-[#22D3EE]" />
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black p-8 text-center">
          <AlertCircle className="h-8 w-8 text-rose-400" />
          <p className="text-sm text-gray-200">This server could not be loaded on your network.</p>
          {onSwitchServer && (
            <button
              onClick={onSwitchServer}
              className="mt-2 rounded-xl bg-[#22D3EE] px-4 py-2 text-xs font-semibold text-[#080B14] transition hover:bg-[#22D3EE]/90"
            >
              Switch to Next Server
            </button>
          )}
        </div>
      )}
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="origin"
        onLoad={() => setStatus('ready')}
        onError={() => setStatus('error')}
      />
    </div>
  );
}

export function DualPlayer({ media, initialSeason = 1, initialEpisode = 1 }) {
  const navigate = useNavigate();
  const playerContainerRef = useRef(null);
  const nativeVideoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const lastSavedSecondRef = useRef(-1);

  const {
    activeServer, setActiveServer,
    season, setSeason,
    episode, setEpisode,
    theaterMode, toggleTheaterMode,
    isDrawerOpen, setDrawerOpen,
    isMuted, toggleMute,
    volume, setVolume,
    playbackSpeed, setPlaybackSpeed,
    subtitleLanguage, setSubtitleLanguage
  } = usePlayerStore();
  const { updateWatchProgress, watchProgress, language } = useAppStore();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showServerMenu, setShowServerMenu] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  useEffect(() => {
    if (media?.type !== 'series') return;
    const saved = watchProgress[media.id];
    setSeason(saved?.season || initialSeason);
    setEpisode(saved?.episode || initialEpisode);
  }, [media, initialSeason, initialEpisode, setSeason, setEpisode, watchProgress]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
  }, []);

  // Ensure default server is unblocked on Jio / Indian ISPs
  useEffect(() => {
    if (['vsembed', 'vidsrcme', 'vidsrcsu'].includes(activeServer)) {
      setActiveServer('autoembed');
    }
  }, [activeServer, setActiveServer]);

  const handleSwitchToNextServer = useCallback(() => {
    const currentIndex = STREAM_SERVERS.findIndex((s) => s.id === activeServer);
    const nextIndex = (currentIndex + 1) % STREAM_SERVERS.length;
    setActiveServer(STREAM_SERVERS[nextIndex].id);
  }, [activeServer, setActiveServer]);

  const effectiveServerId = (!activeServer || ['vsembed', 'vidsrcme', 'vidsrcsu'].includes(activeServer))
    ? 'autoembed'
    : activeServer;

  const currentServer = STREAM_SERVERS.find((server) => server.id === effectiveServerId) || STREAM_SERVERS[0];
  const effectiveSubtitleLanguage = subtitleLanguage === 'auto' || subtitleLanguage === 'other' ? language : subtitleLanguage;
  const subtitleLabel = subtitleLanguage === 'auto'
    ? `Auto (${language.toUpperCase()})`
    : SIMPLE_SUBTITLE_CHOICES.find((entry) => entry.code === subtitleLanguage)?.name || 'English';

  useEffect(() => {
    if (!media?.id) return undefined;
    const allowedOrigins = new Set(STREAM_SERVERS
      .filter((server) => server.baseUrl)
      .map((server) => new URL(server.baseUrl).origin));

    const handlePlayerEvent = (event) => {
      if (!allowedOrigins.has(event.origin) || event.data?.type !== 'PLAYER_EVENT') return;
      const payload = event.data.data;
      const playerInfo = payload?.player_info;
      if (!playerInfo) return;
      const providerId = playerInfo.imdb || String(playerInfo.tmdb || '');
      if (providerId && providerId !== media.imdbId && providerId !== String(media.tmdbId || '')) return;

      const nextTime = Number(payload.player_progress) || 0;
      const nextDuration = Number(payload.player_duration) || 0;
      setCurrentTime(nextTime);
      if (nextDuration) setDuration(nextDuration);
      setIsPlaying(payload.player_status === 'playing');

      const nextSeason = Number(playerInfo.season);
      const nextEpisode = Number(playerInfo.episode);
      if (media.type === 'series' && nextSeason > 0 && nextEpisode > 0) {
        setSeason(nextSeason);
        setEpisode(nextEpisode);
      }

      const saveBucket = Math.floor(nextTime / 5);
      if (!nextDuration || saveBucket === lastSavedSecondRef.current) return;
      lastSavedSecondRef.current = saveBucket;
      updateWatchProgress(media.id, {
        progress: Math.min(1, nextTime / nextDuration),
        timestamp: nextTime,
        duration: nextDuration,
        season: media.type === 'series' ? (nextSeason || season) : undefined,
        episode: media.type === 'series' ? (nextEpisode || episode) : undefined
      });
    };

    window.addEventListener('message', handlePlayerEvent);
    return () => window.removeEventListener('message', handlePlayerEvent);
  }, [episode, media, season, setEpisode, setSeason, updateWatchProgress]);

  useEffect(() => {
    const video = nativeVideoRef.current;
    if (!video || !currentServer.isNative) return;
    video.muted = isMuted;
    video.volume = volume;
    video.playbackRate = playbackSpeed;
    if (isPlaying) video.play().catch(() => setIsPlaying(false));
    else video.pause();
  }, [currentServer.isNative, isMuted, isPlaying, playbackSpeed, volume]);

  const toggleFullscreen = useCallback(() => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) playerContainerRef.current.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  }, []);

  const skipTime = useCallback((seconds) => {
    const video = nativeVideoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + seconds));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
      if (event.key === ' ') {
        if (!currentServer.isNative) return;
        event.preventDefault();
        setIsPlaying((playing) => !playing);
      } else if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        toggleFullscreen();
      } else if (event.key.toLowerCase() === 'm') {
        event.preventDefault();
        toggleMute();
      } else if (currentServer.isNative && event.key === 'ArrowRight') {
        event.preventDefault();
        skipTime(10);
      } else if (currentServer.isNative && event.key === 'ArrowLeft') {
        event.preventDefault();
        skipTime(-10);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentServer.isNative, skipTime, toggleFullscreen, toggleMute]);

  if (!media) return null;

  const streamUrl = getStreamUrl({
    serverId: effectiveServerId,
    mediaType: media.type,
    tmdbId: media.tmdbId,
    imdbId: media.imdbId,
    season,
    episode,
    lang: effectiveSubtitleLanguage
  });

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
      setShowServerMenu(false);
      setShowSubtitleMenu(false);
      setShowSpeedMenu(false);
    }, 4000);
  };

  const handleTimeUpdate = (event) => {
    const nextTime = event.currentTarget.currentTime;
    const nextDuration = event.currentTarget.duration || duration;
    setCurrentTime(nextTime);
    if (!nextDuration || Math.floor(nextTime / 10) === lastSavedSecondRef.current) return;
    lastSavedSecondRef.current = Math.floor(nextTime / 10);
    updateWatchProgress(media.id, {
      progress: Math.min(1, nextTime / nextDuration),
      timestamp: nextTime,
      duration: nextDuration,
      season: media.type === 'series' ? season : undefined,
      episode: media.type === 'series' ? episode : undefined
    });
  };

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    return `${mins}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  };

  return (
    <div
      ref={playerContainerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full select-none overflow-hidden bg-[#080B14] ${theaterMode ? 'min-h-screen z-50' : 'aspect-video max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl'}`}
    >
      <div className="relative h-full w-full bg-black">
        {currentServer.isNative ? (
          <video
            ref={nativeVideoRef}
            src={NATIVE_STREAMS.tearsOfSteel}
            className="h-full w-full object-contain"
            autoPlay
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          <EmbedFrame
            key={`${streamUrl}-${effectiveSubtitleLanguage}`}
            src={streamUrl}
            title={`${media.title} player`}
            onSwitchServer={handleSwitchToNextServer}
          />
        )}
      </div>

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pointer-events-auto absolute inset-x-0 top-0 z-30 flex items-start justify-between bg-gradient-to-b from-[#080B14]/95 via-[#080B14]/55 to-transparent p-4 sm:p-6"
          >
            <div className="flex min-w-0 items-center gap-3">
              <button onClick={() => navigate(-1)} className="rounded-xl bg-white/10 p-2 text-white transition-colors hover:bg-white/20" title="Back">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-white sm:text-base">{media.title}</h2>
                <p className="text-xs text-[#22D3EE]">
                  {media.type === 'series' ? `Season ${season} • Episode ${episode} · ` : ''}
                  Subtitles: {subtitleLabel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button onClick={() => { setShowSubtitleMenu((open) => !open); setShowServerMenu(false); }} className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20" title="Subtitle language">
                  <Captions className="h-4 w-4 text-[#22D3EE]" />
                  <span className="hidden sm:inline">Subtitles</span>
                </button>
                {showSubtitleMenu && (
                  <div className="absolute right-0 z-50 mt-2 max-h-72 w-56 overflow-y-auto rounded-2xl border border-white/10 bg-[#101626]/95 p-2 shadow-2xl">
                    <p className="border-b border-white/10 px-3 py-2 text-[10px] text-gray-400">English and Hindi are quick choices. Use Other for the provider's full list.</p>
                    {SIMPLE_SUBTITLE_CHOICES.map((entry) => (
                      <button
                        key={entry.code}
                        onClick={() => { setSubtitleLanguage(entry.code); setShowSubtitleMenu(false); }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs ${subtitleLanguage === entry.code ? 'bg-[#8B5CF6]/25 text-white' : 'text-gray-300 hover:bg-white/5'}`}
                      >
                        <span>{entry.flag} {entry.name}</span>
                        {subtitleLanguage === entry.code && <Check className="h-3.5 w-3.5 text-[#22D3EE]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button onClick={() => { setShowServerMenu((open) => !open); setShowSubtitleMenu(false); }} className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20">
                  <Server className="h-3.5 w-3.5 text-[#22D3EE]" />
                  <span className="hidden sm:inline">{currentServer.name}</span>
                </button>
                {showServerMenu && (
                  <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-white/10 bg-[#101626]/95 p-2 shadow-2xl">
                    {STREAM_SERVERS.map((server) => (
                      <button
                        key={server.id}
                        onClick={() => { setActiveServer(server.id); setShowServerMenu(false); }}
                        className={`w-full rounded-xl px-3 py-2 text-left ${activeServer === server.id ? 'bg-[#8B5CF6]/20 text-white' : 'text-gray-300 hover:bg-white/5'}`}
                      >
                        <span className="flex items-center justify-between text-xs font-semibold">{server.name}{activeServer === server.id && <Check className="h-3.5 w-3.5 text-[#22D3EE]" />}</span>
                        <span className="block text-[10px] text-gray-400">{server.description}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {media.type === 'series' && (
                <button onClick={() => setDrawerOpen(true)} className="rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/20 p-2 text-[#C4B5FD]" title="Episodes">
                  <Layers className="h-4 w-4" />
                </button>
              )}
              <button onClick={toggleTheaterMode} className={`rounded-xl border border-white/10 p-2 ${theaterMode ? 'bg-[#22D3EE] text-[#080B14]' : 'bg-white/10 text-white'}`} title="Theater mode">
                <Sparkles className="h-4 w-4" />
              </button>
              <button onClick={toggleFullscreen} className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20" title="Fullscreen">
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {currentServer.isNative && showControls && (
        <div className="absolute inset-x-0 bottom-0 z-30 space-y-3 bg-gradient-to-t from-black via-black/75 to-transparent p-4 pt-12">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={Math.min(currentTime, duration || 0)}
            onChange={(event) => { if (nativeVideoRef.current) nativeVideoRef.current.currentTime = Number(event.target.value); }}
            className="w-full accent-[#22D3EE]"
            aria-label="Playback position"
          />
          <div className="flex items-center gap-3">
            <button onClick={() => setIsPlaying((playing) => !playing)} className="rounded-lg bg-white/10 p-2 text-white">{isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</button>
            <button onClick={() => skipTime(-10)} className="text-white"><RotateCcw className="h-4 w-4" /></button>
            <button onClick={() => skipTime(10)} className="text-white"><RotateCw className="h-4 w-4" /></button>
            <button onClick={toggleMute} className="text-white">{isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}</button>
            <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} onChange={(event) => setVolume(Number(event.target.value))} className="w-24 accent-[#22D3EE]" aria-label="Volume" />
            <span className="text-xs text-gray-300">{formatTime(currentTime)} / {formatTime(duration)}</span>
            <div className="relative ml-auto">
              <button onClick={() => setShowSpeedMenu((open) => !open)} className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white">{playbackSpeed}×</button>
              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 rounded-xl bg-[#101626] p-1 shadow-xl">
                  {[0.5, 1, 1.25, 1.5, 2].map((speed) => <button key={speed} onClick={() => { setPlaybackSpeed(speed); setShowSpeedMenu(false); }} className="block w-full rounded-lg px-3 py-1.5 text-left text-xs text-white hover:bg-white/10">{speed}×</button>)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <EpisodeDrawer
        key={`${media.id}-${season}`}
        media={media}
        currentSeason={season}
        currentEpisode={episode}
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelectEpisode={(nextSeason, nextEpisode) => {
          setSeason(nextSeason);
          setEpisode(nextEpisode);
          setDrawerOpen(false);
        }}
      />
    </div>
  );
}
