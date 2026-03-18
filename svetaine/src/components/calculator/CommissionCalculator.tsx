"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowRight, PiggyBank, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const formatNumber = (num: number) => {
  return num.toLocaleString("lt-LT").replace(/\u202F|\u00A0|\s/g, "\u00A0");
};


export default function CommissionCalculator({ dark = false }: { dark?: boolean }) {
  const [propertyPrice, setPropertyPrice] = useState<number>(150000);

  // Skaiciavimai
  const standardCommissionRate = 0.03; // 3%
  const myCommissionRate = 0.0189; // 1.89%

  const rawStandardFee = propertyPrice * standardCommissionRate;
  const standardFee = Math.max(3000, rawStandardFee);
  
  const rawMyFee = propertyPrice * myCommissionRate;
  const myFee = Math.max(2000, rawMyFee);
  const savings = standardFee - myFee;

  return (
    <section className={cn("py-24 bg-white border-y border-slate-100 overflow-hidden relative", dark && "bg-slate-950 text-white border-y border-white/5")}>
      {/* Dekoracijos */}
      <div className={cn("absolute top-0 right-0 w-[800px] h-[800px] bg-[#F8FAFC] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none", dark && "bg-primary/5")} />
      <div className={cn("absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#DBEAFE]/30 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/3 pointer-events-none", dark && "bg-primary/5")} />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Tekstas */}
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={cn("inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-primary font-bold text-xs uppercase tracking-widest mb-8 border border-blue-100 shadow-sm", dark && "bg-white/10 border-white/10")}
            >
              <Calculator className="w-4 h-4 mr-2" />Skaidri Kainodara</motion.div>
            <h2 className={cn("text-4xl md:text-6xl font-sans font-extrabold text-slate-950 mb-8 leading-[1.1] tracking-tight", dark && "text-white")}>Kiek sutaupysite <br/><span className="text-primary italic">pasirinkę mus?</span>
            </h2>
            <p className={cn("text-slate-500 text-xl mb-10 leading-relaxed font-medium", dark && "text-slate-300")}>Tradicinės agentūros dažnai prašo 3% ar didesnio komisinio mokesčio. Mes siūlome kur kas efektyvesnį ir skaidresnį modelį (nuo 1.89%).</p>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {[
                { title: "Skaidrumas", desc: "Aiški kainodara be jokių paslėptų mokesčių" },
                { title: "Rinkodara", desc: "Profesionalus objekto pristatymas ir tikslinė sklaida" },
                { title: "Saugumas", desc: "Užtikrintas teisinis saugumas kiekviename etape" },
                { title: "Strategija", desc: "Nuoseklus proceso valdymas iki sėkmingo rezultato" }
              ].map((item, i) => (
                <li key={i} className="flex flex-col gap-1">
                  <div className={cn("flex items-center text-slate-900 font-bold text-lg mb-1", dark && "text-white")}>
                    <CheckCircle2 className="w-5 h-5 text-primary mr-3" />
                    {item.title}
                  </div>
                  <p className={cn("text-slate-500 text-sm font-medium pl-8", dark && "text-slate-400")}>{item.desc}</p>
                </li>
              ))}
            </ul>

            <Link href="/konsultacija" className="w-full sm:w-auto">
              <Button size="lg" className={cn("h-16 w-full px-10 text-lg shadow-2xl shadow-primary/20 font-extrabold rounded-2xl bg-primary hover:bg-slate-950 transition-all duration-500 hover:-translate-y-1", dark && "bg-primary hover:bg-white hover:text-slate-950 text-slate-950 font-bold shadow-primary/10")}>Parduokime jūsų turtą<ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
          </div>

          {/* Skaiciuokle */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={cn("bg-white rounded-[3rem] premium-shadow border border-slate-100 p-8 md:p-12 relative overflow-hidden group", dark && "bg-white/5 border-white/10 shadow-none backdrop-blur-md")}
          >
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-primary to-blue-400" />
            
            <div className="mb-12">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                <div>
                  <h3 className={cn("font-extrabold text-slate-950 text-2xl tracking-tight mb-1", dark && "text-white")}>Turto vertė</h3>
                  <p className={cn("text-slate-500 font-medium", dark && "text-slate-400")}>Pasirinkite numatomą pardavimo kainą</p>
                </div>
                <div className="text-4xl font-black text-primary tracking-wide tabular-nums drop-shadow-sm whitespace-nowrap">
                  € {formatNumber(propertyPrice)}
                </div>


              </div>
              
              <div className="relative pt-6 pb-2 px-3">
                <input 
                  type="range" 
                  min="50000" 
                  max="1000000" 
                  step="5000" 
                  value={propertyPrice} 
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  className="w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-110 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:shadow-lg transition-all shadow-inner"
                  style={{
                    background: `linear-gradient(to right, #2563EB ${(propertyPrice - 50000) / (1000000 - 50000) * 100}%, #f1f5f9 ${(propertyPrice - 50000) / (1000000 - 50000) * 100}%)`
                  }}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className={cn("flex justify-between items-center p-6 rounded-3xl bg-slate-50/50 border border-slate-100 group-hover:bg-slate-50 transition-colors", dark && "bg-white/5 border-white/5 group-hover:bg-white/10")}>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Tradicinės Agentūros (3%)</p>
                  <p className="font-sans text-2xl font-bold text-slate-400 flex items-baseline gap-2 tracking-wide">
                    <span className="line-through decoration-red-500/30 decoration-2">€ {formatNumber(standardFee)}</span>
                    <span className="text-xs font-bold opacity-60">+PVM</span>
                  </p>
                </div>
              </div>

              <div 
                className={cn("flex justify-between items-center p-8 rounded-[2rem] bg-slate-950 shadow-2xl shadow-slate-950/20", dark && "bg-primary shadow-primary/10")}
              >
                <div>
                  <p className={cn("text-[10px] font-black text-blue-400 uppercase tracking-[0.15em] mb-3", dark && "text-slate-950")}>Mūsų Mokestis (nuo 1.89%)</p>
                  <p className={cn("font-sans text-4xl font-black text-white flex items-baseline gap-2 tabular-nums tracking-wide whitespace-nowrap", dark && "text-slate-950")}>
                    €{formatNumber(myFee)} <span className={cn("text-sm font-bold text-slate-400 tracking-normal", dark && "text-slate-950/60")}>+PVM</span>
                  </p>
                </div>
              </div>
            </div>

            <div className={cn("mt-10 pt-10 border-t border-slate-100 flex items-center justify-between", dark && "border-white/10")}>
              <div className="flex items-center">
                <div className={cn("w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mr-6 shadow-sm border border-emerald-100", dark && "bg-emerald-500/10 border-emerald-500/20 text-emerald-400")}>
                  <PiggyBank className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Sutaupoma suma</p>
                  <p 
                    className={cn("text-3xl font-black text-emerald-600 tracking-wide tabular-nums whitespace-nowrap", dark && "text-emerald-400")}
                  >
                    €{formatNumber(savings)}
                  </p>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
