import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search, Sparkles, Globe, MapPin, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { isTranslationConfigured, translateText } from '../../services/translationService';

// Full list of ISO 3166-1 alpha-2 country codes
const COUNTRY_CODES = `AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW`.split(' ');

const regionNames = typeof Intl !== 'undefined' && Intl.DisplayNames
  ? new Intl.DisplayNames(['en'], { type: 'region' })
  : null;

// Primary language mapping for top streaming countries
const COUNTRY_LANGUAGES = {
  US: { lang: 'en', name: 'English' },
  IN: { lang: 'hi', name: 'Hindi (हिन्दी) / English' },
  GB: { lang: 'en', name: 'English (UK)' },
  CA: { lang: 'en', name: 'English / Français' },
  AU: { lang: 'en', name: 'English (AU)' },
  FR: { lang: 'fr', name: 'Français' },
  DE: { lang: 'de', name: 'Deutsch' },
  JP: { lang: 'ja', name: '日本語' },
  KR: { lang: 'ko', name: '한국어' },
  BR: { lang: 'pt', name: 'Português (Brasil)' },
  ES: { lang: 'es', name: 'Español' },
  MX: { lang: 'es', name: 'Español (México)' },
  IT: { lang: 'it', name: 'Italiano' },
  NL: { lang: 'nl', name: 'Nederlands' },
  AE: { lang: 'ar', name: 'العربية / English' },
  SA: { lang: 'ar', name: 'العربية' },
  ZA: { lang: 'en', name: 'English / Afrikaans' },
  SG: { lang: 'en', name: 'English / 中文' },
  SE: { lang: 'sv', name: 'Svenska' },
  NO: { lang: 'no', name: 'Norsk' },
  DK: { lang: 'da', name: 'Dansk' },
  FI: { lang: 'fi', name: 'Suomi' },
  CH: { lang: 'de', name: 'Deutsch / Français' },
  AT: { lang: 'de', name: 'Deutsch' },
  BE: { lang: 'nl', name: 'Nederlands / Français' },
  IE: { lang: 'en', name: 'English' },
  NZ: { lang: 'en', name: 'English' },
  PL: { lang: 'pl', name: 'Polski' },
  PT: { lang: 'pt', name: 'Português' },
  GR: { lang: 'el', name: 'Ελληνικά' },
  TR: { lang: 'tr', name: 'Türkçe' },
  ID: { lang: 'id', name: 'Bahasa Indonesia' },
  PH: { lang: 'tl', name: 'Filipino / English' },
  TH: { lang: 'th', name: 'ไทย' },
  VN: { lang: 'vi', name: 'Tiếng Việt' },
  MY: { lang: 'ms', name: 'Bahasa Melayu / English' },
  EG: { lang: 'ar', name: 'العربية' },
  NG: { lang: 'en', name: 'English' },
  AR: { lang: 'es', name: 'Español' },
  CO: { lang: 'es', name: 'Español' },
  CL: { lang: 'es', name: 'Español' },
  IL: { lang: 'he', name: 'עברית' },
  PK: { lang: 'ur', name: 'اردو / English' },
  BD: { lang: 'bn', name: 'বাংলা' },
  UA: { lang: 'uk', name: 'Українська' },
  RU: { lang: 'ru', name: 'Русский' },
  CN: { lang: 'zh', name: '中文' },
  HK: { lang: 'zh', name: '繁體中文 / English' },
  TW: { lang: 'zh', name: '繁體中文' }
};

// Popular countries for quick recommendation
const POPULAR_COUNTRY_CODES = ['US', 'IN', 'GB', 'CA', 'AU', 'FR', 'DE', 'JP', 'KR', 'BR', 'ES', 'MX', 'IT', 'AE', 'ZA', 'NL'];

// Build sorted list of all countries
export const ALL_COUNTRIES = COUNTRY_CODES.map((code) => {
  const name = regionNames?.of(code) || code;
  const langInfo = COUNTRY_LANGUAGES[code] || { lang: 'en', name: 'English' };
  return {
    code,
    name,
    lang: langInfo.lang,
    langName: langInfo.name,
    label: name,
    value: code,
    keywords: `${name} ${code} ${langInfo.name} ${langInfo.lang}`
  };
}).sort((a, b) => a.name.localeCompare(b.name));

// Official LocaleIcon with FlagCDN and Unicode Emoji Fallback
export function LocaleIcon({ code, className = '' }) {
  const [failed, setFailed] = useState(false);
  const normalized = (code || '').trim().toLowerCase();

  useEffect(() => {
    setFailed(false);
  }, [normalized]);

  // Unicode flag emoji fallback
  const getEmojiFlag = (c) => {
    if (!c || c.length !== 2) return '🌐';
    try {
      return String.fromCodePoint(...c.toUpperCase().split('').map((char) => 127397 + char.charCodeAt(0)));
    } catch {
      return '🌐';
    }
  };

  if (normalized && !failed) {
    return (
      <img
        src={`https://flagcdn.com/w40/${normalized}.png`}
        srcSet={`https://flagcdn.com/w80/${normalized}.png 2x`}
        width="20"
        height="14"
        loading="lazy"
        decoding="async"
        alt=""
        className={`inline-block shrink-0 rounded-xs object-cover shadow-sm ${className}`}
        style={{
          width: '20px',
          height: '14px',
          minWidth: '20px',
          maxWidth: '20px'
        }}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className="text-base leading-none select-none inline-block shrink-0" aria-hidden="true">
      {getEmojiFlag(code)}
    </span>
  );
}

export function LanguageSelector({ compact = false }) {
  const { language, setLanguage, country, setCountry } = useAppStore();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [detectedCountry, setDetectedCountry] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const activeOptionRef = useRef(null);

  // Auto-detect country via Cloudflare trace or Timezone/Locale
  useEffect(() => {
    let isMounted = true;

    const detectLocation = async () => {
      let detectedCode = null;

      // 1. Cloudflare Anycast trace lookup
      try {
        const traceUrls = [
          `https://www.cloudflare.com/cdn-cgi/trace?_t=${Date.now()}`,
          `https://1.1.1.1/cdn-cgi/trace?_t=${Date.now()}`
        ];
        for (const url of traceUrls) {
          try {
            const cfRes = await fetch(url, { signal: AbortSignal.timeout(2500) });
            if (cfRes.ok) {
              const text = await cfRes.text();
              for (const line of text.split('\n')) {
                if (line.startsWith('loc=')) {
                  const loc = line.replace('loc=', '').trim().toUpperCase();
                  if (loc.length === 2 && COUNTRY_CODES.includes(loc)) {
                    detectedCode = loc;
                    break;
                  }
                }
              }
              if (detectedCode) break;
            }
          } catch {}
        }
      } catch {}

      // 2. Client Timezone fallback (e.g. Asia/Calcutta -> IN, Europe/London -> GB)
      if (!detectedCode) {
        try {
          const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
          const navLang = (navigator.language || '').toUpperCase();
          const sub = navLang.split('-')[1];
          if (sub && COUNTRY_CODES.includes(sub)) {
            detectedCode = sub;
          } else if (tz.includes('calcutta') || tz.includes('kolkata') || tz.includes('delhi')) {
            detectedCode = 'IN';
          } else if (tz.includes('new_york') || tz.includes('los_angeles') || tz.includes('chicago')) {
            detectedCode = 'US';
          } else if (tz.includes('london')) {
            detectedCode = 'GB';
          } else if (tz.includes('paris')) {
            detectedCode = 'FR';
          } else if (tz.includes('berlin')) {
            detectedCode = 'DE';
          } else if (tz.includes('tokyo')) {
            detectedCode = 'JP';
          } else if (tz.includes('sao_paulo')) {
            detectedCode = 'BR';
          }
        } catch {}
      }

      if (isMounted && detectedCode) {
        const matched = ALL_COUNTRIES.find((c) => c.code === detectedCode);
        if (matched) {
          setDetectedCountry(matched);
          // If country not initialized in store yet, use detected
          if (!country) {
            setCountry(matched.code);
            if (matched.lang) setLanguage(matched.lang);
          }
        }
      }
    };

    detectLocation();
    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronize document language attributes
  useEffect(() => {
    document.documentElement.lang = language || 'en';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Current selected option
  const selectedOption = useMemo(() => {
    return ALL_COUNTRIES.find((c) => c.code === (country || 'US')) || ALL_COUNTRIES[0];
  }, [country]);

  // High-performance search & filter matching LocaleSelector.jsx logic
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return ALL_COUNTRIES;

    const startsWith = [];
    const includes = [];
    ALL_COUNTRIES.forEach((option) => {
      const searchableText = `${option.name} ${option.code} ${option.langName} ${option.lang}`.toLocaleLowerCase();
      if (!searchableText.includes(normalizedQuery)) return;
      if (
        option.name.toLocaleLowerCase().startsWith(normalizedQuery) ||
        option.code.toLocaleLowerCase().startsWith(normalizedQuery) ||
        option.langName.toLocaleLowerCase().startsWith(normalizedQuery)
      ) {
        startsWith.push(option);
      } else {
        includes.push(option);
      }
    });
    return [...startsWith, ...includes];
  }, [query]);

  // Recommended countries subset
  const recommendedOptions = useMemo(() => {
    const popular = ALL_COUNTRIES.filter((c) => POPULAR_COUNTRY_CODES.includes(c.code));
    if (detectedCountry && !popular.some((c) => c.code === detectedCountry.code)) {
      return [detectedCountry, ...popular];
    }
    return popular;
  }, [detectedCountry]);

  // Handle open/close and outside click
  useEffect(() => {
    if (!open) return undefined;

    const selectedIndex = Math.max(0, filteredOptions.findIndex((opt) => opt.code === country));
    setActiveIndex(selectedIndex);
    window.requestAnimationFrame(() => inputRef.current?.focus());

    const handleOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [open, country, filteredOptions]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    activeOptionRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const selectOption = async (option) => {
    setCountry(option.code);
    const targetLang = option.lang || 'en';
    setLanguage(targetLang);
    setOpen(false);
    setQuery('');
    window.requestAnimationFrame(() => triggerRef.current?.focus());

    if (targetLang !== 'en' && isTranslationConfigured) {
      setIsTranslating(true);
      try {
        await translateText('Language ready', targetLang, { throwOnError: false, timeoutMs: 5000 });
      } finally {
        setIsTranslating(false);
      }
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, filteredOptions.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === 'Enter' && filteredOptions[activeIndex]) {
      event.preventDefault();
      selectOption(filteredOptions[activeIndex]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div className="relative inline-block text-left" ref={rootRef} data-no-translate="true">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium text-gray-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#22D3EE]/50 transition-all cursor-pointer backdrop-blur-md shadow-sm"
        aria-label="Select Country and Language"
        aria-haspopup="listbox"
        aria-expanded={open}
        title={`Country: ${selectedOption.name} • Language: ${selectedOption.langName}`}
      >
        <LocaleIcon code={selectedOption.code} />
        <span className="font-mono text-[11px] font-bold text-[#CFFAFE] uppercase tracking-wider">
          {compact ? selectedOption.code : `${selectedOption.code}`}
        </span>
        <ChevronDown size={13} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180 text-[#22D3EE]' : ''}`} />
      </button>

      {/* Dropdown Menu (Rich, Luxury Dropdown with Search & Auto-Recommended) */}
      {open && (
        <div
          className="absolute right-0 mt-2 z-50 w-[340px] sm:w-[380px] max-w-[calc(100vw-24px)] rounded-2xl border border-[#22D3EE]/30 bg-[#101626]/98 p-3 shadow-2xl backdrop-blur-2xl text-left"
          role="dialog"
          aria-label="Country and Language Options"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-1 pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#22D3EE]" />
              <strong className="text-xs font-bold text-white uppercase tracking-wider">
                Country &amp; Language
              </strong>
            </div>
            <span className="text-[10px] font-mono text-[#22D3EE] bg-[#22D3EE]/10 border border-[#22D3EE]/20 px-1.5 py-0.5 rounded">
              {ALL_COUNTRIES.length} Regions
            </span>
          </div>

          {/* Search Field */}
          <div className="my-2.5 relative flex items-center rounded-xl border border-white/15 bg-[#080B14]/80 px-3 py-2 text-gray-300 focus-within:border-[#22D3EE] focus-within:ring-2 focus-within:ring-[#22D3EE]/20 transition-all">
            <Search size={14} className="text-[#22D3EE] shrink-0 mr-2" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search country or language..."
              className="w-full bg-transparent text-xs text-white placeholder:text-gray-500 focus:outline-none"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-gray-400 hover:text-white"
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Auto-Recommended / Detected Section (When query is empty) */}
          {!query && (
            <div className="mb-2 pb-2.5 border-b border-white/10 space-y-2">
              {detectedCountry && (
                <div className="p-2 rounded-xl bg-gradient-to-r from-[#22D3EE]/15 to-[#8B5CF6]/15 border border-[#22D3EE]/30 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <LocaleIcon code={detectedCountry.code} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-[#22D3EE] uppercase tracking-wider">
                        <MapPin size={10} /> Auto-Detected
                      </div>
                      <div className="text-xs font-semibold text-white truncate">
                        {detectedCountry.name} <span className="text-[10px] text-gray-400 font-normal">({detectedCountry.langName})</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => selectOption(detectedCountry)}
                    className="px-2.5 py-1 rounded-lg bg-[#22D3EE] text-[#080B14] font-bold text-[10px] hover:brightness-110 active:scale-95 transition-all shrink-0 cursor-pointer"
                  >
                    Select
                  </button>
                </div>
              )}

              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1">
                  <Sparkles size={11} className="text-[#22D3EE]" /> Popular
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {recommendedOptions.slice(0, 7).map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => selectOption(item)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                        selectedOption.code === item.code
                          ? 'border-[#22D3EE] bg-[#22D3EE]/20 text-white'
                          : 'border-white/10 bg-white/5 hover:border-[#22D3EE]/40 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      <LocaleIcon code={item.code} />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Options List */}
          <div
            className="max-h-60 overflow-y-auto no-scrollbar space-y-1 pr-1"
            role="listbox"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const isSelected = option.code === country;
                const isActive = index === activeIndex;

                return (
                  <button
                    key={option.code}
                    ref={isActive ? activeOptionRef : null}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#22D3EE]/15 border border-[#22D3EE]/40 text-white font-medium'
                        : isActive
                        ? 'bg-white/10 text-white border border-transparent'
                        : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectOption(option)}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <LocaleIcon code={option.code} />
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-white truncate flex items-center gap-1.5">
                          <span>{option.name}</span>
                          <span className="text-[10px] font-mono text-gray-400 uppercase">({option.code})</span>
                        </div>
                        <div className="text-[10px] text-gray-400 truncate">
                          {option.langName}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check size={14} className="text-[#22D3EE] shrink-0 ml-2" />}
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-gray-400">
                No matching countries or languages
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
