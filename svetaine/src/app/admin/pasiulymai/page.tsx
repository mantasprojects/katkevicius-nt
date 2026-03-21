"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { FileText, Calendar, Edit, Trash2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProposals() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('proposals')
        .select('*, properties(title, image)')
        .order('created_at', { ascending: false });

      if (data) {
        setProposals(data);
      }
      setLoading(false);
    }
    fetchProposals();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Ar tikrai norite ištrinti šį pasiūlymą?")) return;
    const supabase = createClient();
    await supabase.from('proposals').delete().eq('id', id);
    setProposals(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-2">Komerciniai Pasiūlymai</h1>
          <p className="text-slate-500 font-medium">Jūsų paruošti ir išsaugoti PDF pasiūlymai klientams.</p>
        </div>
        <Button onClick={() => window.location.href='/admin/nt-objektai'} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl h-11 px-6 shadow-lg shadow-blue-500/20">
          Naujas Pasiūlymas
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div></div>
      ) : proposals.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-500 font-medium bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <FileText className="w-16 h-16 text-slate-300 mb-4" />
          <p className="text-lg">Nėra išsaugotų pasiūlymų.</p>
          <p className="text-sm text-slate-400 mt-2">Eikite į "NT Objektai" ir prie objekto spauskite "Kurti pasiūlymą".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {proposals.map((proposal) => (
            <Link href={`/admin/pasiulymai/${proposal.id}`} key={proposal.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-[#BFDBFE] transition-all group flex flex-col cursor-pointer block">
              <div className="h-40 bg-slate-100 relative overflow-hidden">
                 {/* Thumbnail using the first selected photo from content_data, or property image fallback */}
                 {proposal.content_data?.selectedPhotos?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={proposal.content_data.selectedPhotos[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                 ) : (
                    <div className="flex h-full items-center justify-center text-slate-300"><FileText className="w-12 h-12" /></div>
                 )}
                 <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded text-[#2563EB] shadow-sm">
                   PDF
                 </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-extrabold text-[#111827] text-lg leading-tight mb-2 line-clamp-2">{proposal.title}</h3>
                <div className="flex items-center text-xs text-slate-500 mb-4">
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  {new Date(proposal.created_at).toLocaleDateString("lt-LT")}
                </div>
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex gap-2">
                     <span className="flex items-center gap-1 text-slate-600 font-bold text-xs hover:text-[#2563EB]">
                       <Edit className="w-4 h-4" /> Redaguoti
                     </span>
                   </div>
                   <div className="flex items-center gap-2">
                     <button onClick={(e) => handleDelete(proposal.id, e)} className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors">
                       <Trash2 className="w-4 h-4" />
                     </button>
                     <span className="p-1.5 text-slate-600 hover:text-[#2563EB] bg-slate-50 hover:bg-blue-50 rounded-lg transition-colors">
                       <Printer className="w-4 h-4" />
                     </span>
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
