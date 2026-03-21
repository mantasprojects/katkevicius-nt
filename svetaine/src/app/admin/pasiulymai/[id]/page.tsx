"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Printer, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";

interface ProposalParams {
  params: { id: string };
}

export default function EditProposalPage({ params }: ProposalParams) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Proposal State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [price, setPrice] = useState("");
  const [pricePerSqM, setPricePerSqM] = useState("");
  const [advantages, setAdvantages] = useState<string[]>([""]);
  const [mainInfo, setMainInfo] = useState<string[]>([""]);
  const [locationInfo, setLocationInfo] = useState<string[]>([""]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function fetchProposal() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .eq("id", params.id)
        .single();

      if (data && data.content_data) {
        const cd = data.content_data;
        setTitle(cd.title || "");
        setSubtitle(cd.subtitle || "");
        setPrice(cd.price || "");
        setPricePerSqM(cd.pricePerSqM || "");
        setDescription(cd.description || "");
        setAdvantages(cd.advantages && cd.advantages.length ? cd.advantages : [""]);
        setMainInfo(cd.mainInfo && cd.mainInfo.length ? cd.mainInfo : [""]);
        setLocationInfo(cd.locationInfo && cd.locationInfo.length ? cd.locationInfo : [""]);
        setSelectedPhotos(cd.selectedPhotos || []);
      }
      setLoading(false);
    }
    fetchProposal();
  }, [params.id]);

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
      advantages,
      mainInfo,
      locationInfo,
      selectedPhotos
    };

    const { error } = await supabase.from('proposals').update({
      title: `Pasiūlymas: ${title}`,
      content_data: proposalData,
      updated_at: new Date().toISOString()
    }).eq('id', params.id);

    setIsSaving(false);
    if (error) {
      alert("Klaida išsaugant: " + error.message);
    } else {
      alert("Pasiūlymas atnaujintas sėkmingai!");
    }
  };

  const updateArrayField = (setter: any, array: string[], index: number, value: string) => {
    const newArr = [...array];
    newArr[index] = value;
    setter(newArr);
  };

  const addArrayField = (setter: any, array: string[]) => {
    setter([...array, ""]);
  };

  const removeArrayField = (setter: any, array: string[], index: number) => {
    setter(array.filter((_, i) => i !== index));
  };

  if (loading) return <div className="p-10 text-center font-bold">Kraunama...</div>;

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
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Aprašymas</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} className="min-h-[120px]" placeholder="Parduodamas naujos statybos..." />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* DYNAMIC LISTS */}
          <div className="space-y-6">
            {/* PRIVALUMAI */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Privalumai</Label>
                <Button variant="ghost" size="sm" onClick={() => addArrayField(setAdvantages, advantages)} className="h-6 text-xs text-[#2563EB]"><Plus className="w-3 h-3 mr-1"/> Pridėti</Button>
              </div>
              <div className="space-y-2">
                {advantages.map((adv, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={adv} onChange={e => updateArrayField(setAdvantages, advantages, i, e.target.value)} className="text-sm" />
                    <Button variant="outline" size="icon" onClick={() => removeArrayField(setAdvantages, advantages, i)} className="shrink-0 text-red-500"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
            </div>

            {/* MAIN INFO */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pagrindinė Informacija</Label>
                <Button variant="ghost" size="sm" onClick={() => addArrayField(setMainInfo, mainInfo)} className="h-6 text-xs text-[#2563EB]"><Plus className="w-3 h-3 mr-1"/> Pridėti</Button>
              </div>
              <div className="space-y-2">
                {mainInfo.map((info, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={info} onChange={e => updateArrayField(setMainInfo, mainInfo, i, e.target.value)} className="text-sm" />
                    <Button variant="outline" size="icon" onClick={() => removeArrayField(setMainInfo, mainInfo, i)} className="shrink-0 text-red-500"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
            </div>

             {/* LOCATION */}
             <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vieta ir Susisiekimas</Label>
                <Button variant="ghost" size="sm" onClick={() => addArrayField(setLocationInfo, locationInfo)} className="h-6 text-xs text-[#2563EB]"><Plus className="w-3 h-3 mr-1"/> Pridėti</Button>
              </div>
              <div className="space-y-2">
                {locationInfo.map((loc, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={loc} onChange={e => updateArrayField(setLocationInfo, locationInfo, i, e.target.value)} className="text-sm" />
                    <Button variant="outline" size="icon" onClick={() => removeArrayField(setLocationInfo, locationInfo, i)} className="shrink-0 text-red-500"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: LIVE PDF PREVIEW / ACTUAL PRINT CONTAINER */}
      <div className="flex-1 h-full overflow-y-auto bg-slate-200/50 p-4 md:p-8 flex flex-col items-center print:p-0 print:bg-white print:block print:overflow-visible">
        
        {/* A4 PAGE 1: COVER */}
        <div className="w-full max-w-[794px] h-[1123px] bg-white shadow-xl mb-8 relative flex flex-col print:shadow-none print:mb-0 print:break-after-page mx-auto">
          <div className="h-2 w-full bg-red-600 absolute top-0 left-0" />
          
          <div className="flex-1 pt-12">
             <div className="w-full h-[500px] bg-slate-100 mb-8 relative overflow-hidden">
               {selectedPhotos[0] ? (
                 // eslint-disable-next-line @next/next/no-img-element
                 <img src={selectedPhotos[0]} className="w-full h-full object-cover" alt="Cover" />
               ) : (
                 <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon className="w-20 h-20" /></div>
               )}
             </div>

             <div className="px-12">
               <h1 className="text-3xl font-extrabold text-[#111827] mb-2">{title || "Pavadinimas"}</h1>
               <p className="text-lg text-slate-600 mb-6">{subtitle || "Poraštė"}</p>
               <div className="flex items-baseline gap-2">
                 <p className="text-2xl font-extrabold text-red-600">{price || "0 €"}</p>
                 <p className="text-slate-500">{pricePerSqM}</p>
               </div>
             </div>
          </div>

          <div className="w-full bg-[#f8f9fa] h-40 mt-auto flex flex-col justify-end">
            <div className="flex items-center justify-between px-12 py-6">
              <div className="flex items-center gap-6">
                 <div className="w-24 h-24 bg-slate-300 rounded overflow-hidden shadow-sm shrink-0">
                    <img src="/logo.png" alt="Mantas" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display='none'} />
                 </div>
                 <div>
                   <h3 className="text-2xl font-bold text-[#111827]">Mantas Katkevičius</h3>
                   <p className="text-slate-500 mb-2">Nekilnojamojo turto brokeris</p>
                   <p className="text-sm font-bold text-slate-700">+37064541892</p>
                   <p className="text-sm font-bold text-slate-700">info@katkevicius.lt</p>
                   <p className="text-sm font-bold text-red-600 mt-1">katkevicius.lt</p>
                 </div>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-extrabold tracking-tighter text-[#111827]">KATKEVIČIUS</h2>
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 text-right">Real Estate</p>
              </div>
            </div>
          </div>
        </div>

        {/* A4 PAGE 2: TEXT DETAILS */}
        <div className="w-full max-w-[794px] h-[1123px] bg-white shadow-xl mb-8 relative flex flex-col print:shadow-none print:mb-0 print:break-after-page mx-auto">
          <div className="h-2 w-full bg-red-600 absolute top-0 left-0" />
          
          <div className="px-12 pt-16 flex-1">
             <h1 className="text-2xl font-extrabold text-[#111827] mb-1">{title}</h1>
             <p className="text-slate-600 mb-4">{subtitle}</p>
             <p className="text-xl font-extrabold text-red-600 mb-12">{price} <span className="text-sm text-slate-500 font-normal">{pricePerSqM}</span></p>

             {description && (
               <div className="mb-8">
                 <p className="text-sm text-[#111827] whitespace-pre-line leading-relaxed">{description}</p>
               </div>
             )}

             <div className="w-full border-t border-slate-200 my-8"></div>

             {advantages.length > 0 && advantages[0] !== "" && (
               <div className="mb-8">
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Privalumai:</h3>
                 <ul className="list-disc pl-5 space-y-1">
                   {advantages.map((adv, i) => adv && <li key={i} className="text-sm text-[#111827]">{adv}</li>)}
                 </ul>
               </div>
             )}

             {mainInfo.length > 0 && mainInfo[0] !== "" && (
               <div className="mb-8">
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Pagrindinė Informacija:</h3>
                 <ul className="list-disc pl-5 space-y-1">
                   {mainInfo.map((info, i) => info && <li key={i} className="text-sm text-[#111827]">{info}</li>)}
                 </ul>
               </div>
             )}

             {locationInfo.length > 0 && locationInfo[0] !== "" && (
               <div className="mb-8">
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Vieta ir Susisiekimas:</h3>
                 <ul className="list-disc pl-5 space-y-1">
                   {locationInfo.map((loc, i) => loc && <li key={i} className="text-sm text-[#111827]">{loc}</li>)}
                 </ul>
               </div>
             )}
          </div>

          <div className="w-full bg-[#f8f9fa] h-40 mt-auto flex flex-col justify-end">
            <div className="flex items-center justify-between px-12 py-6">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-slate-300 rounded overflow-hidden shadow-sm shrink-0">
                    <img src="/logo.png" alt="Mantas" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display='none'} />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-[#111827]">Mantas Katkevičius</h3>
                   <p className="text-xs text-slate-500 mb-1">Nekilnojamojo turto brokeris</p>
                   <p className="text-xs font-bold text-slate-700">+37064541892</p>
                   <p className="text-xs font-bold text-slate-700">info@katkevicius.lt</p>
                 </div>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-extrabold tracking-tighter text-[#111827]">KATKEVIČIUS</h2>
                <p className="text-[8px] font-bold tracking-widest uppercase text-slate-500 text-right">Real Estate</p>
              </div>
            </div>
          </div>
        </div>

        {/* A4 PAGE 3: GALLERY GRID */}
        {selectedPhotos.length > 1 && (
          <div className="w-full max-w-[794px] h-[1123px] bg-white shadow-xl mb-8 relative flex flex-col print:shadow-none print:mb-0 print:break-after-page mx-auto">
            <div className="h-2 w-full bg-red-600 absolute top-0 left-0" />
            <div className="px-12 pt-16 flex-1">
              <div className="grid grid-cols-2 gap-4 h-[850px]">
                {selectedPhotos.slice(1, 7).map((photo, i) => (
                  <div key={i} className="bg-slate-100 overflow-hidden shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo} className="w-full h-full object-cover" alt={`Nuotrauka ${i+1}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full bg-[#f8f9fa] h-40 mt-auto flex flex-col justify-end">
              <div className="flex items-center justify-between px-12 py-6">
                <div className="flex flex-col text-left">
                  <h3 className="text-sm font-bold text-[#111827]">Mantas Katkevičius</h3>
                  <p className="text-xs text-red-600 font-bold">katkevicius.lt</p>
                </div>
                <div className="text-right">
                  <h2 className="text-lg font-extrabold tracking-tighter text-[#111827]">KATKEVIČIUS</h2>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
