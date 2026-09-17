import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, Search, Trash2, X } from 'lucide-react';
import { AppShell } from '../layouts/AppShell';
import { MediaCard } from '../components/cards/MediaCard';
import { useCatalog, useSearchCatalog } from '../hooks/useCatalog';

const DEFAULT_RECENT = ['Stranger Things', 'Dune', 'Christopher Nolan'];

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(urlQuery);
  const [activeFilter, setActiveFilter] = useState('all');
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ritzlaplay_recent_searches') || JSON.stringify(DEFAULT_RECENT));
    } catch {
      return DEFAULT_RECENT;
    }
  });
  const { data: catalog } = useCatalog();
  const { data: searchResults, isFetching, error } = useSearchCatalog(debouncedQuery, catalog);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      setDebouncedQuery(q.trim());
    }
  }, [searchParams]);

  const results = useMemo(() => (searchResults || []).filter((item) => {
    if (activeFilter === 'movie') return item.type === 'movie';
    if (activeFilter === 'series') return item.type === 'series';
    return true;
  }), [activeFilter, searchResults]);

  const rememberSearch = (term) => {
    const normalized = term.trim();
    if (normalized.length < 2) return;
    setRecentSearches((current) => {
      const next = [normalized, ...current.filter((entry) => entry.toLowerCase() !== normalized.toLowerCase())].slice(0, 8);
      localStorage.setItem('ritzlaplay_recent_searches', JSON.stringify(next));
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    rememberSearch(query);
    setDebouncedQuery(query.trim());
  };

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('ritzlaplay_recent_searches');
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8 px-4 pb-16 pt-24 sm:px-8">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">Search the catalog</h1>
          <p className="text-sm text-gray-400">Find movies and TV series by title, cast, director, genre, or language.</p>

          <form onSubmit={handleSubmit} className="flex items-center rounded-2xl border border-white/15 bg-[#101626]/90 p-2 focus-within:border-[#22D3EE] focus-within:ring-2 focus-within:ring-[#22D3EE]/20">
            <Search className="ml-3 h-5 w-5 shrink-0 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Dune, sci-fi, Zendaya…"
              className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none sm:text-base"
              autoFocus
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="mr-1 rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white" aria-label="Clear search">
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          <div className="flex justify-center gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'movie', label: 'Movies' },
              { id: 'series', label: 'TV series' }
            ].map((filter) => (
              <button key={filter.id} onClick={() => setActiveFilter(filter.id)} className={`rounded-xl border px-4 py-2 text-xs font-semibold ${activeFilter === filter.id ? 'border-[#22D3EE] bg-[#22D3EE] text-[#080B14]' : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'}`}>
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {!query && recentSearches.length > 0 && (
          <section className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#8B5CF6]" /> Recent searches</span>
              <button onClick={clearHistory} className="flex items-center gap-1 hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" /> Clear</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => <button key={term} onClick={() => setQuery(term)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10 hover:text-white">{term}</button>)}
            </div>
          </section>
        )}

        {debouncedQuery.length >= 2 && (
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-semibold text-white">Results for “<span className="text-[#22D3EE]">{debouncedQuery}</span>”</h2>
              <span className="text-xs text-gray-400">{isFetching ? 'Searching…' : `${results.length} results`}</span>
            </div>

            {error && <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">The live search failed, so local catalog matches are shown.</p>}

            {results.length ? (
              <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 ${isFetching ? 'opacity-70' : ''}`}>
                {results.map((item) => <MediaCard key={item.id} media={item} variant="poster" />)}
              </div>
            ) : !isFetching && (
              <div className="rounded-3xl border border-white/10 bg-white/5 py-16 text-center">
                <Search className="mx-auto mb-3 h-10 w-10 text-gray-500" />
                <h3 className="font-semibold text-white">No titles found</h3>
                <p className="mt-1 text-sm text-gray-400">Try another title, person, or genre.</p>
              </div>
            )}
          </section>
        )}
      </div>
    </AppShell>
  );
}
