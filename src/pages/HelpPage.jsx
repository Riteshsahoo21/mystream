import React, { useState } from 'react';
import { AppShell } from '../layouts/AppShell';
import { ChevronDown, MessageSquare, Server, Send } from 'lucide-react';

export function HelpPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Welcome to RitzlaPlay Concierge! How can we assist your streaming experience today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const faqs = [
    {
      q: 'How do I stream Stranger Things and other TV series episodes?',
      a: 'Navigate to any TV series such as Stranger Things from the Series page or search bar. Click Watch Now to load the episode directly in full 1080p, or click "Episodes" in the top player bar to switch between Seasons 1-4 and jump to any chapter.'
    },
    {
      q: 'What should I do if a stream buffers or lags on my network?',
      a: 'RitzlaPlay includes a multi-mirror switcher. Inside the video player toolbar, use the server menu to alternate between Server 1 (vsmbed.ru), Server 2 (2Embed), Server 3 (Rive - Global), Server 4 (Smashy HD), Server 5 (VidLink HD), or Server 6 (AutoEmbed).'
    },
    {
      q: 'How does the Google Cloud Translation integration work?',
      a: 'RitzlaPlay connects to the Google Cloud Translation API using your verified project key. Clicking the globe icon in the navigation bar lets you select from 10+ languages (English, Spanish, French, German, Hindi, Japanese, etc.), instantly translating movie synopses and interface text.'
    },
    {
      q: 'Which devices and resolutions are supported?',
      a: 'RitzlaPlay is designed for modern browsers across macOS, Windows, iOS Safari, Android Chrome, and Smart TV browsers. Available quality and audio depend on the selected VidSrc source.'
    }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: `Thank you for your question about "${userText}". If playback is interrupted, try another mirror in the player server menu and confirm that your browser allows embedded media.`
        }
      ]);
    }, 800);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-24 pb-16 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-xs font-mono uppercase text-[#22D3EE]">
            Support & Knowledge
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
            How Can We Assist Your Orbit?
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Answers to common streaming questions, server diagnostic telemetry, and concierge assistance.
          </p>
        </div>

        {/* Streaming Health Check telemetry */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-[#22D3EE]" />
              Streaming Provider Endpoints
            </h3>
            <span className="text-xs font-mono text-[#34D399] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
              Automatic mirror fallback enabled
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-xs font-semibold text-white">Server 1 (AutoEmbed)</div>
              <div className="text-[11px] text-[#34D399] font-mono mt-0.5">Primary route (Jio/Airtel optimized)</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-xs font-semibold text-white">Server 2 (2Embed)</div>
              <div className="text-[11px] text-[#34D399] font-mono mt-0.5">High availability mirror</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-xs font-semibold text-white">Google Translate API</div>
              <div className="text-[11px] text-[#22D3EE] font-mono mt-0.5">Checked when a language is selected</div>
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-display font-semibold text-white hover:text-[#22D3EE] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openFaq === idx ? 'rotate-180 text-[#22D3EE]' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Support assistant trigger */}
        <div className="text-center p-8 rounded-3xl glass-panel border border-white/10 space-y-4">
          <MessageSquare className="w-8 h-8 text-[#22D3EE] mx-auto" />
          <h3 className="text-lg font-display font-bold text-white">
            Need Immediate Assistance?
          </h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Our automated streaming concierge is available 24/7 to answer questions and resolve playback issues.
          </p>
          <button
            onClick={() => setChatOpen(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-[#080B14] font-display font-bold text-xs sm:text-sm shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            Launch Support Assistant
          </button>
        </div>

        {/* Support Chat Modal */}
        {chatOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080B14]/80 backdrop-blur-md">
            <div className="glass-panel rounded-3xl bg-[#101626] border border-white/10 max-w-md w-full h-[520px] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#172033]/60">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#34D399] animate-pulse" />
                  <span className="text-sm font-display font-bold text-white">Ritzla Concierge</span>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white text-sm">
                  ✕
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#22D3EE] text-[#080B14] font-medium'
                          : 'bg-white/10 text-white border border-white/5'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#22D3EE]"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-[#22D3EE] text-[#080B14] hover:brightness-110 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
