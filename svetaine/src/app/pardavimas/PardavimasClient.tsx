"use client";

import { useState } from "react";
import { TrendingUp, FileText, Camera, ArrowRight, ShieldCheck, CheckCircle2, Award, Zap, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Turnstile from "@/components/ui/Turnstile";

export default function PardavimasClient() {
  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken && typeof window !== "undefined" && window.location.hostname !== "localhost") {
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
             phone: contact,
             message,
             pageUrl: "/pardavimas",
             turnstileToken
          })
       });
       if (res.ok) {
          setIsSuccess(true);
       }
    } catch (error) {
       console.error(error);
    } finally {
       setIsSubmitting(false);
    }
  };

  const steps = [
    { id: "01", title: "Objekto analizė ir kaina", description: "Atlieku tikslią rinkos kainų ir konkurentų analizę, nustatome maksimalią objekto starto vertę." },
    { id: "02", title: "Home staging ir paruošimas", description: "Subtiliais dizaino sprendimais padidiname patrauklumą ir sukuriame prabangos įspūdį nuo pirmo žvilgsnio." },
    { id: "03", title: "Maksimali sklaida (Ads)", description: "Targetuota Facebook, Instagram ir Google reklama nukreipiama tik į realiai būsto ieškančius pirkėjus." },
    { id: "04", title: "Derybos ir atranka", description: "Filtruoju skambučius, organizuoju apžiūras ir ginu Jūsų finansinius interesus derybų metu." },
    { id: "05", title: "Sėkmingas sandoris", description: "Sutvarkau visą dokumentaciją, pažymas bei lydžiu Jus iki sandorio užbaigimo pas notarą." }
  ];

  const features = [
    {
      title: "Profesionali fotografija",
      description: "Aukščiausios kokybės HDR kadrai, pabrėžiantys erdves ir šviesą.",
      icon: Camera,
      badge: "Cinematic"
    },
    {
      title: "Dronų kadrai (4K)",
      description: "Parodome infrastruktūrą, apylinkes ir sklypą iš paukščio skrydžio.",
      icon: Award,
      badge: "Aerial"
    },
    {
      title: "3D virtualūs turai",
      description: "Suteikiame galimybę lankytojui apžiūrėti būstą bet kuriuo paros metu.",
      icon: Eye,
      badge: "Interact"
    },
    {
      title: "Google & Meta Ads",
      description: "Nukreipiu srautą į tūkstančius tikslinių lankytojų vos per 24 valandas.",
      icon: Zap,
      badge: "Performance"
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } },
    viewport: { once: true }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white overflow-hidden">
      
      {/* 1. Cinematic Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Fixed/Parallax scaling */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070" 
            alt="Cinematic luxury setup" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/50 to-slate-900/90" />
        </div>

        <div className="container px-4 mx-auto max-w-5xl text-center relative z-10 space-y-8">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-slate-200"
          >
            Aukščiausias NT pardavimų standartas
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-sans font-black tracking-tight leading-[1.1]"
          >
            Parduokite turtą <br />
            <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent italic pr-2">brangiau</span> su strategija
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed text-balance"
          >
            Nuo profesionalaus Home Staging iki tikslinės skaitmeninės reklamos. Maksimali sandorio kaina ir nulis rūpesčio Jums.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex justify-center flex-wrap gap-4"
          >
            <Link href="/konsultacija" className="w-full sm:w-auto">
              <Button size="lg" className="h-14 px-8 text-base shadow-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-2xl transition-all hover:scale-105 cursor-pointer border border-white/20">
                Gauti nemokamą turto vertinimą <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator overlay */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 text-xs font-bold tracking-widest uppercase opacity-60">
           <span className="animate-pulse">Slinkite žemyn</span>
           <div className="w-1 h-12 bg-white/20 rounded-full relative overflow-hidden">
              <motion.div initial={{ y: -48 }} animate={{ y: 48 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-full h-full bg-white rounded-full" />
           </div>
        </div>
      </section>

      {/* 2. Stats Bar of Trust */}
      <section className="relative z-10 bg-black border-y border-white/5 py-12">
        <div className="container px-4 mx-auto max-w-5xl">
          <motion.div 
            {...fadeInUp}
            className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center"
          >
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-sans font-black bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">300+</div>
              <div className="text-xs text-slate-500 font-bold tracking-wider">Parduota objektų</div>
            </div>
            <div className="space-y-1 border-l border-white/10">
              <div className="text-4xl md:text-5xl font-sans font-black bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">21 d.</div>
              <div className="text-xs text-slate-500 font-bold tracking-wider">Vidutinis pardavimo laikas</div>
            </div>
            <div className="space-y-1 border-l border-white/10 col-span-2 md:col-span-1 pt-4 md:pt-0">
              <div className="text-4xl md:text-5xl font-sans font-black bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">+5%</div>
              <div className="text-xs text-slate-500 font-bold tracking-wider">Viršyta pradinė kaina</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Interactive Steps Timeline */}
      <section className="py-28 relative z-10 bg-slate-900 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 -left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container px-4 mx-auto max-w-6xl">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">5 žingsnių pardavimo strategija</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">Rinkodaros efektyvumą didina tikslingi įrankiai ir derybinis meistriškumas.</p>
          </motion.div>

          {/* Desktop Timeline using Tabs style interaction or sequential grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
             <div className="absolute top-8 left-0 right-0 h-0.5 bg-blue-500/20 hidden md:block" />
             
             {steps.map((step, idx) => (
                <motion.div 
                   key={idx}
                   custom={idx}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0, transition: { delay: idx * 0.15, duration: 0.6 } }}
                   viewport={{ once: true }}
                   onClick={() => setActiveStep(idx)}
                   className={`relative border border-white/5 p-6 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col items-center text-center group ${
                     activeStep === idx 
                        ? "bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/30 shadow-xl shadow-blue-500/[0.03]" 
                        : "hover:bg-white/[0.02] hover:border-white/10"
                   }`}
                >
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl mb-4 transition-all duration-300 ${
                     activeStep === idx ? "bg-blue-500 text-white shadow-xl shadow-blue-500/20" : "bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white"
                   }`}>
                      {step.id}
                   </div>
                   <h3 className={`font-bold text-base mb-2 transition-colors ${activeStep === idx ? "text-white" : "text-slate-200"}`}>{step.title}</h3>
                   <p className={`text-slate-400 text-xs leading-relaxed transition-opacity ${activeStep === idx ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
                      {step.description}
                   </p>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. Marketing Grid Power */}
      <section className="py-28 relative z-10 bg-white text-slate-900">
        <div className="container px-4 mx-auto max-w-6xl">
          <motion.div {...fadeInUp} className="text-center mb-16 px-4">
             <p className="text-blue-600 font-bold tracking-wider uppercase text-xs mb-2">Vizualinis Svoris</p>
             <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight">Kaip pasiekiame maksimalią kainą?</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                   <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05, translateY: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="bg-[#F8FAFC] border border-slate-100 p-8 rounded-2xl flex flex-col justify-between h-[280px] shadow-sm hover:shadow-xl hover:bg-white cursor-pointer group transition-all"
                   >
                      <div>
                         <div className="flex justify-between items-center mb-4">
                            <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                               <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] uppercase tracking-widest bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">{feat.badge}</span>
                         </div>
                         <h3 className="text-lg font-extrabold text-[#111827] mb-2">{feat.title}</h3>
                         <p className="text-slate-500 text-sm leading-relaxed">{feat.description}</p>
                      </div>
                      <div className="text-[#2563EB] text-xs font-bold items-center gap-1 flex opacity-0 group-hover:opacity-100 transition-opacity">
                         Sužinoti daugiau <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                   </motion.div>
                );
             })}
          </div>
        </div>
      </section>

      {/* 5. Custom CTA with Blur Glass form */}
      <section className="relative py-28 flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
               src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070" 
               alt="Bottom footer cinematic background" 
               className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/85" />
         </div>

         <div className="container px-4 mx-auto max-w-md relative z-10 text-center space-y-6">
            <motion.div {...fadeInUp} className="space-y-4">
               <h2 className="text-3xl font-extrabold tracking-tight text-white">Pasiruošę maksimaliam rezultatui?</h2>
               <p className="text-slate-300 text-sm leading-relaxed mb-4">Užpildykite užklausą ir gausite nemokamą turto vertinimą jau rytoj.</p>
            </motion.div>

            {isSuccess ? (
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl text-center"
               >
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Užklausa gauta!</h3>
                  <p className="text-slate-300 text-sm">Susisieksiu su Jumis artimiausiu metu.</p>
               </motion.div>
            ) : (
               <motion.form 
                  onSubmit={handleSubmit}
                  {...fadeInUp}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl space-y-4 text-left"
               >
                  <div>
                     <input 
                        type="text" 
                        placeholder="Jūsų vardas" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-11 bg-white/10 border border-white/5 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder:text-slate-500" 
                     />
                  </div>
                  <div>
                     <input 
                        type="text" 
                        placeholder="El. paštas arba telefonas" 
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="w-full h-11 bg-white/10 border border-white/5 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder:text-slate-500" 
                     />
                  </div>
                  <div>
                     <textarea 
                        placeholder="Žinutė / Komentaras (neprivaloma)" 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        className="w-full bg-white/10 border border-white/5 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder:text-slate-500 resize-none" 
                     />
                  </div>
                  
                  <Turnstile onVerify={setTurnstileToken} theme="dark" />

                  <Button 
                     type="submit"
                     disabled={isSubmitting}
                     className="w-full h-12 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-50"
                  >
                     {isSubmitting ? "Siunčiama..." : "Pradėkime šiandien"}
                  </Button>
               </motion.form>
            )}
         </div>
      </section>

    </div>
  );
}

