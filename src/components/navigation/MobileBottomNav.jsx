import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Search, Bookmark, User } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { getUIText } from '../../services/translationService';

export function MobileBottomNav() {
  const { language, user } = useAppStore();

  const items = [
    { label: getUIText('home', language), path: '/home', icon: Home },
    { label: getUIText('discover', language), path: '/discover', icon: Compass },
    { label: getUIText('search', language), path: '/search', icon: Search },
    { label: getUIText('mySpace', language), path: '/my-space', icon: Bookmark },
    { label: 'Account', path: '/account', icon: User, isAvatar: true }
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pt-1"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 12px))' }}
    >
      <div className="glass-dock bg-[#080B14]/95 border border-white/10 rounded-2xl py-2 px-2 flex items-center justify-around shadow-2xl backdrop-blur-2xl">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] py-1 transition-all ${
                  isActive ? 'text-[#22D3EE]' : 'text-gray-400 hover:text-gray-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.isAvatar ? (
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] p-[1px] ${isActive ? 'ring-2 ring-[#22D3EE]' : ''}`}>
                      <div className="w-full h-full bg-[#101626] rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                        {user.name.charAt(0)}
                      </div>
                    </div>
                  ) : (
                    <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  )}
                  <span className="text-[10px] font-medium tracking-tight">
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-[#22D3EE] shadow-[0_0_6px_#22D3EE]" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
