"use client";

import { useEffect } from "react";
import Script from "next/script";
import { motion } from "framer-motion";
import { Clock, Phone, CheckCircle2 } from "lucide-react";

export default function KonsultacijaPage() {
  // Manual trigger to handle Next.js client-side navigation loads
  const initCalendly = () => {
    // @ts-ignore
    if (typeof window !== "undefined" && window.Calendly) {
      // @ts-ignore
      window.Calendly.initInlineWidget({
        url: 'https://calendly.com/katkevicius/30min?hide_gdpr_banner=1&background_color=ffffff&primary_color=1e3a8a&text_color=111827',
        parentElement: document.getElementById('calendly-inline-widget'),
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      initCalendly();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Framer-Motion wrapper for fade-in effect to the entire content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-4"
      >
        {/* Hero-like title and description area */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4 tracking-tight">
            NT KONSULTACIJA
          </h1>
          <p className="text-slate-600 text-lg md:text-xl mb-8 leading-relaxed">
            Pasirinkite jums patogų laiką nemokamam 30 min. pokalbiui telefonu. Aptarsime jūsų NT poreikius, rinkos situaciją ir efektyviausią veiksmų planą.
          </p>
          
          {/* Accent labels with icons */}
          <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-[#0F172A]">
            <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-sm border border-[#E2E8F0]">
              <Clock className="w-5 h-5 text-[#2563EB]" />
              <span>30 min.</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-sm border border-[#E2E8F0]">
              <Phone className="w-5 h-5 text-[#2563EB]" />
              <span>Telefonu</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-sm border border-[#E2E8F0]">
              <CheckCircle2 className="w-5 h-5 text-[#2563EB]" />
              <span>Nemokamai</span>
            </div>
          </div>
        </div>

        {/* Clean-UI Container encapsulating official Calendly snippet with absolute cutout sizing */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full max-w-[900px] mx-auto h-[1300px] overflow-hidden relative"
        >
          <div 
             id="calendly-inline-widget" 
             className="calendly-inline-widget absolute top-0 lg:top-[-50px] left-0 w-full" 
             data-url="https://calendly.com/katkevicius/30min?hide_gdpr_banner=1&background_color=ffffff&primary_color=1e3a8a&text_color=111827"
             style={{ minWidth: '320px', height: '1450px' }} 
          />
          <Script 
             src="https://assets.calendly.com/assets/external/widget.js" 
             strategy="lazyOnload"
             onLoad={initCalendly} 
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

