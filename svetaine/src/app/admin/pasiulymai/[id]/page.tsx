"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Printer, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";

interface ProposalParams {
  params: Promise<{ id: string }>;
}

export default function EditProposalPage({ params }: ProposalParams) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Proposal State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [price, setPrice] = useState("");
  const [pricePerSqM, setPricePerSqM] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function fetchProposal() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .eq("id", id)
        .single();

      if (data && data.content_data) {
        const cd = data.content_data;
        setTitle(cd.title || "");
        setSubtitle(cd.subtitle || "");
        setPrice(cd.price || "");
        setPricePerSqM(cd.pricePerSqM || "");
        setDescription(cd.description || "");
        setSelectedPhotos(cd.selectedPhotos || []);
      }
      setLoading(false);
    }
    fetchProposal();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async () => {
    setIsSaving(true);
    const supabase = createClient();
    const proposalData = {
      title,
      subtitle,
      price,
      pricePerSqM,
      description,
      selectedPhotos
    };

    const { error } = await supabase.from('proposals').update({
      title: `Pasiūlymas: ${title}`,
      content_data: proposalData,
      updated_at: new Date().toISOString()
    }).eq('id', id);

    setIsSaving(false);
    if (error) {
      alert("Klaida išsaugant: " + error.message);
    } else {
      alert("Pasiūlymas atnaujintas sėkmingai!");
    }
  };



  if (loading) return <div className="p-10 text-center font-bold">Kraunama...</div>;

    // Config dynamic pages
  const pages: any[] = [
    { type: 'cover', content: selectedPhotos[0] },
  ];
  if (description) {
    pages.push({ type: 'text', content: description });
  }
  if (selectedPhotos && selectedPhotos.length > 1) {
    const list = selectedPhotos.slice(1);
    const chunkSize = 4;
    for (let i = 0; i < list.length; i += chunkSize) {
      pages.push({ type: 'gallery', content: list.slice(i, i + chunkSize) });
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 flex-col md:flex-row w-full font-sans print:bg-white print:h-auto print:block">
      
      {/* LEFT PANEL: EDITOR (HIDDEN ON PRINT) */}
      <div className="w-full md:w-[450px] lg:w-[500px] h-full bg-white border-r border-slate-200 flex flex-col shadow-2xl z-10 shrink-0 print:hidden overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <Button variant="ghost" onClick={() => router.back()} className="text-slate-500 hover:text-[#2563EB]">
            <ChevronLeft className="w-5 h-5 mr-1" /> Grįžti
          </Button>
          <div className="flex gap-2">
             <Button variant="outline" onClick={handleSave} disabled={isSaving}>
               <Save className="w-4 h-4 mr-2" /> Naujinti
             </Button>
             <Button className="bg-[#111827] text-white hover:bg-[#1E3A8A]" onClick={handlePrint}>
               <Printer className="w-4 h-4 mr-2" /> PDF / Spausdinti
             </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div>
            <h2 className="text-xl font-extrabold text-[#111827] mb-4">Pasiūlymo Nustatymai</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Antraštė</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 font-bold" />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Poraštė (Plotas, būklė)</Label>
                <Input value={subtitle} onChange={e => setSubtitle(e.target.value)} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kaina</Label>
                  <Input value={price} onChange={e => setPrice(e.target.value)} className="mt-1 font-bold text-[#2563EB]" />
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kvadratūra</Label>
                  <Input value={pricePerSqM} onChange={e => setPricePerSqM(e.target.value)} className="mt-1" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Cotas turinys (Aprašymas, Privalumai, Kita)</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} className="min-h-[400px] text-sm leading-relaxed" placeholder="Parduodamas naujos statybos..." />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: LIVE PDF PREVIEW / ACTUAL PRINT CONTAINER */}
      <div className="flex-1 h-full overflow-y-auto bg-slate-200/50 p-4 md:p-8 flex flex-col items-center print:p-0 print:bg-white print:block print:overflow-visible" pasiulymas-print-panel>
        <style>{`
          @media print {
            body * { visibility: hidden !important; }
            .pasiulymas-print-panel, .pasiulymas-print-panel * { visibility: visible !important; }
            .pasiulymas-print-panel {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              height: auto !important;
              background: white !important;
              z-index: 999999 !important;
              padding: 0 !important;
              margin: 0 !important;
            }
          }
        `}</style>
        
        {pages.map((page, index) => (
          <div key={index} className="w-[794px] shrink-0 h-[1123px] bg-white shadow-xl mb-8 relative flex flex-col print:shadow-none print:mb-0 print:break-after-page mx-auto print:w-full">
             <div className="h-2 w-full bg-[#2563EB] absolute top-0 left-0" />
             
             <div className="px-12 pt-12">
                <h1 className="text-xl font-extrabold text-[#111827] mb-1">{title || "Pavadinimas"}</h1>
                <p className="text-sm text-slate-600">{subtitle || "Poraštė"}</p>
                <p className="text-base font-extrabold text-[#2563EB] mt-1">{price || "0 €"} <span className="text-xs text-slate-500 font-normal">{pricePerSqM}</span></p>
             </div>

             <div className="flex-1 px-12 pt-8">
                {page.type === 'cover' && (
                   <div className="w-full h-[650px] relative overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                       {page.content ? (
                          <img src={page.content} className="w-full h-full object-cover" alt="Cover" />
                       ) : (
                          <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon className="w-20 h-20" /></div>
                       )}
                   </div>
                )}
                {page.type === 'text' && (
                   <div className="prose prose-slate max-w-none text-sm text-[#111827] whitespace-pre-wrap leading-relaxed">
                       {page.content}
                   </div>
                )}
                {page.type === 'gallery' && (
                   <div className="grid grid-cols-2 gap-4 h-[780px]">
                       {page.content.map((photo: any, i: any) => (
                          <div key={i} className="bg-slate-50 overflow-hidden border border-slate-100 h-[380px]">
                             <img src={photo} className="w-full h-full object-cover" alt="Galerija" />
                          </div>
                      ))}
                   </div>
                )}
             </div>

             <div className="w-full bg-[#f8f9fa] h-44 mt-auto flex flex-col justify-end">
                <div className="flex items-center justify-between px-12 py-6">
                   <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-slate-300 rounded overflow-hidden shadow-sm shrink-0">
                         <img src="/uploads/1773775458388-profilio.png" alt="Mantas" className="w-full h-full object-cover" />
                      </div>
                      <div>
                         <h3 className="text-lg font-bold text-[#111827]">Mantas Katkevičius</h3>
                         <p className="text-xs text-slate-500 mb-1">Jūsų NT partneris</p>
                         <p className="text-xs font-bold text-slate-700">+370 645 41892</p>
                         <p className="text-xs font-bold text-slate-700">info@katkevicius.lt</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <h2 className="text-xl font-extrabold tracking-tighter text-[#111827]">KATKEVIČIUS</h2>
                      <p className="text-[8px] font-bold tracking-widest uppercase text-slate-500 text-right">Real Estate</p>
                   </div>
                </div>
                <div className="w-full bg-[#111827] h-8 flex items-center justify-center text-white text-[9px] uppercase tracking-widest gap-2">
                   <span>katkevicius.lt</span>
                   <span className="opacity-40">|</span>
                   <span>Nr. 1</span>
                   <span className="opacity-40">|</span>
                   <span>Nekilnojamasis turtas</span>
                </div>
             </div>
          </div>
        ))}



      </div>

    </div>
  );
}
