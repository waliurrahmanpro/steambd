import React from 'react';
import { X, ShieldAlert, CheckCircle, ExternalLink, Globe } from 'lucide-react';

export function DisclaimerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#121422] border border-slate-700/80 shadow-2xl p-6 text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <ShieldAlert size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">About StreamBD & Terms</h3>
            <p className="text-xs text-slate-400">Free, client-side live streaming directory</p>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/30">
            <h4 className="font-semibold text-purple-300 mb-1">Public Playlist Aggregator</h4>
            <p className="text-xs text-slate-300">
              StreamBD operates entirely in your web browser and does not host, broadcast, or store any media or video files. All channel listings are fetched directly from the community-maintained{' '}
              <a
                href="https://github.com/iptv-org/iptv"
                target="_blank"
                rel="noreferrer"
                className="text-purple-400 hover:underline inline-flex items-center gap-1"
              >
                iptv-org project <ExternalLink size={11} />
              </a>.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-semibold text-slate-200 mb-1">Why do some streams not play?</h4>
            <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
              <li><strong>CORS Restrictions:</strong> Many TV networks restrict playback exclusively to their official domains.</li>
              <li><strong>Geo-blocking:</strong> Streams may only be available in certain countries or regions.</li>
              <li><strong>Temporary Outages:</strong> Live IPTV broadcast links change frequently or go offline.</li>
              <li><strong>Mixed Content (HTTP/HTTPS):</strong> Modern browsers block unencrypted HTTP streams when loaded over secure HTTPS.</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-semibold text-slate-200 mb-1">Content & Copyright Notice</h4>
            <p className="text-xs text-slate-400">
              Only streams intended for public viewing are supported. StreamBD respects copyright laws and stream providers' terms of service. If a channel broadcaster discontinues public access, the stream will cease to be accessible.
            </p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm transition-colors shadow-lg shadow-purple-600/30"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
