"use client";

import { ShieldCheck, CheckCircle2, ArrowRight, Eye, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PirkimasClient() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } },
    viewport: { once: true }
  };

  const steps = [
    {
      number: "01",
      title: "Poreikių analizė",
      description: "Susitinkame išsiaiškinti Jūsų lūkesčius, galimybes ir esminius kriterijus bei pradedame kryptingą paiešką.",
      icon: <Search className="w-6 h-6 text-primary" />
    },
    {
      number: "02",
      title: "Objektų atrinkimas",
      description: "Atrinkti objektai rinkoje pristatomi sistemizuotai. Apžiūrų metu akcentuoju pliusus bei minusus.",
      icon: <Eye className="w-6 h-6 text-primary" />
    },
    {
      number: "03",
      title: "Derybos ir dokumentai",
      description: "Užtikrinu profesionalias derybas, teisiškai įvertinu sutartis ir paruošiu dokumentus saugiam notariniam sandoriui.",
      icon: <FileText className="w-6 h-6 text-primary" />
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-950 overflow-hidden">
      
      {/* Dynamic BG Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      {/* Hero */}
      <section className="relative pt-36 pb-24 z-10 bg-white border-b border-slate-100">
        <div className="container px-4 mx-auto max-w-5xl text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold uppercase tracking-wider text-primary mb-6"
          >Saugus būsto įsigijimas</motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-sans font-black mb-6 tracking-tight leading-[1.1] text-slate-950"
          >Nuo paieškos iki sandorio<br/>
            <span className="text-primary italic">ramiai ir užtikrintai</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed mb-10 text-balance"
          >Mano, kaip Jūsų atstovo, tikslas – suderinti Jūsų poreikius su rinkos galimybėmis, identifikuoti rizikas ir užtikrinti maksimaliai palankias sąlygas.</motion.p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 relative z-10 bg-slate-50">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left: Interactive Timeline column */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <motion.h2 {...fadeInUp} className="text-3xl md:text-4xl font-extrabold mb-12 text-slate-950">Pirkimo procesas</motion.h2>

              <div className="space-y-12 relative">
                {/* Vertical Connector Line */}
                <div className="absolute top-4 left-6 h-[calc(100%-40px)] w-0.5 border-l-2 border-dashed border-primary/30 z-0" />
                
                {steps.map((step, index) => (
                  <motion.div 
                    key={step.number}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="flex gap-6 relative z-10 group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                      {step.number}
                    </div>
                    <div className="flex flex-col bg-white border border-slate-100 p-6 rounded-2xl hover:border-primary/40 transition-all flex-1 shadow-sm hover:shadow-md">
                      <div className="flex items-center gap-3 mb-2">
                        {step.icon}
                        <h3 className="text-xl font-bold text-slate-950">{step.title}</h3>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Guarantee Card Column */}
            <motion.div 
              {...fadeInUp}
              className="lg:col-span-5 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-8 md:p-10 flex flex-col h-full justify-center shadow-lg backdrop-blur-md"
            >
              <ShieldCheck className="w-14 h-14 text-primary mb-6" />
              <h3 className="text-2xl font-bold text-slate-950 mb-4">Mano vertė Jums</h3>
              
              <div className="space-y-5 mb-8 flex-1">
                <div className="flex items-start gap-3 group">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <p className="text-slate-700 font-medium">Sutaupysite laiko apžiūrint tik lūkesčius atitinkančius objektus.</p>
                </div>
                <div className="flex items-start gap-3 group">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <p className="text-slate-700 font-medium">Identifikuoti paslėpti trūkumai ar teisinės rizikos objektuose.</p>
                </div>
                <div className="flex items-start gap-3 group">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <p className="text-slate-700 font-medium">Užtikrintos palankiausios pirkimo sąlygos derybose.</p>
                </div>
              </div>

              <Link href="/konsultacija" className="mt-8 w-full sm:w-auto">
                <Button className="w-full text-base h-14 bg-primary hover:bg-slate-950 text-white font-bold rounded-2xl transition-all shadow-xl shadow-primary/10">Pradėkime paiešką<ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
}
