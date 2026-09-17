// Streaming URL builder. Embed providers are cross-origin, so subtitle and
// playback preferences must be passed when the iframe URL is created.

function normalizeBaseUrl(value, fallback) {
  try {
    const url = new URL(value || fallback);
    return `${url.protocol}//${url.host}`;
  } catch {
    return fallback;
  }
}

const ENV = import.meta.env || {};
const PRIMARY_STREAM_BASE = normalizeBaseUrl(ENV.VITE_STREAM_API_URL, 'https://autoembed.co');

function buildQuery(params = {}, includeAutonext = false) {
  const { lang = 'en', ...rest } = params;
  return new URLSearchParams({
    autoplay: '1',
    ...(includeAutonext ? { autonext: '1' } : {}),
    ds_lang: lang,
    ...rest
  }).toString();
}

export const STREAM_SERVERS = [
  {
    id: 'autoembed',
    name: 'Server 1 (AutoEmbed - Jio/Airtel)',
    description: 'High-speed primary route unblocked on Jio, Airtel & mobile',
    badge: 'Fast',
    baseUrl: 'https://autoembed.co',
    getMovieUrl: (identifier, { tmdbId, imdbId } = {}) => {
      const id = imdbId || identifier;
      if (String(id).startsWith('tt')) {
        return `https://autoembed.co/movie/imdb/${encodeURIComponent(id)}`;
      }
      const tmdb = tmdbId || identifier;
      return `https://autoembed.co/movie/tmdb/${encodeURIComponent(tmdb)}`;
    },
    getTvUrl: (identifier, season = 1, episode = 1, { tmdbId, imdbId } = {}) => {
      const s = Number(season) || 1;
      const e = Number(episode) || 1;
      const id = imdbId || identifier;
      if (String(id).startsWith('tt')) {
        return `https://autoembed.co/tv/imdb/${encodeURIComponent(id)}-${s}-${e}`;
      }
      const tmdb = tmdbId || identifier;
      return `https://autoembed.co/tv/tmdb/${encodeURIComponent(tmdb)}-${s}-${e}`;
    },
    getSeriesPickerUrl: (identifier, { tmdbId, imdbId } = {}) => {
      const id = imdbId || identifier;
      if (String(id).startsWith('tt')) {
        return `https://autoembed.co/tv/imdb/${encodeURIComponent(id)}-1-1`;
      }
      const tmdb = tmdbId || identifier;
      return `https://autoembed.co/tv/tmdb/${encodeURIComponent(tmdb)}-1-1`;
    }
  },
  {
    id: '2embed',
    name: 'Server 2 (2Embed)',
    description: 'High-availability global mirror unblocked on Jio',
    badge: 'Mirror',
    baseUrl: 'https://www.2embed.cc',
    getMovieUrl: (identifier, { tmdbId, imdbId } = {}) => {
      const id = imdbId || tmdbId || identifier;
      return `https://www.2embed.cc/embed/${encodeURIComponent(id)}`;
    },
    getTvUrl: (identifier, season = 1, episode = 1, { tmdbId, imdbId } = {}) => {
      const s = Number(season) || 1;
      const e = Number(episode) || 1;
      const id = imdbId || tmdbId || identifier;
      return `https://www.2embed.cc/embedtv/${encodeURIComponent(id)}&s=${s}&e=${e}`;
    },
    getSeriesPickerUrl: (identifier, { tmdbId, imdbId } = {}) => {
      const id = imdbId || tmdbId || identifier;
      return `https://www.2embed.cc/embedtv/${encodeURIComponent(id)}&s=1&e=1`;
    }
  },
  {
    id: 'rivestream',
    name: 'Server 3 (Rive - Global)',
    description: 'Ultra-fast cloud stream unblocked across all mobile ISPs',
    badge: 'Fast Cloud',
    baseUrl: 'https://rivestream.live',
    getMovieUrl: (identifier, { tmdbId, imdbId } = {}) => {
      const id = imdbId || tmdbId || identifier;
      return `https://rivestream.live/embed?type=movie&id=${encodeURIComponent(id)}`;
    },
    getTvUrl: (identifier, season = 1, episode = 1, { tmdbId, imdbId } = {}) => {
      const s = Number(season) || 1;
      const e = Number(episode) || 1;
      const id = imdbId || tmdbId || identifier;
      return `https://rivestream.live/embed?type=series&id=${encodeURIComponent(id)}&season=${s}&episode=${e}`;
    },
    getSeriesPickerUrl: (identifier, { tmdbId, imdbId } = {}) => {
      const id = imdbId || tmdbId || identifier;
      return `https://rivestream.live/embed?type=series&id=${encodeURIComponent(id)}&season=1&episode=1`;
    }
  },
  {
    id: 'smashy',
    name: 'Server 4 (Smashy HD)',
    description: 'Alternative multi-source HD unblocked server',
    badge: 'HD Stream',
    baseUrl: 'https://embed.smashystream.com',
    getMovieUrl: (identifier, { tmdbId, imdbId } = {}) => {
      const id = imdbId || identifier;
      if (String(id).startsWith('tt')) {
        return `https://embed.smashystream.com/playere.php?imdb=${encodeURIComponent(id)}`;
      }
      const tmdb = tmdbId || identifier;
      return `https://embed.smashystream.com/playere.php?tmdb=${encodeURIComponent(tmdb)}`;
    },
    getTvUrl: (identifier, season = 1, episode = 1, { tmdbId, imdbId } = {}) => {
      const s = Number(season) || 1;
      const e = Number(episode) || 1;
      const id = imdbId || identifier;
      if (String(id).startsWith('tt')) {
        return `https://embed.smashystream.com/playere.php?imdb=${encodeURIComponent(id)}&season=${s}&episode=${e}`;
      }
      const tmdb = tmdbId || identifier;
      return `https://embed.smashystream.com/playere.php?tmdb=${encodeURIComponent(tmdb)}&season=${s}&episode=${e}`;
    },
    getSeriesPickerUrl: (identifier, { tmdbId, imdbId } = {}) => {
      const id = imdbId || identifier;
      if (String(id).startsWith('tt')) {
        return `https://embed.smashystream.com/playere.php?imdb=${encodeURIComponent(id)}&season=1&episode=1`;
      }
      const tmdb = tmdbId || identifier;
      return `https://embed.smashystream.com/playere.php?tmdb=${encodeURIComponent(tmdb)}&season=1&episode=1`;
    }
  },
  {
    id: 'vidlink',
    name: 'Server 5 (VidLink HD)',
    description: 'High-speed cloud stream unblocked on all mobile networks',
    badge: 'HD Stream',
    baseUrl: 'https://vidlink.pro',
    getMovieUrl: (identifier, { tmdbId, imdbId } = {}) => {
      const id = imdbId || tmdbId || identifier;
      return `https://vidlink.pro/movie/${encodeURIComponent(id)}`;
    },
    getTvUrl: (identifier, season = 1, episode = 1, { tmdbId, imdbId } = {}) => {
      const s = Number(season) || 1;
      const e = Number(episode) || 1;
      const id = tmdbId || imdbId || identifier;
      return `https://vidlink.pro/tv/${encodeURIComponent(id)}/${s}/${e}`;
    },
    getSeriesPickerUrl: (identifier, { tmdbId, imdbId } = {}) => {
      const id = tmdbId || imdbId || identifier;
      return `https://vidlink.pro/tv/${encodeURIComponent(id)}/1/1`;
    }
  },
  {
    id: 'native',
    name: 'Demo Player',
    description: 'Legal sample video for testing native controls',
    badge: 'Demo',
    isNative: true
  }
];

export const NATIVE_STREAMS = {
  demoHls: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  bigBuckBunny: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  tearsOfSteel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  sintel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  elephantsDream: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
};

export function getStreamUrl({
  serverId = 'autoembed',
  mediaType = 'movie',
  tmdbId,
  imdbId,
  season = 1,
  episode = 1,
  lang = 'en'
}) {
  const server = STREAM_SERVERS.find((entry) => entry.id === serverId) || STREAM_SERVERS[0];
  const identifier = imdbId || tmdbId;
  if (!identifier) return '';
  if (server.isNative) return NATIVE_STREAMS.tearsOfSteel;
  const context = { lang, tmdbId, imdbId };
  if (mediaType === 'series' || mediaType === 'tv') {
    return server.getTvUrl(identifier, season, episode, context);
  }
  return server.getMovieUrl(identifier, context);
}

export function getDirectDownloadUrl({ serverId = 'autoembed', downloadUrl = '' }) {
  if (serverId === 'native') return NATIVE_STREAMS.tearsOfSteel;
  if (!downloadUrl) return '';
  try {
    const url = new URL(downloadUrl);
    return ['https:', 'http:'].includes(url.protocol) ? url.toString() : '';
  } catch {
    return '';
  }
}
