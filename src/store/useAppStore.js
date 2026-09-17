import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Authentication & Single User Profile
      user: {
        id: 'u-101',
        name: 'Ritesh',
        email: 'ritesh@ritzlaplay.com',
        memberSince: '2024'
      },
      isAuthenticated: true,

      // Single active profile representation (profile switching removed)
      activeProfile: { id: 'p1', name: 'Ritesh' },

      // Localization & Language / Country
      language: 'en',
      country: 'US',
      setLanguage: (lang) => set({ language: lang }),
      setCountry: (code) => set({ country: code }),

      // Watchlist & Favorites
      watchlist: ['stranger-things', 'dune-part-two', 'interstellar', 'severance'],
      favorites: ['stranger-things', 'dune-part-two'],
      disliked: [],

      toggleWatchlist: (id) => {
        const { watchlist } = get();
        if (watchlist.includes(id)) {
          set({ watchlist: watchlist.filter(item => item !== id) });
        } else {
          set({ watchlist: [...watchlist, id] });
        }
      },

      toggleFavorite: (id) => {
        const { favorites } = get();
        if (favorites.includes(id)) {
          set({ favorites: favorites.filter(item => item !== id) });
        } else {
          set({ favorites: [...favorites, id] });
        }
      },

      // Viewing Progress
      watchProgress: {
        'stranger-things': {
          id: 'stranger-things',
          progress: 0.65,
          timestamp: 1950,
          duration: 2940,
          season: 1,
          episode: 1,
          episodeTitle: 'Chapter One: The Vanishing of Will Byers',
          updatedAt: Date.now() - 3600000
        },
        'dune-part-two': {
          id: 'dune-part-two',
          progress: 0.45,
          timestamp: 4500,
          duration: 9960,
          updatedAt: Date.now() - 86400000
        },
        'severance': {
          id: 'severance',
          progress: 0.88,
          timestamp: 2800,
          duration: 3180,
          season: 1,
          episode: 1,
          episodeTitle: 'Good News About Hell',
          updatedAt: Date.now() - 172800000
        }
      },

      updateWatchProgress: (titleId, progressData) => {
        set((state) => ({
          watchProgress: {
            ...state.watchProgress,
            [titleId]: {
              ...(state.watchProgress[titleId] || {}),
              ...progressData,
              id: titleId,
              updatedAt: Date.now()
            }
          }
        }));
      },

      removeWatchProgress: (titleId) => {
        set((state) => {
          const updated = { ...state.watchProgress };
          delete updated[titleId];
          return { watchProgress: updated };
        });
      },

      clearHistory: () => set({ watchProgress: {} }),

      // Custom User Collections
      customCollections: [
        { id: 'c1', name: 'Weekend Binge', items: ['stranger-things', 'breaking-bad', 'the-bear'], createdAt: '2024-03-01' },
        { id: 'c2', name: 'Cosmic Odysseys', items: ['dune-part-two', 'interstellar', 'blade-runner-2049'], createdAt: '2024-03-05' },
        { id: 'c3', name: 'Late Night Tension', items: ['severance', 'the-batman', 'inception'], createdAt: '2024-03-10' }
      ],

      createCollection: (name) => {
        const id = `col-${Date.now()}`;
        set((state) => ({
          customCollections: [
            ...state.customCollections,
            { id, name, items: [], createdAt: new Date().toISOString().split('T')[0] }
          ]
        }));
        return id;
      },

      deleteCollection: (id) => {
        set((state) => ({
          customCollections: state.customCollections.filter(c => c.id !== id)
        }));
      },

      toggleItemInCollection: (collectionId, mediaId) => {
        set((state) => ({
          customCollections: state.customCollections.map(col => {
            if (col.id !== collectionId) return col;
            const exists = col.items.includes(mediaId);
            return {
              ...col,
              items: exists ? col.items.filter(i => i !== mediaId) : [...col.items, mediaId]
            };
          })
        }));
      },

      // Notifications
      notifications: [
        {
          id: 'n1',
          title: 'Stranger Things Chapter One Stream Ready',
          body: 'Season 1 Episode 1 is loaded on High-Speed Server Alpha.',
          time: '12m ago',
          unread: true,
          link: '/watch/stranger-things'
        },
        {
          id: 'n2',
          title: 'Dune: Part Two Available on VidSrc',
          body: 'Paul Atreides’ journey awaits in Tonight’s Cinematic Orbit.',
          time: '2h ago',
          unread: true,
          link: '/title/dune-part-two'
        },
        {
          id: 'n3',
          title: 'Shōgun Episode 9 Ready',
          body: 'Lord Toranaga’s plan begins to unfold in Crimson Sky.',
          time: '1d ago',
          unread: false,
          link: '/watch/shogun'
        }
      ],

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map(n => n.id === id ? { ...n, unread: false } : n)
        }));
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, unread: false }))
        }));
      },

      // Preferences & Settings (Sound effects and autoplay previews default to ON)
      settings: {
        dataSaver: false,
        reducedMotion: false,
        soundEffects: true,
        autoplayPreviews: true,
        defaultServer: 'vsembed'
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },

      // Auth actions
      login: (userData) => set({
        isAuthenticated: true,
        user: { ...get().user, ...userData }
      }),

      logout: () => set({ isAuthenticated: false })
    }),
    {
      name: 'ritzlaplay_storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        language: state.language,
        country: state.country,
        watchlist: state.watchlist,
        favorites: state.favorites,
        watchProgress: state.watchProgress,
        customCollections: state.customCollections,
        settings: state.settings,
        notifications: state.notifications
      })
    }
  )
);
