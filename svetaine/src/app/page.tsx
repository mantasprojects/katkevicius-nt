"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Star, Quote, CheckCircle2, Zap, TrendingUp, ShieldCheck } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import CommissionCalculator from "@/components/calculator/CommissionCalculator";
import ProcessTimeline from "@/components/ui/timeline";
import TestimonialCard from "@/components/ui/testimonial-card";
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

  if (!isMounted) return null;

  return (
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
        <div className="container px-4 mx-auto max-w-7xl relative z-10 flex flex-col md:flex-row items-center justify-between h-full pt-6 md:pt-16">
          {/* Left Content Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full md:w-6/12 flex flex-col items-start text-left relative z-10 mb-12 md:mb-0"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-primary/20 mb-6"
            >
              <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-widest leading-none">NT Ekspertas</span>
            </motion.div>

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
          </motion.div>

          {/* Right Profile Side - Floating overlapping Frame-less look */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full md:w-5/12 flex flex-col items-center justify-end h-full relative md:-translate-y-12"
          >
            {/* Ambient Background Glow behind profile */}
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-[120px] -z-10" />
            
            <div className="relative w-full max-w-sm h-[440px] md:h-auto aspect-[3/4] md:self-end self-center mt-2 md:mt-auto">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 to-slate-400/10 rounded-[3rem] blur-2xl opacity-70" />
              <div className="relative h-full w-full rounded-t-[5rem] rounded-b-3xl overflow-hidden shadow-2xl border border-white/10 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/uploads/1773775458388-profilio.png" 
                  alt="Mantas Katkevičius" 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700"
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
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Timeline */}
      <ProcessTimeline dark={false} />

      {/* Services Bento Grid Section */}
      <section className="py-32 relative z-10 bg-slate-50 border-b border-slate-100">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-black mb-4 text-slate-950 tracking-tight"
            >
              Teikiamos paslaugos
            </motion.h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base">Aukščiausio lygio atstovavimas kiekviename nekilnojamojo turto etape.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 md:gap-8">
            {/* 1. NT Pardavimas (Dominant - Big Card) */}
            <Link href="/pardavimas" className="md:col-span-2 md:row-span-2 group block relative">
              <motion.div 
                whileHover={{ y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="bg-slate-950 transform-gpu rounded-[2rem] flex flex-col h-full hover:border-primary/40 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden"
              >
                {/* Background Image Full cover layout */}
                <div className="absolute inset-0">
                   <img src="/images/minimalist_interior.png" alt="Pardavimas" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
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
              </motion.div>
            </Link>

            {/* 2. NT Pirkimas */}
            <Link href="/pirkimas" className="group block relative">
              <motion.div 
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
              </motion.div>
            </Link>

            {/* 3. NT Nuoma */}
            <Link href="/nuoma" className="group block relative">
              <motion.div 
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
              </motion.div>
            </Link>
          </div>
        </div>
      </section>


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
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.length === 0 ? (
              [1, 2, 3].map((_, i) => (
                <div key={i} className="bg-slate-50 rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col h-200 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded-full w-24 mb-4"></div>
                  <div className="h-7 bg-slate-200 rounded-full w-5/6 mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded-full w-full mb-2"></div>
                </div>
              ))
            ) : (
              articles.map(article => (
                <StaggerItem key={article.id}>
                  <Link href={`/naudinga-informacija/${article.slug}`} className="group bg-white rounded-3xl p-8 hover:bg-slate-50 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full hover:-translate-y-1">
                    <div className="text-sm font-bold tracking-wider uppercase text-primary mb-4">
                      {article.category || "Patarimai"}
                    </div>
                    <h3 className="text-xl font-bold text-slate-950 mb-4 group-hover:text-primary transition-colors leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-slate-500 mb-8 flex-1 leading-relaxed text-sm line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="inline-flex items-center text-slate-950 font-bold text-sm group-hover:text-primary transition-colors mt-auto">Skaityti straipsnį<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </Link>
                </StaggerItem>
              ))
            )}
          </StaggerContainer>

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
  );
}

function TestimonialsGrid() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/reviews")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data.filter((r: any) => r.status === "approved").slice(0, 6));
        } else {
          const saved = localStorage.getItem("nt_reviews_master_v1");
          if (saved) {
            const allReviews = JSON.parse(saved);
            setReviews(allReviews.filter((r: any) => r.status === "approved").slice(0, 6));
          }
        }
      })
      .catch(() => {
        const saved = localStorage.getItem("nt_reviews_master_v1");
        if (saved) {
          const allReviews = JSON.parse(saved);
          setReviews(allReviews.filter((r: any) => r.status === "approved").slice(0, 6));
        }
      });
  }, []);

  if (!mounted || reviews.length === 0) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-20 pointer-events-none">
       {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-[32px] animate-pulse"></div>)}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
      <Quote className="absolute -top-24 -right-12 w-64 h-64 text-slate-100/30 -rotate-12 pointer-events-none z-0" />
      
      {reviews.map((review, idx) => (
        <TestimonialCard 
          key={review.id}
          id={review.id}
          name={review.name}
          rating={review.rating}
          comment={review.comment}
          date={review.date}
          image={review.image}
          delay={idx * 0.1}
          dark={false}
        />
      ))}
    </div>
  );
}
