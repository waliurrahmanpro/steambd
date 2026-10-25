# StreamBD - Premium Live TV Streaming Platform

**StreamBD** is a modern, responsive, and high-performance live TV streaming web application built with **React**, **Vite**, **JavaScript**, and **Tailwind CSS**. It fetches and parses publicly accessible M3U playlists (from [iptv-org](https://github.com/iptv-org/iptv)) completely client-side in the browser, providing access to thousands of live television channels from Bangladesh and around the globe.

---

## ✨ Features

- 📺 **Client-Side M3U Parser**: Directly downloads and parses the ~11,000+ channel IPTV-org playlist in less than 50ms with zero backend dependency.
- 🇧🇩 **Bangladesh TV Priority**: Instant 1-click filter for Bangladeshi channels (ATN Bangla, Channel S, DBC News, Ekushey TV, Gazi TV, NTV, RTV, T Sports, etc.).
- 🎥 **Modern HLS.js Video Player**: Smooth live HLS streaming with auto-recovery for network and media glitches, native Safari/iOS HLS fallback, Theater Mode, volume slider, and fullscreen controls.
- 🔇 **Autoplay Policy Compliant**: Adheres to browser standards by never playing sound automatically. Streams start muted with an intuitive 1-click un-mute button.
- 🔍 **Real-Time Instant Search**: Filter channels on the fly by name, network, country, or category.
- 🏷️ **Categorization & Country Filter**: Browse by categories (*News, Sports, Entertainment, Movies, Music, Kids, etc.*) and countries (*Bangladesh 🇧🇩, USA 🇺🇸, UK 🇬🇧, India 🇮🇳, etc.*).
- ⭐ **Favorites & Watch History**: Channels can be favorited and recent viewing history is automatically tracked and persisted in `localStorage`.
- 🛡️ **Graceful Error States & Fallbacks**: Clear notices when a stream is geo-blocked, offline, or restricted by CORS headers, with one-click retry and bundled fallback streams.
- ⚙️ **Configurable Playlists**: Switch between the full global index, Bangladesh-only lightweight playlist, sports, news, or your own custom M3U source URL.
- 🎨 **Premium Dark UI**: Built with a sleek dark aesthetic, deep purple and blue neon glowing accents, glassmorphism, responsive cards, and smooth hover animations.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Run

1. Clone or open the project directory:
   ```bash
   cd e:/Downloads/gtv
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:5173
   ```

5. Build for production:
   ```bash
   npm run build
   npm run preview
   ```

---

## ⚠️ Disclaimer & Legal Notice

StreamBD is an open-source, client-side web application. It does not host, store, or stream any video content directly. All streams and playlists are indexed from public community repositories (such as `iptv-org`). Stream availability depends on the respective broadcaster's servers. Some streams may be geo-restricted or blocked by browser CORS security policies.
