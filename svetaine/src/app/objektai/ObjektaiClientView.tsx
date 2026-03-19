"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect width="${w}" height="${h}" fill="url(#g)" />
  <animate attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"/>
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);
import { MapPin, Building, Search, SlidersHorizontal, ChevronDown, LandPlot, Calendar } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const INITIAL_PROPERTIES: any[] = [];

export default function ObjektaiClientView() {
  const [properties, setProperties] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Filters state
  const [cityFilter, setCityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState(""); 
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const loadProperties = async () => {
      try {
        const res = await fetch("/api/properties");
        const data = await res.json();
        setProperties(data);
      } catch (err) {
        console.error("Failed to load properties:", err);
      }
    };
    loadProperties();
  }, []);

  const { maxPriceOfAll, maxAreaOfAll } = useMemo(() => {
    if (properties.length === 0) return { maxPriceOfAll: 1000000, maxAreaOfAll: 250 };
    const prices = properties.map(p => p.price);
    const areas = properties.map(p => p.area || 0);
    return {
      maxPriceOfAll: Math.max(...prices),
      maxAreaOfAll: Math.ceil(Math.max(...areas))
    };
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((prop: any) => {
      // City match
      if (cityFilter && prop.city.toLowerCase() !== cityFilter.toLowerCase()) return false;
      // Type match
      if (typeFilter && (prop.type || "").toLowerCase() !== typeFilter.toLowerCase()) return false;
      // Area match (Nuo)
      if (areaFilter && prop.area < parseInt(areaFilter)) return false;
      // Price match (Iki)
      if (maxPrice && prop.price > parseInt(maxPrice)) return false;
      return true;
    }).sort((a: any, b: any) => {
      if (a.status === "Parduota" && b.status !== "Parduota") return 1;
      if (a.status !== "Parduota" && b.status === "Parduota") return -1;
      return 0;
    });
  }, [properties, cityFilter, typeFilter, areaFilter, maxPrice]);

  const uniqueCities = Array.from(new Set(properties.map((p: any) => p.city)));

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-10">
      
      {/* Non-sticky Filter Bar */}
      <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl p-6 md:p-8 relative z-10 transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#111827] flex items-center">
            <SlidersHorizontal className="w-6 h-6 mr-3 text-[#2563EB]" />OBJEKTŲ FILTRAS</h2>
          <Button 
            variant="ghost" 
            className="md:hidden text-slate-500 hover:bg-slate-50 rounded-xl"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
             <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`} />
          </Button>
        </div>

        {isFilterOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            
            {/* City */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Miestas</label>
              <Select value={cityFilter} onValueChange={(val) => setCityFilter(val === "all" ? "" : (val || ""))}>
                <SelectTrigger className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all">
                  <SelectValue placeholder="Visi miestai" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl shadow-xl border-slate-100">
                  <SelectItem value="all" className="cursor-pointer font-medium hover:bg-slate-50">Visi miestai</SelectItem>
                  {uniqueCities.map(c => <SelectItem key={c} value={c} className="cursor-pointer font-medium hover:bg-slate-50">{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Tipas */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tipas</label>
              <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val === "all" ? "" : (val || ""))}>
                <SelectTrigger className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all">
                  <SelectValue placeholder="Visi tipai" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl shadow-xl border-slate-100">
                  <SelectItem value="all" className="cursor-pointer font-medium hover:bg-slate-50">Visi tipai</SelectItem>
                  <SelectItem value="Butas" className="cursor-pointer font-medium hover:bg-slate-50">Butas</SelectItem>
                  <SelectItem value="Namas" className="cursor-pointer font-medium hover:bg-slate-50">Namas</SelectItem>
                  <SelectItem value="Sklypas" className="cursor-pointer font-medium hover:bg-slate-50">Sklypas</SelectItem>
                  <SelectItem value="Komercinės patalpos" className="cursor-pointer font-medium hover:bg-slate-50">Komercinės patalpos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Plotas Slider */}
            <div className="flex flex-col gap-3 lg:col-span-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plotas nuo</label>
                <span className="text-sm font-black text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-lg">
                  {areaFilter || 0} m²
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max={maxAreaOfAll} 
                step="5"
                value={areaFilter || "0"} 
                onChange={(e) => setAreaFilter(e.target.value)}
                className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#2563EB]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>0 m²</span>
                <span>{maxAreaOfAll} m²</span>
              </div>
            </div>

            {/* Kaina Slider */}
            <div className="flex flex-col gap-3 lg:col-span-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Maksimali kaina</label>
                <span className="text-sm font-black text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-lg">
                  {maxPrice ? `${parseInt(maxPrice).toLocaleString("lt-LT")} €` : 'Visi'}
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max={maxPriceOfAll} 
                step="5000"
                value={maxPrice || maxPriceOfAll} 
                onChange={(e) => setMaxPrice(e.target.value === maxPriceOfAll.toString() ? "" : e.target.value)}
                className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#2563EB]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>0 €</span>
                <span>{maxPriceOfAll.toLocaleString("lt-LT")} €</span>
              </div>
            </div>

            {/* Reset */}
            <div className="flex flex-col justify-end lg:col-span-2">
              <Button 
                onClick={() => { setCityFilter(""); setTypeFilter(""); setAreaFilter(""); setMaxPrice(""); }}
                variant="outline"
                className="h-12 w-full rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-[#111827] transition-all"
              >Išvalyti filtrą</Button>
            </div>

          </div>
        )}

      </div>

      {/* Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-[#111827] mb-2">Objektų nerasta</h3>
          <p className="text-slate-500">Pabandykite pakeisti filtro kriterijus</p>
          <Button 
            onClick={() => { setCityFilter(""); setTypeFilter(""); setAreaFilter(""); setMaxPrice(""); }}
            className="mt-6 bg-[#2563EB] text-white hover:bg-[#1E3A8A] px-8 h-12 rounded-xl font-bold"
          >Atstatyti filtrą</Button>
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {filteredProperties.map(property => (
            <StaggerItem key={property.id}>
              <Link 
                href={`/objektai/${property.slug}`} 
                className="group flex flex-col bg-transparent rounded-none h-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl mb-6 shadow-sm">
                  <Image 
                    src={property.image}
                    alt={property.title}
                    fill
                    className={`object-cover group-hover:scale-105 transition-transform duration-1000 ease-out ${property.status !== "Parduodama" ? "grayscale-[30%]" : ""}`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                  />
                  {property.status !== "Parduodama" && (
                    <div className={`absolute top-4 left-4 z-10 text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded-md shadow-sm text-white ${property.status === "Parduota" ? "bg-[#111827]" : "bg-[#2563EB]"}`}>
                      {property.status}
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 px-2">
                  <h3 className="font-sans text-2xl md:text-3xl font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors line-clamp-2 mb-3 leading-tight tracking-tight">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-slate-500 mb-6 text-base font-medium">
                    <MapPin className="w-5 h-5 mr-1.5 text-[#2563EB]" /> {property.city}{property.address ? `, ${property.address}` : ''}
                  </div>
                  <div className="text-3xl font-extrabold text-[#111827] mb-6 tracking-tight">
                    € {property.price.toLocaleString("lt-LT")}
                  </div>
                  <div className="flex justify-between items-center text-slate-500 mt-auto pt-6 border-t border-slate-200 text-sm font-medium uppercase tracking-wider">
                    <span className="flex items-center" title="Plotas"><Building className="w-5 h-5 mr-2 text-slate-400" /> {property.area} m²</span>
                    {property.arai && Number(property.arai) > 0 ? (
                      <span className="flex items-center" title="Sklypas"><LandPlot className="w-5 h-5 mr-2 text-emerald-500" /> {property.arai} a.</span>
                    ) : null}
                    {property.year ? (
                      <span className="flex items-center" title="Statybos metai"><Calendar className="w-5 h-5 mr-2 text-indigo-500" /> {property.year}</span>
                    ) : null}
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
