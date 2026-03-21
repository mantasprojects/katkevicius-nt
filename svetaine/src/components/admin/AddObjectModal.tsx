"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Plus, Building, MapPin, Image as ImageIcon, FileText, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LocationPicker from "./LocationPicker";
import { createClient } from "@/utils/supabase/client";

import imageCompression from 'browser-image-compression';

/* ── Auto-expanding Textarea ──────────────────────────────────────── */
function AutoExpandTextarea({ name, id, placeholder, minHeight = 200, className = "" }: {
  name: string; id: string; placeholder?: string; minHeight?: number; className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const autoResize = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.max(el.scrollHeight, minHeight) + "px";
  }, [minHeight]);

  useEffect(() => { autoResize(); }, [autoResize]);

  return (
    <textarea
      ref={ref}
      id={id}
      name={name}
      onInput={autoResize}
      style={{ minHeight: `${minHeight}px` }}
      className={`w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white resize-none transition-all ${className}`}
      placeholder={placeholder}
    />
  );
}

export function AddObjectModal({ onAdd }: { onAdd: (obj: any) => void }) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [locationData, setLocationData] = useState({ latitude: 54.8985207, longitude: 23.9035965, is_exact_location: true, address: "" });
  const [isPublic, setIsPublic] = useState(true);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    setIsUploading(true);
    let galleryUrls: string[] = [];
    
    const fileInputs = formData.getAll("imageFiles") as File[];
    const validFiles = fileInputs.filter(f => f.size > 0);
    
    if (validFiles.length > 0) {
      try {
        const totalFiles = validFiles.length;
        setUploadProgress({ current: 1, total: totalFiles });

        for (let i = 0; i < totalFiles; i++) {
          const file = validFiles[i];
          setUploadProgress({ current: i + 1, total: totalFiles });

          // Light client-side compression first
          const compressionOptions = {
            maxSizeMB: 2,
            maxWidthOrHeight: 2400,
            useWebWorker: true,
          };
          const compressedFile = await imageCompression(file, compressionOptions);

          // Send to watermark API for server-side watermark + WebP
          const uploadFormData = new FormData();
          uploadFormData.append("file", compressedFile, compressedFile.name || "image.jpg");

          const res = await fetch("/api/watermark", {
            method: "POST",
            body: uploadFormData,
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || "Watermark processing failed");
          }

          const result = await res.json();
          if (result.url) {
            galleryUrls.push(result.url);
          }
        }
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }
    
    const payload = {
      pavadinimas: formData.get("title") as string,
      miestas: formData.get("city") as string,
      kaina: Number(formData.get("price")),
      statusas: formData.get("status") as string,
      aprasymas: formData.get("description") as string,
      nuotraukos_urls: galleryUrls,
      plotas: Number(formData.get("area") || 0),
      rooms: Number(formData.get("rooms") || 0),
      floor: formData.get("floor") as string || "",
      year: Number(formData.get("year") || 0),
      arai: Number(formData.get("arai") || 0),
      heating: formData.get("heating") as string || "",
      type: formData.get("type") as string || "Butas",
      privalumai: (formData.get("privalumai") as string || "").split(",").map(t => t.trim()).filter(Boolean),
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      is_exact_location: locationData.is_exact_location,
      address: locationData.address,
      is_public: isPublic,
    };

    try {
      const { data, error } = await supabase.from('nt_objektai').insert([payload]).select();
      if (error) throw error;
      
      if (data && data.length > 0) {
         const p = data[0];
         const newProperty = {
           id: p.id,
           title: p.pavadinimas,
           city: p.miestas,
           address: p.address,
           latitude: p.latitude,
           longitude: p.longitude,
           is_exact_location: p.is_exact_location,
           price: p.kaina,
           status: p.statusas,
           description: p.aprasymas,
           gallery: galleryUrls,
           image: galleryUrls[0] || "",
           area: p.plotas || 0,
           rooms: p.rooms || 0,
           floor: p.floor || "",
           year: p.year || 0,
           arai: p.arai || 0,
           heating: p.heating || "",
           type: p.type || "Butas",
           privalumai: p.privalumai || [],
           is_public: p.is_public !== false,
           slug: p.pavadinimas.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
         };
         onAdd(newProperty);
      }
    } catch (err) {
       console.error("DB insert failed:", err);
    }

    setIsUploading(false);
    setIsPublic(true);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <span className="bg-[#2563EB] hover:bg-[#1E3A8A] text-white shadow-xl shadow-[#2563EB]/20 h-12 px-4 md:px-6 rounded-xl font-bold flex items-center cursor-pointer transition-all whitespace-nowrap">
          <Plus className="w-5 h-5 md:mr-2" />
          <span className="hidden md:inline">Pridėti naują objektą</span>
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl p-0 overflow-hidden bg-white border-none shadow-2xl rounded-2xl h-[90vh] max-h-[90vh] flex flex-col fixed left-1/2 !top-4 sm:!top-6 -translate-x-1/2 !translate-y-0 sm:!translate-y-0 backdrop-blur-md">
        {isUploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <div className="w-64 bg-slate-100 h-2.5 rounded-full overflow-hidden mb-4 shadow-inner">
              <div 
                className="bg-[#2563EB] h-full transition-all duration-300 ease-out rounded-full" 
                style={{ width: `${uploadProgress.total > 0 ? (uploadProgress.current / uploadProgress.total) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-sm font-extrabold text-[#111827]">
              Apdorojamas failas {uploadProgress.current} iš {uploadProgress.total}... ({Math.round((uploadProgress.current / (uploadProgress.total || 1)) * 100)}%)
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">Watermark + WebP konvertavimas</p>
          </div>
        )}

        <div className="bg-[#F8FAFC] border-b border-slate-100 p-6">
          <DialogTitle className="text-2xl font-extrabold text-[#111827] tracking-tight">Pridėti NT Objektą</DialogTitle>
          <p className="text-sm font-medium text-slate-500 mt-1">Užpildykite pagrindinę objekto informaciją viešam katalogui.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8 flex-1 overflow-y-auto">
          
          {/* Main Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1E3A8A] flex items-center border-b border-slate-100 pb-2">
              <Building className="w-5 h-5 mr-2" /> Pagrindinė informacija
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-slate-500">Pavadinimas *</Label>
                <Input id="title" name="title" required className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="Pvz.: Modernus butas centre" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-slate-500">Kaina (€) *</Label>
                <Input id="price" name="price" type="number" required className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="150000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-xs font-bold uppercase tracking-wider text-slate-500">Statusas *</Label>
                <select 
                  name="status" 
                  id="status"
                  defaultValue="Parduodama"
                  className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all cursor-pointer"
                >
                  <option value="Parduodama">Parduodama</option>
                  <option value="Rezervuota">Rezervuota</option>
                  <option value="Parduota">Parduota</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-xs font-bold uppercase tracking-wider text-slate-500">Tipas *</Label>
                <select 
                  name="type" 
                  id="type"
                  defaultValue="Butas"
                  className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all cursor-pointer"
                >
                  <option value="Butas">Butas</option>
                  <option value="Namas">Namas</option>
                  <option value="Sklypas">Sklypas</option>
                  <option value="Patalpos">Patalpos</option>
                </select>
              </div>
            </div>

            {/* Visibility Toggle */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Skelbimo matomumas</Label>
              <button
                type="button"
                onClick={() => setIsPublic(prev => !prev)}
                className={`w-full md:w-auto h-12 rounded-xl border px-6 flex items-center gap-3 text-sm font-bold transition-all ${
                  isPublic
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                {isPublic ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                {isPublic ? "Matomas viešai" : "Paslėptas nuo lankytojų"}
              </button>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1E3A8A] flex items-center border-b border-slate-100 pb-2">
              <MapPin className="w-5 h-5 mr-2" /> Lokacija
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-xs font-bold uppercase tracking-wider text-slate-500">Miestas *</Label>
                <Input id="city" name="city" required className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="Kaunas" />
              </div>
            </div>
            {/* Map Location Picker */}
            <LocationPicker onChange={setLocationData} />
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1E3A8A] flex items-center border-b border-slate-100 pb-2">
              <FileText className="w-5 h-5 mr-2" /> Specifikacijos
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-2">
                <Label htmlFor="area" className="text-xs font-bold uppercase tracking-wider text-slate-500">Plotas (m²)</Label>
                <Input id="area" name="area" type="number" step="0.01" className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="68" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor" className="text-xs font-bold uppercase tracking-wider text-slate-500">Aukštas</Label>
                <Input id="floor" name="floor" className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="2/4" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year" className="text-xs font-bold uppercase tracking-wider text-slate-500">Metai</Label>
                <Input id="year" name="year" type="number" className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="2022" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-2">
              <div className="space-y-2">
                <Label htmlFor="arai" className="text-xs font-bold uppercase tracking-wider text-slate-500">Sklypas (arai)</Label>
                <Input id="arai" name="arai" type="number" step="0.01" className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="6" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heating" className="text-xs font-bold uppercase tracking-wider text-slate-500">Šildymas</Label>
                <Input id="heating" name="heating" className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="Centrinis kolektorinis" />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <Label htmlFor="privalumai" className="text-xs font-bold uppercase tracking-wider text-slate-500">Privalumai (atskirti kableliais)</Label>
              <AutoExpandTextarea
                id="privalumai"
                name="privalumai"
                placeholder="Aukštos kokybės apdaila, Integruota buitinė technika, Dvi parkavimo vietos, Rekuperacinė sistema"
                minHeight={80}
              />
              <p className="text-xs text-slate-400 mt-1">Rašykite kiekvieną privalumą atskirtą kableliu</p>
            </div>
            <div className="space-y-2 pt-2">
              <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-slate-500">Pilnas aprašymas</Label>
              <AutoExpandTextarea
                id="description"
                name="description"
                placeholder="Detalus objekto aprašymas – rašykite įtaigiai ir profesionaliai..."
                minHeight={200}
              />
            </div>
          </div>

          {/* Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1E3A8A] flex items-center border-b border-slate-100 pb-2">
              <ImageIcon className="w-5 h-5 mr-2" /> Nuotraukos (galerija)
            </h3>
             <div className="space-y-2">
                <Label htmlFor="imageFiles" className="text-xs font-bold uppercase tracking-wider text-slate-500">Įkelti nuotraukas iš įrenginio (galima kelias)</Label>
                <Input id="imageFiles" name="imageFiles" type="file" accept="image/*" multiple className="h-12 pt-2.5 rounded-xl bg-slate-50 border-slate-200 cursor-pointer" />
                <p className="text-xs text-slate-400 mt-1">Automatiškai bus uždėtas logotipas ir konvertuota į WebP formatą. Pirma nuotrauka bus pagrindinė.</p>
              </div>
          </div>

          <div className="sticky bottom-0 bg-white z-10 pt-4 border-t border-slate-100 flex justify-end gap-3 -mx-6 -mb-6 p-6">
             <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-12 px-6 rounded-xl font-bold bg-white text-slate-600 border-slate-200 hover:bg-slate-50">
                Atšaukti
             </Button>
             <Button type="submit" disabled={isUploading} className="bg-[#111827] hover:bg-[#1E3A8A] text-white shadow-xl shadow-[#111827]/20 h-12 px-8 rounded-xl font-bold transition-all disabled:opacity-50">
                {isUploading ? "Apdorojama..." : "Išsaugoti objektą"}
             </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}
