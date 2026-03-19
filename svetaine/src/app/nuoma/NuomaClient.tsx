"use client";

import { useState } from "react";
import { ShieldCheck, Scale, TrendingUp, Camera, Paintbrush, Heart, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import Turnstile from "@/components/ui/Turnstile";

export default function NuomaClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [errorHeader, setErrorHeader] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    // Matching contact form structure
    const inquiryData = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      property: formData.get("objectType") as string, // Maps to object type for better email display
      message: "Užklausa dėl nuomos administravimo",
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
      b_name: formData.get("b_name") as string,
      turnstileToken: turnstileToken,
    };

    try {
      setErrorHeader("");
      const res = await fetch("/api/send-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryData),
      });

      if (res.ok) {
        setIsSuccess(true);
        (e.target as HTMLFormElement).reset();
        setTurnstileToken("");
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        const errData = await res.json();
        setErrorHeader(errData.error || "Įvyko klaida. Bandykite dar kartą.");
      }
    } catch (err) {
      console.error("Klaida siunčiant užklausą:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } },
    viewport: { once: true }
  };

  const timelineSteps = [
    { title: "Objekto įvertinimas ir kaina", desc: "Atlieku rinkos analizę ir nustatau optimalią nuomos kainą." },
    { title: "Profesionalus paruošimas ir nuotraukos", desc: "Patarimai dėl patrauklumo ir profesionali fotosesija." },
    { title: "Masinė reklama portaluose", desc: "Reklama didžiuosiuose kanaluose bei socialiniuose tinkluose." },
    { title: "Kandidatų patikra ir apžiūros", desc: "Mokumo vertinimas ir gyvos apžiūros su interesantais." },
    { title: "Sutarties pasirašymas", desc: "Teisiškai saugios sutarties paruošimas ir turto perdavimas." }
  ];

  const safetyCards = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "Griežta nuomininkų atranka",
      desc: "Tikriname mokumą, reputaciją ir rekomendacijas. Jokių „atsitiktinių“ žmonių."
    },
    {
      icon: <Scale className="w-8 h-8 text-primary" />,
      title: "Teisinė apsauga",
      desc: "Paruošiame notarines nuomos sutartis, saugančias jūsų turtą ir pajamas."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Maksimali grąža",
      desc: "Profesionalus pateikimas leidžia nuomoti brangiau ir išvengti prastovų."
    }
  ];

  const extraServices = [
    { icon: <Paintbrush className="w-6 h-6" />, title: "Objekto paruošimas", desc: "Home-staging paslaugos didesniam patrauklumui." },
    { icon: <Camera className="w-6 h-6" />, title: "Profesionali fotografija", desc: "Nuotraukos, kurios pritraukia geriausius nuomininkus." },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Draudimo konsultacijos", desc: "Turto ir civilinės atsakomybės apsauga." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-950 overflow-hidden font-sans">

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with overlay */}
        <div 
          className="absolute inset-0 bg-[url('/images/hero-nuoma.png')] bg-cover bg-center"
          style={{ backgroundPosition: '50% 30%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-[#F8FAFC]" />

        <div className="container px-4 mx-auto max-w-7xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl backdrop-blur-md bg-white/80 border border-white/40 p-10 md:p-12 rounded-3xl shadow-2xl shadow-black/5"
          >
            <span className="inline-flex items-center px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold tracking-wider text-primary mb-6">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Išskirtinis valdymas
            </span>
            
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-[1.1] text-slate-900">
              Profesionalus NT nuomos valdymas ir ramybė jums
            </h1>
            
            <p className="text-lg text-slate-600 font-normal leading-relaxed mb-8">
              Padedu rasti patikimus nuomininkus, paruošiu teisiškai saugias sutartis ir užtikrinu, kad jūsų turtas neštų maksimalią grąžą be jokio streso.
            </p>

            <a href="#nuomos-forma">
              <Button className="h-14 px-8 bg-primary hover:bg-slate-900 text-white font-bold rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center gap-2 group">
                Išnuomoti turtą saugiai
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Saugumo Skydas */}
      <section className="py-24 relative z-10 bg-gradient-to-b from-[#F8FAFC] to-white">
        <div className="container px-4 mx-auto max-w-6xl">
          <motion.div 
            {...fadeInUp}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Saugumo skydas jūsų turtui</h2>
            <p className="text-slate-500">Mano tikslas – užtikrinti, kad nuoma būtų pelninga ir nekeltų rūpesčių.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {safetyCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0, transition: { delay: idx * 0.15, duration: 0.5 } }}
                viewport={{ once: true }}
                className="bg-white/70 backdrop-blur-sm border border-slate-100 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors group-hover:scale-105 transform">
                  <div className="group-hover:text-white transition-colors">
                    {card.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuomos Procesas (Timeline) */}
      <section className="py-24 bg-slate-50 relative z-10">
        <div className="container px-4 mx-auto max-w-4xl">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Nuomos procesas</h2>
            <p className="text-slate-500">Žingsniai link sėkmingo ir stabilaus pajamų šaltinio.</p>
          </motion.div>

          {/* Timeline Track */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 h-full w-0.5 bg-slate-200 z-0" />

            <div className="space-y-12 relative z-10">
              {timelineSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0, transition: { duration: 0.6 } }}
                  viewport={{ once: true }}
                  className={`flex flex-row md:items-center w-full ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} relative`}
                >
                  {/* Content Panel */}
                  <div className={`w-full md:w-1/2 pl-14 md:pl-0 ${idx % 2 === 0 ? 'md:pr-8 text-left md:text-right' : 'md:pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                      <h4 className="text-lg font-bold text-slate-900 mb-1">{step.title}</h4>
                      <p className="text-slate-500 text-sm">{step.desc}</p>
                    </div>
                  </div>

                  {/* Node Circle */}
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20 z-10 flex-shrink-0 absolute left-1 md:relative md:left-auto">
                    {idx + 1}
                  </div>

                  {/* Spacer for structure stiffness */}
                  <div className="hidden md:block w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pilnas Aptarnavimas */}
      <section className="py-24 bg-white relative z-10">
        <div className="container px-4 mx-auto max-w-5xl">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Mano papildoma vertė</h2>
            <p className="text-slate-500">Tai ne tik administravimas – tai pilnas ramybės paketas.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {extraServices.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.5 } }}
                viewport={{ once: true }}
                className="bg-[#F8FAFC] p-8 rounded-2xl border border-slate-100 flex items-start gap-4 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-primary flex-shrink-0">
                  {service.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">{service.title}</h4>
                  <p className="text-slate-500 text-sm">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA & Form */}
      <section id="nuomos-forma" className="py-24 bg-slate-900 text-white relative z-10 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>

        <div className="container px-4 mx-auto max-w-xl relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">Jūsų turtas nusipelnė geriausios priežiūros</h2>
            <p className="text-slate-400">Palikite užklausą ir aš susisieksiu su jumis per 24 valandas.</p>
          </motion.div>

          {isSuccess ? (
            <div className="bg-white text-slate-900 rounded-3xl p-10 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Užklausa gauta!</h3>
              <p className="text-slate-500 mb-6">Ačiū, susisieksiu su jumis artimiausiu metu.</p>
              <Button onClick={() => setIsSuccess(false)} variant="outline" className="border-slate-200">Siųsti kitą</Button>
            </div>
          ) : (
            <motion.form 
              {...fadeInUp}
              onSubmit={handleSubmit}
              className="bg-white text-slate-900 p-8 md:p-10 rounded-3xl shadow-xl space-y-5"
            >
              {errorHeader && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium">
                  ⚠️ {errorHeader}
                </div>
              )}

              {/* Honeypot */}
              <input type="text" name="b_name" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-400">Vardas</Label>
                <Input id="name" name="name" required className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white" placeholder="Jūsų vardas" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-slate-400">Tel. numeris</Label>
                <Input id="phone" name="phone" type="tel" required className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white" placeholder="+370 600 00000" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="objectType" className="text-xs font-bold uppercase tracking-wider text-slate-400">Objekto tipas</Label>
                <select 
                  id="objectType" 
                  name="objectType" 
                  required 
                  className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all appearance-none"
                >
                  <option value="">Pasirinkite...</option>
                  <option value="Butas">Butas</option>
                  <option value="Namas">Namas</option>
                  <option value="Komercinės">Komercinės</option>
                </select>
              </div>

              <Button 
                disabled={isSubmitting || (!turnstileToken && typeof window !== "undefined" && window.location.hostname !== "localhost")} 
                type="submit" 
                className="w-full h-14 text-base font-bold bg-primary hover:bg-slate-900 transition-all rounded-xl shadow-lg shadow-primary/10 mt-2"
              >
                {isSubmitting ? "Siunčiama..." : "Išnuomoti turtą saugiai"}
              </Button>

              <div className="flex justify-center mt-4">
                <Turnstile onVerify={setTurnstileToken} theme="light" />
              </div>

              <p className="text-center text-[11px] text-slate-400 font-medium">Paspausdami sutinkate su privatumo politika.</p>
            </motion.form>
          )}
        </div>
      </section>

    </div>
  );
}
