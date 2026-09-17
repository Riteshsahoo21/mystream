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
const PRIMARY_STREAM_BASE = normalizeBaseUrl(ENV.VITE_STREAM_API_URL, 'https://vsembed.ru');

function buildQuery(params = {}, includeAutonext = false) {
  const { lang = 'en', ...rest } = params;
  return new URLSearchParams({
    autoplay: '1',
    ...(includeAutonext ? { autonext: '1' } : {}),
    ds_lang: lang,
    ...rest
  }).toString();
}

function createEmbedServer({ id, name, description, badge, baseUrl }) {
  return {
    id,
    name,
    description,
    badge,
    baseUrl,
    getMovieUrl: (identifier, params = {}) => `${baseUrl}/embed/movie/${encodeURIComponent(identifier)}?${buildQuery(params)}`,
    getTvUrl: (identifier, season = 1, episode = 1, params = {}) => `${baseUrl}/embed/tv/${encodeURIComponent(identifier)}/${Number(season) || 1}/${Number(episode) || 1}?${buildQuery(params, true)}`,
    getSeriesPickerUrl: (identifier, params = {}) => `${baseUrl}/embed/tv/${encodeURIComponent(identifier)}?${buildQuery(params, true)}`
  };
}

export const STREAM_SERVERS = [
  createEmbedServer({
    id: 'vsembed',
    name: 'Server Alpha',
    description: 'Primary multi-subtitle route',
    badge: 'Primary',
    baseUrl: PRIMARY_STREAM_BASE
  }),
  createEmbedServer({
    id: 'vidsrcme',
    name: 'Server Beta',
    description: 'Global mirror route',
    badge: 'Mirror',
    baseUrl: 'https://vidsrcme.ru'
  }),
  createEmbedServer({
    id: 'vidsrcsu',
    name: 'Server Gamma',
    description: 'Secondary low-latency route',
    badge: 'Backup',
    baseUrl: 'https://vidsrc-embed.su'
  }),
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
  serverId = 'vsembed',
  mediaType = 'movie',
  tmdbId,
  imdbId,
  season = 1,
  episode = 1,
  lang = 'en'
}) {
  const server = STREAM_SERVERS.find((entry) => entry.id === serverId) || STREAM_SERVERS[0];
  // VidSrc's own inventory is keyed by IMDb ID. Prefer it so playback does not
  // depend on a separate metadata provider's numeric identifier.
  const identifier = imdbId || tmdbId;
  if (!identifier) return '';
  if (server.isNative) return NATIVE_STREAMS.tearsOfSteel;
  if (mediaType === 'series' || mediaType === 'tv') return server.getTvUrl(identifier, season, episode, { lang });
  return server.getMovieUrl(identifier, { lang });
}

export function getDirectDownloadUrl({ serverId = 'vsembed', downloadUrl = '' }) {
  if (serverId === 'native') return NATIVE_STREAMS.tearsOfSteel;
  if (!downloadUrl) return '';
  try {
    const url = new URL(downloadUrl);
    return ['https:', 'http:'].includes(url.protocol) ? url.toString() : '';
  } catch {
    return '';
  }
}
