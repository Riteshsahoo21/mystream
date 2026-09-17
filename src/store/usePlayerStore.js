import { create } from 'zustand';

export const usePlayerStore = create((set) => ({
  activeServer: 'autoembed',
  season: 1,
  episode: 1,
  theaterMode: false,
  isDrawerOpen: false,
  playbackSpeed: 1.0,
  isMuted: false,
  volume: 0.85,
  subtitleStyle: {
    fontSize: 'text-lg',
    color: '#ffffff',
    bg: 'rgba(8, 11, 20, 0.85)',
    fontFamily: 'Inter'
  },
  audioTrack: 'Original audio',
  subtitleLanguage: 'auto',

  setActiveServer: (server) => set({ activeServer: server }),
  setSeason: (season) => set({ season }),
  setEpisode: (episode) => set({ episode }),
  setSeasonAndEpisode: (season, episode) => set({ season, episode }),
  toggleTheaterMode: () => set((state) => ({ theaterMode: !state.theaterMode })),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  setDrawerOpen: (open) => set({ isDrawerOpen: open }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  setVolume: (vol) => set({ volume: vol, isMuted: vol === 0 }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setSubtitleStyle: (style) => set((state) => ({ subtitleStyle: { ...state.subtitleStyle, ...style } })),
  setAudioTrack: (track) => set({ audioTrack: track }),
  setSubtitleLanguage: (language) => set({ subtitleLanguage: language })
}));
