import React, { useState } from 'react';
import { AppShell } from '../layouts/AppShell';
import { useAppStore } from '../store/useAppStore';
import { MediaCard } from '../components/cards/MediaCard';
import {
  Bookmark, Clock, Heart, FolderPlus, Trash2,
  Sparkles, X
} from 'lucide-react';
import { useCatalog } from '../hooks/useCatalog';

export function MySpacePage() {
  const [activeTab, setActiveTab] = useState('watchlist'); // 'watchlist' | 'continue' | 'favorites' | 'collections'
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: catalog } = useCatalog();

  const {
    watchlist,
    favorites,
    watchProgress,
    clearHistory,
    customCollections,
    createCollection,
    deleteCollection
  } = useAppStore();

  const watchlistItems = watchlist.map(id => catalog.find(m => m.id === id)).filter(Boolean);
  const favoriteItems = favorites.map(id => catalog.find(m => m.id === id)).filter(Boolean);
  const continueItems = Object.keys(watchProgress).map(id => catalog.find(m => m.id === id)).filter(Boolean);

  const handleCreateCollection = (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    createCollection(newCollectionName.trim());
    setNewCollectionName('');
    setShowCreateModal(false);
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-24 pb-16 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Bookmark className="w-5 h-5 text-[#22D3EE]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#22D3EE]">
                Personal Sanctum
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
              My Space
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Your saved watchlist, active viewing progress, liked masterworks, and custom playlists.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-[#080B14] font-display font-bold text-xs sm:text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>New Collection</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-white/5">
          {[
            { id: 'watchlist', label: `Watchlist (${watchlistItems.length})`, icon: Bookmark },
            { id: 'continue', label: `Continue Watching (${continueItems.length})`, icon: Clock },
            { id: 'favorites', label: `Liked Masterworks (${favoriteItems.length})`, icon: Heart },
            { id: 'collections', label: `Custom Playlists (${customCollections.length})`, icon: Sparkles }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                  isActive
                    ? 'bg-[#172033] border-[#22D3EE] text-white shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#22D3EE]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {/* Watchlist Tab */}
          {activeTab === 'watchlist' && (
            <div>
              {watchlistItems.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {watchlistItems.map(item => (
                    <MediaCard key={item.id} media={item} variant="poster" />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center glass-panel rounded-3xl border border-white/10">
                  <Bookmark className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                  <h3 className="text-base font-display font-semibold text-white mb-1">
                    Your Space is Empty
                  </h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Add movies and series to your space to keep track of titles you want to watch.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Continue Watching Tab */}
          {activeTab === 'continue' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Progress</span>
                </button>
              </div>

              {continueItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {continueItems.map(item => (
                    <MediaCard key={item.id} media={item} variant="wide" />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center glass-panel rounded-3xl border border-white/10">
                  <Clock className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                  <h3 className="text-base font-display font-semibold text-white mb-1">
                    No Active Streams
                  </h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Start watching any title to seamlessly resume from where you left off.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div>
              {favoriteItems.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {favoriteItems.map(item => (
                    <MediaCard key={item.id} media={item} variant="poster" />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center glass-panel rounded-3xl border border-white/10">
                  <Heart className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                  <h3 className="text-base font-display font-semibold text-white mb-1">
                    No Liked Masterworks
                  </h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Titles you like while watching will appear here for fast retrieval.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Custom Collections Tab */}
          {activeTab === 'collections' && (
            <div className="space-y-8">
              {customCollections.map(col => {
                const colItems = col.items.map(id => catalog.find(m => m.id === id)).filter(Boolean);
                return (
                  <div key={col.id} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-display font-bold text-white">{col.name}</h3>
                        <span className="text-xs text-gray-400 font-mono">{colItems.length} titles</span>
                      </div>
                      <button
                        onClick={() => deleteCollection(col.id)}
                        className="p-2 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete collection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {colItems.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                        {colItems.map(item => (
                          <MediaCard key={item.id} media={item} variant="poster" />
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">No titles added to this playlist yet.</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal: Create Collection */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080B14]/80 backdrop-blur-md">
            <div className="glass-panel p-6 rounded-2xl bg-[#101626] border border-white/10 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-display font-bold text-white">Create New Collection</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleCreateCollection} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Collection Title</label>
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="e.g. Midnight Mindfuck, Sci-Fi Classics..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22D3EE]"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#22D3EE] text-[#080B14] font-bold text-xs"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
