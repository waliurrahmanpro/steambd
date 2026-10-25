import React, { useState } from 'react';
import { Heart, Play, Tv } from 'lucide-react';

export function ChannelCard({ channel, isSelected, isFavorite, onSelect, onToggleFavorite }) {
  const [imgError, setImgError] = useState(false);

  // Generate unique subtle gradient based on channel name
  const getGradient = (name) => {
    const charCode = name.charCodeAt(0) || 0;
    const gradients = [
      'from-purple-900/50 to-indigo-900/50',
      'from-blue-900/50 to-cyan-900/50',
      'from-violet-900/50 to-fuchsia-900/50',
      'from-indigo-900/50 to-purple-900/50',
      'from-slate-800/60 to-slate-900/60'
    ];
    return gradients[charCode % gradients.length];
  };

  const getInitials = (name) => {
    if (!name) return 'TV';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  return (
    <div
      onClick={() => onSelect(channel)}
      className={`group relative flex flex-col justify-between p-3.5 rounded-2xl cursor-pointer transition-all duration-300 select-none
        border ${
          isSelected
            ? 'bg-gradient-to-b from-purple-950/70 via-slate-900/90 to-[#0c0d14] border-purple-500/80 shadow-[0_0_25px_rgba(168,85,247,0.35)] ring-1 ring-purple-400/50 scale-[1.02]'
            : 'bg-[#12141e]/85 hover:bg-[#181b29] border-slate-800/80 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-950/20 hover:-translate-y-1'
        }
      `}
    >
      {/* Top badges bar */}
      <div className="flex items-center justify-between mb-3 w-full">
        <div className="flex items-center gap-1.5 overflow-hidden">
          {channel.countryFlag && (
            <span className="text-base flex-shrink-0" title={channel.countryName}>
              {channel.countryFlag}
            </span>
          )}
          <span className="text-[11px] font-medium text-slate-400 truncate uppercase tracking-wider bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/40">
            {channel.group || 'General'}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(channel);
          }}
          className={`p-1.5 rounded-lg transition-colors duration-200 z-10 ${
            isFavorite
              ? 'text-pink-500 bg-pink-500/10 hover:bg-pink-500/20'
              : 'text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-700/60'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Channel Logo / Fallback Avatar */}
      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-[#0a0b10] flex items-center justify-center p-3 border border-slate-800/60 group-hover:border-slate-700/60 transition-colors">
        {channel.logo && !imgError ? (
          <img
            src={channel.logo}
            alt={channel.name}
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full rounded-lg bg-gradient-to-br ${getGradient(channel.name)} flex flex-col items-center justify-center text-slate-300 gap-1.5`}>
            <Tv size={26} className="text-purple-400/80 group-hover:text-purple-300 transition-colors" />
            <span className="text-xs font-bold tracking-wider text-slate-300">
              {getInitials(channel.cleanName || channel.name)}
            </span>
          </div>
        )}

        {/* Hover Play Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/50 transform scale-75 group-hover:scale-100 transition-transform duration-200">
            <Play size={18} fill="currentColor" className="ml-0.5" />
          </div>
        </div>

        {/* Quality Badge */}
        {channel.quality && (
          <span className="absolute bottom-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-purple-300 border border-purple-500/30 backdrop-blur-sm">
            {channel.quality}
          </span>
        )}

        {/* Active Live Indicator */}
        {isSelected && (
          <span className="absolute top-1.5 left-1.5 flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-500/90 text-white shadow-md shadow-red-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            LIVE
          </span>
        )}
      </div>

      {/* Channel Information */}
      <div className="flex flex-col gap-0.5">
        <h4
          className={`text-sm font-semibold truncate transition-colors ${
            isSelected ? 'text-purple-200 font-bold' : 'text-slate-200 group-hover:text-white'
          }`}
          title={channel.name}
        >
          {channel.cleanName || channel.name}
        </h4>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="truncate">{channel.countryName || 'Global'}</span>
          {isSelected && (
            <span className="text-purple-400 font-medium">Now Playing</span>
          )}
        </div>
      </div>
    </div>
  );
}
