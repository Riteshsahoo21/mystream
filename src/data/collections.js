// RitzlaPlay Discovery Collections, Moods & Genre Constellations

export const MOODS = [
  { id: 'all', name: 'All Frequencies', icon: 'Sparkles', color: '#8B5CF6' },
  { id: 'Mind-bending', name: 'Mind-bending', icon: 'Brain', color: '#22D3EE', gradient: 'from-cyan-500/20 to-violet-600/30' },
  { id: 'Adrenaline', name: 'Adrenaline', icon: 'Zap', color: '#FB7185', gradient: 'from-rose-500/20 to-amber-500/30' },
  { id: 'Dark', name: 'Dark & Gritty', icon: 'Moon', color: '#6366F1', gradient: 'from-indigo-600/30 to-purple-950/40' },
  { id: 'Inspiring', name: 'Inspiring', icon: 'Flame', color: '#FBBF24', gradient: 'from-amber-400/20 to-emerald-500/30' },
  { id: 'Comfort', name: 'Comfort', icon: 'Coffee', color: '#34D399', gradient: 'from-emerald-500/20 to-teal-600/30' },
  { id: 'Family Night', name: 'Family Night', icon: 'Smile', color: '#38BDF8', gradient: 'from-sky-400/20 to-blue-600/30' },
  { id: 'Quick Watch', name: 'Quick Watch', icon: 'Clock', color: '#A855F7', gradient: 'from-purple-500/20 to-fuchsia-600/30' }
];

export const GENRE_CONSTELLATION_NODES = [
  { id: 'Sci-Fi', label: 'Sci-Fi', x: 25, y: 30, size: 28, count: 8, color: '#22D3EE' },
  { id: 'Action', label: 'Action', x: 65, y: 25, size: 26, count: 6, color: '#FB7185' },
  { id: 'Drama', label: 'Drama', x: 45, y: 55, size: 30, count: 9, color: '#8B5CF6' },
  { id: 'Mystery', label: 'Mystery', x: 20, y: 70, size: 22, count: 5, color: '#A78BFA' },
  { id: 'Crime', label: 'Crime', x: 75, y: 60, size: 20, count: 4, color: '#F43F5E' },
  { id: 'Animation', label: 'Animation', x: 80, y: 35, size: 24, count: 4, color: '#34D399' },
  { id: 'Thriller', label: 'Thriller', x: 50, y: 80, size: 24, count: 6, color: '#F59E0B' },
  { id: 'Adventure', label: 'Adventure', x: 35, y: 15, size: 22, count: 5, color: '#38BDF8' }
];

export const GENRE_CONSTELLATION_LINKS = [
  { from: 'Sci-Fi', to: 'Action' },
  { from: 'Sci-Fi', to: 'Drama' },
  { from: 'Sci-Fi', to: 'Mystery' },
  { from: 'Action', to: 'Thriller' },
  { from: 'Drama', to: 'Crime' },
  { from: 'Drama', to: 'Thriller' },
  { from: 'Animation', to: 'Action' },
  { from: 'Adventure', to: 'Sci-Fi' },
  { from: 'Mystery', to: 'Thriller' }
];

export const EDITORIAL_COLLECTIONS = [
  {
    id: 'deep-space-epics',
    title: 'Cosmic Horizons & Quantum Realities',
    subtitle: 'Vast explorations of spacetime, destiny, and the outer limits of existence.',
    genre: 'Sci-Fi'
  },
  {
    id: 'peak-tv-drama',
    title: 'Prestige Masterworks',
    subtitle: 'Storytelling without compromise. Flawless directing, writing, and unforgettable performances.',
    genre: 'Drama'
  },
  {
    id: 'visual-sensations',
    title: 'Visual Sensations & Animated Artistry',
    subtitle: 'Groundbreaking color grading, visual geometry, and cinematic revolution.',
    genre: 'Animation'
  }
];
