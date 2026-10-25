import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  Filter,
  Globe,
  Star,
  Clock,
  Sparkles,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  selectedCountry,
  setSelectedCountry,
  countries,
  activeTab,
  setActiveTab,
  favoritesCount,
  historyCount,
  sortBy,
  setSortBy,
  totalChannels,
  filteredCount
}) {
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter countries for dropdown search
  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top Controls Row: View Tabs + Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#11131c] border border-slate-800/80 w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles size={14} />
            <span>All Channels</span>
            <span className="text-[10px] opacity-75">({totalChannels.toLocaleString()})</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'favorites'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Star size={14} fill={activeTab === 'favorites' ? 'currentColor' : 'none'} />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-pink-500/30 text-pink-200 font-bold">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Clock size={14} />
            <span>Recent</span>
            {historyCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-indigo-200 font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>

        {/* Sort and Count */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <span className="text-xs text-slate-400">
            Showing <strong className="text-purple-300">{filteredCount.toLocaleString()}</strong> channels
          </span>

          <div className="flex items-center gap-1.5 bg-[#11131c] border border-slate-800/80 px-2.5 py-1.5 rounded-xl">
            <SlidersHorizontal size={13} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort channels"
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="featured" className="bg-[#151824] text-slate-200">Featured (BD First)</option>
              <option value="name-asc" className="bg-[#151824] text-slate-200">Name: A to Z</option>
              <option value="name-desc" className="bg-[#151824] text-slate-200">Name: Z to A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Middle Row: Search Input + Country Dropdown Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search channels by name, network, or keyword..."
            className="w-full bg-[#11131c] border border-slate-800/90 hover:border-slate-700 focus:border-purple-500/80 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/40 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Country Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
            className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border transition-all min-w-[180px] ${
              selectedCountry !== 'all'
                ? 'bg-purple-950/40 border-purple-500/60 text-purple-200 shadow-md shadow-purple-950/30'
                : 'bg-[#11131c] border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <Globe size={15} className="text-purple-400 flex-shrink-0" />
              <span className="truncate">
                {selectedCountry === 'all'
                  ? 'All Countries'
                  : countries.find((c) => c.code === selectedCountry)?.name || selectedCountry.toUpperCase()}
              </span>
            </div>
            <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
          </button>

          {/* Dropdown Menu */}
          {isCountryDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 max-h-72 bg-[#141624] border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col">
              <div className="p-2 border-b border-slate-800 bg-[#0e101a]">
                <input
                  type="text"
                  placeholder="Filter countries..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="w-full bg-[#161828] border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  autoFocus
                />
              </div>

              <div className="overflow-y-auto p-1.5 flex flex-col gap-0.5">
                <button
                  onClick={() => {
                    setSelectedCountry('all');
                    setIsCountryDropdownOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                    selectedCountry === 'all'
                      ? 'bg-purple-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🌐</span>
                    <span>All Countries</span>
                  </div>
                  <span className="text-[10px] opacity-70">{totalChannels}</span>
                </button>

                {filteredCountries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setSelectedCountry(c.code);
                      setIsCountryDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      selectedCountry === c.code
                        ? 'bg-purple-600 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span>{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </div>
                    <span className="text-[10px] opacity-70 ml-2">({c.count})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Filter Pills (Horizontal Scroll) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar select-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
            selectedCategory === 'all'
              ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-600/30'
              : 'bg-[#11131c] hover:bg-slate-800/80 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Filter size={12} />
          <span>All Categories</span>
        </button>

        {/* Quick Bangladesh Shortcut */}
        <button
          onClick={() => {
            setSelectedCountry(selectedCountry === 'bd' ? 'all' : 'bd');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
            selectedCountry === 'bd'
              ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/30'
              : 'bg-emerald-950/40 hover:bg-emerald-900/50 border-emerald-800/50 text-emerald-300'
          }`}
        >
          <span>🇧🇩 Bangladesh TV</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
              selectedCategory === cat.name
                ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-600/30'
                : 'bg-[#11131c] hover:bg-slate-800/80 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <span>{cat.name}</span>
            <span className="text-[10px] opacity-60">({cat.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
