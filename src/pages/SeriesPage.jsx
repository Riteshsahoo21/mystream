import React, { useMemo, useState } from 'react';
import { Database, LoaderCircle, Tv } from 'lucide-react';
import { AppShell } from '../layouts/AppShell';
import { MediaCard } from '../components/cards/MediaCard';
import { SpotlightHero } from '../components/discovery/SpotlightHero';
import { CatalogFilterBar } from '../components/discovery/CatalogFilterBar';
import { DEFAULT_CATALOG_FILTERS } from '../components/discovery/catalogFilterConfig';
import { useCatalog, useInfiniteDiscoverCatalog, useProviderStats } from '../hooks/useCatalog';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

export function SeriesPage() {
  const [filters, setFilters] = useState(DEFAULT_CATALOG_FILTERS);
  const { data: catalog } = useCatalog();
  const debouncedQuery = useDebouncedValue(filters.query, 300);
  const queryFilters = { ...filters, query: debouncedQuery, type: 'tv' };
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isLoading } = useInfiniteDiscoverCatalog(queryFilters);
  const { data: stats } = useProviderStats();

  const series = useMemo(() => {
    const seen = new Set();
    return (data?.pages.flatMap((page) => page.results) || []).filter((item) => {
      if (seen.has(item.imdbId)) return false;
      seen.add(item.imdbId);
      return true;
    });
  }, [data]);

  const hasDefaultFilters = filters.genre === 'All genres' && filters.region === 'all' && filters.originalLanguage === 'all' && filters.sort === 'popular' && !debouncedQuery;
  const fallbackSeries = hasDefaultFilters ? catalog.filter((item) => item.type === 'series') : [];
  const visibleSeries = series.length ? series : !data ? fallbackSeries : [];
  const featuredSeries = catalog.find((item) => item.imdbId === 'tt4574334') || fallbackSeries[0] || visibleSeries[0];

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const resetFilters = () => setFilters(DEFAULT_CATALOG_FILTERS);

  return (
    <AppShell>
      <SpotlightHero media={featuredSeries} />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-8">
        <header className="flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Tv className="h-4 w-4 text-[#8B5CF6]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#8B5CF6]">Prestige Episodic TV</span>
            </div>
            <h1 className="text-2xl font-bold text-white sm:text-4xl">Groundbreaking TV Series</h1>
            <p className="mt-2 flex items-center gap-2 text-xs text-gray-400">
              <Database className="h-3.5 w-3.5 text-emerald-400" />
              {stats ? `${stats.series.toLocaleString()} streamable series indexed by VidSrc` : 'Loading the live VidSrc inventory…'}
            </p>
          </div>
        </header>

        <CatalogFilterBar
          filters={filters}
          onChange={updateFilter}
          onReset={resetFilters}
          showType={false}
          searchLabel="Search all streamable series…"
          isUpdating={filters.query !== debouncedQuery || isFetching}
        />

        {error && <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-100">The series catalog could not be refreshed. Please retry.</div>}

        <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 ${isFetching && !isFetchingNextPage ? 'opacity-70' : ''}`}>
          {visibleSeries.map((show) => <MediaCard key={show.id} media={show} variant="poster" />)}
        </div>

        {isLoading && !visibleSeries.length && <LoaderCircle className="mx-auto h-7 w-7 animate-spin text-[#8B5CF6]" />}
        {!isLoading && !visibleSeries.length && <p className="text-center text-sm text-gray-400">No streamable series match these filters.</p>}
        {hasNextPage && (
          <div className="flex justify-center">
            <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="flex items-center gap-2 rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-5 py-2.5 text-sm font-semibold text-[#C4B5FD] hover:bg-[#8B5CF6]/20 disabled:opacity-50">
              {isFetchingNextPage && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {isFetchingNextPage ? 'Loading more series…' : 'Load more series'}
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
