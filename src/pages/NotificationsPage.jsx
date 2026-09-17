import React from 'react';
import { AppShell } from '../layouts/AppShell';
import { useAppStore } from '../store/useAppStore';
import { Bell, CheckCheck, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppStore();

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-24 pb-16 space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-5 h-5 text-[#22D3EE]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#22D3EE]">
                Broadcast Feed
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
              Notifications
            </h1>
          </div>

          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-[#34D399]" />
            <span>Mark All as Read</span>
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                n.unread
                  ? 'bg-[#172033] border-[#8B5CF6]/40 shadow-lg shadow-[#8B5CF6]/5'
                  : 'bg-[#101626]/60 border-white/5 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl shrink-0 ${n.unread ? 'bg-[#8B5CF6]/20 text-[#22D3EE]' : 'bg-white/5 text-gray-400'}`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm sm:text-base font-display font-semibold text-white">
                      {n.title}
                    </h4>
                    {n.unread && (
                      <span className="w-2 h-2 rounded-full bg-[#22D3EE] shadow-[0_0_6px_#22D3EE]" />
                    )}
                  </div>
                  <p className="text-xs text-gray-300 mb-2">{n.body}</p>
                  <span className="text-[10px] font-mono text-gray-400">{n.time}</span>
                </div>
              </div>

              {n.link && (
                <Link
                  to={n.link}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white shrink-0 self-center"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
