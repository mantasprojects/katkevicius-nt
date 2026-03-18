"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Edit, Trash2, Home, MapPin, X, Check, ChevronLeft, ChevronRight, Plus, Star, Image as ImageIcon, Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddObjectModal } from "@/components/admin/AddObjectModal";
import { INITIAL_PROPERTIES as PUBLIC_INITIAL_PROPERTIES } from "../../objektai/ObjektaiClientView";
import LocationPicker from "@/components/admin/LocationPicker";
import { createClient } from "@/utils/supabase/client";
import { deleteProperty, updateProperty } from "@/app/actions/properties";
import imageCompression from 'browser-image-compression';

interface Property {
  id: string | number;
  title: string;
  city: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  is_exact_location?: boolean;
  price: number;
  rooms?: number;
  area?: number;
  arai?: number;
  year?: number;
  floor?: string;
  heating?: string;
  status: string;
  type?: string;
  image?: string;
  gallery?: string[];
  slug?: string;
  description?: string;
  privalumai?: string[];
  details?: any;
}

const STATUSES = ["Parduodama", "Rezervuota", "Parduota"];

export default function AdminObjectsPage() {
  const supabase = createClient();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const showNotice = (m: string, t: 'success' | 'error' = 'success') => { setNotification({ message: m, type: t }); setTimeout(() => setNotification(null), 3000); };
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | number | null>(null);
  const [editGallery, setEditGallery] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [editLocationData, setEditLocationData] = useState({ latitude: 54.8985207, longitude: 23.9035965, is_exact_location: true, address: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProperties = useMemo(() => {
    return properties.filter((p: any) => {
      const searchStr = `${p.title} ${p.city} ${p.description || ""} ${p.price}`;
      return searchStr.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [properties, searchTerm]);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const { data, error } = await supabase.from('nt_objektai').select('*');
        if (data) {
          const mapped = data.map(p => ({
            id: p.id,
            title: p.pavadinimas,
            city: p.miestas,
            price: p.kaina,
            status: p.statusas,
            description: p.aprasymas,
            gallery: p.nuotraukos_urls ? (typeof p.nuotraukos_urls === 'string' ? JSON.parse(p.nuotraukos_urls) : p.nuotraukos_urls) : [],
            latitude: p.latitude,
            longitude: p.longitude,
            address: p.address,
            is_exact_location: p.is_exact_location,
            area: p.plotas || 0,
            rooms: p.rooms || 0,
            floor: p.floor || "",
            year: p.year || 0,
            arai: p.arai || 0,
            heating: p.heating || "",
            type: p.type || "Butas",
            privalumai: p.privalumai || []
          }));
          setProperties(mapped as any);
        }
      } catch (err) {
        console.error("Failed to load from Supabase", err);
      }
    };
    loadProperties();
    setIsMounted(true);
  }, []);

  const saveProperties = async (updated: Property[]) => {
    // legacy array fallback
    setProperties(updated);
  };

  const handleDelete = async (id: string | number) => {
    const res = await deleteProperty(String(id));
    if (res.success) {
      setProperties(prev => prev.filter(p => String(p.id) !== String(id)));
      showNotice("Objektas sėkmingai ištrintas");
    } else {
      showNotice(res.error || "Klaida trinant", "error");
    }
    setDeleteConfirmId(null);
  };

  const handleStatusChange = async (id: string | number, newStatus: string) => {
    const res = await updateProperty(String(id), { statusas: newStatus });
    if (res.success) {
      setProperties(prev => prev.map(p => String(p.id) === String(id) ? { ...p, status: newStatus } : p));
      showNotice("Statusas atnaujintas");
    } else {
      showNotice(res.error || "Klaida atnaujinant statusą", "error");
    }
  };

  const handleAddObject = (newProperty: Property) => {
     // Re-trigger load to fetch updated dataset
     setProperties(prev => [newProperty, ...prev]);
  };

  const openEdit = (property: Property) => {
    setEditingProperty({ ...property });
    setEditGallery(property.gallery || []);
    setEditLocationData({
      latitude: property.latitude || 54.8985207,
      longitude: property.longitude || 23.9035965,
      is_exact_location: property.is_exact_location ?? true,
      address: property.address || ""
    });
    setIsEditOpen(true);
  };

  // Gallery management
  const moveImage = (index: number, direction: -1 | 1) => {
    const newGallery = [...editGallery];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newGallery.length) return;
    [newGallery[index], newGallery[targetIndex]] = [newGallery[targetIndex], newGallery[index]];
    setEditGallery(newGallery);
  };

  const removeImage = (index: number) => {
    setEditGallery(editGallery.filter((_, i) => i !== index));
  };

  const setCoverImage = (index: number) => {
    if (index === 0) return;
    const newGallery = [...editGallery];
    const [moved] = newGallery.splice(index, 1);
    newGallery.unshift(moved);
    setEditGallery(newGallery);
  };

  const handleUploadNewImages = async (files: FileList) => {
    if (files.length === 0) return;
    setIsUploading(true);
    const newUrls: string[] = [];
    try {
      const compressionOptions = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 2000,
        useWebWorker: true,
        fileType: 'image/webp'
      };

      const filesArray = Array.from(files);
      const totalFiles = filesArray.length;
      setUploadProgress({ current: 1, total: totalFiles });

      for (let i = 0; i < totalFiles; i++) {
        const file = filesArray[i];
        if (file.size === 0) continue;
        setUploadProgress({ current: i + 1, total: totalFiles });
        if (file.size === 0) continue;
        const compressedFile = await imageCompression(file, compressionOptions);
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
        const filePath = `uploads/${fileName}`;

        const { data, error } = await supabase.storage
          .from('properties')
          .upload(filePath, compressedFile);

        if (error) throw error;

        if (data) {
          const { data: urlData } = supabase.storage.from('properties').getPublicUrl(filePath);
          newUrls.push(urlData.publicUrl);
        }
      }
      setEditGallery(prev => [...prev, ...newUrls]);
    } catch (err) {
      console.error("Upload failed", err);
      showNotice("Nuotraukų įkėlimas nepavyko", "error");
    }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEditSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProperty) return;
    const formData = new FormData(e.currentTarget);

    const payload = {
      pavadinimas: formData.get("title") as string,
      miestas: formData.get("city") as string,
      kaina: Number(formData.get("price")),
      statusas: formData.get("status") as string,
      aprasymas: formData.get("description") as string,
      nuotraukos_urls: editGallery,
      plotas: Number(formData.get("area") || 0),
      rooms: Number(formData.get("rooms") || 0),
      floor: formData.get("floor") as string || "",
      year: Number(formData.get("year") || 0),
      arai: Number(formData.get("arai") || 0),
      heating: formData.get("heating") as string || "",
      type: formData.get("type") as string || "Butas",
      privalumai: (formData.get("privalumai") as string || "").split(",").map(t => t.trim()).filter(Boolean),
      latitude: editLocationData.latitude,
      longitude: editLocationData.longitude,
      is_exact_location: editLocationData.is_exact_location,
      address: editLocationData.address
    };

    try {
      const { error } = await supabase.from('nt_objektai').update(payload).eq('id', editingProperty.id);
      if (error) throw error;

      // --- Nuotraukų šalinimas iš Supabase Storage ---
      const oldGallery = editingProperty.gallery || [];
      const removedUrls = oldGallery.filter((url: string) => !editGallery.includes(url));
      if (removedUrls.length > 0) {
        const pathsToDelete = removedUrls.map((url: string) => {
          const parts = url.split('/properties/');
          return parts[1];
        }).filter(Boolean);

        if (pathsToDelete.length > 0) {
          await supabase.storage.from('properties').remove(pathsToDelete);
        }
      }
      // ------------------------------------------------

      const updatedProp: Property = {
        ...editingProperty,
        title: payload.pavadinimas,
        city: payload.miestas,
        price: payload.kaina,
        status: payload.statusas,
        description: payload.aprasymas,
        gallery: editGallery,
        image: editGallery[0] || "",
        address: editLocationData.address,
        latitude: editLocationData.latitude,
        longitude: editLocationData.longitude,
        is_exact_location: editLocationData.is_exact_location,
        area: payload.plotas,
        rooms: payload.rooms,
        floor: payload.floor,
        year: payload.year,
        arai: payload.arai,
        heating: payload.heating,
        type: payload.type,
        privalumai: payload.privalumai
      };

      setProperties(prev => prev.map(p => String(p.id) === String(editingProperty.id) ? updatedProp : p));
      showNotice("Objektas sėkmingai atnaujintas");
    } catch (err) {
      console.error("Failed to update property on Supabase", err);
    }
    
    setIsEditOpen(false);
    setEditingProperty(null);
  };

  if (!isMounted) return null;

  
  return (
    <>
      {notification && (
        <div className={`fixed top-6 right-6 p-4 rounded-xl shadow-2xl font-bold text-white transition-all transform z-50 ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {notification.message}
        </div>
      )}

    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-2">NT Objektai</h1>
          <p className="text-slate-500 font-medium">Valdykite visus parduodamus ir išnuomotus objektus.</p>
        </div>
        <AddObjectModal onAdd={handleAddObject} />
      </div>

      <div className="mb-6 flex max-w-md gap-2">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
               placeholder="Ieškoti pagal pavadinimą, miestą, aprašymą..." 
               className="pl-9 h-11 rounded-xl bg-white border-slate-200 shadow-sm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 font-bold text-slate-500 tracking-wider text-xs">Pavadinimas</th>
                <th className="py-4 px-6 font-bold text-slate-500 tracking-wider text-xs">Miestas</th>
                <th className="py-4 px-6 font-bold text-slate-500 tracking-wider text-xs">Kaina</th>
                <th className="py-4 px-6 font-bold text-slate-500 tracking-wider text-xs">Statusas</th>
                <th className="py-4 px-6 font-bold text-slate-500 tracking-wider text-xs text-right">Veiksmai</th>
              </tr>
            </thead>
            <tbody>
            {filteredProperties.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                <td className="py-5 px-6">
                  <div className="flex items-center text-[#111827] font-bold">
                    <Home className="w-5 h-5 mr-3 text-slate-400" />
                    {p.title}
                  </div>
                </td>
                <td className="py-5 px-6 font-medium text-slate-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-[#2563EB]" /> {p.city}
                  </div>
                </td>
                <td className="py-5 px-6 font-extrabold text-[#111827]">
                  € {p.price.toLocaleString("lt-LT")}
                </td>
                <td className="py-5 px-6">
                  <select
                    value={p.status}
                    onChange={(e) => handleStatusChange(String(p.id), e.target.value)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer border-0 outline-none focus:ring-2 focus:ring-[#2563EB] bg-blue-50 text-blue-700 transition-all"
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="py-5 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => openEdit(p)}
                      className="h-9 w-9 rounded-lg border-slate-200 text-[#2563EB] hover:bg-[#EFF6FF] hover:text-[#1E3A8A]"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {deleteConfirmId === String(p.id) ? (
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleDelete(String(p.id))}
                          className="h-9 w-9 rounded-lg border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => setDeleteConfirmId(null)}
                          className="h-9 w-9 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-100"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setDeleteConfirmId(String(p.id))}
                        className="h-9 w-9 rounded-lg border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">Nėra pridėtų objektų.</td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-5xl p-0 overflow-hidden bg-white border-none shadow-2xl rounded-3xl h-[85vh] max-h-[85vh] flex flex-col relative sm:mt-10">
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
            <DialogTitle className="text-2xl font-extrabold text-[#111827] tracking-tight">Redaguoti Objektą</DialogTitle>
            <p className="text-sm font-medium text-slate-500 mt-1">Atnaujinkite objekto informaciją.</p>
          </div>

          {editingProperty && (
            <form onSubmit={handleEditSave} className="p-6 space-y-5 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title" className="text-xs font-bold uppercase tracking-wider text-slate-500">Pavadinimas *</Label>
                  <Input id="edit-title" name="title" required defaultValue={editingProperty.title} className="h-12 rounded-xl bg-slate-50 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price" className="text-xs font-bold uppercase tracking-wider text-slate-500">Kaina (€) *</Label>
                  <Input id="edit-price" name="price" type="number" required defaultValue={editingProperty.price} className="h-12 rounded-xl bg-slate-50 border-slate-200" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-city" className="text-xs font-bold uppercase tracking-wider text-slate-500">Miestas *</Label>
                  <Input id="edit-city" name="city" required defaultValue={editingProperty.city} className="h-12 rounded-xl bg-slate-50 border-slate-200" />
                </div>
              </div>

              {/* Map Location Picker */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Vietos Valdymas</Label>
                <LocationPicker 
                  initialData={{
                    latitude: editingProperty.latitude,
                    longitude: editingProperty.longitude,
                    is_exact_location: editingProperty.is_exact_location,
                    address: editingProperty.address
                  }}
                  onChange={setEditLocationData}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-area" className="text-xs font-bold uppercase tracking-wider text-slate-500">Plotas (m²)</Label>
                  <Input id="edit-area" name="area" type="number" step="0.01" defaultValue={editingProperty.area || 0} className="h-12 rounded-xl bg-slate-50 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-arai" className="text-xs font-bold uppercase tracking-wider text-slate-500">Sklypas (arai)</Label>
                  <Input id="edit-arai" name="arai" type="number" step="0.01" defaultValue={editingProperty.arai || 0} className="h-12 rounded-xl bg-slate-50 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status" className="text-xs font-bold uppercase tracking-wider text-slate-500">Statusas</Label>
                  <select 
                    name="status" 
                    defaultValue={editingProperty.status}
                    className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all cursor-pointer"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type" className="text-xs font-bold uppercase tracking-wider text-slate-500">Tipas</Label>
                  <select 
                    name="type" 
                    defaultValue={editingProperty.type || "Butas"}
                    className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="Butas">Butas</option>
                    <option value="Namas">Namas</option>
                    <option value="Sklypas">Sklypas</option>
                    <option value="Komercinės patalpos">Komercinės patalpos</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-xs font-bold uppercase tracking-wider text-slate-500">Aprašymas</Label>
                <textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editingProperty.description || ""}
                  className="w-full min-h-[100px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
                  placeholder="Objekto aprašymas..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-privalumai" className="text-xs font-bold uppercase tracking-wider text-slate-500">Privalumai (atskirti kableliais)</Label>
                <textarea
                  id="edit-privalumai"
                  name="privalumai"
                  defaultValue={(editingProperty.privalumai || []).join(", ")}
                  className="w-full min-h-[80px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
                  placeholder="Rekuperacija, Signalizacija, Parkavimas"
                />
                <p className="text-xs text-slate-400">Kiekvieną privalumą atskirkite kableliu</p>
              </div>

              {/* Image Gallery Editor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Nuotraukų galerija ({editGallery.length})
                  </Label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-bold hover:bg-[#1E3A8A] transition-colors disabled:opacity-50"
                  >
                    {isUploading ? (
                      <span className="animate-pulse">Įkeliama...</span>
                    ) : (
                      <><Upload className="w-3.5 h-3.5" /> Pridėti nuotraukų</>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleUploadNewImages(e.target.files)}
                  />
                </div>

                {editGallery.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {editGallery.map((url, i) => (
                      <div key={`${url}-${i}`} className="relative group rounded-xl overflow-hidden border-2 border-slate-200 aspect-square bg-slate-100 hover:border-[#2563EB] transition-colors">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Nuotrauka ${i + 1}`} className="w-full h-full object-cover" />

                        {/* Cover badge */}
                        {i === 0 && (
                          <div className="absolute top-1.5 left-1.5 bg-[#2563EB] text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> Pagrindinė
                          </div>
                        )}

                        {/* Overlay controls */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          {i > 0 && (
                            <button type="button" onClick={() => moveImage(i, -1)} className="w-7 h-7 rounded-lg bg-white/90 text-slate-700 flex items-center justify-center hover:bg-white transition-colors" title="Perkelti kairėn">
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                          )}
                          {i > 0 && (
                            <button type="button" onClick={() => setCoverImage(i)} className="w-7 h-7 rounded-lg bg-yellow-400/90 text-slate-800 flex items-center justify-center hover:bg-yellow-400 transition-colors" title="Nustatyti kaip pagrindinę">
                              <Star className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button type="button" onClick={() => removeImage(i)} className="w-7 h-7 rounded-lg bg-red-500/90 text-white flex items-center justify-center hover:bg-red-500 transition-colors" title="Ištrinti">
                            <X className="w-4 h-4" />
                          </button>
                          {i < editGallery.length - 1 && (
                            <button type="button" onClick={() => moveImage(i, 1)} className="w-7 h-7 rounded-lg bg-white/90 text-slate-700 flex items-center justify-center hover:bg-white transition-colors" title="Perkelti dešinėn">
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Add more button tile */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-[#2563EB] hover:text-[#2563EB] transition-colors cursor-pointer"
                    >
                      <Plus className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-bold uppercase">Pridėti</span>
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl border-2 border-dashed border-slate-300 py-8 flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon className="w-10 h-10 mb-2" />
                    <p className="text-sm font-medium">Nėra nuotraukų</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 text-xs font-bold text-[#2563EB] hover:underline"
                    >
                      Įkelti nuotraukas
                    </button>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white z-10 pt-4 border-t border-slate-100 flex justify-end gap-3 -mx-6 -mb-6 p-6">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="h-12 px-6 rounded-xl font-bold bg-white text-slate-600 border-slate-200 hover:bg-slate-50">
                  Atšaukti
                </Button>
                <Button type="submit" className="bg-[#111827] hover:bg-[#1E3A8A] text-white shadow-xl shadow-[#111827]/20 h-12 px-8 rounded-xl font-bold transition-all">
                  Išsaugoti pakeitimus
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}
