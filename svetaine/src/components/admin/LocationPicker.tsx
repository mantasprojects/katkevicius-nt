"use client";

import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
// Token is set inside useEffect to ensure it loads on client with correct env variables

interface LocationData {
  latitude: number;
  longitude: number;
  is_exact_location: boolean;
  address: string;
}

interface LocationPickerProps {
  initialData?: Partial<LocationData>;
  onChange: (data: LocationData) => void;
}

export default function LocationPicker({ initialData, onChange }: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const [coords, setCoords] = useState({
    latitude: initialData?.latitude || 54.8985207,
    longitude: initialData?.longitude || 23.9035965,
  });

  const [isExact, setIsExact] = useState(initialData?.is_exact_location ?? true);
  const [address, setAddress] = useState(initialData?.address || "");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Initialize Map
  useEffect(() => {
    if (MAPBOX_TOKEN) {
      mapboxgl.accessToken = MAPBOX_TOKEN;
    }
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [coords.longitude, coords.latitude],
      zoom: initialData?.latitude ? 16 : 12,
      attributionControl: false,
    });

    // Add Zoom and Rotation Controls
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    mapRef.current = map;

    const marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat([coords.longitude, coords.latitude])
      .addTo(map);

    markerRef.current = marker;

    marker.on("dragend", () => {
      const lngLat = marker.getLngLat();
      setCoords({ latitude: lngLat.lat, longitude: lngLat.lng });
    });

    return () => {
      map.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync coords to marker/map
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat([coords.longitude, coords.latitude]);
    }
  }, [coords]);

  useEffect(() => {
    onChange({
      latitude: coords.latitude,
      longitude: coords.longitude,
      is_exact_location: isExact,
      address,
    });
  }, [coords, isExact, address, onChange]);

  const handleSearch = async (query: string) => {
    setAddress(query);
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&country=lt&language=lt`
      );
      const data = await res.json();
      setSuggestions(data.features || []);
    } catch (err) {
      console.error("Geocoding failed", err);
    }
  };

  const selectSuggestion = (f: any) => {
    const [lng, lat] = f.geometry.coordinates;
    const newCoords = { latitude: lat, longitude: lng };
    setCoords(newCoords);
    setAddress(f.place_name);
    setSuggestions([]);
    
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [lng, lat], zoom: 15 });
    }
  };

  return (
    <div className="space-y-4">
      {/* Address Search */}
      <div className="space-y-2 relative">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Adreso Paieška</Label>
        <div className="relative">
          <Input 
            value={address}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-12 rounded-xl bg-slate-50 border-slate-200 pl-10"
            placeholder="Įveskite adresą gatvę..."
          />
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute z-50 w-full bg-white rounded-xl border border-slate-100 shadow-xl overflow-hidden mt-1 max-h-48 overflow-y-auto">
            {suggestions.map((f: any) => (
              <button
                key={f.id}
                type="button"
                className="w-full text-left p-3 text-sm hover:bg-slate-50 font-medium text-[#111827] border-b border-slate-50 last:border-0"
                onClick={() => selectSuggestion(f)}
              >
                {f.place_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map display */}
      <div className="h-64 rounded-2xl border border-slate-200 overflow-hidden relative">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Draggable hint */}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-md z-10">
           Nuvilkite žymeklį į tikslią vietą
        </div>
      </div>

      {/* Privacy Toggle */}
      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div>
          <p className="text-sm font-bold text-[#111827]">Rodymo rėžimas</p>
          <p className="text-xs text-slate-500 font-medium">
             {isExact ? "Viešai rodomas tikslus adresas" : "Rodyti tik bendrą regioną/spindulį"}
          </p>
        </div>
        <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={isExact} 
                onChange={(e) => setIsExact(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
            </label>
        </div>
      </div>
    </div>
  );
}
