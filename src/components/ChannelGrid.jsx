import React, { useState, useEffect } from 'react';
import { ChannelCard } from './ChannelCard';
import { Tv, Sparkles, RefreshCw, AlertCircle, Heart } from 'lucide-react';

export function ChannelGrid({
  channels,
  selectedChannel,
  favorites,
  onSelectChannel,
  onToggleFavorite,
  isLoading,
  error,
  onRetry,
  activeTab
}) {
  const PAGE_SIZE = 48;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset pagination when channels array or filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [channels]);

  const displayedChannels = channels.slice(0, visibleCount);
  const hasMore = visibleCount < channels.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, channels.length));
  };

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full py-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="h-4 w-40 bg-slate-800/80 rounded animate-pulse"></div>
          <div className="h-4 w-24 bg-slate-800/80 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col justify-between p-3.5 rounded-2xl bg-[#12141e]/60 border border-slate-800/60 animate-pulse"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-3 w-12 bg-slate-800 rounded"></div>
                <div className="h-4 w-4 bg-slate-800 rounded-full"></div>
              </div>
              <div className="w-full aspect-[16/10] rounded-xl bg-slate-800/60 mb-3"></div>
              <div className="h-4 w-3/4 bg-slate-800 rounded mb-1"></div>
              <div className="h-3 w-1/2 bg-slate-800/60 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State (Failed to fetch playlist)
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#12141f]/70 border border-red-500/30 my-6 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-100 mb-2">Playlist Load Error</h3>
        <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
          {error}
        </p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/30"
        >
          <RefreshCw size={16} />
          <span>Retry Fetching Channels</span>
        </button>
      </div>
    );
  }

  // Empty State: Favorites Tab
  if (channels.length === 0 && activeTab === 'favorites') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#11131c]/70 border border-slate-800/80 my-8">
        <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4">
          <Heart size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-100 mb-1.5">No Favorite Channels Yet</h3>
        <p className="text-slate-400 text-sm max-w-sm">
          Click the heart icon on any channel card to save it here for quick one-click access.
        </p>
      </div>
    );
  }

  // Empty State: No search results
  if (channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#11131c]/70 border border-slate-800/80 my-8">
        <div className="w-16 h-16 rounded-2xl bg-purple-900/20 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
          <Tv size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-100 mb-1.5">No Channels Match Your Filters</h3>
        <p className="text-slate-400 text-sm max-w-sm mb-4">
          Try adjusting your search query, selecting another category, or choosing a different country.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full py-2">
      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
        {displayedChannels.map((channel) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            isSelected={selectedChannel?.id === channel.id}
            isFavorite={favorites.includes(channel.id)}
            onSelect={onSelectChannel}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex flex-col items-center justify-center gap-2 pt-4 pb-8">
          <button
            onClick={loadMore}
            className="flex items-center gap-2 px-7 py-3 rounded-xl bg-[#151825] hover:bg-purple-600 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm border border-slate-700/80 hover:border-purple-500 transition-all shadow-lg hover:shadow-purple-600/30"
          >
            <Sparkles size={15} />
            <span>Load More Channels (+{Math.min(PAGE_SIZE, channels.length - visibleCount)})</span>
          </button>
          <span className="text-xs text-slate-500">
            Showing {visibleCount} of {channels.length.toLocaleString()} available channels
          </span>
        </div>
      )}
    </div>
  );
}
