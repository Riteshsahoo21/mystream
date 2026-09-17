import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Compass, Database } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { AppShell } from '../layouts/AppShell';
import { MediaCard } from '../components/cards/MediaCard';
import { CatalogFilterBar } from '../components/discovery/CatalogFilterBar';
import { DEFAULT_CATALOG_FILTERS } from '../components/discovery/catalogFilterConfig';
import { useDiscoverCatalog, useProviderStats } from '../hooks/useCatalog';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

const DEFAULT_FILTERS = { type: 'all', ...DEFAULT_CATALOG_FILTERS };

export function DiscoverPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    genre: searchParams.get('genre') || DEFAULT_FILTERS.genre
  }));
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebouncedValue(filters.query, 300);
  const { data, isFetching, error } = useDiscoverCatalog({ ...filters, query: debouncedQuery, page });
  const { data: stats } = useProviderStats();
  const titles = data?.results || [];

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-7 px-4 pb-16 pt-24 sm:px-8">
        <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#22D3EE]">
              <Compass className="h-5 w-5" /> Discover
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">Find something worth watching</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-400">Filter VidSrc-available titles by format, genre, primary country, language market, and ranking.</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300">
            <Database className="h-4 w-4 text-emerald-400" />
            {stats ? `${(stats.movies + stats.series).toLocaleString()} VidSrc titles` : 'Live VidSrc catalog'}
          </div>
        </header>

        <CatalogFilterBar filters={filters} onChange={updateFilter} onReset={resetFilters} isUpdating={filters.query !== debouncedQuery || isFetching} />

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{data?.totalResults ?? titles.length} matching titles</span>
          {isFetching && <span className="text-[#22D3EE]">Updating results…</span>}
        </div>

        {error && <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">The live VidSrc catalog request failed. Showing the last available results.</div>}

        {titles.length ? (
          <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 ${isFetching ? 'opacity-70' : ''}`}>
            {titles.map((item) => <MediaCard key={item.id} media={item} variant="poster" />)}
          </div>
        ) : !isFetching && (
          <div className="rounded-3xl border border-white/10 bg-white/5 py-20 text-center">
            <Compass className="mx-auto mb-3 h-10 w-10 text-gray-500" />
            <h2 className="font-semibold text-white">No matching titles</h2>
            <p className="mt-1 text-sm text-gray-400">Try a broader region, language, or genre.</p>
          </div>
        )}

        {(data?.totalPages || 1) > 1 && (
          <nav className="flex items-center justify-center gap-3" aria-label="Discover pages">
            <button disabled={page <= 1 || isFetching} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-xl border border-white/10 bg-white/5 p-2 text-white disabled:opacity-30">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-gray-300">Page {page} of {data.totalPages}</span>
            <button disabled={page >= data.totalPages || isFetching} onClick={() => setPage((current) => current + 1)} className="rounded-xl border border-white/10 bg-white/5 p-2 text-white disabled:opacity-30">
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        )}
      </div>
    </AppShell>
  );
}
