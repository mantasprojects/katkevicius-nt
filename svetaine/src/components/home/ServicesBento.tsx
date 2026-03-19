"use client";

import Link from "next/link";
import { LazyMotion, domMax, m } from "framer-motion";
import { ArrowRight, CheckCircle2, Zap, TrendingUp, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function ServicesBento() {
  return (
    <LazyMotion features={domMax}>
      <section className="py-32 relative z-10 bg-slate-50 border-b border-slate-100">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <m.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-black mb-4 text-slate-950 tracking-tight"
            >
              Teikiamos paslaugos
            </m.h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base">Aukščiausio lygio atstovavimas kiekviename nekilnojamojo turto etape.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 md:gap-8">
            {/* 1. NT Pardavimas */}
            <Link href="/pardavimas" className="md:col-span-2 md:row-span-2 group block relative">
              <m.div 
                whileHover={{ y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="bg-slate-950 transform-gpu rounded-[2rem] flex flex-col h-full hover:border-primary/40 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden"
              >
                <div className="absolute inset-0">
                   <Image src="/images/scandi_clean_light.png" alt="Pardavimas" fill priority={false} sizes="(max-width: 768px) 100vw, 66vw" className="object-cover group-hover:scale-105 transition-all duration-1000" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent md:bg-gradient-to-r md:from-slate-950/70 md:via-slate-950/30 md:to-transparent" />
                </div>

                <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end h-full text-white">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-primary transition-colors duration-500">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="inline-flex items-center gap-2 bg-primary/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
                    Populiariausia paslauga
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black mb-4 text-white tracking-tight">NT pardavimas</h3>
                  <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8 max-w-md">
                    Maksimali rinkos kaina per trumpą laiką. Stipri prezentacija, tikslinė sklaida ir profesionalus derybų valdymas jūsų ramybei.
                  </p>
                  <ul className="space-y-3 mb-8 text-white/70 text-sm font-medium">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Strateginis kainos nustatymas</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Profesionalus NT marketingas</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Saugus sandoris</li>
                  </ul>
                  <div className="flex items-center text-primary font-bold text-base mt-auto group-hover:gap-2 transition-all cursor-pointer">
                    Sužinoti daugiau<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </m.div>
            </Link>

            {/* 2. NT Pirkimas */}
            <Link href="/pirkimas" className="group block relative">
              <m.div 
                whileHover={{ y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white transform-gpu border border-slate-100/80 rounded-[2rem] p-8 flex flex-col h-full hover:border-primary/40 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/5 rounded-full blur-2xl -z-10" />
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                  <Zap className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-950 tracking-tight">NT pirkimas</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Apžiūrime tik lūkesčius atitinkančius objektus. Identifikuoju teisinę riziką ir sutaupau jūsų biudžetą derybose.
                </p>
                <div className="flex items-center text-primary font-bold text-sm mt-auto">
                  Sužinoti daugiau<ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </m.div>
            </Link>

            {/* 3. NT Nuoma */}
            <Link href="/nuoma" className="group block relative">
              <m.div 
                whileHover={{ y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white border border-slate-100/80 rounded-[2rem] p-8 flex flex-col h-full hover:border-primary/40 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400/5 rounded-full blur-2xl -z-10" />
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-950 tracking-tight">NT nuoma</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Patikima nuomininkų atranka ir sklandus sutarčių administravimas. Apsaugokite savo investiciją nuo rizikų.
                </p>
                <div className="flex items-center text-emerald-600 font-bold text-sm mt-auto">
                  Sužinoti daugiau<ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </m.div>
            </Link>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
