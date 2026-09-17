import React, { useState } from 'react';
import { GENRE_CONSTELLATION_NODES, GENRE_CONSTELLATION_LINKS } from '../../data/collections';
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';

export function GenreConstellation({ activeGenre = 'All', onSelectGenre }) {
  const [hoveredNode, setHoveredNode] = useState(null);

  return (
    <div className="relative w-full glass-panel bg-[#101626]/70 rounded-3xl p-6 sm:p-8 border border-white/10 overflow-hidden my-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-mono uppercase text-[#8B5CF6] tracking-widest flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-[#22D3EE]" /> Interactive Constellation
          </span>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
            Genre Stellar Map
          </h3>
        </div>
        <div className="text-xs text-gray-400 hidden sm:block font-mono">
          Interactive Nodes • Click to Filter
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full aspect-[21/9] min-h-[260px] bg-[#080B14]/60 rounded-2xl border border-white/5 overflow-hidden">
        <svg className="w-full h-full absolute inset-0 pointer-events-none">
          <defs>
            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Links */}
          {GENRE_CONSTELLATION_LINKS.map((link, idx) => {
            const fromNode = GENRE_CONSTELLATION_NODES.find(n => n.id === link.from);
            const toNode = GENRE_CONSTELLATION_NODES.find(n => n.id === link.to);
            if (!fromNode || !toNode) return null;

            const isHighlighted = hoveredNode === fromNode.id || hoveredNode === toNode.id;

            return (
              <line
                key={idx}
                x1={`${fromNode.x}%`}
                y1={`${fromNode.y}%`}
                x2={`${toNode.x}%`}
                y2={`${toNode.y}%`}
                stroke={isHighlighted ? '#22D3EE' : 'rgba(255, 255, 255, 0.12)'}
                strokeWidth={isHighlighted ? 2 : 1}
                strokeDasharray={isHighlighted ? 'none' : '3,3'}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {GENRE_CONSTELLATION_NODES.map((node) => {
          const isActive = activeGenre === node.id;
          const isHovered = hoveredNode === node.id;

          return (
            <motion.button
              key={node.id}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => onSelectGenre && onSelectGenre(node.id)}
              className={`absolute flex flex-col items-center justify-center p-2 rounded-2xl cursor-pointer transition-all ${
                isActive
                  ? 'z-20 bg-[#22D3EE] text-[#080B14] shadow-lg shadow-[#22D3EE]/40 ring-4 ring-[#22D3EE]/20'
                  : isHovered
                  ? 'z-20 bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/30'
                  : 'z-10 bg-[#172033]/90 text-gray-200 border border-white/10 hover:border-white/30 backdrop-blur-md'
              }`}
            >
              <div className="flex items-center gap-1.5 px-2 py-0.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isActive ? '#080B14' : node.color }}
                />
                <span className="text-xs font-display font-semibold whitespace-nowrap">
                  {node.label}
                </span>
              </div>
              <span className={`text-[10px] font-mono ${isActive ? 'text-[#080B14]/80' : 'text-gray-400'}`}>
                {node.count} titles
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
