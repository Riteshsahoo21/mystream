import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronDown, ShieldCheck, Settings, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { LanguageSelector } from './LanguageSelector';
import { getUIText } from '../../services/translationService';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const isMovieDetailPage = location.pathname.startsWith('/title/');
  const isWatchPage = location.pathname.startsWith('/watch/');
  const isContentPage = isMovieDetailPage || isWatchPage;

  const {
    user,
    language
  } = useAppStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search bar and menus whenever route changes
  useEffect(() => {
    setIsSearchOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/search');
    }
  };

  const navItems = [
    { label: getUIText('home', language), path: '/home' },
    { label: getUIText('discover', language), path: '/discover' },
    { label: getUIText('movies', language), path: '/movies' },
    { label: getUIText('series', language), path: '/series' },
    { label: getUIText('mySpace', language), path: '/my-space' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 py-2.5 sm:py-4 px-3 sm:px-8">
      {/* Ambient gradient fade at top of screen */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#080B14]/90 via-[#080B14]/60 to-transparent pointer-events-none h-32" />

      <div className="max-w-7xl mx-auto flex flex-col gap-2.5 sm:gap-3">
        {/* Tier 1: Sleek, Uncluttered Top Navbar */}
        <div className={`w-full flex items-center justify-between px-3 sm:px-6 py-2 sm:py-2.5 rounded-2xl sm:rounded-full transition-all duration-300 ${
          isScrolled
            ? 'glass-dock bg-[#101626]/95 border border-white/10 shadow-2xl py-2'
            : 'glass-dock bg-[#101626]/80 border border-white/10 shadow-xl'
        }`}>
          
          {/* Left: Back Button (on Movie Details / Watch) + Brand Wordmark */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isContentPage && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
                title="Go back"
                aria-label="Go back"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span className="text-xs">Back</span>
              </button>
            )}

            <Link to="/home" className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer select-none">
              <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#8B5CF6] via-[#22D3EE] to-[#FB7185] p-[1.5px] shadow-lg shadow-[#8B5CF6]/25 group-hover:shadow-[#22D3EE]/40 transition-all duration-300 group-hover:scale-105">
                <div className="w-full h-full bg-[#080B14] rounded-[9px] flex items-center justify-center">
                  <span className="font-display font-black text-xs sm:text-sm tracking-wider bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
                    RP
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base sm:text-xl tracking-tight text-white flex items-center gap-1">
                  Ritzla<span className="text-[#22D3EE]">Play</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Floating Translucent Nav Dock (Desktop only) */}
          <nav className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white/10 text-white shadow-inner font-semibold border border-white/10 text-[#22D3EE]'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right: Quick Search Button (Desktop Only), Language Selector, Profile Orb */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Toggle: Hidden on mobile (bottom nav has Search tab) and hidden on Movie/Watch pages */}
            {!isSearchPage && !isContentPage && (
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`hidden sm:flex items-center gap-1.5 h-9 sm:h-10 px-3.5 rounded-full border transition-all duration-200 cursor-pointer text-xs font-medium ${
                  isSearchOpen
                    ? 'border-[#22D3EE] bg-[#22D3EE]/15 text-[#22D3EE] shadow-md shadow-[#22D3EE]/15'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-[#22D3EE]/40 hover:bg-[#22D3EE]/10'
                }`}
                title={isSearchOpen ? 'Hide search bar' : 'Open search bar'}
                aria-label="Toggle search bar"
              >
                <Search className="w-4 h-4 text-[#22D3EE]" />
                <span>Search</span>
              </button>
            )}

            {/* Language Selector (Google Cloud Translation) */}
            <LanguageSelector compact />

            {/* Profile Quick-Switch Avatar */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full border border-white/15 hover:border-[#22D3EE]/50 transition-all cursor-pointer group"
                aria-label="User menu"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] p-[1.5px] shadow-sm">
                  <div className="w-full h-full bg-[#101626] rounded-full flex items-center justify-center text-xs font-semibold text-white">
                    {user.name.charAt(0)}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-transform hidden sm:block" />
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel bg-[#101626]/95 border border-white/10 shadow-2xl p-2 z-50"
                    onMouseLeave={() => setIsProfileMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-1.5">
                      <div className="text-xs font-semibold text-white">{user.name}</div>
                      <div className="text-[11px] text-gray-400 truncate mt-0.5">
                        Local browser profile
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <Link
                        to="/account"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                        <span>Local Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-gray-400" />
                        <span>Playback Settings</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Tier 2: Dedicated Search Bar (Desktop only, NEVER on movie details or search page) */}
        <AnimatePresence>
          {isSearchOpen && !isSearchPage && !isContentPage && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-3xl mx-auto overflow-hidden"
            >
              <div className="relative rounded-2xl sm:rounded-3xl border border-[#22D3EE]/30 bg-[#101626]/90 p-3 sm:p-4 shadow-2xl backdrop-blur-2xl">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2.5">
                  <div className="relative flex-1 flex items-center">
                    <Search className="absolute left-3.5 sm:left-4 h-4.5 w-4.5 sm:h-5 sm:w-5 text-[#22D3EE] pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search movies, TV series, actors, directors, genres..."
                      className="w-full h-11 sm:h-12 pl-10 sm:pl-12 pr-9 rounded-xl sm:rounded-2xl bg-[#080B14]/90 border border-white/10 text-xs sm:text-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 transition-all"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        aria-label="Clear query"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="h-11 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#22D3EE] via-[#06B6D4] to-[#8B5CF6] text-[#080B14] font-display font-bold text-xs sm:text-sm shadow-md shadow-[#22D3EE]/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <span>Search</span>
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
