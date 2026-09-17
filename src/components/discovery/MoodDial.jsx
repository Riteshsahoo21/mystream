import React from 'react';
import { Sparkles, Brain, Zap, Moon, Flame, Coffee, Smile, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOODS } from '../../data/collections';
import { useSoundEffects } from '../../hooks/useSoundEffects';

const MOOD_ICONS = {
  Sparkles,
  Brain,
  Zap,
  Moon,
  Flame,
  Coffee,
  Smile,
  Clock
};

export function MoodDial({ activeMood = 'all', onSelectMood }) {
  const { playSound } = useSoundEffects();

  const handleSelect = (id) => {
    playSound('click');
    if (onSelectMood) onSelectMood(id);
  };

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-mono uppercase text-[#22D3EE] tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Emotional Resonance
          </span>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
            Choose Your Cinematic Frequency
          </h3>
        </div>
      </div>

      {/* Mood Capsule Shelf */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2">
        {MOODS.map((mood) => {
          const isActive = activeMood === mood.id;
          const Icon = MOOD_ICONS[mood.icon] || Sparkles;

          return (
            <motion.button
              key={mood.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelect(mood.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer border select-none ${
                isActive
                  ? 'bg-gradient-to-r from-[#8B5CF6]/30 to-[#22D3EE]/30 border-[#22D3EE] text-white shadow-lg shadow-[#22D3EE]/15 ring-1 ring-[#22D3EE]/40'
                  : 'bg-[#101626]/80 hover:bg-[#172033] border-white/5 hover:border-white/15 text-gray-300 hover:text-white'
              }`}
            >
              <Icon
                className="w-4 h-4 shrink-0 transition-colors"
                style={{ color: isActive ? '#22D3EE' : mood.color }}
              />
              <span>{mood.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
