import React from 'react';
import { Tv, RefreshCw, Info, Settings, Heart, Radio, ExternalLink } from 'lucide-react';

export function Navbar({
  channelCount,
  onRefresh,
  isRefreshing,
  onOpenSettings,
  onOpenAbout,
  favoritesCount,
  onViewFavorites
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#090a10]/85 backdrop-blur-xl border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer select-none">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-[1.5px] shadow-lg shadow-purple-900/40">
            <div className="w-full h-full bg-[#0a0b12] rounded-[10px] flex items-center justify-center">
              <Tv className="text-purple-400" size={20} />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#090a10] animate-pulse"></span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white">
                Stream<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">BD</span>
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-800/60">
                Live
              </span>
            </div>
            <span className="text-[10px] text-slate-400 -mt-1 font-medium hidden sm:inline">
              Premium TV Streaming Platform
            </span>
          </div>
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Channel Count Pill */}
          {channelCount > 0 && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <Radio size={12} className="text-emerald-400 animate-pulse" />
              <span><strong className="text-white">{channelCount.toLocaleString()}</strong> Channels Online</span>
            </div>
          )}

          {/* Favorites Button Shortcut */}
          <button
            onClick={onViewFavorites}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/70 hover:bg-pink-950/40 border border-slate-800 hover:border-pink-500/40 text-slate-300 hover:text-pink-300 text-xs font-semibold transition-all"
            title="View saved favorites"
          >
            <Heart size={14} className={favoritesCount > 0 ? 'text-pink-500 fill-pink-500' : 'text-slate-400'} />
            <span className="hidden sm:inline">Favorites</span>
            {favoritesCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-300 font-bold">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Refresh Playlist Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors ${
              isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Reload latest M3U playlist"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin text-purple-400' : ''} />
          </button>

          {/* Playlist Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
            title="Configure M3U Playlist source"
          >
            <Settings size={16} />
          </button>

          {/* About / Disclaimer Button */}
          <button
            onClick={onOpenAbout}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
            title="Platform Information & Disclaimer"
          >
            <Info size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
