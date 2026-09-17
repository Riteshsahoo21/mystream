import React from 'react';
import { LoaderCircle, RotateCcw, Search } from 'lucide-react';
import { DISCOVER_GENRES } from '../../services/vidsrcCatalogService';
import { SUPPORTED_LANGUAGES } from '../../services/translationService';
import { CATALOG_REGIONS } from './catalogFilterConfig';

const selectClassName = 'w-full rounded-xl border border-white/10 bg-[#080B14] px-3 py-2.5 text-sm text-white focus:border-[#22D3EE]/60 focus:outline-none';

export function CatalogFilterBar({ filters, onChange, onReset, showType = true, isUpdating = false, searchLabel = 'Search movies and series…' }) {
  return (
    <section
      className={`grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-[#101626]/80 p-4 sm:grid-cols-2 ${showType ? 'lg:grid-cols-6' : 'lg:grid-cols-5'}`}
      aria-label="Catalog filters"
    >
      <label className={`space-y-1 text-xs text-gray-400 sm:col-span-2 ${showType ? 'lg:col-span-6' : 'lg:col-span-5'}`}>
        <span>Search the streamable catalog</span>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#22D3EE]" />
          <input
            value={filters.query}
            onChange={(event) => onChange('query', event.target.value)}
            placeholder={searchLabel}
            className="w-full rounded-xl border border-white/10 bg-[#080B14] py-3 pl-10 pr-10 text-sm text-white placeholder:text-gray-500 focus:border-[#22D3EE]/60 focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/10"
          />
          {isUpdating && <LoaderCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#22D3EE]" />}
        </div>
      </label>

      {showType && (
        <label className="space-y-1 text-xs text-gray-400">
          <span>Format</span>
          <select value={filters.type} onChange={(event) => onChange('type', event.target.value)} className={selectClassName}>
            <option value="all">Movies & series</option>
            <option value="movie">Movies</option>
            <option value="tv">TV series</option>
          </select>
        </label>
      )}

      <label className="space-y-1 text-xs text-gray-400">
        <span>Genre</span>
        <select value={filters.genre} onChange={(event) => onChange('genre', event.target.value)} className={selectClassName}>
          {DISCOVER_GENRES.map((genre) => <option key={genre} value={genre}>{genre}</option>)}
        </select>
      </label>

      <label className="space-y-1 text-xs text-gray-400">
        <span>Region</span>
        <select value={filters.region} onChange={(event) => onChange('region', event.target.value)} className={selectClassName}>
          {CATALOG_REGIONS.map((region) => <option key={region.code} value={region.code}>{region.name}</option>)}
        </select>
      </label>

      <label className="space-y-1 text-xs text-gray-400">
        <span>Language / market</span>
        <select value={filters.originalLanguage} onChange={(event) => onChange('originalLanguage', event.target.value)} className={selectClassName}>
          <option value="all">All languages</option>
          {SUPPORTED_LANGUAGES.map((language) => <option key={language.code} value={language.code}>{language.name}</option>)}
        </select>
      </label>

      <label className="space-y-1 text-xs text-gray-400">
        <span>Sort</span>
        <select value={filters.sort} onChange={(event) => onChange('sort', event.target.value)} className={selectClassName}>
          <option value="popular">Most popular</option>
          <option value="rating">Highest rated</option>
          <option value="newest">Newest first</option>
        </select>
      </label>

      <button onClick={onReset} className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white">
        <RotateCcw className="h-4 w-4" /> Reset
      </button>
    </section>
  );
}
