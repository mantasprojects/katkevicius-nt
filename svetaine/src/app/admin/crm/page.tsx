"use client";

import { useState, useEffect } from "react";
import { Users, Search, Plus, Mail, Phone, Edit, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  notes: string;
  date: string;
}

const INITIAL_CONTACTS: Contact[] = [
  { id: "1", name: "Jonas Jonaitis", email: "jonas.j@pavyzdys.lt", phone: "+370 600 11111", status: "Naujas", notes: "Domisi namais Kauno rajone.", date: "2024-05-18" },
  { id: "2", name: "Asta Astienė", email: "asta@pavyzdys.lt", phone: "+370 611 22222", status: "Susitikimas", notes: "Apžiūrės butą centre trečiadienį.", date: "2024-05-19" },
  { id: "3", name: "Tomas Tomaitis", email: "tomas@pavyzdys.lt", phone: "+370 622 33333", status: "Užbaigta", notes: "Nupirko sklypą Garliavoje.", date: "2024-05-10" },
];

export default function AdminCRMPage() {
  const supabase = createClient();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const loadContacts = async () => {
      try {
        const { data, error } = await supabase.from('crm_kontaktai').select('*').order('created_at', { ascending: false });
        if (data) {
          const mapped: Contact[] = data.map((i: any) => ({
            id: i.id,
            name: i.vardas,
            email: i.email || "—",
            phone: i.telefonas || "",
            status: i.statusas || "Naujas",
            notes: i.zinute || "",
            date: i.created_at ? i.created_at.split('T')[0] : "—"
          }));
          setContacts(mapped);
          return;
        }
      } catch (err) {
        console.error("Failed to load contacts:", err);
      }
    };
    loadContacts();
  }, []);

  const handleAddContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      vardas: formData.get("name") as string,
      email: formData.get("email") as string,
      telefonas: formData.get("phone") as string,
      zinute: formData.get("notes") as string
    };

    try {
      const { data, error } = await supabase.from('crm_kontaktai').insert([payload]).select();
      if (data && data.length > 0) {
         const i = data[0];
         const newContact: Contact = {
           id: i.id,
           name: i.vardas,
           email: i.email || "—",
           phone: i.telefonas,
           status: i.statusas || "Naujas",
           notes: i.zinute,
           date: i.created_at.split('T')[0]
         };
         setContacts(prev => [newContact, ...prev]);
      }
    } catch (err) { console.error(err); }
    setIsAddOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from('crm_kontaktai').delete().eq('id', id);
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (err) { console.error(err); }
    setDeleteConfirmId(null);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await supabase.from('crm_kontaktai').update({ statusas: newStatus }).eq('id', id);
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (err) { console.error(err); }
  };

  const handleEditSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingContact) return;
    const formData = new FormData(e.currentTarget);
    const payload = {
      vardas: formData.get("name") as string,
      telefonas: formData.get("phone") as string,
      zinute: formData.get("notes") as string
    };

    try {
      await supabase.from('crm_kontaktai').update(payload).eq('id', editingContact.id);
      setContacts(prev => prev.map(c => c.id === editingContact.id ? { ...c, name: payload.vardas, phone: payload.telefonas, notes: payload.zinute } : c));
    } catch (err) { console.error(err); }
    setIsEditOpen(false);
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isMounted) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-2 flex items-center gap-3">
            Klientų CRM
            <span className="text-sm font-bold bg-[#EFF6FF] text-[#2563EB] px-3 py-1 rounded-xl border border-blue-100">
              {contacts.length}
            </span>
          </h1>
          <p className="text-slate-500 font-medium">Valdykite savo klientų kontaktus, užklausas ir pardavimų eigą.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger>
            <span className="bg-[#2563EB] hover:bg-[#1E3A8A] text-white shadow-xl shadow-[#2563EB]/20 h-12 px-6 rounded-xl font-bold flex items-center cursor-pointer">
              <Plus className="w-5 h-5 mr-2" />
              Pridėti kontaktą
            </span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-3xl">
            <div className="bg-[#F8FAFC] border-b border-slate-100 p-6">
              <DialogTitle className="text-2xl font-extrabold text-[#111827] tracking-tight">Naujas kontaktas</DialogTitle>
            </div>
            <form onSubmit={handleAddContact} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500">Vardas, Pavardė *</Label>
                <Input id="name" name="name" required className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="Vardenis Pavardenis" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-slate-500">Telefonas *</Label>
                  <Input id="phone" name="phone" required className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="+370 600..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">El. paštas</Label>
                  <Input id="email" name="email" type="email" className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="vardas@mail.lt" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-xs font-bold uppercase tracking-wider text-slate-500">Pradinis Statusas</Label>
                <select id="status" name="status" className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-3 text-sm focus:ring-2 focus:ring-[#2563EB] outline-none">
                  <option value="Naujas">Naujas</option>
                  <option value="Susitikimas">Susitikimas</option>
                  <option value="Derybos">Derybos</option>
                </select>
              </div>
              <div className="space-y-2 pt-2">
                <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider text-slate-500">Pastabos</Label>
                <textarea 
                  id="notes" 
                  name="notes" 
                  className="w-full min-h-[100px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
                  placeholder="Kliento pageidavimai, lūkesčiai..."
                />
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                 <Button type="submit" className="w-full bg-[#111827] hover:bg-[#1E3A8A] text-white shadow-xl shadow-[#111827]/20 h-12 rounded-xl font-bold transition-all">
                    Išsaugoti kontaktą
                 </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center">
          <div className="relative w-full max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Ieškoti pagal vardą, el. paštą ar telefoną..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl border-slate-200 bg-white focus:ring-[#2563EB]"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white border-b border-slate-200">
                <th className="py-4 px-6 font-bold text-slate-500 tracking-wider text-xs">Klientas</th>
                <th className="py-4 px-6 font-bold text-slate-500 tracking-wider text-xs">Kontaktinė Info</th>
                <th className="py-4 px-6 font-bold text-slate-500 tracking-wider text-xs">Statusas</th>
                <th className="py-4 px-6 font-bold text-slate-500 tracking-wider text-xs w-1/3">Tekstas</th>
                <th className="py-4 px-6 font-bold text-slate-500 tracking-wider text-xs text-right">Veiksmai</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="py-5 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold mr-3 flex-shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[#111827] font-bold">{c.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">{c.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6 font-medium text-slate-600">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-slate-500"><Phone className="w-3.5 h-3.5 mr-2" /> {c.phone}</div>
                      <div className="flex items-center text-slate-500"><Mail className="w-3.5 h-3.5 mr-2" /> {c.email}</div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusChange(c.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer border-0 outline-none focus:ring-2 focus:ring-[#2563EB] transition-all ${
                        c.status === 'Naujas' ? 'bg-blue-100 text-blue-700' :
                        c.status === 'Susitikimas' ? 'bg-purple-100 text-purple-700' :
                        c.status === 'Derybos' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}
                    >
                      <option value="Naujas">Naujas</option>
                      <option value="Susitikimas">Susitikimas</option>
                      <option value="Derybos">Derybos</option>
                      <option value="Užbaigta">Užbaigta</option>
                    </select>
                  </td>
                  <td className="py-5 px-6 text-sm text-slate-500 italic max-w-xs truncate" title={c.notes}>
                    {c.notes || "-"}
                  </td>
                  <td className="py-5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => { setEditingContact(c); setIsEditOpen(true); }} className="h-9 w-9 rounded-lg border-slate-100 text-slate-600 hover:bg-slate-100">
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      {deleteConfirmId === c.id ? (
                        <>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(c.id)} className="h-9 w-9 rounded-lg border-red-200 bg-red-50 text-red-600 hover:bg-red-100">
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => setDeleteConfirmId(null)} className="h-9 w-9 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-100">
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" size="icon" onClick={() => setDeleteConfirmId(c.id)} className="h-9 w-9 rounded-lg border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-500">
                    <Users className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                    <p className="text-lg font-medium text-[#111827]">Kontaktų nerasta</p>
                    <p className="text-sm">Bandykite keisti paieškos kriterijus arba pridėkite naują kontaktą.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / View Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-3xl">
          <div className="bg-[#F8FAFC] border-b border-slate-100 p-6">
            <DialogTitle className="text-2xl font-extrabold text-[#111827] tracking-tight">Peržiūrėti / Redaguoti</DialogTitle>
          </div>
          {editingContact && (
            <form onSubmit={handleEditSave} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-xs font-bold uppercase tracking-wider text-slate-500">Vardas, Pavardė</Label>
                <Input id="edit-name" name="name" defaultValue={editingContact.name} required className="h-12 rounded-xl bg-slate-50 border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone" className="text-xs font-bold uppercase tracking-wider text-slate-500">Telefonas</Label>
                <Input id="edit-phone" name="phone" defaultValue={editingContact.phone} required className="h-12 rounded-xl bg-slate-50 border-slate-200" />
              </div>
              <div className="space-y-2 pt-2">
                <Label htmlFor="edit-notes" className="text-xs font-bold uppercase tracking-wider text-slate-500">Pastabos / Žinutė</Label>
                <textarea 
                  id="edit-notes" 
                  name="notes" 
                  defaultValue={editingContact.notes}
                  className="w-full min-h-[140px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
                />
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                 <Button type="submit" className="w-full bg-[#111827] hover:bg-[#1E3A8A] text-white shadow-xl shadow-[#111827]/20 h-12 rounded-xl font-bold transition-all">
                    Išsaugoti pakeitimus
                 </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
