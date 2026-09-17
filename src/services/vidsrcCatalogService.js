const DEFAULT_VIDSRC_BASE = 'https://vsembed.ru';
const DEFAULT_METADATA_BASE = 'https://v3-cinemeta.strem.io';
const ARCHIVE_PAGE_SIZE = 24;
const LATEST_PAGE_SIZE = 50;
const METADATA_PAGE_SIZE = 50;
const MARKET_SCAN_PAGES = 10;
const CACHE_PREFIX = 'ritzlaplay-api-v2';
const HOUR = 60 * 60 * 1000;

function normalizeBaseUrl(value, fallback) {
  try {
    const url = new URL(value || fallback);
    return `${url.protocol}//${url.host}`;
  } catch {
    return fallback;
  }
}

const ENV = import.meta.env || {};
const VIDSRC_BASE = normalizeBaseUrl(ENV.VITE_STREAM_API_URL, DEFAULT_VIDSRC_BASE);
const METADATA_BASE = normalizeBaseUrl(ENV.VITE_METADATA_API_URL, DEFAULT_METADATA_BASE);

export const DISCOVER_GENRES = [
  'All genres', 'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Mystery',
  'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
];

const SUBTITLE_LANGUAGES = ['English', 'Hindi', 'Other languages'];

const LANGUAGE_NAMES = {
  en: 'English', es: 'Spanish', fr: 'French', de: 'German', hi: 'Hindi',
  ja: 'Japanese', ko: 'Korean', it: 'Italian', pt: 'Portuguese', ar: 'Arabic'
};

const REGION_NAMES = {
  US: 'United States', IN: 'India', GB: 'United Kingdom', KR: 'South Korea',
  JP: 'Japan', FR: 'France', ES: 'Spain'
};

const REGION_ALIASES = {
  US: ['united states', 'united states of america', 'usa', 'us'],
  IN: ['india'],
  GB: ['united kingdom', 'great britain', 'uk', 'gb'],
  KR: ['south korea', 'republic of korea', 'korea'],
  JP: ['japan'],
  FR: ['france'],
  ES: ['spain']
};

const LANGUAGE_COUNTRIES = {
  en: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Ireland', 'New Zealand'],
  es: ['Spain', 'Mexico', 'Argentina', 'Colombia', 'Chile', 'Peru'],
  fr: ['France', 'Belgium', 'Canada', 'Switzerland'],
  de: ['Germany', 'Austria', 'Switzerland'],
  hi: ['India'],
  ja: ['Japan'],
  ko: ['South Korea'],
  it: ['Italy'],
  pt: ['Portugal', 'Brazil'],
  ar: ['Egypt', 'Saudi Arabia', 'United Arab Emirates', 'Jordan', 'Lebanon', 'Morocco']
};

const inventoryPromises = new Map();
const metadataPromises = new Map();
let providerStatsPromise;

class BloomFilter {
  constructor(expectedItems) {
    this.size = Math.max(8192, expectedItems * 12);
    this.hashCount = 7;
    this.bits = new Uint8Array(Math.ceil(this.size / 8));
  }

  hashes(value) {
    let first = 2166136261;
    let second = 5381;
    for (let index = 0; index < value.length; index += 1) {
      const code = value.charCodeAt(index);
      first = Math.imul(first ^ code, 16777619) >>> 0;
      second = (Math.imul(second, 33) ^ code) >>> 0;
    }
    if (second === 0) second = 0x9e3779b9;
    return Array.from({ length: this.hashCount }, (_, index) => ((first + Math.imul(index, second) + index * index) >>> 0) % this.size);
  }

  add(value) {
    this.hashes(value).forEach((hash) => {
      this.bits[hash >> 3] |= 1 << (hash & 7);
    });
  }

  has(value) {
    return this.hashes(value).every((hash) => (this.bits[hash >> 3] & (1 << (hash & 7))) !== 0);
  }
}

function readCache(key, maxAge) {
  if (typeof localStorage === 'undefined') return null;
  try {
    const cached = JSON.parse(localStorage.getItem(`${CACHE_PREFIX}:${key}`));
    if (!cached || Date.now() - cached.savedAt > maxAge) return null;
    return cached.value;
  } catch {
    return null;
  }
}

function writeCache(key, value) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(`${CACHE_PREFIX}:${key}`, JSON.stringify({ savedAt: Date.now(), value }));
  } catch {
    // Remote data still works when storage is full or disabled.
  }
}

function providerType(type) {
  return type === 'series' || type === 'tv' ? 'series' : 'movie';
}

function providerPathType(type) {
  return providerType(type) === 'series' ? 'tvshows' : 'movies';
}

function inventoryFilename(type) {
  return providerType(type) === 'series' ? 'tv_imdb.txt' : 'movie_imdb.txt';
}

async function fetchResource(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Provider request failed (${response.status})`);
  return response;
}

async function fetchJson(url, signal) {
  const response = await fetchResource(url, { signal, headers: { accept: 'application/json' } });
  return response.json();
}

async function fetchInventory(type) {
  const normalizedType = providerType(type);
  if (!inventoryPromises.has(normalizedType)) {
    const cachedText = readCache(`inventory:${normalizedType}`, 12 * HOUR);
    const textRequest = cachedText
      ? Promise.resolve(cachedText)
      : fetchResource(`${VIDSRC_BASE}/ids/${inventoryFilename(normalizedType)}`)
        .then((response) => response.text())
        .then((text) => {
          writeCache(`inventory:${normalizedType}`, text);
          return text;
        });
    const request = textRequest
      .then((text) => {
        const ids = text.split(/\r?\n/).map((id) => id.trim()).filter((id) => /^tt\d+$/.test(id));
        const idSet = new Set(ids);
        const bloom = new BloomFilter(ids.length);
        ids.forEach((id) => bloom.add(id));
        return { ids, idSet, bloom, has: (id) => bloom.has(id) && idSet.has(id) };
      })
      .catch(() => {
        inventoryPromises.delete(normalizedType);
        return { ids: [], idSet: new Set(), bloom: null, has: () => true };
      });
    inventoryPromises.set(normalizedType, request);
  }
  return inventoryPromises.get(normalizedType);
}

function parseFeedTitle(value = '') {
  const match = value.trim().match(/^(.*?)(?:\s+((?:18|19|20)\d{2}))?$/);
  return {
    title: match?.[1]?.trim() || value || 'Untitled',
    year: match?.[2] || '—'
  };
}

function imageFor(imdbId, kind) {
  if (!imdbId) return '';
  return `https://images.metahub.space/${kind}/${kind === 'poster' ? 'small' : 'medium'}/${imdbId}/img`;
}

function languageCode(value = '', country = '') {
  const normalized = value.toLowerCase();
  const explicitCode = Object.entries(LANGUAGE_NAMES).find(([, name]) => normalized.includes(name.toLowerCase()))?.[0];
  if (explicitCode) return explicitCode;
  const primaryCountry = country.split(',')[0].trim().toLowerCase();
  return Object.entries(LANGUAGE_COUNTRIES).find(([, countries]) => countries.some((entry) => primaryCountry === entry.toLowerCase()))?.[0] || '';
}

function countryCode(value = '') {
  const primaryCountry = value.split(',')[0].trim().toLowerCase();
  return Object.entries(REGION_ALIASES).find(([, aliases]) => aliases.includes(primaryCountry))?.[0] || '';
}

function inferMoods(genres = [], runtime = '', rating = 0) {
  const normalized = genres.map((genre) => String(genre).toLowerCase());
  const hasAny = (...values) => values.some((value) => normalized.includes(value.toLowerCase()));
  const moods = [];
  if (hasAny('Sci-Fi', 'Mystery', 'Fantasy', 'Thriller')) moods.push('Mind-bending');
  if (hasAny('Action', 'Adventure', 'Thriller', 'Crime')) moods.push('Adrenaline');
  if (hasAny('Horror', 'Crime', 'Thriller')) moods.push('Dark');
  if (hasAny('Biography', 'Documentary', 'History', 'Sport') || Number(rating) >= 7.8) moods.push('Inspiring');
  if (hasAny('Comedy', 'Romance', 'Family')) moods.push('Comfort');
  if (hasAny('Family', 'Animation', 'Adventure', 'Comedy')) moods.push('Family Night');
  const runtimeMinutes = Number.parseInt(String(runtime), 10);
  if (runtimeMinutes > 0 && runtimeMinutes <= 100) moods.push('Quick Watch');
  return [...new Set(moods)];
}

function mapEpisodes(videos = [], runtime = 'Runtime unavailable') {
  const grouped = new Map();
  videos
    .filter((video) => Number(video.season) > 0 && Number(video.episode || video.number) > 0)
    .forEach((video) => {
      const seasonNumber = Number(video.season);
      const episodeNumber = Number(video.episode || video.number);
      if (!grouped.has(seasonNumber)) grouped.set(seasonNumber, []);
      grouped.get(seasonNumber).push({
        episodeNumber,
        title: video.name || `Episode ${episodeNumber}`,
        runtime,
        thumbnail: video.thumbnail || '',
        synopsis: video.overview || video.description || 'Episode synopsis unavailable.',
        released: video.released || video.firstAired || ''
      });
    });

  return [...grouped.entries()]
    .sort(([left], [right]) => left - right)
    .map(([seasonNumber, episodes]) => ({
      seasonNumber,
      title: `Season ${seasonNumber}`,
      episodes: episodes.sort((left, right) => left.episodeNumber - right.episodeNumber),
      episodesCount: episodes.length
    }));
}

export function mapVidSrcRecord(record, typeHint) {
  const type = providerType(typeHint);
  const imdbId = record.imdb_id || record.imdbId || '';
  const parsedTitle = parseFeedTitle(record.title || record.show_title || '');
  const tmdbId = record.tmdb_id ? Number(record.tmdb_id) : undefined;

  return {
    id: `${type}-${imdbId}`,
    imdbId,
    tmdbId,
    title: parsedTitle.title,
    originalTitle: parsedTitle.title,
    type,
    tagline: '',
    synopsis: 'Open this title to load its full synopsis, cast, genres, and episode guide.',
    year: parsedTitle.year,
    runtime: type === 'series' ? 'TV series' : 'Runtime unavailable',
    maturityRating: 'NR',
    matchScore: 0,
    rating: 0,
    votes: '—',
    quality: record.quality || 'HD',
    backdrop: imageFor(imdbId, 'background'),
    poster: imageFor(imdbId, 'poster'),
    genres: [],
    moods: [],
    director: 'Open for full credits',
    cast: [],
    audioLanguages: ['Original audio'],
    subtitleLanguages: SUBTITLE_LANGUAGES,
    originalLanguage: '',
    originCountry: '',
    popularity: 0,
    apiSource: 'vidsrc',
    downloadUrl: record.download_url || record.file_url || '',
    embedUrl: record.embed_url || `${VIDSRC_BASE}/embed/${type === 'series' ? 'tv' : 'movie'}/${imdbId}`,
    timeAdded: record.time_added || ''
  };
}

export function mapCinemetaMedia(meta, typeHint, fallback = {}) {
  const type = providerType(typeHint || meta.type);
  const imdbId = meta.imdb_id || meta.id || fallback.imdbId || '';
  const rating = Number.parseFloat(meta.imdbRating || fallback.rating || 0) || 0;
  const genres = meta.genres || meta.genre || fallback.genres || [];
  const directors = Array.isArray(meta.director) ? meta.director.join(', ') : meta.director;
  const audioLanguages = meta.language
    ? String(meta.language).split(',').map((entry) => entry.trim()).filter(Boolean)
    : fallback.audioLanguages || ['Original audio'];
  const runtime = meta.runtime || fallback.runtime || (type === 'series' ? 'TV series' : 'Runtime unavailable');
  const cast = (meta.cast || []).map((name) => ({ name, role: 'Cast', image: '' }));

  return {
    ...fallback,
    id: `${type}-${imdbId}`,
    imdbId,
    tmdbId: meta.moviedb_id || fallback.tmdbId,
    title: meta.name || fallback.title || 'Untitled',
    originalTitle: meta.name || fallback.originalTitle || fallback.title || 'Untitled',
    type,
    tagline: meta.awards || fallback.tagline || '',
    synopsis: meta.description || fallback.synopsis || 'Synopsis unavailable.',
    year: meta.releaseInfo || meta.year || fallback.year || '—',
    runtime,
    maturityRating: fallback.maturityRating || 'NR',
    matchScore: Math.round(rating * 10),
    rating,
    votes: fallback.votes || 'IMDb',
    quality: fallback.quality || 'HD',
    backdrop: meta.background || fallback.backdrop || imageFor(imdbId, 'background'),
    poster: meta.poster || fallback.poster || imageFor(imdbId, 'poster'),
    logo: meta.logo || fallback.logo || '',
    genres,
    moods: inferMoods(genres, runtime, rating),
    director: directors || fallback.director || 'Creator information unavailable',
    cast: cast.length ? cast : fallback.cast || [],
    audioLanguages,
    subtitleLanguages: SUBTITLE_LANGUAGES,
    originalLanguage: languageCode(meta.language, meta.country) || fallback.originalLanguage || '',
    originCountry: countryCode(meta.country) || fallback.originCountry || '',
    country: meta.country || fallback.country || '',
    popularity: Number(meta.popularity || meta.popularities?.stremio || fallback.popularity || 0),
    seasons: type === 'series' ? mapEpisodes(meta.videos, runtime) : undefined,
    apiSource: 'vidsrc',
    metadataSource: 'cinemeta',
    downloadUrl: meta.download_url || meta.file_url || fallback.downloadUrl || '',
    embedUrl: fallback.embedUrl || `${VIDSRC_BASE}/embed/${type === 'series' ? 'tv' : 'movie'}/${imdbId}`
  };
}

async function fetchCinemetaDetails(imdbId, type, signal) {
  const normalizedType = providerType(type);
  const cacheKey = `${normalizedType}-${imdbId}`;
  if (!metadataPromises.has(cacheKey)) {
    const cachedMeta = readCache(`metadata:${cacheKey}`, 24 * HOUR);
    const request = (cachedMeta
      ? Promise.resolve({ meta: cachedMeta })
      : fetchJson(`${METADATA_BASE}/meta/${normalizedType}/${encodeURIComponent(imdbId)}.json`, signal))
      .then((payload) => {
        if (!payload?.meta) throw new Error('Metadata was not found for this title.');
        writeCache(`metadata:${cacheKey}`, payload.meta);
        return payload.meta;
      })
      .catch((error) => {
        metadataPromises.delete(cacheKey);
        throw error;
      });
    metadataPromises.set(cacheKey, request);
  }
  return metadataPromises.get(cacheKey);
}

async function fetchCinemetaCatalog(type, { catalog = 'top', genre, search, skip = 0 } = {}, signal) {
  const extras = [];
  if (genre && genre !== 'All genres') extras.push(`genre=${encodeURIComponent(genre)}`);
  if (search) extras.push(`search=${encodeURIComponent(search)}`);
  if (skip) extras.push(`skip=${skip}`);
  const suffix = extras.length ? `/${extras.join('&')}` : '';
  const payload = await fetchJson(`${METADATA_BASE}/catalog/${providerType(type)}/${catalog}${suffix}.json`, signal);
  return payload.metas || [];
}

async function enrichIds(ids, type, signal) {
  const results = await Promise.allSettled(ids.map((imdbId) => fetchCinemetaDetails(imdbId, type, signal)));
  return results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => mapCinemetaMedia(result.value, type));
}

export async function fetchProviderStats() {
  const cachedStats = readCache('provider-stats', 24 * HOUR);
  if (cachedStats) return cachedStats;
  if (!providerStatsPromise) {
    providerStatsPromise = Promise.all([
      fetchInventory('movie'),
      fetchInventory('series')
    ]).then(([movies, series]) => {
      const stats = {
        movies: movies.ids.length,
        series: series.ids.length
      };
      writeCache('provider-stats', stats);
      return stats;
    }).catch((error) => {
      providerStatsPromise = undefined;
      throw error;
    });
  }
  return providerStatsPromise;
}

export async function fetchCatalogPage(type = 'movie', page = 1, signal) {
  const normalizedType = providerType(type);
  const requestedPage = Math.max(1, Number(page) || 1);
  const [firstFeed, inventory] = await Promise.all([
    fetchJson(`${VIDSRC_BASE}/${providerPathType(normalizedType)}/latest/page-1.json`, signal),
    fetchInventory(normalizedType)
  ]);
  const latestPages = Math.max(1, Number(firstFeed.pages) || 1);

  let results;
  if (requestedPage <= latestPages) {
    const feed = requestedPage === 1
      ? firstFeed
      : await fetchJson(`${VIDSRC_BASE}/${providerPathType(normalizedType)}/latest/page-${requestedPage}.json`, signal);
    results = (feed.result || []).map((record) => mapVidSrcRecord(record, normalizedType));
  } else {
    const archiveOffset = (requestedPage - latestPages - 1) * ARCHIVE_PAGE_SIZE;
    const estimatedRecentCount = latestPages * LATEST_PAGE_SIZE;
    const archiveIds = [];
    for (let index = estimatedRecentCount + archiveOffset; index < estimatedRecentCount + archiveOffset + ARCHIVE_PAGE_SIZE; index += 1) {
      const imdbId = inventory.ids[inventory.ids.length - 1 - index];
      if (imdbId) archiveIds.push(imdbId);
    }
    results = await enrichIds(archiveIds, normalizedType, signal);
  }

  const archiveCount = Math.max(0, inventory.ids.length - latestPages * LATEST_PAGE_SIZE);
  return {
    results,
    page: requestedPage,
    totalPages: latestPages + Math.ceil(archiveCount / ARCHIVE_PAGE_SIZE),
    totalResults: inventory.ids.length,
    isFallback: false,
    source: 'vidsrc'
  };
}

export async function fetchCatalog(_language = 'en', signal) {
  const cachedCatalog = readCache('home-catalog', 30 * 60 * 1000);
  if (cachedCatalog) return cachedCatalog;
  const [movieMetas, seriesMetas, featured] = await Promise.all([
    fetchCinemetaCatalog('movie', { catalog: 'top' }, signal),
    fetchCinemetaCatalog('series', { catalog: 'top' }, signal),
    Promise.allSettled([
      fetchCinemetaDetails('tt15239678', 'movie', signal),
      fetchCinemetaDetails('tt4574334', 'series', signal)
    ])
  ]);

  const popularMovies = movieMetas.map((meta) => mapCinemetaMedia(meta, 'movie'));
  const popularSeries = seriesMetas.map((meta) => mapCinemetaMedia(meta, 'series'));
  const featuredTitles = featured
    .filter((result) => result.status === 'fulfilled')
    .map((result) => mapCinemetaMedia(result.value, result.value.type));

  const seen = new Set();
  const catalog = [...featuredTitles, ...popularMovies, ...popularSeries].filter((item) => {
    if (!item.imdbId || seen.has(item.imdbId)) return false;
    seen.add(item.imdbId);
    return true;
  });
  writeCache('home-catalog', catalog);
  return catalog;
}

export async function fetchMediaDetails(imdbId, type = 'movie', _language = 'en', signal) {
  if (!/^tt\d+$/.test(String(imdbId || ''))) throw new Error('This title does not have a valid IMDb identifier.');
  const normalizedType = providerType(type);
  const meta = await fetchCinemetaDetails(imdbId, normalizedType, signal);
  return mapCinemetaMedia(meta, normalizedType);
}

export function searchLocalCatalog(query, catalog = []) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];
  return catalog.filter((item) => [
    item.title,
    item.originalTitle,
    item.director,
    ...(item.genres || []),
    ...(item.cast || []).map((person) => person.name)
  ].some((value) => value?.toLowerCase().includes(normalizedQuery)));
}

export async function searchMedia(query, _language = 'en', signal) {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < 2) return [];
  const [movies, series] = await Promise.all([
    fetchCinemetaCatalog('movie', { search: normalizedQuery }, signal),
    fetchCinemetaCatalog('series', { search: normalizedQuery }, signal)
  ]);

  return [
    ...movies.map((meta) => mapCinemetaMedia(meta, 'movie')),
    ...series.map((meta) => mapCinemetaMedia(meta, 'series'))
  ].slice(0, 60);
}

function matchesDiscoverFilters(meta, { genre, region, originalLanguage }) {
  if (genre !== 'All genres' && !(meta.genres || meta.genre || []).includes(genre)) return false;
  const primaryCountry = String(meta.country || '').split(',')[0].trim().toLowerCase();
  const resolvedCountryCode = meta.originCountry || countryCode(meta.country);
  const regionMatches = resolvedCountryCode === region || (REGION_ALIASES[region] || [REGION_NAMES[region]?.toLowerCase(), region.toLowerCase()]).includes(primaryCountry);
  if (region !== 'all' && !regionMatches) return false;
  if (originalLanguage !== 'all') {
    const requestedLanguage = LANGUAGE_NAMES[originalLanguage]?.toLowerCase() || originalLanguage.toLowerCase();
    const explicitLanguageMatches = meta.originalLanguage === originalLanguage || String(meta.language || '').toLowerCase().includes(requestedLanguage);
    const countryMatches = (LANGUAGE_COUNTRIES[originalLanguage] || []).some((country) => primaryCountry === country.toLowerCase());
    if (!explicitLanguageMatches && !countryMatches) return false;
  }
  return true;
}

export async function discoverMedia(filters, _language = 'en', signal) {
  const {
    type = 'all', genre = 'All genres', region = 'all', originalLanguage = 'all',
    sort = 'popular', page = 1, query = ''
  } = filters;
  const normalizedQuery = query.trim();
  if (normalizedQuery.length >= 2) {
    const searched = (await searchMedia(normalizedQuery, _language, signal))
      .filter((item) => type === 'all' || item.type === providerType(type))
      .filter((item) => matchesDiscoverFilters(item, { genre, region, originalLanguage }));
    searched.sort((left, right) => {
      if (sort === 'rating') return right.rating - left.rating;
      if (sort === 'newest') return Number.parseInt(right.year, 10) - Number.parseInt(left.year, 10);
      return right.popularity - left.popularity;
    });
    return {
      results: searched,
      page: 1,
      totalPages: 1,
      totalResults: searched.length,
      isFallback: false,
      source: 'vidsrc-search'
    };
  }
  const types = type === 'all' ? ['movie', 'series'] : [providerType(type)];
  const currentPage = Math.max(1, Number(page) || 1);
  const requiresMarketScan = region !== 'all' || originalLanguage !== 'all';
  const pagesToScan = requiresMarketScan ? MARKET_SCAN_PAGES : 1;
  const marketYear = String(new Date().getFullYear() - (currentPage - 1));
  const skip = requiresMarketScan ? 0 : (currentPage - 1) * METADATA_PAGE_SIZE;
  const catalog = requiresMarketScan ? 'year' : sort === 'rating' ? 'imdbRating' : 'top';

  const batches = await Promise.all(types.map(async (mediaType) => {
    const [inventory, metaPages] = await Promise.all([
      fetchInventory(mediaType),
      Promise.all(Array.from({ length: pagesToScan }, (_, index) => fetchCinemetaCatalog(mediaType, {
          catalog,
          genre: requiresMarketScan ? marketYear : genre === 'All genres' ? undefined : genre,
          skip: skip + index * METADATA_PAGE_SIZE
        }, signal)))
    ]);
    const metas = metaPages.flat();
    return {
      inventory,
      mediaType,
      rawCount: metas.length,
      metas: metas.filter((meta) => inventory.has(meta.imdb_id || meta.id) && matchesDiscoverFilters(meta, { genre, region, originalLanguage }))
    };
  }));

  const results = batches.flatMap(({ metas, mediaType }) => metas.map((meta) => mapCinemetaMedia(meta, mediaType)));
  results.sort((left, right) => {
    if (sort === 'rating') return right.rating - left.rating;
    if (sort === 'newest') return Number.parseInt(right.year, 10) - Number.parseInt(left.year, 10);
    return right.popularity - left.popularity;
  });

  const hasMore = requiresMarketScan
    ? Number(marketYear) > 1960
    : batches.some((batch) => batch.rawCount >= METADATA_PAGE_SIZE * pagesToScan * 0.8);
  const totalAvailable = batches.reduce((total, batch) => total + batch.inventory.ids.length, 0);
  return {
    results,
    page: currentPage,
    totalPages: hasMore ? currentPage + 1 : currentPage,
    totalResults: genre === 'All genres' && region === 'all' && originalLanguage === 'all' ? totalAvailable : results.length,
    isFallback: false,
    source: 'vidsrc'
  };
}

export function parseMediaIdentifier(identifier) {
  const value = String(identifier || '');
  const match = value.match(/^(movie|series|tv)-(tt\d+)$/);
  if (match) return { imdbId: match[2], type: providerType(match[1]) };
  if (/^tt\d+$/.test(value)) return { imdbId: value, type: 'movie' };
  return { imdbId: null, type: 'movie' };
}

export { VIDSRC_BASE };
