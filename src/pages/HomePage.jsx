import React, { useMemo, useState } from 'react';
import { AppShell } from '../layouts/AppShell';
import { SpotlightHero } from '../components/discovery/SpotlightHero';
import { CinematicOrbit } from '../components/discovery/CinematicOrbit';
import { BentoDiscoveryGrid } from '../components/discovery/BentoDiscoveryGrid';
import { MoodDial } from '../components/discovery/MoodDial';
import { MediaCard } from '../components/cards/MediaCard';
import { RankedCard } from '../components/cards/RankedCard';
import { EditorialCard } from '../components/cards/EditorialCard';
import { EDITORIAL_COLLECTIONS } from '../data/collections';
import { useAppStore } from '../store/useAppStore';
import { Sparkles, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../hooks/useCatalog';

export function HomePage() {
  const [activeMood, setActiveMood] = useState('all');
  const { watchProgress } = useAppStore();
  const { data: rawCatalog } = useCatalog();
  const [rotationOffset] = useState(() => {
    try {
      const next = (Number(localStorage.getItem('ritzlaplay-home-rotation')) || 0) + 7;
      localStorage.setItem('ritzlaplay-home-rotation', String(next));
      return next;
    } catch {
      return 0;
    }
  });
  const catalog = useMemo(() => {
    if (!rawCatalog.length) return rawCatalog;
    const offset = rotationOffset % rawCatalog.length;
    return [...rawCatalog.slice(offset), ...rawCatalog.slice(0, offset)];
  }, [rawCatalog, rotationOffset]);

  if (!catalog.length) {
    return (
      <AppShell>
        <div className="animate-pulse space-y-10 px-4 pb-16 pt-24 sm:px-8">
          <div className="mx-auto h-[55vh] max-w-7xl rounded-3xl bg-gradient-to-br from-[#172033] to-[#101626]" />
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {Array.from({ length: 6 }, (_, index) => <div key={index} className="aspect-[2/3] rounded-2xl bg-white/5" />)}
          </div>
        </div>
      </AppShell>
    );
  }

  const heroMedia = catalog.find((item) => item.type === 'movie') || catalog[0];
  const strangerThings = catalog.find((item) => item.imdbId === 'tt4574334');
  const orbitTitles = catalog.filter((item) => item.id !== heroMedia.id).slice(0, 6);
  const orbitIds = new Set([heroMedia.id, ...orbitTitles.map((item) => item.id)]);
  const moodFilteredTitles = catalog.filter((item) => {
    if (orbitIds.has(item.id)) return false;
    return activeMood === 'all' || item.moods?.includes(activeMood);
  });
  const rankedTitles = catalog.filter(m => m.isTop10).sort((a, b) => a.isTop10 - b.isTop10);
  const top10Titles = rankedTitles.length ? rankedTitles : catalog.slice(0, 10);
  const seriesCatalog = catalog.filter(m => m.type === 'series');
  const moviesCatalog = catalog.filter(m => m.type === 'movie');
  const editorialCollections = EDITORIAL_COLLECTIONS.map((collection, index) => {
    const matchingTitle = catalog.find((item, itemIndex) => itemIndex >= index * 4 && item.genres?.includes(collection.genre));
    const artworkTitle = matchingTitle || catalog[(index * 7 + 3) % catalog.length];
    return { ...collection, bannerImage: artworkTitle?.backdrop || artworkTitle?.poster };
  });

  // Continue watching items from state
  const continueWatchingItems = Object.keys(watchProgress)
    .map(id => catalog.find(m => m.id === id))
    .filter(Boolean);

  return (
    <AppShell>
      {/* 1. Asymmetric Editorial Spotlight Hero */}
      <SpotlightHero media={heroMedia} />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12 sm:space-y-16 mt-4">
        
        {/* 2. Continue Watching Shelf (with real progress persistence) */}
        {continueWatchingItems.length > 0 && (
          <section className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#22D3EE]" />
                <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                  Continue Watching
                </h2>
              </div>
              <Link to="/my-space" className="text-xs font-mono text-gray-400 hover:text-[#22D3EE] transition-colors">
                View All History →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {continueWatchingItems.map((item) => (
                <MediaCard key={item.id} media={item} variant="wide" />
              ))}
            </div>
          </section>
        )}

        {/* 3. Tonight's Orbit Personalized System */}
        <CinematicOrbit centerTitle={strangerThings || heroMedia} orbitalTitles={orbitTitles} />

        {/* 4. Mood Dial Discovery Filter */}
        <section>
          <MoodDial activeMood={activeMood} onSelectMood={setActiveMood} />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
            {moodFilteredTitles.slice(0, 6).map((item) => (
              <MediaCard key={item.id} media={item} variant="poster" />
            ))}
          </div>
        </section>

        {/* 5. Top 10 in Your Region */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-[#FB7185]" />
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                Top 10 in Your Region Today
              </h2>
              <p className="text-xs text-gray-400">The most watched streams across the Ritzla network</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {top10Titles.slice(0, 6).map((item, idx) => (
              <RankedCard key={item.id} media={item} rank={idx + 1} />
            ))}
          </div>
        </section>

        {/* 6. Curated Editorial Bento Spotlight */}
        <BentoDiscoveryGrid items={catalog.slice(1, 5)} />

        {/* 7. Prestige TV Series Shelf */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono uppercase text-[#8B5CF6] tracking-widest">
                Episodic Masterpieces
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-0.5">
                Binge-Worthy TV Series
              </h2>
            </div>
            <Link to="/series" className="text-xs font-mono text-[#22D3EE] hover:underline">
              Browse All Series →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {seriesCatalog.slice(0, 6).map((item) => (
              <MediaCard key={item.id} media={item} variant="poster" />
            ))}
          </div>
        </section>

        {/* 8. Editorial Collections Spotlight */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#22D3EE]" />
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
              Curated Visions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {editorialCollections.slice(0, 2).map((col) => (
              <EditorialCard key={col.id} collection={col} />
            ))}
          </div>
        </section>

        {/* 9. Critically Acclaimed Cinema */}
        <section className="pb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono uppercase text-[#34D399] tracking-widest">
                Cinematic Perfection
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-0.5">
                Critically Acclaimed Masterpieces
              </h2>
            </div>
            <Link to="/movies" className="text-xs font-mono text-[#22D3EE] hover:underline">
              Explore All Movies →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {moviesCatalog.slice(0, 6).map((item) => (
              <MediaCard key={item.id} media={item} variant="poster" />
            ))}
          </div>
        </section>

      </div>
    </AppShell>
  );
}
