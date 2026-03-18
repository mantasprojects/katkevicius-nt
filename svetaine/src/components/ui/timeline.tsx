"use client";

import { Wrench, Tag, Camera, Handshake, FileCheck, PenTool, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

const TIMELINE_STEPS = [
  { 
    icon: Wrench, 
    title: "Būsto paruošimas", 
    description: "Erdvės paruošimas pardavimui – pagal poreikį organizuojame smulkius remonto ar valymo darbus, kad Jūsų turtas atrodytų nepriekaištingai." 
  },
  { 
    icon: Tag, 
    title: "Kainos strategija", 
    description: "Tikslingas vertės nustatymas – konsultuojame kainodaros klausimais, remdamiesi realiais rinkos duomenimis, kad pasiektume maksimalų rezultatą." 
  },
  { 
    icon: Camera, 
    title: "Vizualinis pristatymas", 
    description: "Profesionalus estetikos kūrimas – užfiksuojame aukščiausios kokybės vaizdus, paruošiame unikalų skelbimą bei tikslingai valdome apžiūrų procesą." 
  },
  { 
    icon: Handshake, 
    title: "Sutarčių ruošimas", 
    description: "Teisinis dokumentų ruošimas – parengiame korektiškas preliminariąsias pirkimo–pardavimo sutartis, apsaugančias Jūsų interesus." 
  },
  { 
    icon: FileCheck, 
    title: "Dokumentacijos valdymas", 
    description: "Klientų ir turto dokumentai – koordinuojame abiejų šalių dokumentų tvarkymą bei operatyviai surenkame reikiamas pažymas." 
  },
  { 
    icon: PenTool, 
    title: "Sandorio užbaigimas", 
    description: "Notarinis tvirtinimas – suorganizuojame sklandų vizitą pas notarą bei užtikriname galutinį, saugų sandorio pasirašymą." 
  }
];

export default function ProcessTimeline({ dark = false }: { dark?: boolean }) {
  return (
    <section className={cn("py-24 bg-white relative overflow-hidden", dark && "bg-slate-950 text-white border-y border-white/5")}>
      <div className="container px-4 mx-auto max-w-7xl">
        
        <div className="mb-20">
          <FadeIn>
            <h2 className={cn("text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-center text-[#111827] tracking-tight", dark && "text-white")}>
              Kodėl vertėtų rinktis mus?
            </h2>
            <p className={cn("text-slate-600 max-w-4xl mx-auto text-center mt-6 text-base md:text-lg font-medium leading-relaxed", dark && "text-slate-300")}>
              Už kiekvieno sklandaus sandorio stovi ne vienas žmogus, o aiškiai dirbanti komanda. Sujungiame rinkos žinias, teisines kompetencijas ir rinkodaros sprendimus, kad procesas vyktų sklandžiai.
            </p>
          </FadeIn>
        </div>

        {/* Timeline Desktop */}
        <div className="hidden lg:block relative mt-16 mb-24">
          <StaggerContainer className="grid grid-cols-3 gap-8 relative z-10">
            {TIMELINE_STEPS.map((step, index) => {
              const stepNumber = (index + 1).toString().padStart(2, '0');
              return (
                <StaggerItem key={index} className="group h-full">
                  <div className={cn(
                    "bg-white/90 backdrop-blur-md rounded-[32px] p-8 border border-slate-100 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden h-full group",
                    dark && "bg-white/5 border-white/5 shadow-none hover:border-primary/40 hover:bg-white/10"
                  )}>
                    <div className={cn("absolute -bottom-6 -right-4 text-9xl font-black text-slate-50 select-none group-hover:text-blue-500/5 transition-colors duration-500 font-sans", dark && "text-white/5")}>
                      {stepNumber}
                    </div>

                    <div className={cn("w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100/60 rounded-3xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500", dark && "from-white/10 to-white/5")}>
                      <step.icon className={cn("w-9 h-9 text-[#111827]", dark && "text-primary")} />
                    </div>

                    <div className="flex-grow flex flex-col items-center relative z-10">
                      <h3 className={cn("text-xl font-bold text-slate-950 mb-3 group-hover:text-blue-600 transition-colors leading-snug tracking-tight", dark && "text-white group-hover:text-primary")}>
                        {step.title}
                      </h3>
                      <p className={cn("text-base font-medium text-slate-500 leading-relaxed px-2", dark && "text-slate-400")}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Timeline Mobile / Tablet */}
        <div className="lg:hidden relative mt-12 mb-20 space-y-4">
          <StaggerContainer className="grid gap-4">
            {TIMELINE_STEPS.map((step, index) => {
              const stepNumber = (index + 1).toString().padStart(2, '0');
              return (
                <StaggerItem key={index} className="group">
                  <div className={cn(
                    "bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] hover:shadow-xl hover:shadow-[#1E3A8A]/5 hover:border-[#1E3A8A]/10 transition-all duration-300 flex items-start gap-4 relative overflow-hidden",
                    dark && "bg-white/5 backdrop-blur-md border-white/10 shadow-none hover:border-primary/40 hover:bg-white/10"
                  )}>
                    <div className={cn("absolute -bottom-4 -right-2 text-7xl font-black text-slate-50/70 select-none group-hover:text-[#1E3A8A]/5 transition-colors duration-300 font-sans", dark && "text-white/5")}>
                      {stepNumber}
                    </div>

                    <div className="flex-shrink-0 flex flex-col items-center relative z-10">
                      <div className={cn("w-14 h-14 bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300", dark && "from-white/10 to-white/5")}>
                        <step.icon className={cn("w-6 h-6 text-[#1E3A8A]", dark && "text-primary")} />
                      </div>
                    </div>

                    <div className="flex-grow pt-1 relative z-10">
                      <h3 className={cn("text-lg font-black text-slate-900 mb-1 group-hover:text-[#1E3A8A] transition-colors leading-snug", dark && "text-white group-hover:text-primary")}>
                        {step.title}
                      </h3>
                      <p className={cn("text-sm font-semibold text-slate-500 leading-relaxed", dark && "text-slate-400")}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        <div className="text-center mt-12 flex justify-center">
          <FadeIn delay={0.4} className="w-full sm:w-auto">
            <Link href="/konsultacija" className="w-full sm:w-auto">
              <Button size="lg" className={cn("h-16 w-full px-12 text-lg shadow-xl shadow-blue-500/20 bg-blue-600 hover:bg-[#111827] text-white font-bold rounded-2xl transition-all hover:-translate-y-1", dark && "shadow-primary/10 bg-primary hover:bg-white hover:text-slate-950 text-slate-950 px-12 rounded-2xl")}>
                Pradėkime jūsų turto pardavimą <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}
