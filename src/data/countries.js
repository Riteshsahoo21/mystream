// Comprehensive Country & Language Catalog with Flag Generator and Auto-Detection

export function getCountryFlag(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🌐';
  }
}

// Built-in comprehensive dataset covering all regions worldwide
export const BASE_COUNTRIES = [
  // Popular / Recommended
  { code: 'US', name: 'United States', flag: '🇺🇸', lang: 'en', langName: 'English', region: 'Americas', popular: true },
  { code: 'IN', name: 'India', flag: '🇮🇳', lang: 'hi', langName: 'Hindi (हिन्दी) / English', region: 'Asia', popular: true },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', lang: 'en', langName: 'English (UK)', region: 'Europe', popular: true },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', lang: 'en', langName: 'English / Français', region: 'Americas', popular: true },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', lang: 'en', langName: 'English (AU)', region: 'Oceania', popular: true },
  { code: 'FR', name: 'France', flag: '🇫🇷', lang: 'fr', langName: 'Français', region: 'Europe', popular: true },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', lang: 'de', langName: 'Deutsch', region: 'Europe', popular: true },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', lang: 'ja', langName: '日本語', region: 'Asia', popular: true },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', lang: 'ko', langName: '한국어', region: 'Asia', popular: true },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', lang: 'pt', langName: 'Português (Brasil)', region: 'Americas', popular: true },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', lang: 'es', langName: 'Español', region: 'Europe', popular: true },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', lang: 'es', langName: 'Español (México)', region: 'Americas', popular: true },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', lang: 'it', langName: 'Italiano', region: 'Europe', popular: true },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', lang: 'nl', langName: 'Nederlands', region: 'Europe', popular: true },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', lang: 'ar', langName: 'العربية / English', region: 'Asia', popular: true },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', lang: 'ar', langName: 'العربية', region: 'Asia', popular: true },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', lang: 'en', langName: 'English / Afrikaans', region: 'Africa', popular: true },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', lang: 'en', langName: 'English / 中文', region: 'Asia', popular: true },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', lang: 'sv', langName: 'Svenska', region: 'Europe', popular: true },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', lang: 'no', langName: 'Norsk', region: 'Europe', popular: true },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', lang: 'da', langName: 'Dansk', region: 'Europe', popular: true },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', lang: 'fi', langName: 'Suomi', region: 'Europe', popular: true },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', lang: 'de', langName: 'Deutsch / Français', region: 'Europe', popular: true },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', lang: 'de', langName: 'Deutsch', region: 'Europe' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', lang: 'nl', langName: 'Nederlands / Français', region: 'Europe' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', lang: 'en', langName: 'English', region: 'Europe' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', lang: 'en', langName: 'English', region: 'Oceania' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', lang: 'pl', langName: 'Polski', region: 'Europe' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', lang: 'pt', langName: 'Português', region: 'Europe' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', lang: 'el', langName: 'Ελληνικά', region: 'Europe' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', lang: 'tr', langName: 'Türkçe', region: 'Asia' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', lang: 'id', langName: 'Bahasa Indonesia', region: 'Asia' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', lang: 'tl', langName: 'Filipino / English', region: 'Asia' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', lang: 'th', langName: 'ไทย', region: 'Asia' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', lang: 'vi', langName: 'Tiếng Việt', region: 'Asia' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', lang: 'ms', langName: 'Bahasa Melayu / English', region: 'Asia' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', lang: 'ar', langName: 'العربية', region: 'Africa' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', lang: 'en', langName: 'English', region: 'Africa' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', lang: 'en', langName: 'English / Kiswahili', region: 'Africa' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', lang: 'ar', langName: 'العربية / Français', region: 'Africa' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', lang: 'es', langName: 'Español', region: 'Americas' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', lang: 'es', langName: 'Español', region: 'Americas' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', lang: 'es', langName: 'Español', region: 'Americas' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', lang: 'es', langName: 'Español', region: 'Americas' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', lang: 'he', langName: 'עברית', region: 'Asia' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', lang: 'ur', langName: 'اردو / English', region: 'Asia' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', lang: 'bn', langName: 'বাংলা', region: 'Asia' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', lang: 'uk', langName: 'Українська', region: 'Europe' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', lang: 'cs', langName: 'Čeština', region: 'Europe' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', lang: 'ro', langName: 'Română', region: 'Europe' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', lang: 'hu', langName: 'Magyar', region: 'Europe' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', lang: 'bg', langName: 'Български', region: 'Europe' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', lang: 'hr', langName: 'Hrvatski', region: 'Europe' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸', lang: 'sr', langName: 'Српски', region: 'Europe' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰', lang: 'sk', langName: 'Slovenčina', region: 'Europe' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮', lang: 'sl', langName: 'Slovenščina', region: 'Europe' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹', lang: 'lt', langName: 'Lietuvių', region: 'Europe' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻', lang: 'lv', langName: 'Latviešu', region: 'Europe' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪', lang: 'et', langName: 'Eesti', region: 'Europe' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸', lang: 'is', langName: 'Íslenska', region: 'Europe' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', lang: 'ar', langName: 'العربية', region: 'Asia' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', lang: 'ar', langName: 'العربية', region: 'Asia' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', lang: 'ar', langName: 'العربية', region: 'Asia' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', lang: 'ar', langName: 'العربية', region: 'Asia' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', lang: 'ar', langName: 'العربية', region: 'Asia' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', lang: 'ar', langName: 'العربية', region: 'Asia' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', lang: 'zh', langName: '繁體中文 / English', region: 'Asia' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', lang: 'zh', langName: '繁體中文', region: 'Asia' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', lang: 'es', langName: 'Español', region: 'Americas' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', lang: 'es', langName: 'Español', region: 'Americas' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦', lang: 'es', langName: 'Español', region: 'Americas' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', lang: 'es', langName: 'Español', region: 'Americas' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', lang: 'es', langName: 'Español', region: 'Americas' },
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴', lang: 'es', langName: 'Español', region: 'Americas' },
  { code: 'PR', name: 'Puerto Rico', flag: '🇵🇷', lang: 'es', langName: 'Español / English', region: 'Americas' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', lang: 'ar', langName: 'العربية / Français', region: 'Africa' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', lang: 'ar', langName: 'العربية', region: 'Africa' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', lang: 'en', langName: 'English', region: 'Africa' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', lang: 'am', langName: 'አማርኛ / English', region: 'Africa' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', lang: 'sw', langName: 'Kiswahili / English', region: 'Africa' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', lang: 'en', langName: 'English', region: 'Africa' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', lang: 'si', langName: 'සිංහල / தமிழ் / English', region: 'Asia' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', lang: 'ne', langName: 'नेपाली', region: 'Asia' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', lang: 'kk', langName: 'Қазақша / Русский', region: 'Asia' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', lang: 'uz', langName: 'Oʻzbekcha', region: 'Asia' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪', lang: 'ka', langName: 'ქართული', region: 'Asia' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲', lang: 'hy', langName: 'Հայերեն', region: 'Asia' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿', lang: 'az', langName: 'Azərbaycan', region: 'Asia' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', lang: 'fr', langName: 'Français / Deutsch', region: 'Europe' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾', lang: 'el', langName: 'Ελληνικά / English', region: 'Europe' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹', lang: 'mt', langName: 'Malti / English', region: 'Europe' },
  { code: 'MC', name: 'Monaco', flag: '🇲🇨', lang: 'fr', langName: 'Français', region: 'Europe' },
  { code: 'FJI', name: 'Fiji', flag: '🇫🇯', lang: 'en', langName: 'English / Fijian', region: 'Oceania' }
];

// Detect User Country from browser timezone and locale
export function detectUserCountry(list = BASE_COUNTRIES) {
  try {
    const tz = (Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone || '').toLowerCase();
    const navLang = (navigator?.language || '').toUpperCase();

    // 1. Regional country subtag from navigator.language (e.g., 'en-IN' -> 'IN', 'pt-BR' -> 'BR')
    const langCountry = navLang.split('-')[1];
    if (langCountry) {
      const match = list.find((c) => c.code.toUpperCase() === langCountry);
      if (match) return match;
    }

    // 2. High-accuracy timezone city matches
    const tzMap = {
      calcutta: 'IN',
      kolkata: 'IN',
      delhi: 'IN',
      mumbai: 'IN',
      new_york: 'US',
      chicago: 'US',
      los_angeles: 'US',
      denver: 'US',
      london: 'GB',
      toronto: 'CA',
      vancouver: 'CA',
      sydney: 'AU',
      melbourne: 'AU',
      paris: 'FR',
      berlin: 'DE',
      frankfurt: 'DE',
      tokyo: 'JP',
      seoul: 'KR',
      sao_paulo: 'BR',
      rio: 'BR',
      dubai: 'AE',
      madrid: 'ES',
      rome: 'IT',
      amsterdam: 'NL',
      singapore: 'SG',
      mexico: 'MX',
      johannesburg: 'ZA',
      bangkok: 'TH',
      jakarta: 'ID',
      riyadh: 'SA',
      cairo: 'EG',
      istanbul: 'TR',
      warsaw: 'PL',
      kiev: 'UA',
      kyiv: 'UA',
      stockholm: 'SE',
      oslo: 'NO',
      copenhagen: 'DK',
      helsinki: 'FI',
      dublin: 'IE',
      auckland: 'NZ',
      manila: 'PH',
      kuala_lumpur: 'MY',
      buenos_aires: 'AR'
    };

    for (const [key, code] of Object.entries(tzMap)) {
      if (tz.includes(key)) {
        const found = list.find((c) => c.code === code);
        if (found) return found;
      }
    }
  } catch {
    // Silently fall back
  }

  return list.find((c) => c.code === 'US') || list[0];
}

// Dynamic Fetcher: Fetches all countries from remote GitHub CDN and merges with local base
export async function fetchAllCountries() {
  const CACHE_KEY = 'rp_all_countries_v2';
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 50) {
        return parsed;
      }
    }
  } catch {
    // Ignore localStorage errors
  }

  try {
    const response = await fetch('https://raw.githubusercontent.com/umpirsky/country-list/master/data/en/country.json', {
      signal: AbortSignal.timeout(4000)
    });
    if (!response.ok) throw new Error('Remote fetch failed');
    const remoteData = await response.json();

    const existingCodes = new Set(BASE_COUNTRIES.map((c) => c.code.toUpperCase()));
    const additional = [];

    for (const [code, name] of Object.entries(remoteData)) {
      const upperCode = code.toUpperCase();
      if (!existingCodes.has(upperCode) && upperCode.length === 2) {
        additional.push({
          code: upperCode,
          name,
          flag: getCountryFlag(upperCode),
          lang: 'en',
          langName: 'English (Default)',
          region: 'All'
        });
      }
    }

    const merged = [...BASE_COUNTRIES, ...additional];
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
    } catch {
      // Ignore cache write error
    }
    return merged;
  } catch {
    return BASE_COUNTRIES;
  }
}
