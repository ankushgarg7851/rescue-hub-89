import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, Navigation, Clock, ExternalLink } from 'lucide-react';

// Mock data
const shelters = [
  { id: 1, name: 'Central Shelter', lat: 34.052, lng: -118.244, type: 'shelter', capacity: 500 },
  { id: 2, name: 'East Medical Center', lat: 34.058, lng: -118.230, type: 'hospital', capacity: 200 },
  { id: 3, name: 'West Relief Camp', lat: 34.045, lng: -118.260, type: 'shelter', capacity: 350 },
  { id: 4, name: 'South Hospital', lat: 34.038, lng: -118.250, type: 'hospital', capacity: 150 },
  { id: 5, name: 'Police Station Alpha', lat: 34.055, lng: -118.255, type: 'police', capacity: 0 },
];

const sosPoints = [
  { id: 1, lat: 34.050, lng: -118.248, type: 'medical', priority: 'critical', msg: 'Trapped under debris - 3 people' },
  { id: 2, lat: 34.047, lng: -118.238, type: 'rescue', priority: 'high', msg: 'Flooding - family on rooftop' },
  { id: 3, lat: 34.060, lng: -118.252, type: 'fire', priority: 'critical', msg: 'Building fire - evacuation needed' },
];

const hazardZones = [
  [34.048, -118.246, 0.8],
  [34.050, -118.242, 0.6],
  [34.046, -118.250, 0.9],
  [34.052, -118.248, 0.5],
  [34.054, -118.240, 0.7],
  [34.044, -118.244, 0.4],
  [34.049, -118.256, 0.6],
  [34.057, -118.250, 0.3],
];

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function createIcon(color: string, pulse = false) {
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.8);${pulse ? 'animation:pulse-red 1.5s ease-in-out infinite;box-shadow:0 0 8px ' + color : ''}" ></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

interface MapViewProps {
  tabId: string;
}

export function MapView({ tabId }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const layerGroups = useRef<Record<string, L.LayerGroup>>({});
  const [layers, setLayers] = useState({ hazard: true, rescue: true, support: true });
  const [showLayers, setShowLayers] = useState(false);
  const [userPos] = useState<[number, number]>([34.0522, -118.2437]);

  const nearestHelp = shelters
    .map(s => ({ ...s, dist: getDistance(userPos[0], userPos[1], s.lat, s.lng) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 3);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: userPos,
      zoom: 14,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    // Hazard layer (circle markers as heatmap substitute)
    const hazardGroup = L.layerGroup();
    hazardZones.forEach(([lat, lng, intensity]) => {
      L.circle([lat as number, lng as number], {
        radius: (intensity as number) * 300,
        color: 'transparent',
        fillColor: '#DC2626',
        fillOpacity: (intensity as number) * 0.35,
      }).addTo(hazardGroup);
    });
    hazardGroup.addTo(map);

    // Rescue layer
    const rescueGroup = L.layerGroup();
    sosPoints.forEach(p => {
      L.marker([p.lat, p.lng], { icon: createIcon('#DC2626', p.priority === 'critical') })
        .bindPopup(`<div style="font-family:IBM Plex Mono,monospace;font-size:11px"><strong>${p.type.toUpperCase()}</strong><br/>${p.msg}<br/><span style="color:#DC2626">${p.priority.toUpperCase()}</span></div>`)
        .addTo(rescueGroup);
    });
    rescueGroup.addTo(map);

    // Support layer
    const supportGroup = L.layerGroup();
    shelters.forEach(s => {
      const color = s.type === 'hospital' ? '#2563EB' : s.type === 'police' ? '#7C3AED' : '#16A34A';
      L.marker([s.lat, s.lng], { icon: createIcon(color) })
        .bindPopup(`<div style="font-family:IBM Plex Mono,monospace;font-size:11px"><strong>${s.name}</strong><br/>${s.type.toUpperCase()}${s.capacity ? `<br/>Capacity: ${s.capacity}` : ''}</div>`)
        .addTo(supportGroup);
    });
    supportGroup.addTo(map);

    // User position
    L.circleMarker(userPos, {
      radius: 6,
      color: '#2563EB',
      fillColor: '#2563EB',
      fillOpacity: 1,
      weight: 2,
    }).bindPopup('Your Location').addTo(map);

    layerGroups.current = { hazard: hazardGroup, rescue: rescueGroup, support: supportGroup };
    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [tabId]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    Object.entries(layers).forEach(([key, visible]) => {
      const group = layerGroups.current[key];
      if (!group) return;
      if (visible && !map.hasLayer(group)) map.addLayer(group);
      if (!visible && map.hasLayer(group)) map.removeLayer(group);
    });
  }, [layers]);

  return (
    <div className="flex h-full relative">
      {/* Map */}
      <div ref={mapRef} className="flex-1 h-full" />

      {/* Layer selector overlay */}
      <div className="absolute top-3 right-3 z-[1000]">
        <button
          onClick={() => setShowLayers(p => !p)}
          className="p-2 bg-card border border-subtle border-border rounded-md text-foreground hover:bg-secondary transition-colors duration-75"
        >
          <Layers className="w-4 h-4" />
        </button>
        {showLayers && (
          <div className="mt-1 p-3 bg-card border border-subtle border-border rounded-md space-y-2 min-w-[160px]">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Layers</p>
            {[
              { key: 'hazard', label: 'Hazard Zones', color: 'bg-urgent' },
              { key: 'rescue', label: 'SOS Signals', color: 'bg-urgent' },
              { key: 'support', label: 'Help Points', color: 'bg-primary' },
            ].map(l => (
              <label key={l.key} className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers[l.key as keyof typeof layers]}
                  onChange={() => setLayers(p => ({ ...p, [l.key]: !p[l.key as keyof typeof p] }))}
                  className="rounded-sm"
                />
                <span className={`w-2 h-2 rounded-full ${l.color}`} />
                {l.label}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Nearest Help sidebar */}
      <div className="w-64 border-l border-subtle border-border bg-card overflow-y-auto flex-shrink-0">
        <div className="p-3 border-b border-subtle border-border">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Navigation className="w-3 h-3" /> Quick-Find Nearest
          </h3>
        </div>
        <div className="p-2 space-y-2">
          {nearestHelp.map(h => (
            <div key={h.id} className="p-2.5 border border-subtle border-border rounded-md space-y-1.5">
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs font-medium text-foreground">{h.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground uppercase">
                  {h.type}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Navigation className="w-2.5 h-2.5" />
                  {h.dist.toFixed(1)} km
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  ~{Math.ceil(h.dist * 12)} min
                </span>
              </div>
              <div className="flex gap-1.5">
                <button className="flex-1 text-[10px] font-mono py-1 rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity duration-75">
                  Get Route
                </button>
                <button className="px-2 py-1 rounded bg-success text-success-foreground hover:opacity-90 transition-opacity duration-75">
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Active SOS */}
        <div className="p-3 border-t border-subtle border-border">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Active SOS</h3>
          <div className="space-y-1.5">
            {sosPoints.map(s => (
              <div key={s.id} className="flex items-center gap-2 p-1.5 rounded border border-subtle border-border">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.priority === 'critical' ? 'bg-urgent pulse-urgent' : 'bg-warning'}`} />
                <span className="text-[10px] font-mono text-foreground truncate">{s.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
