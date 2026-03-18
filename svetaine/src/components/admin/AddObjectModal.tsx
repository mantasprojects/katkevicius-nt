"use client";

import { useState } from "react";
import { Plus, Building, MapPin, Image as ImageIcon, FileText } from "lucide-react";
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

export function AddObjectModal({ onAdd }: { onAdd: (obj: any) => void }) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [locationData, setLocationData] = useState({ latitude: 54.8985207, longitude: 23.9035965, is_exact_location: true, address: "" });
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    setIsUploading(true);
    let galleryUrls: string[] = [];
    
    const fileInputs = formData.getAll("imageFiles") as File[];
    const validFiles = fileInputs.filter(f => f.size > 0);
    
    if (validFiles.length > 0) {
      try {
        const compressionOptions = {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 2000,
          useWebWorker: true,
          fileType: 'image/webp'
        };
        const totalFiles = validFiles.length;
        setUploadProgress({ current: 1, total: totalFiles });

        for (let i = 0; i < totalFiles; i++) {
          const file = validFiles[i];
          setUploadProgress({ current: i + 1, total: totalFiles });
          const compressedFile = await imageCompression(file, compressionOptions);
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
          const filePath = `uploads/${fileName}`;
          
          const { data, error } = await supabase.storage
            .from('properties')
            .upload(filePath, compressedFile);
            
          if (error) throw error;
          
          if (data) {
             const { data: urlData } = supabase.storage.from('properties').getPublicUrl(filePath);
             galleryUrls.push(urlData.publicUrl);
          }
        }
      } catch (err) {
        console.error("Storage upload failed:", err);
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
      privalumai: (formData.get("privalumai") as string || "").split(",").map(t => t.trim()).filter(Boolean)
    };

    try {
      const { data, error } = await supabase.from('nt_objektai').insert([payload]).select();
      if (error) throw error;
      
      if (data && data.length > 0) {
         const p = data[0];
         // Map back for state
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
           slug: p.pavadinimas.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
         };
         onAdd(newProperty);
      }
    } catch (err) {
       console.error("DB insert failed:", err);
    }

    setIsUploading(false);
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
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto relative">
        {isUploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <div className="w-64 bg-slate-100 h-2.5 rounded-full overflow-hidden mb-4 shadow-inner">
              <div 
                className="bg-[#2563EB] h-full transition-all duration-300 ease-out rounded-full" 
                style={{ width: `${uploadProgress.total > 0 ? (uploadProgress.current / uploadProgress.total) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-sm font-extrabold text-[#111827]">
              Keliamas failas {uploadProgress.current} iš {uploadProgress.total}... ({Math.round((uploadProgress.current / (uploadProgress.total || 1)) * 100)}%)
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">Prašome palaukti, vykdomas suspaudimas ir kėlimas</p>
          </div>
        )}

        <div className="bg-[#F8FAFC] border-b border-slate-100 p-6">
          <DialogTitle className="text-2xl font-extrabold text-[#111827] tracking-tight">Pridėti NT Objektą</DialogTitle>
          <p className="text-sm font-medium text-slate-500 mt-1">Užpildykite pagrindinę objekto informaciją viešam katalogui.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* Main Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1E3A8A] flex items-center border-b border-slate-100 pb-2">
              <Building className="w-5 h-5 mr-2" /> Pagrindinė Informacija
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="relative">
                  <Select name="status" defaultValue="Parduodama">
                    <SelectTrigger className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all">
                      <SelectValue placeholder="Pasirinkite statusą" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-xl shadow-xl border-slate-100">
                      <SelectItem value="Parduodama" className="cursor-pointer font-medium hover:bg-slate-50">Parduodama</SelectItem>
                      <SelectItem value="Rezervuota" className="cursor-pointer font-medium hover:bg-slate-50">Rezervuota</SelectItem>
                      <SelectItem value="Parduota" className="cursor-pointer font-medium hover:bg-slate-50">Parduota</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-xs font-bold uppercase tracking-wider text-slate-500">Tipas *</Label>
                <div className="relative">
                  <Select name="type" defaultValue="Butas">
                    <SelectTrigger className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all">
                      <SelectValue placeholder="Pasirinkite tipą" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-xl shadow-xl border-slate-100">
                      <SelectItem value="Butas" className="cursor-pointer font-medium hover:bg-slate-50">Butas</SelectItem>
                      <SelectItem value="Namas" className="cursor-pointer font-medium hover:bg-slate-50">Namas</SelectItem>
                      <SelectItem value="Sklypas" className="cursor-pointer font-medium hover:bg-slate-50">Sklypas</SelectItem>
                      <SelectItem value="Komercinės patalpos" className="cursor-pointer font-medium hover:bg-slate-50">Komercinės patalpos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1E3A8A] flex items-center border-b border-slate-100 pb-2">
              <MapPin className="w-5 h-5 mr-2" /> Lokacija
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="arai" className="text-xs font-bold uppercase tracking-wider text-slate-500">Sklypas (arai)</Label>
                <Input id="arai" name="arai" type="number" step="0.01" className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="6" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heating" className="text-xs font-bold uppercase tracking-wider text-slate-500">Šildymas</Label>
                <Input id="heating" name="heating" className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="Centrinis kolektorinis" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 pt-2">
            </div>
            <div className="space-y-2 pt-2">
              <Label htmlFor="privalumai" className="text-xs font-bold uppercase tracking-wider text-slate-500">Privalumai (atskirti kableliais)</Label>
              <textarea
                id="privalumai"
                name="privalumai"
                className="w-full min-h-[80px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
                placeholder="Aukštos kokybės apdaila, Integruota buitinė technika, Dvi parkavimo vietos, Rekuperacinė sistema"
              />
              <p className="text-xs text-slate-400 mt-1">Rašykite kiekvieną privalumą atskirtą kableliu. Pvz.: Rekuperacija, Signalizacija, Parkavimas</p>
            </div>
            <div className="space-y-2 pt-2">
              <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-slate-500">Pilnas Aprašymas</Label>
              <textarea 
                id="description" 
                name="description" 
                className="w-full min-h-[100px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
                placeholder="Detalizuokite objekto privalumus..."
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
                <p className="text-xs text-slate-400 mt-1">Galite pažymėti neribotą kiekį nuotraukų. Pirma bus pagrindinė.</p>
              </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
             <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-12 px-6 rounded-xl font-bold bg-white text-slate-600 border-slate-200 hover:bg-slate-50">
                Atšaukti
             </Button>
             <Button type="submit" disabled={isUploading} className="bg-[#111827] hover:bg-[#1E3A8A] text-white shadow-xl shadow-[#111827]/20 h-12 px-8 rounded-xl font-bold transition-all disabled:opacity-50">
                {isUploading ? "Įkeliama..." : "Išsaugoti Objektą"}
             </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}
