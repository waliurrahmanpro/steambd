import React, { useState } from 'react';
import { X, Settings, RefreshCw, Trash2, Check, ExternalLink, Link2 } from 'lucide-react';
import { DEFAULT_PLAYLIST_URL } from '../services/storage';

export function SettingsModal({
  isOpen,
  onClose,
  currentUrl,
  onSaveUrl,
  onClearHistory,
  onClearFavorites
}) {
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const presets = [
    { label: 'Full Global Index (~12k Channels)', url: 'https://iptv-org.github.io/iptv/index.m3u' },
    { label: 'Bangladesh Channels (Fast & Lightweight)', url: 'https://iptv-org.github.io/iptv/countries/bd.m3u' },
    { label: 'Global News Channels', url: 'https://iptv-org.github.io/iptv/categories/news.m3u' },
    { label: 'Global Sports Channels', url: 'https://iptv-org.github.io/iptv/categories/sports.m3u' },
    { label: 'Global Movies Channels', url: 'https://iptv-org.github.io/iptv/categories/movies.m3u' }
  ];

  const handleSave = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onSaveUrl(urlInput.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handlePresetSelect = (url) => {
    setUrlInput(url);
    onSaveUrl(url);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    setUrlInput(DEFAULT_PLAYLIST_URL);
    onSaveUrl(DEFAULT_PLAYLIST_URL);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#121422] border border-slate-700/80 shadow-2xl p-6 text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Settings size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Playlist & Settings</h3>
            <p className="text-xs text-slate-400">Configure M3U data source and storage</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {/* Custom URL Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>M3U Playlist Source URL:</span>
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] text-purple-400 hover:underline"
              >
                Reset to Default
              </button>
            </label>
            <div className="relative">
              <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://..."
                required
                className="w-full bg-[#161828] border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          {/* Quick Preset Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400">Popular Playlist Presets:</span>
            <div className="flex flex-col gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => handlePresetSelect(p.url)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs text-left border transition-all ${
                    urlInput === p.url
                      ? 'bg-purple-950/40 border-purple-500 text-purple-200'
                      : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="font-medium truncate">{p.label}</span>
                  {urlInput === p.url && <Check size={14} className="text-purple-400 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Data Management */}
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400">Clear Saved Data:</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-slate-900/80 hover:bg-red-950/30 text-slate-300 hover:text-red-300 border border-slate-800 transition-colors"
              >
                <Trash2 size={13} />
                <span>Clear History</span>
              </button>

              <button
                type="button"
                onClick={onClearFavorites}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-slate-900/80 hover:bg-red-950/30 text-slate-300 hover:text-red-300 border border-slate-800 transition-colors"
              >
                <Trash2 size={13} />
                <span>Clear Favorites</span>
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-purple-600/30"
            >
              {saveSuccess ? (
                <>
                  <Check size={14} />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save & Reload</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
