import React, { useState } from 'react';
import { AppShell } from '../layouts/AppShell';
import { useAppStore } from '../store/useAppStore';
import { Settings, Check } from 'lucide-react';
import { useSoundEffects } from '../hooks/useSoundEffects';

export function SettingsPage() {
  const { settings, updateSettings } = useAppStore();
  const [savedToast, setSavedToast] = useState(false);
  const { playSound } = useSoundEffects();

  const handleToggle = (key) => {
    playSound('click');
    updateSettings({ [key]: !settings[key] });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-24 pb-16 space-y-10">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings className="w-5 h-5 text-[#22D3EE]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#22D3EE]">
                Preferences
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
              Playback & System Settings
            </h1>
          </div>

          {savedToast && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center gap-1.5 border border-emerald-500/30">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>

        {/* Playback & Data Preferences */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <h3 className="text-base font-display font-bold text-white">Streaming & Audio Preferences</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <div>
                <div className="text-sm font-semibold text-white">Procedural Web Audio Effects</div>
                <div className="text-xs text-gray-400">Play subtle cinematic synthesized chimes on interactions (Enabled by default)</div>
              </div>
              <button
                onClick={() => handleToggle('soundEffects')}
                className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                  settings.soundEffects !== false ? 'bg-[#8B5CF6]' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.soundEffects !== false ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <div>
                <div className="text-sm font-semibold text-white">Autoplay Previews on Hover</div>
                <div className="text-xs text-gray-400">Play muted cinematic trailer teasers when hovering cards (Enabled by default)</div>
              </div>
              <button
                onClick={() => handleToggle('autoplayPreviews')}
                className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                  settings.autoplayPreviews !== false ? 'bg-[#22D3EE]' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.autoplayPreviews !== false ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <div>
                <div className="text-sm font-semibold text-white">Data Saver Mode</div>
                <div className="text-xs text-gray-400">Limits cellular bandwidth usage to 720p HD</div>
              </div>
              <button
                onClick={() => handleToggle('dataSaver')}
                className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                  settings.dataSaver ? 'bg-[#22D3EE]' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.dataSaver ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
