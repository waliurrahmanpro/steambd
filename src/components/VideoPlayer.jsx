import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RefreshCw,
  AlertCircle,
  Copy,
  Check,
  Heart,
  Radio,
  ExternalLink,
  ShieldAlert,
  Tv
} from 'lucide-react';

export function VideoPlayer({
  channel,
  isFavorite,
  onToggleFavorite,
  onNextChannel,
  isTheaterMode,
  setIsTheaterMode
}) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // strict adherence to "Do not autoplay audio"
  const [volume, setVolume] = useState(0.8);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  // Clean up HLS instance
  const destroyHls = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };

  // Initialize and load stream
  const loadStream = () => {
    if (!channel || !channel.url || !videoRef.current) return;

    const video = videoRef.current;
    setError(null);
    setIsLoading(true);
    destroyHls();

    // Ensure audio policy: strictly muted on startup
    video.muted = isMuted;
    video.volume = volume;

    const streamUrl = channel.url.trim();

    // Check HLS.js support
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
        fragLoadingTimeOut: 15000,
        manifestLoadingTimeOut: 15000,
        levelLoadingTimeOut: 15000
      });

      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        // Play muted
        video.play().catch((err) => {
          console.warn('Autoplay prevented or interrupted:', err);
          setIsPlaying(false);
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.warn('HLS.js event error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Try to recover network error
              console.log('Attempting HLS network error recovery...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Attempting HLS media error recovery...');
              hls.recoverMediaError();
              break;
            default:
              destroyHls();
              setError({
                title: 'Stream Unavailable or Blocked',
                message:
                  'This live broadcast could not be loaded. It may be temporarily offline, geo-blocked in your region, or restricted by browser CORS security policies.',
                details: data.details || 'Playback error'
              });
              setIsLoading(false);
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS for Safari on macOS/iOS
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        video.play().catch(() => setIsPlaying(false));
      });
      video.addEventListener('error', () => {
        setError({
          title: 'Native Playback Error',
          message: 'The native media player failed to stream this channel. The stream link might be inactive.',
          details: 'Video element error code'
        });
        setIsLoading(false);
      });
    } else {
      // Direct video format fallback
      video.src = streamUrl;
    }
  };

  useEffect(() => {
    loadStream();
    return () => {
      destroyHls();
    };
  }, [channel?.url]);

  // Handle Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    if (!newMuted && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  const copyStreamUrl = () => {
    if (!channel?.url) return;
    navigator.clipboard.writeText(channel.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  if (!channel) {
    return (
      <div className="w-full aspect-[16/9] max-h-[520px] rounded-2xl bg-gradient-to-br from-[#12141f] to-[#0a0b10] border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 shadow-lg shadow-purple-950/40">
          <Tv size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-200 mb-2">Select a Channel to Watch</h3>
        <p className="text-slate-400 text-sm max-w-md">
          Browse through hundreds of live television channels from Bangladesh and across the world. Click on any card below to start streaming.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Video Container Frame */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="relative w-full aspect-[16/9] max-h-[580px] bg-black rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl shadow-purple-950/20 group select-none"
      >
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          playsInline
          muted={isMuted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => setIsLoading(false)}
        />

        {/* Loading Spinner Overlay */}
        {isLoading && !error && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20 pointer-events-none">
            <div className="w-12 h-12 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin"></div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-200">Connecting to Live Stream...</p>
              <p className="text-xs text-slate-400">Loading {channel.cleanName || channel.name}</p>
            </div>
          </div>
        )}

        {/* Audio Muted Indicator Pill (Top Left) */}
        {isMuted && !error && (
          <button
            onClick={toggleMute}
            className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-purple-900/80 text-purple-200 border border-purple-500/40 text-xs font-semibold backdrop-blur-md shadow-lg transition-all animate-pulse-subtle"
            title="Click to unmute sound"
          >
            <VolumeX size={15} className="text-purple-400" />
            <span>Audio Muted • Click to Unmute</span>
          </button>
        )}

        {/* Stream Error Screen */}
        {error && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#14121f]/95 to-[#0b0c14]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-3 shadow-lg shadow-red-950/30">
              <AlertCircle size={30} />
            </div>
            <h4 className="text-lg font-bold text-slate-100 mb-1">{error.title}</h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-4 leading-relaxed">
              {error.message}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={loadStream}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs sm:text-sm transition-colors shadow-lg shadow-purple-600/30"
              >
                <RefreshCw size={15} />
                <span>Retry Stream</span>
              </button>
              {onNextChannel && (
                <button
                  onClick={onNextChannel}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm border border-slate-700 transition-colors"
                >
                  <Play size={15} />
                  <span>Try Next Channel</span>
                </button>
              )}
              <a
                href={channel.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors border border-slate-800"
                title="Open raw stream link in external player or new tab"
              >
                <ExternalLink size={13} />
                <span>Open URL</span>
              </a>
            </div>
          </div>
        )}

        {/* Video Player Controls Overlay */}
        <div
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 transition-opacity duration-300 z-20 flex flex-col gap-2 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            {/* Left Controls: Play/Pause, Volume, Live badge */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-purple-600/90 hover:bg-purple-500 text-white flex items-center justify-center transition-all shadow-md shadow-purple-600/40"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </button>

              {/* Volume Slider & Mute Toggle */}
              <div className="flex items-center gap-2 bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/50">
                <button
                  onClick={toggleMute}
                  className="text-slate-300 hover:text-white transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                />
              </div>

              {/* Live Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>LIVE</span>
              </div>
            </div>

            {/* Right Controls: Stream Reload, Theater Mode, Fullscreen */}
            <div className="flex items-center gap-2">
              <button
                onClick={loadStream}
                className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/70 hover:bg-slate-800/80 border border-slate-700/50 backdrop-blur-md transition-colors"
                title="Reload Stream"
              >
                <RefreshCw size={17} />
              </button>

              {setIsTheaterMode && (
                <button
                  onClick={() => setIsTheaterMode(!isTheaterMode)}
                  className={`hidden md:flex p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/70 hover:bg-slate-800/80 border border-slate-700/50 backdrop-blur-md transition-colors ${
                    isTheaterMode ? 'text-purple-400 border-purple-500/50' : ''
                  }`}
                  title={isTheaterMode ? 'Standard View' : 'Theater View'}
                >
                  <Radio size={17} />
                </button>
              )}

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/70 hover:bg-slate-800/80 border border-slate-700/50 backdrop-blur-md transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info Header / Metadata Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#11131c] border border-slate-800/80 shadow-lg">
        {/* Channel Details */}
        <div className="flex items-center gap-3.5 overflow-hidden">
          {channel.logo ? (
            <img
              src={channel.logo}
              alt={channel.name}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="w-12 h-12 object-contain rounded-xl bg-black/50 p-1.5 border border-slate-800 flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
              <Tv size={22} />
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white truncate">
                {channel.cleanName || channel.name}
              </h2>
              {channel.quality && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-500/40">
                  {channel.quality}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{channel.countryFlag} {channel.countryName}</span>
              <span>•</span>
              <span className="text-purple-400 font-medium">{channel.group}</span>
              <span>•</span>
              <span className="truncate max-w-[200px] text-slate-500 text-[11px]" title={channel.url}>
                HLS Source
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onToggleFavorite(channel)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isFavorite
                ? 'bg-pink-600/20 border-pink-500/50 text-pink-400 hover:bg-pink-600/30'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
            <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>

          <button
            onClick={copyStreamUrl}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
            title="Copy M3U8 Stream URL to clipboard"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? 'Copied URL!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Legal & Service Notice */}
      <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-purple-950/20 border border-purple-800/20 text-slate-400 text-[11px] leading-relaxed">
        <ShieldAlert size={16} className="text-purple-400 flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-purple-300 font-semibold">Stream Notice:</strong> StreamBD aggregates publicly broadcasted HLS streams from the community-maintained IPTV index. Stream availability depends on the broadcaster's servers and may be subject to geographic restrictions or CORS headers.
        </p>
      </div>
    </div>
  );
}
