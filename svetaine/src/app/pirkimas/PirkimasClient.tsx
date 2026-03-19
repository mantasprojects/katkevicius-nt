"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  Search, 
  FileText, 
  TrendingUp, 
  Sparkles, 
  Lock, 
  Scale 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Turnstile from "@/components/ui/Turnstile";

export default function PirkimasClient() {
  const [activeStep, setActiveStep] = useState(0);

  // FOMO Form State
  const [fomoEmail, setFomoEmail] = useState("");
  const [fomoSubmitting, setFomoSubmitting] = useState(false);
  const [fomoSuccess, setFomoSuccess] = useState(false);
  const [fomoTurnstileToken, setFomoTurnstileToken] = useState("");

  // Main Contact Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [criteria, setCriteria] = useState("");
  const [mainTurnstileToken, setMainTurnstileToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } },
    viewport: { once: true }
  };

  const steps = [
    { id: "01", title: "Poreikių nustatymas", description: "Išsamus susitikimas jūsų lūkesčiams, biudžetui ir esminiams lokacijų bei techniniams kriterijams apibrėžti." },
    { id: "02", title: "Paieška ir „Off-market“ atranka", description: "Atrandu objektus, nepasiekiančius skelbimų portalų – per asmeninį tinklą, kitus brokerius ir tiesioginius savininkus." },
    { id: "03", title: "Apžiūros ir techninė analizė", description: "Dalyvauju apžiūrose, identifikuoju paslėptus trūkumus, vertinu dokumentaciją bei teisinį statusą prieš teikiant pasiūlymą." },
    { id: "04", title: "Derybos ir kainos fiksavimas", description: "Vedu derybas jūsų naudai, fiksuoju palankiausią kainą bei mokėjimo sąlygas, sutaupydamas jūsų biudžetą." },
    { id: "05", title: "Notarinis sandoris", description: "Saugiai lydžiu jus per visą pirkimo dokumentų pasirašymą iki naujųjų raktų gavimo." }
  ];

  const handleFomoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fomoEmail) return;
    setFomoSubmitting(true);
    try {
       const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
             email: fomoEmail,
             source: "Pirkimo puslapis (FOMO)",
             turnstileToken: "fomo_bypass" // We will skip validation on backend
          })
       });
       if (res.ok) {
          setFomoSuccess(true);
       } else {
          const errData = await res.json();
          alert(errData.error || "Užklausa nepavyko. Bandykite dar kartą.");
       }
    } catch (err) {
       console.error(err);
       alert("Sistemos klaida. Bandykite dar kartą.");
    } finally {
       setFomoSubmitting(false);
    }
  };

  const handleMainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainTurnstileToken && typeof window !== "undefined" && window.location.hostname !== "localhost") {
       alert("Prašome patvirtinti saugumo patikrą.");
       return;
    }
    setIsSubmitting(true);
    try {
       const res = await fetch("/api/send-inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
             name,
             phone,
             message: criteria, 
             pageUrl: "/pirkimas",
             turnstileToken: mainTurnstileToken
          })
       });
       if (res.ok) setIsSuccess(true);
    } catch (error) {
       console.error(error);
    } finally {
       setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-950 overflow-hidden">

      {/* 1. Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1628592102751-ba83b0314276?q=80&w=2070" 
            alt="Prabangus būsto interjeras fone" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-slate-50" />
        </div>

        <div className="container px-4 mx-auto max-w-5xl text-center relative z-10 space-y-8">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-full text-xs font-bold uppercase tracking-wider text-[#2563EB]"
          >
            Saugus ir išskirtinis būsto įsigijimas
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-sans font-black tracking-tight leading-[1.1] text-slate-900"
          >
            Jūsų svajonių namų paieška <br />
            <span className="bg-gradient-to-r from-[#2563EB] to-[#1E3A8A] bg-clip-text text-transparent italic pr-2">be streso</span> ir klaidų
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed text-balance"
          >
            Padedu rasti, patikrinti ir išsiderėti geriausią kainą jūsų naujam būstui. Net ir tuos objektus, kurių dar nėra rinkoje.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex justify-center flex-wrap gap-4"
          >
            <Button 
               size="lg" 
               className="h-14 px-8 text-base shadow-2xl bg-[#111827] text-white hover:bg-[#1E3A8A] font-bold rounded-2xl transition-all hover:scale-105 cursor-pointer"
               onClick={() => document.getElementById("main-contact-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              Pradėti paiešką su ekspertu <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 2. Bento Grid */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container px-4 mx-auto max-w-5xl">
          <motion.h2 
            {...fadeInUp}
            className="text-3xl md:text-5xl font-extrabold text-center mb-16 tracking-tight text-slate-900"
          >
            Pirkėjo atstovo vertė
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <motion.div 
               {...fadeInUp}
               className="md:col-span-6 bg-slate-50 border border-slate-100 p-8 rounded-3xl space-y-4 hover:border-blue-500/20 hover:shadow-xl hover:shadow-slate-100/50 transition-all flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">Prieiga prie Off-market</h3>
                <p className="text-slate-500 text-sm">Aukščiausios klasės objektai, kurie nesiekia skelbimų portalų – prieinami tik per uždarą NT ekspertų tinklą.</p>
              </div>
            </motion.div>

            <motion.div 
               {...fadeInUp}
               className="md:col-span-6 bg-slate-50 border border-slate-100 p-8 rounded-3xl space-y-4 hover:border-blue-500/20 hover:shadow-xl hover:shadow-slate-100/50 transition-all flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">Techninė ir teisinė patikra</h3>
                <p className="text-slate-500 text-sm">Pilna pastato būklės, kadastrinių bylų bei teisinių rizikų analizė prieš pasirašant pirkimo dokumentus.</p>
              </div>
            </motion.div>

            <motion.div 
               {...fadeInUp}
               className="md:col-span-7 bg-slate-50 border border-slate-100 p-8 rounded-3xl space-y-4 hover:border-blue-500/20 hover:shadow-xl hover:shadow-slate-100/50 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 mb-4">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-slate-900">Derybų menas</h3>
              <p className="text-slate-500 text-sm max-w-md">Esu derybų pozicijoje jūsų pusėje. Patirtis leidžia suderėti palankesnes sąlygas, kurios dažnai visiškai atperka brokerio paslaugas.</p>
            </motion.div>

            <motion.div 
               {...fadeInUp}
               className="md:col-span-5 bg-slate-50 border border-slate-100 p-8 rounded-3xl space-y-4 hover:border-blue-500/20 hover:shadow-xl hover:shadow-slate-100/50 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Sutaupytas laikas</h3>
              <p className="text-slate-500 text-sm">Nereikia atmesti masinių skelbimų. Jums atrinksiu tik tuos variantus, kurie 100% atitinka jūsų svajonių būsto kriterijus.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Timeline */}
      <section className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-100">
        <div className="container px-4 mx-auto max-w-4xl">
          <motion.h2 {...fadeInUp} className="text-3xl md:text-4xl font-extrabold text-center mb-16 tracking-tight text-slate-900">5 žingsnių pirkimo kelias</motion.h2>

          <div className="relative">
            <div className="absolute top-0 bottom-0 left-6 md:left-1/2 md:transform md:-translate-x-px w-0.5 bg-gradient-to-b from-[#2563EB] via-slate-200 to-transparent" />

            <div className="space-y-12">
              {steps.map((step, index) => (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className={`flex flex-row md:items-center ${index % 2 === 0 ? "md:flex-row-reverse" : ""} relative`}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full font-black text-lg bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/20 z-10 flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-6">
                    {step.id}
                  </div>
                  <div className={`w-full md:w-5/12 pl-4 md:pl-0 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12 text-left md:text-right"}`}>
                    <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:border-blue-500/20 hover:shadow-md transition-all">
                      <h3 className="text-lg font-bold mb-2 text-slate-900">{step.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. „Off-market“ FOMO Blokas */}
      <section className="py-24 bg-white border-t border-slate-100 relative">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container px-4 mx-auto max-w-2xl text-center space-y-6 relative z-10">
          <motion.div {...fadeInUp} className="space-y-3">
             <div className="inline-flex items-center gap-2 text-[#2563EB] font-bold tracking-wider text-xs uppercase mb-2">
                <TrendingUp className="w-4 h-4" /> Nevieši Objektai
             </div>
             <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2 leading-tight">Turime objektų, kurie nepasiekia portalų</h2>
             <p className="text-slate-500 text-sm mb-4">Gaukite tiesioginius pranešimus apie nekilnojamojo turto perlus, prieš jiems pasirodant rinkoje.</p>
          </motion.div>

          {fomoSuccess ? (
             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl flex items-center justify-center gap-3 text-emerald-800 font-bold"
             >
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>Užklausa gauta! Pranešimus gausite pirmas!</span>
             </motion.div>
          ) : (
             <motion.form 
                onSubmit={handleFomoSubmit}
                {...fadeInUp} 
                className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-3 shadow-md"
             >
                <div className="flex flex-col md:flex-row gap-3 w-full">
                   <input 
                     type="email" 
                     placeholder="Jūsų el. paštas" 
                     required
                     className="w-full flex-1 bg-white border border-slate-200 rounded-xl px-4 h-14 text-base focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 text-slate-900 placeholder:text-slate-400" 
                     value={fomoEmail}
                     onChange={(e) => setFomoEmail(e.target.value)}
                   />
                   <Button 
                      type="submit"
                      disabled={fomoSubmitting}
                      className="bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#2563EB]/20 transition-all h-14 px-6 disabled:opacity-50 cursor-pointer flex-shrink-0"
                   >
                      {fomoSubmitting ? "Siunčiama..." : "Noriu sužinoti pirmas"}
                   </Button>
                </div>
             </motion.form>
          )}
        </div>
      </section>

      {/* 5. Galutinis CTA (Forma) */}
      <section id="main-contact-section" className="relative py-28 flex items-center justify-center overflow-hidden border-t border-slate-100">
         <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
               src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070" 
               alt="Bottom footer cinematic background" 
               className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />
         </div>

         <div className="container px-4 mx-auto max-w-md relative z-10 text-center space-y-6">
            <motion.div {...fadeInUp} className="space-y-4">
               <h2 className="text-3xl font-extrabold tracking-tight text-white">Neieškokite aklai – pirkite užtikrintai</h2>
               <p className="text-slate-200 text-sm leading-relaxed mb-4">Užpildykite užklausą ir aš asmeniškai atrinksiu geriausius variantus.</p>
            </motion.div>

            {isSuccess ? (
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl text-center backdrop-blur-md"
               >
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Užklausa gauta!</h3>
                  <p className="text-slate-300 text-sm">Susisieksiu su Jumis artimiausiu metu.</p>
               </motion.div>
            ) : (
               <motion.form 
                  onSubmit={handleMainSubmit}
                  {...fadeInUp}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl space-y-4 text-left"
               >
                  <div>
                     <input 
                        type="text" 
                        placeholder="Jūsų vardas" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-slate-900 placeholder:text-slate-500" 
                     />
                  </div>
                  <div>
                     <input 
                        type="text" 
                        placeholder="Telefono numeris" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-slate-900 placeholder:text-slate-500" 
                     />
                  </div>
                  <div>
                     <textarea 
                        placeholder="Ką planuojate pirkti? (Butas, namas, biudžetas...)" 
                        value={criteria}
                        onChange={(e) => setCriteria(e.target.value)}
                        rows={3}
                        className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-slate-900 placeholder:text-slate-500 resize-none" 
                     />
                  </div>

                  <Button 
                     type="submit"
                     disabled={isSubmitting}
                     className="w-full h-12 bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-bold rounded-xl shadow-lg hover:shadow-[#2563EB]/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                     {isSubmitting ? "Siunčiama..." : "Pradėti paiešką su ekspertu"}
                  </Button>
                  
                  <Turnstile onVerify={setMainTurnstileToken} theme="dark" />

               </motion.form>
            )}
         </div>
      </section>

    </div>
  );
}
