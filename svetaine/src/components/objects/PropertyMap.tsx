"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

const createGeoJSONCircle = (center: [number, number], radiusInKm: number, points: number = 64) => {
  const [lng, lat] = center;
  const coords = [];
  const distanceX = radiusInKm / (111.32 * Math.cos(lat * Math.PI / 180));
  const distanceY = radiusInKm / 110.574;

  for (let i = 0; i <= points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coords.push([lng + x, lat + y]);
  }

  return {
    type: "Feature",
    geometry: { type: "Polygon", coordinates: [coords] },
    properties: {}
  };
};

export default function PropertyMap({ latitude, longitude, isExact }: { latitude: number; longitude: number; isExact: boolean }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [longitude, latitude],
      zoom: isExact ? 16 : 14,
      scrollZoom: active,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on('load', () => {
      if (isExact) {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            <div class="w-6 h-6 rounded-full bg-[#2563EB] border-4 border-white shadow-xl flex items-center justify-center z-10"></div>
            <div class="absolute w-10 h-10 rounded-full bg-[#2563EB]/30 animate-ping"></div>
          </div>
        `;
        new mapboxgl.Marker(el)
          .setLngLat([longitude, latitude])
          .addTo(map);
      } else {
        const geojson = createGeoJSONCircle([longitude, latitude], 0.5);
        map.addSource('circle-source', {
          type: 'geojson',
          data: geojson as any
        });
        
        map.addLayer({
          id: 'circle-layer',
          type: 'fill',
          source: 'circle-source',
          paint: {
            'fill-color': '#2563EB',
            'fill-opacity': 0.15,
          }
        });

        map.addLayer({
          id: 'circle-outline-layer',
          type: 'line',
          source: 'circle-source',
          paint: {
            'line-color': '#2563EB',
            'line-width': 2,
            'line-dasharray': [2, 2]
          }
        });
      }
    });

    return () => {
      map.remove();
    };
  }, [latitude, longitude, isExact, active]);

  return (
    <div className="absolute inset-0" onClick={() => setActive(true)}>
      <div ref={mapContainerRef} className="w-full h-full" />
      {!active && (
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center cursor-pointer group">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-slate-800 shadow-xl border border-white/50 group-hover:bg-white transition-all">
             Paspauskite tam, kad valdytumėte žemėlapį
          </div>
        </div>
      )}
    </div>
  );
}
