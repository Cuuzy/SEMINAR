import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, ExternalLink, Key, Building2, Copy, Check } from 'lucide-react';

interface VenueMapProps {
  venueName: string;
  venueAddress: string;
  venueMapUrl: string;
}

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

// Default coordinates for PT Pegadaian Kanwil VIII Jakarta (Jl. Kramat Raya No. 162, Senen, Jakarta Pusat)
const DEFAULT_CENTER = { lat: -6.1843, lng: 106.8441 };

export const VenueMap: React.FC<VenueMapProps> = ({ venueName, venueAddress, venueMapUrl }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${venueName}, ${venueAddress}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg space-y-0">
      
      {/* Map Header Bar */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-white">{venueName}</h4>
            <p className="text-xs text-slate-300 line-clamp-1">{venueAddress}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyAddress}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Salin Alamat Lengkap"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin Alamat'}</span>
          </button>

          <a
            href={venueMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Petunjuk Arah</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-[320px] sm:h-[380px] bg-slate-100">
        {hasValidKey ? (
          <APIProvider apiKey={API_KEY} version="weekly">
            <Map
              defaultCenter={DEFAULT_CENTER}
              defaultZoom={16}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
              gestureHandling="cooperative"
            >
              <AdvancedMarker
                ref={markerRef}
                position={DEFAULT_CENTER}
                title={venueName}
                onClick={() => setInfoOpen(true)}
              >
                <Pin background="#059669" glyphColor="#fef08a" borderColor="#064e3b" />
              </AdvancedMarker>

              {infoOpen && (
                <InfoWindow
                  anchor={marker}
                  onCloseClick={() => setInfoOpen(false)}
                >
                  <div className="p-2 max-w-[220px] space-y-1">
                    <div className="text-xs font-extrabold text-emerald-950">{venueName}</div>
                    <div className="text-[11px] text-slate-600 leading-tight">{venueAddress}</div>
                    <a
                      href={venueMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline pt-1"
                    >
                      <span>Buka di Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        ) : (
          /* Interactive Embed Map Fallback + Key Helper Banner */
          <div className="relative w-full h-full">
            <iframe
              title="Google Maps Venue Location"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(`${venueName}, ${venueAddress}`)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />

            {/* Optional Overlay Banner for Custom API Key setup */}
            <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto max-w-md bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-2xl border border-slate-700/80 shadow-xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-[11px]">Mode Peta Google Maps Aktif</div>
                  <p className="text-[10px] text-slate-300">Tambahkan <code>GOOGLE_MAPS_PLATFORM_KEY</code> di Secrets untuk SDK Peta Kustom.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Footer Bar */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 px-5">
        <div className="flex items-center gap-1.5 font-medium text-emerald-800">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Lokasi Acara Resmi PT Pegadaian</span>
        </div>
        <a
          href={venueMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
        >
          <span>Navigasi GPS</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

    </div>
  );
};
