const FAVORITES_KEY = 'streambd_favorites';
const HISTORY_KEY = 'streambd_history';
const PLAYLIST_URL_KEY = 'streambd_playlist_url';
const DEFAULT_PLAYLIST_URL = 'https://iptv-org.github.io/iptv/index.m3u';

export function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load favorites', e);
    return [];
  }
}

export function saveFavorites(favs) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  } catch (e) {
    console.error('Failed to save favorites', e);
  }
}

export function getRecentlyWatched() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load history', e);
    return [];
  }
}

export function addToRecentlyWatched(channel) {
  if (!channel || !channel.id) return [];
  try {
    const history = getRecentlyWatched();
    // Remove if already exists so we can move it to front
    const filtered = history.filter(item => item.id !== channel.id && item.url !== channel.url);
    const updated = [
      {
        id: channel.id,
        tvgId: channel.tvgId,
        name: channel.name,
        cleanName: channel.cleanName,
        logo: channel.logo,
        group: channel.group,
        countryCode: channel.countryCode,
        countryName: channel.countryName,
        countryFlag: channel.countryFlag,
        quality: channel.quality,
        url: channel.url,
        watchedAt: Date.now()
      },
      ...filtered
    ].slice(0, 30); // keep last 30
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to update history', e);
    return [];
  }
}

export function clearRecentlyWatched() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('Failed to clear history', e);
  }
}

export function getPlaylistUrl() {
  try {
    return localStorage.getItem(PLAYLIST_URL_KEY) || DEFAULT_PLAYLIST_URL;
  } catch {
    return DEFAULT_PLAYLIST_URL;
  }
}

export function savePlaylistUrl(url) {
  try {
    localStorage.setItem(PLAYLIST_URL_KEY, url);
  } catch (e) {
    console.error('Failed to save playlist url', e);
  }
}

export { DEFAULT_PLAYLIST_URL };
