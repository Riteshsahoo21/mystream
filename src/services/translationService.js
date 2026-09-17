// Google Cloud Translation (Basic v2). The browser key must be HTTP-referrer
// restricted in Google Cloud because Vite exposes all VITE_* values to clients.

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY?.trim();
const TRANSLATE_URL = 'https://translation.googleapis.com/language/translate/v2';
const CACHE_PREFIX = 'rp_translation_v3_';
const translationCache = new Map();

export const isTranslationConfigured = Boolean(GOOGLE_API_KEY);

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇧🇷' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' }
];

function hashText(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function decodeHtmlEntities(value) {
  if (typeof value !== 'string' || !value.includes('&')) return value;
  const element = document.createElement('textarea');
  element.innerHTML = value;
  return element.value;
}

function getCachedValue(cacheKey) {
  if (translationCache.has(cacheKey)) return translationCache.get(cacheKey);
  try {
    const storedValue = localStorage.getItem(`${CACHE_PREFIX}${cacheKey}`);
    if (!storedValue) return undefined;
    const parsed = JSON.parse(storedValue);
    translationCache.set(cacheKey, parsed);
    return parsed;
  } catch {
    return undefined;
  }
}

function cacheValue(cacheKey, value) {
  translationCache.set(cacheKey, value);
  try {
    localStorage.setItem(`${CACHE_PREFIX}${cacheKey}`, JSON.stringify(value));
  } catch {
    // Translation still succeeds when storage is unavailable or full.
  }
}

async function requestTranslationBatch(values, targetLang, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || 10000);

  try {
    const url = new URL(TRANSLATE_URL);
    url.searchParams.set('key', GOOGLE_API_KEY);
    const response = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: values, target: targetLang, format: 'text' })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.error?.message || `Translation request failed (${response.status})`);
    }

    const translatedValues = payload?.data?.translations?.map((entry) => decodeHtmlEntities(entry.translatedText));
    if (translatedValues?.length !== values.length) {
      throw new Error('Translation API returned an incomplete response.');
    }
    return translatedValues;
  } finally {
    clearTimeout(timeout);
  }
}

export async function translateTexts(texts, targetLang = 'en', options = {}) {
  const values = texts.map((value) => typeof value === 'string' ? value : '');
  if (!values.length || targetLang === 'en' || !GOOGLE_API_KEY) return values;

  const results = [...values];
  const missing = new Map();

  values.forEach((value, index) => {
    if (!value) return;
    const cacheKey = `${targetLang}_${hashText(value)}`;
    const cached = options.bypassCache ? undefined : getCachedValue(cacheKey);
    if (cached !== undefined) {
      results[index] = cached;
      return;
    }
    const pending = missing.get(value) || { cacheKey, indexes: [] };
    pending.indexes.push(index);
    missing.set(value, pending);
  });

  const entries = [...missing.entries()];
  try {
    for (let start = 0; start < entries.length; start += 64) {
      const chunk = entries.slice(start, start + 64);
      const translated = await requestTranslationBatch(chunk.map(([value]) => value), targetLang, options);
      chunk.forEach(([, pending], chunkIndex) => {
        const translatedValue = translated[chunkIndex];
        cacheValue(pending.cacheKey, translatedValue);
        pending.indexes.forEach((resultIndex) => { results[resultIndex] = translatedValue; });
      });
    }
    return results;
  } catch (error) {
    if (options.throwOnError) throw error;
    console.warn('Translation unavailable; showing the original text.', error);
    return values;
  }
}

export async function translateText(text, targetLang = 'en', options = {}) {
  if (!text || targetLang === 'en') return text;
  const isArray = Array.isArray(text);
  const values = isArray ? text : [text];
  const translated = await translateTexts(values, targetLang, options);
  return isArray ? translated : translated[0];
}

const en = {
  home: 'Home', discover: 'Discover', movies: 'Movies', series: 'Series', mySpace: 'My Space',
  search: 'Search', notifications: 'Notifications', account: 'Account', settings: 'Settings',
  watchNow: 'Watch Now', trailer: 'Watch Trailer', addWatchlist: 'Add to My Space',
  inWatchlist: 'Saved in Space', trending: 'Trending', continueWatching: 'Continue Watching',
  top10: 'Top 10 Today', criticallyAcclaimed: 'Critically Acclaimed', newReleases: 'Newly Added',
  editorialPicks: 'Curated Visions', castCrew: 'Cast & Creators', episodes: 'Episodes',
  seasons: 'Seasons', moreLikeThis: 'More Like This', switchServer: 'Switch Stream Server',
  serverActive: 'Active Server'
};

export const UI_LOCALES = {
  en,
  es: { ...en, home: 'Inicio', discover: 'Descubrir', movies: 'Películas', series: 'Series', mySpace: 'Mi espacio', search: 'Buscar', watchNow: 'Ver ahora', addWatchlist: 'Añadir a Mi espacio', inWatchlist: 'Guardado', episodes: 'Episodios', seasons: 'Temporadas', settings: 'Ajustes' },
  fr: { ...en, home: 'Accueil', discover: 'Découvrir', movies: 'Films', series: 'Séries', mySpace: 'Mon espace', search: 'Rechercher', watchNow: 'Regarder', addWatchlist: 'Ajouter à Mon espace', inWatchlist: 'Enregistré', episodes: 'Épisodes', seasons: 'Saisons', settings: 'Paramètres' },
  de: { ...en, home: 'Start', discover: 'Entdecken', movies: 'Filme', series: 'Serien', mySpace: 'Mein Bereich', search: 'Suchen', watchNow: 'Jetzt ansehen', addWatchlist: 'Zu Mein Bereich', inWatchlist: 'Gespeichert', episodes: 'Episoden', seasons: 'Staffeln', settings: 'Einstellungen' },
  hi: { ...en, home: 'होम', discover: 'खोजें', movies: 'फ़िल्में', series: 'सीरीज़', mySpace: 'मेरी सूची', search: 'खोज', watchNow: 'अभी देखें', addWatchlist: 'मेरी सूची में जोड़ें', inWatchlist: 'सहेजा गया', episodes: 'एपिसोड', seasons: 'सीज़न', settings: 'सेटिंग्स' },
  ja: { ...en, home: 'ホーム', discover: '見つける', movies: '映画', series: 'シリーズ', mySpace: 'マイスペース', search: '検索', watchNow: '今すぐ見る', addWatchlist: 'マイスペースに追加', inWatchlist: '保存済み', episodes: 'エピソード', seasons: 'シーズン', settings: '設定' },
  ko: { ...en, home: '홈', discover: '둘러보기', movies: '영화', series: '시리즈', mySpace: '내 공간', search: '검색', watchNow: '지금 보기', addWatchlist: '내 공간에 추가', inWatchlist: '저장됨', episodes: '에피소드', seasons: '시즌', settings: '설정' },
  it: { ...en, home: 'Home', discover: 'Scopri', movies: 'Film', series: 'Serie', mySpace: 'Il mio spazio', search: 'Cerca', watchNow: 'Guarda ora', addWatchlist: 'Aggiungi', inWatchlist: 'Salvato', episodes: 'Episodi', seasons: 'Stagioni', settings: 'Impostazioni' },
  pt: { ...en, home: 'Início', discover: 'Descobrir', movies: 'Filmes', series: 'Séries', mySpace: 'Meu espaço', search: 'Pesquisar', watchNow: 'Assistir agora', addWatchlist: 'Adicionar', inWatchlist: 'Salvo', episodes: 'Episódios', seasons: 'Temporadas', settings: 'Configurações' },
  ar: { ...en, home: 'الرئيسية', discover: 'استكشف', movies: 'أفلام', series: 'مسلسلات', mySpace: 'مساحتي', search: 'بحث', watchNow: 'شاهد الآن', addWatchlist: 'أضف إلى مساحتي', inWatchlist: 'تم الحفظ', episodes: 'الحلقات', seasons: 'المواسم', settings: 'الإعدادات' }
};

export function getUIText(key, lang = 'en') {
  return UI_LOCALES[lang]?.[key] || UI_LOCALES.en[key] || key;
}
