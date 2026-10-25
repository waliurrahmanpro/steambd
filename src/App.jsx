import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { parseM3U } from './services/m3uParser';
import {
  getFavorites,
  saveFavorites,
  getRecentlyWatched,
  addToRecentlyWatched,
  clearRecentlyWatched,
  getPlaylistUrl,
  savePlaylistUrl
} from './services/storage';
import { FALLBACK_CHANNELS } from './data/fallbackChannels';
import { Navbar } from './components/Navbar';
import { VideoPlayer } from './components/VideoPlayer';
import { FilterBar } from './components/FilterBar';
import { ChannelGrid } from './components/ChannelGrid';
import { DisclaimerModal } from './components/DisclaimerModal';
import { SettingsModal } from './components/SettingsModal';

export function App() {
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [favorites, setFavorites] = useState(() => getFavorites());
  const [history, setHistory] = useState(() => getRecentlyWatched());
  const [playlistUrl, setPlaylistUrl] = useState(() => getPlaylistUrl());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'favorites' | 'history'
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'name-asc' | 'name-desc'

  // Modals & View States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Fetch and Parse M3U playlist
  const loadPlaylist = useCallback(async (urlToFetch) => {
    setIsLoading(true);
    setError(null);
    setIsRefreshing(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

      const response = await fetch(urlToFetch, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      const parsed = parseM3U(text);

      if (!parsed || parsed.length === 0) {
        throw new Error('Playlist contained no valid streams or channels.');
      }

      setChannels(parsed);

      // Select first channel (or a Bangladesh channel if available)
      const bdChannel = parsed.find((c) => c.countryCode === 'bd') || parsed[0];
      setSelectedChannel((prev) => prev || bdChannel);
    } catch (err) {
      console.warn('Failed to fetch M3U playlist from network:', err);
      // Fallback to bundled curated channels so user experience is smooth
      if (FALLBACK_CHANNELS && FALLBACK_CHANNELS.length > 0) {
        setChannels(FALLBACK_CHANNELS);
        setSelectedChannel((prev) => prev || FALLBACK_CHANNELS[0]);
        setError(
          `Could not connect to external playlist (${err.message}). Loaded ${FALLBACK_CHANNELS.length} curated fallback channels.`
        );
      } else {
        setError(`Failed to load channels: ${err.message}. Please check your network or try another M3U URL.`);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadPlaylist(playlistUrl);
  }, [loadPlaylist, playlistUrl]);

  // Channel Selection Handler
  const handleSelectChannel = (channel) => {
    setSelectedChannel(channel);
    const updatedHistory = addToRecentlyWatched(channel);
    setHistory(updatedHistory);

    // Scroll smoothly to player if not in view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Favorite
  const handleToggleFavorite = (channel) => {
    setFavorites((prev) => {
      let updated;
      if (prev.includes(channel.id)) {
        updated = prev.filter((id) => id !== channel.id);
      } else {
        updated = [...prev, channel.id];
      }
      saveFavorites(updated);
      return updated;
    });
  };

  // Clear History
  const handleClearHistory = () => {
    clearRecentlyWatched();
    setHistory([]);
  };

  // Clear Favorites
  const handleClearFavorites = () => {
    saveFavorites([]);
    setFavorites([]);
  };

  // Save new playlist URL
  const handleSavePlaylistUrl = (newUrl) => {
    setPlaylistUrl(newUrl);
    savePlaylistUrl(newUrl);
    loadPlaylist(newUrl);
  };

  // Extract Categories with count
  const categories = useMemo(() => {
    const counts = {};
    for (let i = 0; i < channels.length; i++) {
      const g = channels[i].group || 'General';
      counts[g] = (counts[g] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [channels]);

  // Extract Countries with count
  const countries = useMemo(() => {
    const map = new Map();
    for (let i = 0; i < channels.length; i++) {
      const c = channels[i];
      const code = c.countryCode || 'unknown';
      if (!map.has(code)) {
        map.set(code, {
          code,
          name: c.countryName || code.toUpperCase(),
          flag: c.countryFlag || '🌐',
          count: 0
        });
      }
      map.get(code).count += 1;
    }

    return Array.from(map.values()).sort((a, b) => {
      // Prioritize Bangladesh
      if (a.code === 'bd') return -1;
      if (b.code === 'bd') return 1;
      return b.count - a.count;
    });
  }, [channels]);

  // Filter and Sort Channels
  const filteredChannels = useMemo(() => {
    let list = channels;

    // 1. Tab filter: Favorites or History
    if (activeTab === 'favorites') {
      const favSet = new Set(favorites);
      list = channels.filter((c) => favSet.has(c.id));
    } else if (activeTab === 'history') {
      list = history;
    }

    // 2. Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((c) => (c.group || 'General').toLowerCase() === selectedCategory.toLowerCase());
    }

    // 3. Country filter
    if (selectedCountry !== 'all') {
      list = list.filter((c) => (c.countryCode || '').toLowerCase() === selectedCountry.toLowerCase());
    }

    // 4. Search Query (Channel name, country, group)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.cleanName && c.cleanName.toLowerCase().includes(q)) ||
          (c.countryName && c.countryName.toLowerCase().includes(q)) ||
          (c.group && c.group.toLowerCase().includes(q))
      );
    }

    // 5. Sorting
    const sorted = [...list];
    if (sortBy === 'name-asc') {
      sorted.sort((a, b) => (a.cleanName || a.name).localeCompare(b.cleanName || b.name));
    } else if (sortBy === 'name-desc') {
      sorted.sort((a, b) => (b.cleanName || b.name).localeCompare(a.cleanName || a.name));
    } else if (sortBy === 'featured') {
      // Prioritize BD channels, then regular
      sorted.sort((a, b) => {
        const aIsBd = a.countryCode === 'bd' ? 1 : 0;
        const bIsBd = b.countryCode === 'bd' ? 1 : 0;
        return bIsBd - aIsBd;
      });
    }

    return sorted;
  }, [channels, activeTab, favorites, history, selectedCategory, selectedCountry, searchQuery, sortBy]);

  // Next Channel button handler for player
  const handleNextChannel = () => {
    if (!filteredChannels.length) return;
    const currentIndex = filteredChannels.findIndex((c) => c.id === selectedChannel?.id);
    const nextIndex = (currentIndex + 1) % filteredChannels.length;
    handleSelectChannel(filteredChannels[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        channelCount={channels.length}
        onRefresh={() => loadPlaylist(playlistUrl)}
        isRefreshing={isRefreshing}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        favoritesCount={favorites.length}
        onViewFavorites={() => {
          setActiveTab('favorites');
          setSelectedCategory('all');
          setSelectedCountry('all');
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Error / Fallback notice bar if network playlist had issues */}
        {error && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs shadow-md">
            <span>{error}</span>
            <button
              onClick={() => loadPlaylist(playlistUrl)}
              className="ml-4 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium whitespace-nowrap transition-colors"
            >
              Retry Live Playlist
            </button>
          </div>
        )}

        {/* Video Player Section */}
        <section className={`w-full transition-all duration-300 ${isTheaterMode ? 'max-w-full' : 'max-w-5xl mx-auto'}`}>
          <VideoPlayer
            channel={selectedChannel}
            isFavorite={selectedChannel ? favorites.includes(selectedChannel.id) : false}
            onToggleFavorite={handleToggleFavorite}
            onNextChannel={handleNextChannel}
            isTheaterMode={isTheaterMode}
            setIsTheaterMode={setIsTheaterMode}
          />
        </section>

        {/* Filter and Browse Section */}
        <section className="flex flex-col gap-4 mt-2">
          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            countries={countries}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            favoritesCount={favorites.length}
            historyCount={history.length}
            sortBy={sortBy}
            setSortBy={setSortBy}
            totalChannels={channels.length}
            filteredCount={filteredChannels.length}
          />

          {/* Channels Grid */}
          <ChannelGrid
            channels={filteredChannels}
            selectedChannel={selectedChannel}
            favorites={favorites}
            onSelectChannel={handleSelectChannel}
            onToggleFavorite={handleToggleFavorite}
            isLoading={isLoading}
            error={null}
            onRetry={() => loadPlaylist(playlistUrl)}
            activeTab={activeTab}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#090a10] py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">StreamBD</span>
            <span>•</span>
            <span>Live Television Streaming</span>
          </div>

          <div className="text-slate-400">
            Powered by React, Tailwind CSS, Hls.js & IPTV-org public playlists.
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setIsAboutOpen(true)} className="hover:text-purple-400 transition-colors">
              Disclaimer
            </button>
            <span>•</span>
            <button onClick={() => setIsSettingsOpen(true)} className="hover:text-purple-400 transition-colors">
              Sources
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DisclaimerModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUrl={playlistUrl}
        onSaveUrl={handleSavePlaylistUrl}
        onClearHistory={handleClearHistory}
        onClearFavorites={handleClearFavorites}
      />
    </div>
  );
}

export default App;
