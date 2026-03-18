"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Dynamic Background Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden z-10 bg-white border-b border-slate-100">
        <div className="container px-4 mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16 lg:gap-24">
            
            <div className="flex-1 text-center md:text-left">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-5xl md:text-6xl lg:text-7xl font-sans font-black mb-8 leading-[1.05] tracking-tight text-balance text-slate-950"
              >Nuo paieškos <br className="md:hidden"/>iki sandorio <br className="hidden md:block"/>ramiai, aiškiai ir <span className="text-primary italic">užtikrintai</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-xl md:text-xl text-slate-600 mb-12 max-w-2xl text-balance font-medium leading-relaxed"
              >Aiški strategija, stipri prezentacija. Pardavimo vidurkis – vos 6 savaitės.</motion.p>
              
              <FadeIn delay={0.4}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/konsultacija" className="w-full sm:w-auto">
                    <Button size="lg" className="h-16 w-full px-10 text-lg shadow-xl shadow-primary/20 font-bold rounded-2xl bg-primary hover:bg-slate-950 transition-all duration-500 hover:-translate-y-1">Rezervuoti konsultaciją<ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </FadeIn>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="flex-1 relative max-w-lg w-full group"
            >
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-white shadow-2xl border border-slate-100 transition-transform duration-700 group-hover:scale-[1.02]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://katkevicius.lt/wp-content/uploads/2026/01/profilio.png" 
                  alt="Mantas Katkevičius" 
                  className="w-full h-full object-cover object-top"
                />
                
                {/* Floating Glassmorphism text badge */}
                <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-slate-950/70 border border-white/10 p-5 rounded-2xl text-left shadow-lg">
                  <p className="font-extrabold text-2xl tracking-tight mb-1 text-white">Mantas Katkevičius</p>
                  <p className="font-bold text-slate-300 text-xs uppercase tracking-widest opacity-90">Jūsų NT partneris</p>
                </div>
              </motion.div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10"></div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Why Choose Us Timeline */}
      <ProcessTimeline dark={false} />

      {/* Services Bento Grid Section */}
      <section className="py-24 relative z-10 bg-slate-50 border-b border-slate-100">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-slate-950">Teikiamos paslaugos</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base">Aukščiausio lygio atstovavimas kiekviename nekilnojamojo turto etape.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. Pirkimas */}
            <Link href="/pirkimas" className="group block">
              <motion.div 
                whileHover={{ y: -8 }}
                className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col h-full hover:border-primary/40 transition-all shadow-sm hover:shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl" />
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><Zap className="w-6 h-6 text-primary" /></div>
                <h3 className="text-2xl font-bold mb-3 text-slate-950">NT Pirkimas</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">Apžiūrime tik lūkesčius atitinkančius objektus. Identifikuoju teisinę riziką ir sutaupau jūsų laiką bei biudžetą.</p>
                <div className="flex items-center text-primary font-bold text-sm mt-auto">Sužinoti daugiau<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </Link>

            {/* 2. Pardavimas (Now in Middle) */}
            <Link href="/pardavimas" className="group block">
              <motion.div 
                whileHover={{ y: -8 }}
                className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col h-full hover:border-primary/40 transition-all shadow-sm hover:shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><TrendingUp className="w-6 h-6 text-primary" /></div>
                <h3 className="text-2xl font-bold mb-3 text-slate-950">NT Pardavimas</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">Maksimali rinkos kaina per trumpą laiką. Stipri prezentacija, tikslinė sklaida ir profesionalus derybų valdymas.</p>
                <div className="flex items-center text-primary font-bold text-sm mt-auto">Sužinoti daugiau<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </Link>

            {/* 3. Nuoma */}
            <Link href="/nuoma" className="group block">
              <motion.div 
                whileHover={{ y: -8 }}
                className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col h-full hover:border-primary/40 transition-all shadow-sm hover:shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 rounded-full blur-2xl" />
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><ShieldCheck className="w-6 h-6 text-emerald-600" /></div>
                <h3 className="text-2xl font-bold mb-3 text-slate-950">NT Nuoma</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">Patikima nuomininkų atranka ir sklandus sutarčių administravimas. Apsaugokite savo investiciją nuo rizikų.</p>
                <div className="flex items-center text-emerald-600 font-bold text-sm mt-auto">Sužinoti daugiau<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
