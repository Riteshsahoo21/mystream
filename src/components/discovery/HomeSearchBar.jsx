import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, X } from 'lucide-react';

const POPULAR_QUICK_SEARCHES = [
  'Stranger Things',
  'Dune',
  'Christopher Nolan',
  'Sci-Fi',
  'Action',
  'Horror',
  'Drama',
  'Anime'
];

export function HomeSearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/search');
    }
  };

  const handleChipClick = (term) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <section className="relative w-full py-2">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#22D3EE]/10 via-[#8B5CF6]/10 to-[#FB7185]/10 rounded-3xl blur-2xl pointer-events-none opacity-60" />

      <div className="relative z-10 glass-panel rounded-3xl border border-white/10 bg-[#101626]/80 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
        <form onSubmit={handleSearch} className="relative flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full flex items-center">
            <Search className="absolute left-4 sm:left-5 h-5 w-5 sm:h-6 sm:w-6 text-[#22D3EE] pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, TV series, actors, directors, genres..."
              className="w-full h-12 sm:h-15 pl-12 sm:pl-15 pr-10 sm:pr-12 rounded-2xl bg-[#080B14]/90 border border-white/15 text-sm sm:text-base text-white placeholder:text-gray-400 focus:outline-none focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/25 transition-all shadow-inner"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3.5 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Clear query"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto h-12 sm:h-15 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-[#22D3EE] via-[#06B6D4] to-[#8B5CF6] text-[#080B14] font-display font-bold text-sm sm:text-base shadow-lg shadow-[#22D3EE]/20 hover:shadow-[#22D3EE]/35 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Search Catalog</span>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </form>

        {/* Quick Search Trending Tags */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400 mr-1">
            <Sparkles className="h-3.5 w-3.5 text-[#22D3EE]" />
            <span className="uppercase tracking-wider text-[11px]">Popular:</span>
          </div>
          {POPULAR_QUICK_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleChipClick(term)}
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:border-[#22D3EE]/50 hover:bg-[#22D3EE]/10 text-xs font-medium text-gray-300 hover:text-[#22D3EE] transition-all cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
