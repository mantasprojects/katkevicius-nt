"use client";

import { TrendingUp, FileText, Camera, ArrowRight, ShieldCheck, CheckCircle2, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PardavimasClient() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } },
    viewport: { once: true }
  };

  const stagger = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1, transition: { staggerChildren: 0.2 } },
    viewport: { once: true }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-950 overflow-hidden">
      
      {/* Dynamic BG Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      {/* Hero */}
      <section className="relative pt-36 pb-24 z-10 bg-white border-b border-slate-100">
        <div className="container px-4 mx-auto max-w-5xl text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold uppercase tracking-wider text-primary mb-6"
          >Maksimali Turto Vertė</motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-sans font-black mb-6 tracking-tight leading-[1.1] text-slate-950"
          >Aiški strategija, stipri<br/>
            <span className="text-primary italic">prezentacija</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed mb-10 text-balance"
          >Ne vien skelbimas portaluose, bet ir profesionaliai valdoma pardavimo sistema. Didesnis susidomėjimas ir maksimaliai palankios sandorio sąlygos.</motion.p>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-primary mb-1">6 sav.</div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Vid. Pardavimo laikas</div>
            </div>
            <div className="text-center border-l border-slate-100">
              <div className="text-3xl md:text-4xl font-black text-primary mb-1">98%</div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Sėkmingi sandoriai</div>
            </div>
            <div className="text-center border-l col-span-2 md:col-span-1 md:border-l border-slate-100 pt-4 md:pt-0">
              <div className="text-3xl md:text-4xl font-black text-primary mb-1">100+</div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Laimingi klientai</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Strategy */}
      <section className="py-24 relative z-10 bg-slate-50">
        <div className="container px-4 mx-auto max-w-6xl">
          <motion.div {...fadeInUp} className="text-center mb-16 px-4">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-slate-950">Kaip pasiekiame maksimalią kainą?</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base">Rinkodaros efektyvumą didina tikslingi įrankiai ir teisinės derybų žinios.</p>
          </motion.div>

          {/* Bento Grid layout */}
          <motion.div 
            variants={stagger}
            whileInView="whileInView"
            initial="initial"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* 1. Big Feature - Presentation */}
            <motion.div variants={fadeInUp} className="md:col-span-8 bg-white border border-slate-100 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between h-[340px] md:h-96 group shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 group-hover:opacity-10 transition-opacity">
                <Camera className="absolute -top-10 -right-10 w-64 h-64 text-slate-950 rotate-12" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm"><Camera className="w-6 h-6 text-primary" /></div>
                <h3 className="text-2xl md:text-3xl font-extrabold mb-3 text-slate-950">Prezentacija be kompromisų</h3>
                <p className="text-slate-500 max-w-md leading-relaxed">Profesionalus apšvietimas, dronų kadrai, 3D turo skanavimas ir vizualiniai planai. Jūsų turtas kuria prabangos įspūdį nuo pat pirmo paspaudimo.</p>
              </div>
              <div className="flex gap-4 relative z-10 flex-wrap">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">Drone 4K</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">3D Turai</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">Home Staging</span>
              </div>
            </motion.div>

            {/* 2. Small Feature - Pricing */}
            <motion.div variants={fadeInUp} className="md:col-span-4 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center h-[340px] md:h-96 shadow-sm">
              <TrendingUp className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-slate-950">Tiksli kainodara</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">Analizuoju ne tik skelbimus, bet ir realius Registrų Centro sandorius jūsų kaimynystėje. Jokių spėlionių.</p>
              <div className="text-4xl font-black text-primary mt-auto">100% <span className="text-slate-950 text-lg font-bold">atitiktis</span></div>
            </motion.div>

            {/* 3. Small Feature - Safety */}
            <motion.div variants={fadeInUp} className="md:col-span-4 bg-white border border-slate-100 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center h-[340px] md:h-96 shadow-sm">
              <ShieldCheck className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-slate-950">Teisinis saugumas</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Dokumentų tikrinimas, areštų paieška, paveldėjimo niuansai. Sutvarkau viską iki galutinio parašo pas notarą.</p>
            </motion.div>

            {/* 4. Medium Feature - Target Marketing */}
            <motion.div variants={fadeInUp} className="md:col-span-8 bg-white border border-slate-100 rounded-3xl p-8 h-[340px] md:h-96 flex items-center justify-between gap-6 relative shadow-sm group">
              <div className="flex flex-col gap-4 max-w-md">
                <Zap className="w-12 h-12 text-amber-500" />
                <h3 className="text-2xl md:text-3xl font-bold text-slate-950">Skaitmeninė sklaida</h3>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed">Targeted (tikslinga) reklama socialiniuose tinkluose (FB, IG) ir Google Ads. Jūsų objektą mato tik tie, kurie domisi nekilnojamuoju turtu būtent dabar.</p>
              </div>
              <div className="absolute right-6 bottom-6 md:static flex flex-col bg-slate-50 border border-slate-100 p-4 rounded-2xl w-48 text-center rotate-3 hidden md:block">
                <div className="text-primary font-black text-3xl">TOP 1%</div>
                <div className="text-xs text-slate-400 font-bold">sklaidos efektyvumas</div>
                <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1 }} className="h-full bg-primary" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* CTA Footer Wrapper */}
          <motion.div {...fadeInUp} className="mt-20 text-center flex justify-center">
            <Link href="/konsultacija" className="w-full sm:w-auto">
              <Button size="lg" className="h-14 w-full px-8 text-base shadow-xl bg-primary hover:bg-slate-950 hover:text-white font-bold rounded-2xl transition-all">Sužinokite savo turto vertę nemokamai<ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
