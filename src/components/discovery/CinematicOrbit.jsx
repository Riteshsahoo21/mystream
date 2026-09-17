import React from 'react';
import { Orbit } from 'lucide-react';
import { MediaCard } from '../cards/MediaCard';

export function CinematicOrbit({ centerTitle, orbitalTitles = [] }) {
  const titles = orbitalTitles.length > 0 ? orbitalTitles : (centerTitle ? [centerTitle] : []);

  if (!titles.length) return null;

  return (
    <section className="relative w-full py-12 sm:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Orbit className="w-4 h-4 text-[#22D3EE] animate-spin" style={{ animationDuration: '14s' }} />
              <span className="text-xs font-mono uppercase tracking-widest text-[#22D3EE]">
                Cinematic Orbit System
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Tonight's Orbit
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Featured celestial titles in tonight's discovery rotation.
            </p>
          </div>
        </div>

        {/* Clean Grid View */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {titles.map((item) => (
            <MediaCard key={item.id} media={item} variant="poster" />
          ))}
        </div>
      </div>
    </section>
  );
}
