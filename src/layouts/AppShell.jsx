import React from 'react';
import { FloatingNav } from '../components/navigation/FloatingNav';
import { MobileBottomNav } from '../components/navigation/MobileBottomNav';
import { Link } from 'react-router-dom';

export function AppShell({ children, hideNav = false }) {
  return (
    <div className="min-h-screen bg-[#080B14] text-[#F8FAFC] flex flex-col selection:bg-[#8B5CF6]/40 selection:text-[#22D3EE] relative overflow-x-hidden">
      {/* Background Ambient Aura Orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#8B5CF6]/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-10 w-[500px] h-[500px] bg-[#22D3EE]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Floating Desktop Navigation */}
      {!hideNav && <FloatingNav />}

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-24 md:pb-16">
        {children}
      </main>

      {/* Floating Mobile Bottom Navigation */}
      {!hideNav && <MobileBottomNav />}

      {/* Footer */}
      {!hideNav && (
        <footer className="border-t border-white/5 bg-[#080B14] text-xs text-gray-500 py-12 px-4 sm:px-8 mt-auto z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center text-[9px] font-bold text-black">
                  RP
                </div>
                <span className="font-display font-bold text-sm text-white">RitzlaPlay</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  VidSrc Catalog Online
                </span>
              </div>
              <p className="text-gray-400 text-center md:text-left">
                Stories don’t wait in rows. They move around you. Next-generation cinematic discovery.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400">
              <Link to="/help" className="hover:text-white transition-colors">Help Centre</Link>
              <Link to="/account" className="hover:text-white transition-colors">Account</Link>
              <Link to="/settings" className="hover:text-white transition-colors">Privacy & Settings</Link>
            </div>

            <div className="text-center md:text-right font-mono text-[11px] text-gray-500">
              © {new Date().getFullYear()} RitzlaPlay Streaming Inc.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
