import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Settings, ShieldCheck } from 'lucide-react';
import { AppShell } from '../layouts/AppShell';
import { useAppStore } from '../store/useAppStore';

export function AccountPage() {
  const user = useAppStore((state) => state.user);

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-8 px-4 pb-16 pt-24 sm:px-8">
        <header className="border-b border-white/10 pb-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#22D3EE]">
            <ShieldCheck className="h-5 w-5" /> Local profile
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">RitzlaPlay Profile</h1>
          <p className="mt-2 text-sm text-gray-400">No sign-in is required. Preferences and watch progress stay in this browser.</p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-[#101626]/80 p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#22D3EE] to-[#8B5CF6] text-2xl font-bold text-[#080B14]">
              {(user?.name || 'R')[0].toUpperCase()}
            </div>
            <div>
              <span className="text-xs uppercase text-gray-500">Browser profile</span>
              <h2 className="text-xl font-bold text-white">{user?.name || 'Ritzla Viewer'}</h2>
            </div>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link to="/my-space" className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white transition-colors hover:bg-white/10">
            <Bookmark className="mb-3 h-5 w-5 text-[#22D3EE]" />
            <div className="font-semibold">My Space</div>
            <p className="mt-1 text-xs text-gray-400">Watchlist and saved progress</p>
          </Link>
          <Link to="/settings" className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white transition-colors hover:bg-white/10">
            <Settings className="mb-3 h-5 w-5 text-[#8B5CF6]" />
            <div className="font-semibold">Playback settings</div>
            <p className="mt-1 text-xs text-gray-400">Language, quality, and accessibility</p>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
