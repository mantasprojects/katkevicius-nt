"use client";

import { Users, FileKey, ShieldAlert, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NuomaClient() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } },
    viewport: { once: true }
  };

  const services = [
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "Nuomininkų atranka",
      description: "Grįsta pajamų, mokumo ir rekomendacijų analize. Atrenkami tik tie nuomininkai, kurie atitinka Jūsų standartus."
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-primary" />,
      title: "Teisinė bazė",
      description: "Aiškios ir detalios nuomos sutartys, apsaugančios savininką nuo žalos atvejo, vėluojančių mokėjimų ar netikėtų aplinkybių."
    },
    {
      icon: <FileKey className="w-6 h-6 text-primary" />,
      title: "Administravimas",
      description: "Priėmimo–perdavimo aktų, defektų registravimo ir sklandaus įsikraustymo bei išsikraustymo procesų kontrolė."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-950 overflow-hidden">
      
      {/* Dynamic BG Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/10 rounded-full blur-[120px]" />
      </div>

      {/* Hero */}
      <section className="relative pt-36 pb-24 z-10 bg-white border-b border-slate-100">
        <div className="container px-4 mx-auto max-w-4xl text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold uppercase tracking-wider text-primary mb-6"
          >Profesionalus Valdymas</motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-6xl font-sans font-black mb-6 tracking-tight leading-[1.1] text-slate-950"
          >Ilgalaikė nuoma<br/>
            <span className="text-primary italic">be rizikų ir rūpesčių</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed mb-10"
          >Patikima nuomininkų atranka ir profesionalus sutarčių administravimas. Jūsų investicija neša grąžą nuolat ir saugiai.</motion.p>
        </div>
      </section>

      {/* Services Breakdown */}
      <section className="py-24 relative z-10 bg-slate-50">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Column: Glass Cards List */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 md:order-1 relative space-y-6"
            >
              {services.map((service, index) => (
                <div 
                  key={index}
                  className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-start gap-4 hover:border-primary/40 transition-all group hover:shadow-md"
                >
                  <div className="mt-1 bg-primary/10 p-3 rounded-xl group-hover:bg-primary group-hover:text-slate-950 transition-colors">
                    {service.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-extrabold text-slate-950 mb-1">{service.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{service.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
            
            {/* Right Column: Features summary */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 md:order-2 flex flex-col justify-center"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                <ShieldCheck className="w-8 h-8 text-slate-950" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 mb-6 font-sans">Investicijų apsauga</h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-6">Buto perdavimas nuomininkams neturi reikšti nuolatinio streso. Mano siūloma sistema remiasi maksimaliu saugumu:</p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-slate-700 font-medium">Išsamus objektų marketingas tikslinėms grupėms</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-slate-700 font-medium">Rizikos faktorių įvertinimas prieš pasirašant sutartį</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-slate-700 font-medium">Saugus depozito ir garantijų valdymas</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-slate-700 font-medium">Nuolatinė pagalba bendraujant su nuomininkais</span>
                </li>
              </ul>

              <Link href="/konsultacija" className="w-full sm:w-auto">
                <Button className="h-14 w-full px-10 bg-primary hover:bg-slate-950 text-white font-bold rounded-2xl transition-all shadow-xl shadow-primary/10">Aptarti nuomos planą<ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
            
          </div>
        </div>
      </section>

    </div>
  );
}
