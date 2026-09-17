import React, { useMemo, useState } from 'react';
import { Database, Film, LoaderCircle } from 'lucide-react';
import { AppShell } from '../layouts/AppShell';
import { MediaCard } from '../components/cards/MediaCard';
import { SpotlightHero } from '../components/discovery/SpotlightHero';
import { CatalogFilterBar } from '../components/discovery/CatalogFilterBar';
import { DEFAULT_CATALOG_FILTERS } from '../components/discovery/catalogFilterConfig';
import { useCatalog, useInfiniteDiscoverCatalog, useProviderStats } from '../hooks/useCatalog';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

export function MoviesPage() {
  const [filters, setFilters] = useState(DEFAULT_CATALOG_FILTERS);
  const { data: catalog } = useCatalog();
  const debouncedQuery = useDebouncedValue(filters.query, 300);
  const queryFilters = { ...filters, query: debouncedQuery, type: 'movie' };
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isLoading } = useInfiniteDiscoverCatalog(queryFilters);
  const { data: stats } = useProviderStats();

  const movies = useMemo(() => {
    const seen = new Set();
    return (data?.pages.flatMap((page) => page.results) || []).filter((item) => {
      if (seen.has(item.imdbId)) return false;
      seen.add(item.imdbId);
      return true;
    });
  }, [data]);

  const hasDefaultFilters = filters.genre === 'All genres' && filters.region === 'all' && filters.originalLanguage === 'all' && filters.sort === 'popular' && !debouncedQuery;
  const fallbackMovies = hasDefaultFilters ? catalog.filter((item) => item.type === 'movie') : [];
  const visibleMovies = movies.length ? movies : !data ? fallbackMovies : [];
  const featuredMovie = catalog.find((item) => item.imdbId === 'tt15239678') || fallbackMovies[0] || visibleMovies[0];

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const resetFilters = () => setFilters(DEFAULT_CATALOG_FILTERS);

  return (
    <AppShell>
      <SpotlightHero media={featuredMovie} />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-8">
        <header className="flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Film className="h-4 w-4 text-[#22D3EE]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#22D3EE]">Feature Length</span>
            </div>
            <h1 className="text-2xl font-bold text-white sm:text-4xl">Cinematic Masterpieces</h1>
            <p className="mt-2 flex items-center gap-2 text-xs text-gray-400">
              <Database className="h-3.5 w-3.5 text-emerald-400" />
              {stats ? `${stats.movies.toLocaleString()} streamable movies indexed by VidSrc` : 'Loading the live VidSrc inventory…'}
            </p>
          </div>
        </header>

        <CatalogFilterBar
          filters={filters}
          onChange={updateFilter}
          onReset={resetFilters}
          showType={false}
          searchLabel="Search all streamable movies…"
          isUpdating={filters.query !== debouncedQuery || isFetching}
        />

        {error && <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-100">The movie catalog could not be refreshed. Please retry.</div>}

        <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 ${isFetching && !isFetchingNextPage ? 'opacity-70' : ''}`}>
          {visibleMovies.map((movie) => <MediaCard key={movie.id} media={movie} variant="poster" />)}
        </div>

        {isLoading && !visibleMovies.length && <LoaderCircle className="mx-auto h-7 w-7 animate-spin text-[#22D3EE]" />}
        {!isLoading && !visibleMovies.length && <p className="text-center text-sm text-gray-400">No streamable movies match these filters.</p>}
        {hasNextPage && (
          <div className="flex justify-center">
            <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="flex items-center gap-2 rounded-xl border border-[#22D3EE]/30 bg-[#22D3EE]/10 px-5 py-2.5 text-sm font-semibold text-[#67E8F9] hover:bg-[#22D3EE]/20 disabled:opacity-50">
              {isFetchingNextPage && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {isFetchingNextPage ? 'Loading more movies…' : 'Load more movies'}
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
