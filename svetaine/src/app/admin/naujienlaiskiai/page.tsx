"use client";

import { useState, useEffect } from "react";
import { Mail, Search, Trash2, Check, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";

interface Subscriber {
  id: string;
  email: string;
  source: string;
  date: string;
}

export default function AdminSubscribersPage() {
  const supabase = createClient();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const loadSubscribers = async () => {
      try {
        // 1. Fetch from primary table 'naujienlaiskiai'
        const { data: pData, error: pError } = await supabase
          .from('naujienlaiskiai')
          .select('*')
          .order('sukuriama_data', { ascending: false });

        let mappedPrimary: Subscriber[] = [];
        if (pData) {
          mappedPrimary = pData.map((s: any) => ({
            id: s.id,
            email: s.email,
            source: s.saltinis || "—",
            date: s.sukuriama_data ? s.sukuriama_data.split('T')[0] : "—"
          }));
        }

        // 2. Fetch from backup 'crm_kontaktai' just in case
        const { data: bData } = await supabase
          .from('crm_kontaktai')
          .select('*')
          .filter('zinute', 'ilike', '%[Naujienlaiškis]%')
          .order('created_at', { ascending: false });

        let mappedBackup: Subscriber[] = [];
        if (bData) {
          mappedBackup = bData.map((s: any) => {
             const email = s.email && s.email !== '—' ? s.email : s.zinute?.match(/Naujienlaiškis: ([\w\.-]+@[\w\.-]+)/)?.[1] || s.email;
             return {
                id: s.id,
                email: email || "—",
                source: "Pirkimas (Backup)",
                date: s.created_at ? s.created_at.split('T')[0] : "—"
             };
          });
        }

        // Combine and de-duplicate by email
        const combined = [...mappedPrimary, ...mappedBackup];
        const uniqueEmails = new Set();
        const deduplicated = combined.filter(item => {
           if (!item.email || item.email === '—') return true; // keep empty just in case
           if (uniqueEmails.has(item.email.toLowerCase())) return false;
           uniqueEmails.add(item.email.toLowerCase());
           return true;
        });

        setSubscribers(deduplicated);
      } catch (err) {
        console.error("Failed to load subscribers:", err);
      }
    };
    loadSubscribers();
  }, []);

  const handleDelete = async (id: string, source: string) => {
    try {
      if (source.includes("Backup")) {
         await supabase.from('crm_kontaktai').delete().eq('id', id);
      } else {
         await supabase.from('naujienlaiskiai').delete().eq('id', id);
      }
      setSubscribers(prev => prev.filter(s => s.id !== id));
    } catch (err) { console.error(err); }
    setDeleteConfirmId(null);
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.source.toLowerCase().includes(searchQuery.toLowerCase())
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
          <p className="text-slate-500 font-medium">Valdykite naujienlaiškių prenumeratorius ir el. pašto kontaktus.</p>
        </div>
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
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-white border-b border-slate-200">
                <th className="py-4 px-6 font-bold text-slate-500 tracking-wider text-xs">El. paštas</th>
                <th className="py-4 px-6 font-bold text-slate-500 tracking-wider text-xs">Šaltinis</th>
                <th className="py-4 px-6 font-bold text-slate-500 tracking-wider text-xs">Data</th>
                <th className="py-4 px-6 font-bold text-slate-500 tracking-wider text-xs text-right">Veiksmai</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="py-5 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold mr-3 flex-shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <p className="text-[#111827] font-bold">{s.email}</p>
                    </div>
                  </td>
                  <td className="py-5 px-6 font-medium text-slate-600 text-sm">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                       {s.source}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-sm text-slate-500">
                    {s.date}
                  </td>
                  <td className="py-5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {deleteConfirmId === s.id ? (
                        <>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(s.id, s.source)} className="h-9 w-9 rounded-lg border-red-200 bg-red-50 text-red-600 hover:bg-red-100">
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => setDeleteConfirmId(null)} className="h-9 w-9 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-100">
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" size="icon" onClick={() => setDeleteConfirmId(s.id)} className="h-9 w-9 rounded-lg border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSubscribers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-slate-500">
                    <Mail className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                    <p className="text-lg font-medium text-[#111827]">Prenumeratorių nerasta</p>
                    <p className="text-sm">Bandykite keisti paieškos kriterijus.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
