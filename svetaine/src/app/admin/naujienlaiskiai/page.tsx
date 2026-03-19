"use client";

import { useState, useEffect } from "react";
import { Mail, Search, Trash2, Check, X, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";

interface Subscriber {
  id: string;
  email: string;
  source: string;
  notes: string;
  date: string;
}

export default function AdminSubscribersPage() {
  const supabase = createClient();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingSub, setEditingSub] = useState<Subscriber | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const loadSubscribers = async () => {
    try {
      const res = await fetch('/api/admin/subscribers');
      const data = await res.json();
      
      const pData = data.naujienlaiskiai || [];
      const bData = data.crm || [];

      const mappedPrimary: Subscriber[] = pData.map((s: any) => ({
        id: s.id,
        email: s.email,
        source: s.saltinis || "—",
        notes: s.pastabos || "",
        date: s.sukuriama_data ? s.sukuriama_data.split('T')[0] : "—"
      }));

      const mappedBackup: Subscriber[] = bData.map((s: any) => {
         const email = s.email && s.email !== '—' ? s.email : s.zinute?.match(/Naujienlaiškis: ([\w\.-]+@[\w\.-]+)/)?.[1] || s.email;
         const extractedNotes = s.zinute?.split('| Notes:')[1] || s.zinute || "";
         return {
            id: s.id,
            email: email || "—",
            source: "Pirkimas (Backup)",
            notes: extractedNotes.replace('[Naujienlaiškis]', '').trim(),
            date: s.created_at ? s.created_at.split('T')[0] : "—"
         };
      });

      // Combine and de-duplicate
      const combined = [...mappedPrimary, ...mappedBackup];
      const uniqueEmails = new Set();
      const deduplicated = combined.filter(item => {
         if (!item.email || item.email === '—') return true;
         if (uniqueEmails.has(item.email.toLowerCase())) return false;
         uniqueEmails.add(item.email.toLowerCase());
         return true;
      });

      setSubscribers(deduplicated);
    } catch (err) {
      console.error("Failed to load subscribers:", err);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const loadState = async () => {
       await loadSubscribers();
    }
    loadState();
  }, []);

  const handleAddSubscriber = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const notes = formData.get("notes") as string;

    try {
      // To bypass SQL blockages, save manual adds directly to crm_kontaktai with a specific tag
      const payload = {
        vardas: "Manual Subscriber",
        email: email,
        telefonas: "-",
        zinute: `[Naujienlaiškis] Maualiai Pridėtas | Notes: ${notes}`
      };
      
      const { data, error } = await supabase.from('crm_kontaktai').insert([payload]).select();
      if (data && data.length > 0) {
         setSubscribers(prev => [{
            id: data[0].id,
            email: email,
            source: "Manualinis",
            notes: notes,
            date: new Date().toISOString().split('T')[0]
         }, ...prev]);
      } else {
         alert("Nepavyko įrašyti.");
      }
    } catch (err) { console.error(err); }
    setIsAddOpen(false);
  };

  const handleEditSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSub) return;
    const formData = new FormData(e.currentTarget);
    const notes = formData.get("notes") as string;

    try {
      const res = await fetch('/api/admin/subscribers', {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ id: editingSub.id, source: editingSub.source, notes })
      });
      
      if (res.ok) {
         setSubscribers(prev => prev.map(s => s.id === editingSub.id ? { ...s, notes } : s));
      } else {
         alert("Nepavyko išsaugoti pakeitimų.");
      }
    } catch (err) { console.error(err); }
    setIsEditOpen(false);
  };

  const handleDelete = async (id: string, source: string) => {
    try {
      const res = await fetch('/api/admin/subscribers', {
         method: 'DELETE',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ id, source })
      });

      if (res.ok) {
         setSubscribers(prev => prev.filter(s => s.id !== id));
      } else {
         alert("Nepavyko ištrinti.");
      }
    } catch (err) { console.error(err); }
    setDeleteConfirmId(null);
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isMounted) return null;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-2 flex items-center gap-3">
            Naujienlaiškiai
            <span className="text-sm font-bold bg-[#EFF6FF] text-[#2563EB] px-3 py-1 rounded-xl border border-blue-100">
              {subscribers.length}
            </span>
          </h1>
          <p className="text-slate-500 font-medium">Valdykite naujienlaiškių prenumeratorius ir pridėkite pastabas.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger>
            <span className="bg-[#2563EB] hover:bg-[#1E3A8A] text-white shadow-xl shadow-[#2563EB]/20 h-12 px-6 rounded-xl font-bold flex items-center cursor-pointer">
              <Plus className="w-5 h-5 mr-2" />
              Pridėti prenumeratorių
            </span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-3xl">
            <div className="bg-[#F8FAFC] border-b border-slate-100 p-6">
              <DialogTitle className="text-2xl font-extrabold text-[#111827] tracking-tight">Naujas prenumeratorius</DialogTitle>
            </div>
            <form onSubmit={handleAddSubscriber} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">El. Paštas *</Label>
                <Input id="email" name="email" type="email" required className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="vardas@mail.lt" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider text-slate-500">Aprašymas / Pastabos</Label>
                <textarea 
                  id="notes" 
                  name="notes" 
                  className="w-full min-h-[100px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
                  placeholder="Informacija apie prenumeratorių..."
                />
              </div>
              <div className="pt-4 border-t border-slate-100">
                 <Button type="submit" className="w-full bg-[#111827] hover:bg-[#1E3A8A] text-white shadow-xl shadow-[#111827]/20 h-12 rounded-xl font-bold transition-all">
                    Išsaugoti
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
              placeholder="Ieškoti pagal el. paštą arba šaltinį..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl border-slate-200 bg-white focus:ring-[#2563EB]"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-white border-b border-slate-200">
                <th className="py-4 px-6 font-bold text-slate-500 tracking-wider text-xs">El. paštas</th>
                <th className="py-4 px-6 font-bold text-slate-500 tracking-wider text-xs">Šaltinis</th>
                <th className="py-4 px-6 font-bold text-slate-500 tracking-wider text-xs w-1/4">Aprašymas</th>
                <th className="py-4 px-6 font-bold text-slate-500 tracking-wider text-xs">Data</th>
                <th className="py-4 px-6 font-bold text-slate-500 tracking-wider text-xs text-right">Veiksmai</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="py-5 px-6">
                    <div className="flex items-center">
                      <div className="w-9 h-9 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold mr-3 flex-shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <p className="text-[#111827] font-bold text-sm">{s.email}</p>
                    </div>
                  </td>
                  <td className="py-5 px-6 font-medium text-slate-600 text-xs">
                    <span className={`px-2 py-1 rounded-lg font-bold uppercase tracking-wider ${
                      s.source.includes("Backup") || s.source === "Manualinis" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                    }`}>
                       {s.source}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-sm text-slate-500 max-w-xs truncate" title={s.notes}>
                    {s.notes || "—"}
                  </td>
                  <td className="py-5 px-6 text-sm text-slate-500">
                    {s.date}
                  </td>
                  <td className="py-5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => { setEditingSub(s); setIsEditOpen(true); }} className="h-8 w-8 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-100">
                        <Edit className="w-3.5 h-3.5" />
                      </Button>

                      {deleteConfirmId === s.id ? (
                        <>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(s.id, s.source)} className="h-8 w-8 rounded-lg border-red-200 bg-red-50 text-red-600 hover:bg-red-100">
                            <Check className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => setDeleteConfirmId(null)} className="h-8 w-8 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-100">
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" size="icon" onClick={() => setDeleteConfirmId(s.id)} className="h-8 w-8 rounded-lg border-red-100 text-red-600 hover:bg-red-50">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Description Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-3xl">
          <div className="bg-[#F8FAFC] border-b border-slate-100 p-6">
            <DialogTitle className="text-2xl font-extrabold text-[#111827] tracking-tight">Redaguoti prenumeratorių</DialogTitle>
          </div>
          {editingSub && (
            <form onSubmit={handleEditSave} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">El. Paštas</Label>
                <Input value={editingSub.email} disabled className="h-12 rounded-xl bg-slate-50 border-slate-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes" className="text-xs font-bold uppercase tracking-wider text-slate-500">Aprašymas / Pastabos</Label>
                <textarea 
                  id="edit-notes" 
                  name="notes" 
                  defaultValue={editingSub.notes}
                  className="w-full min-h-[120px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
                />
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                 <Button type="submit" className="w-full bg-[#111827] hover:bg-[#1E3A8A] text-white h-12 rounded-xl font-bold transition-all">
                    Išsaugoti pastabas
                 </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
