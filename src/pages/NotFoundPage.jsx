import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Orbit } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#080B14] text-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8B5CF6]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#22D3EE] shadow-2xl">
          <Orbit className="w-10 h-10 animate-spin" style={{ animationDuration: '20s' }} />
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-rose-400">
            Error 404 • Coordinate Lost
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white mt-1">
            Lost in the Void
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
            The orbital trajectory you were seeking does not exist or has decayed from our streaming constellation.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/home"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-[#080B14] font-display font-bold text-xs sm:text-sm shadow-xl hover:brightness-110 active:scale-95 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Return to Orbit</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
