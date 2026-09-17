import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, ArrowRight } from 'lucide-react';
import { SplashScreen } from '../components/feedback/SplashScreen';
import { useCatalog } from '../hooks/useCatalog';
import { MediaImage } from '../components/common/MediaImage';

export function LandingPage() {
  const { data: catalog = [] } = useCatalog();

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F8FAFC] selection:bg-[#8B5CF6]/40 selection:text-[#22D3EE] relative overflow-x-hidden">
      {/* Cinematic Splash sequence for first-time visitors */}
      <SplashScreen />

      {/* Floating Marketing Header */}
      <header className="fixed top-0 left-0 right-0 z-40 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8B5CF6] via-[#22D3EE] to-[#FB7185] p-[1.5px] shadow-lg shadow-[#8B5CF6]/25">
              <div className="w-full h-full bg-[#080B14] rounded-[9px] flex items-center justify-center font-display font-black text-xs text-[#22D3EE]">
                RP
              </div>
            </div>
            <span className="font-display font-bold text-xl text-white">
              Ritzla<span className="text-[#22D3EE]">Play</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/home"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-[#080B14] font-display font-bold text-xs sm:text-sm shadow-lg shadow-[#22D3EE]/25 hover:brightness-110 active:scale-95 transition-all"
            >
              Start Watching
            </Link>
          </div>
        </div>
      </header>

      {/* Marketing Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 text-center overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#8B5CF6]/15 via-[#22D3EE]/10 to-[#FB7185]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#22D3EE] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-gray-300">
              The Next-Gen Cinematic Discovery Platform
            </span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-display font-black text-white tracking-tight leading-[1.05]">
            Stories don’t wait in rows. <br />
            <span className="bg-gradient-to-r from-[#22D3EE] via-[#8B5CF6] to-[#FB7185] bg-clip-text text-transparent">
              They move around you.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Explore a provider-backed catalog with Google Cloud Translation, multi-language subtitle selection, and VidSrc mirror switching.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/home"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#22D3EE] via-[#06B6D4] to-[#8B5CF6] text-[#080B14] font-display font-bold text-base shadow-xl shadow-[#22D3EE]/25 hover:shadow-[#22D3EE]/40 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Explore The Platform</span>
            </Link>

            <Link
              to="/discover"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#101626] hover:bg-[#172033] text-white border border-white/10 text-base font-semibold transition-all flex items-center justify-center gap-2"
            >
              <span>Discover All Titles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Titles Showcase Preview */}
      <section className="py-12 border-y border-white/5 bg-[#101626]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
              Movies and series loaded from the provider catalog
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {catalog.slice(0, 6).map((item) => (
              <Link
                key={item.id}
                to={`/title/${item.id}`}
                className="group relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 hover:border-[#22D3EE] transition-all shadow-lg hover:scale-105"
              >
                <MediaImage
                  src={item.poster || item.backdrop}
                  fallbackSrc={item.backdrop}
                  alt={item.title}
                  size="w500"
                  placeholderLabel={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-xs font-display font-bold text-white truncate">{item.title}</div>
                  <div className="text-[10px] text-[#22D3EE] font-mono">{item.quality?.split(' ')[0] || 'HD'}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Call to Action */}
      <footer className="py-16 text-center border-t border-white/10 bg-[#080B14]">
        <div className="max-w-2xl mx-auto px-4 space-y-6">
          <h3 className="text-2xl sm:text-4xl font-display font-bold text-white">
            Ready to Step Into the Orbit?
          </h3>
          <p className="text-xs sm:text-sm text-gray-400">
            Sign up in seconds and start streaming Stranger Things and top blockbusters immediately.
          </p>
          <Link
            to="/home"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-[#080B14] font-display font-bold text-base shadow-xl hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Open RitzlaPlay</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="text-[11px] text-gray-500 font-mono pt-4">
            © {new Date().getFullYear()} RitzlaPlay Streaming Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
