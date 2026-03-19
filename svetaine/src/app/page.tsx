"use client";

import { useState, useEffect } from "react";
import { LazyMotion, domMax, m, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Star, Quote, CheckCircle2, Zap, TrendingUp, ShieldCheck } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import Image from "next/image";
import dynamic from "next/dynamic";

const CommissionCalculator = dynamic(() => import("@/components/calculator/CommissionCalculator"), { ssr: false });
const ProcessTimeline = dynamic(() => import("@/components/ui/timeline"), { ssr: false });
const TestimonialsGrid = dynamic(() => import("@/components/home/TestimonialsGrid"), { ssr: false });
const ArticlesGrid = dynamic(() => import("@/components/home/ArticlesGrid"), { ssr: false });
const ServicesBento = dynamic(() => import("@/components/home/ServicesBento"), { ssr: false });
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [index, setIndex] = useState(0);

  const images = [
    "/images/scandi_clean_light.png",
    "/images/hero_luxury_interior.png"
  ];

  useEffect(() => {
    setIsMounted(true);

    fetch("/api/blog")
      .then(res => res.json())
      .then(data => {
        const postsArray = Array.isArray(data) ? data : (data.posts || []);
        const published = postsArray.filter((p: any) => p.status === "published");
        setArticles(published.slice(0, 3));
      })
      .catch(err => console.error("Klaida kraunant straipsnius:", err));

    // Slider disabled
  }, []);

  

  return (
    <LazyMotion features={domMax}>
    <div className="flex flex-col min-h-screen bg-white text-slate-900 overflow-hidden">
      
      {/* Hero Section with Cinematic Slider */}
      <section className="relative min-h-[90vh] md:h-screen flex items-center justify-center overflow-hidden z-20 pt-12 pb-20 md:py-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
        {/* Cinematic Slider Background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-sky-100/30 rounded-full blur-3xl opacity-60" />
          
          {/* Subtle Bottom Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Integrated Spread Layout */}
        <div className="container px-4 mx-auto max-w-7xl relative z-10 flex flex-col md:flex-row items-center justify-between h-full pt-2 md:pt-16">
          {/* Left Content Side */}
          <m.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full md:w-6/12 flex flex-col items-start text-left relative z-10 mb-12 md:mb-0"
          >
            <h1 className="text-[2.75rem] md:text-6xl lg:text-7xl font-sans font-black mb-6 leading-[1.05] tracking-tight text-slate-950 drop-shadow-sm">
              Nuo paieškos <br />
              iki sandorio <br />
              ramiai ir <span className="text-primary italic">užtikrintai</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-md font-medium leading-relaxed drop-shadow-sm">
              Strateginis požiūris ir maksimali vertė jūsų nekilnojamajam turtui.
            </p>

            <Link href="/konsultacija" className="w-full sm:w-auto">
              <Button size="lg" className="h-14 w-full px-10 text-base shadow-2xl font-bold rounded-2xl bg-primary text-white hover:bg-slate-900 transition-all duration-500 hover:scale-105">
                Rezervuoti konsultaciją
              </Button>
            </Link>
          </m.div>

          {/* Right Profile Side - Floating overlapping Frame-less look */}
          <m.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full md:w-5/12 flex flex-col items-center justify-end h-full relative md:-translate-y-16"
          >
            {/* Ambient Background Glow behind profile */}
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-[120px] -z-10" />
            
            <div className="relative w-full max-w-sm h-[440px] md:h-auto aspect-[3/4] md:self-end self-center mt-2 md:mt-auto">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 to-slate-400/10 rounded-[3rem] blur-2xl opacity-70" />
              <div className="relative h-full w-full rounded-t-[5rem] rounded-b-3xl overflow-hidden shadow-2xl border border-white/10 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Image 
                  src="/uploads/1773775458388-profilio.png" 
                  alt="Mantas Katkevičius" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={true}
                  fetchPriority="high"
                  loading="eager"
                  className="object-cover object-center group-hover:scale-105 transition-all duration-700"
                />
                {/* Removed dark portrait overlay style */}
                <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-white/10 border border-white/20 p-5 rounded-2xl flex flex-col items-center text-center">
                  <p className="text-white font-sans font-black text-2xl tracking-wide mb-1">Mantas Katkevičius</p>
                  <p className="text-primary text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" /> Jūsų NT partneris
                  </p>
                </div>
              </div>
            </div>
          </m.div>
        </div>
      </section>

      {/* Why Choose Us Timeline */}
      <ProcessTimeline dark={false} />

      {/* Services Bento Component */}
      <ServicesBento />

      {/* Commission Calculator */}
      <CommissionCalculator dark={false} />

      {/* Client Testimonials Section */}
      <section className="py-24 bg-slate-50 overflow-hidden relative border-t border-slate-100">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-950 mb-4 tracking-tight">Ką sako mano <span className="text-primary italic font-light pr-3">klientai</span>?
              </h2>
              <p className="text-slate-500 text-base max-w-xl">Pasitikėjimas ir kokybė yra mano darbo pamatas. Štai keletas atsiliepimų.</p>
            </div>
            <Link href="/atsiliepimai" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full rounded-2xl border-slate-200 bg-white text-slate-950 h-14 px-8 font-bold hover:bg-slate-950 hover:text-white transition-all">Visi atsiliepimai</Button>
            </Link>
          </div>

          <TestimonialsGrid />
        </div>
      </section>

      {/* Useful Information Sneak Peek */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-slate-950 mb-3 tracking-tight">Aktualijos</h2>
              <p className="text-slate-500 text-base">Sužinokite naujienas, patarimus ir įžvalgas apie NT rinką.</p>
            </div>
            <Link href="/naudinga-informacija" className="hidden md:flex items-center text-primary font-medium hover:text-slate-950 transition-colors">Skaityti daugiau<ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          
          <ArticlesGrid articles={articles} />

          {/* Mobile Only Button */}
          <div className="mt-10 flex justify-center md:hidden">
            <Link href="/naudinga-informacija" className="w-full">
              <Button variant="outline" className="w-full rounded-2xl border-slate-200 bg-white text-slate-950 h-14 px-8 font-bold hover:bg-slate-950 hover:text-white transition-all">
                Visi straipsniai <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
    </LazyMotion>
  );
}
