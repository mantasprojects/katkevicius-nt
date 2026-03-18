"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, ArrowRight, Clock, MessageSquare, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import Turnstile from "@/components/ui/Turnstile";
export default function KontaktaiPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [errorHeader, setErrorHeader] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const inquiryData = {
      name: `${formData.get("firstName")} ${formData.get("lastName")}`,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      message: `Tema: ${formData.get("subject")}\n\n${formData.get("message")}`,
      pageUrl: window.location.href,
      b_name: formData.get("b_name") as string,
      turnstileToken: turnstileToken,
    };

    try {
      setErrorHeader("");
      const res = await fetch("/api/send-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryData),
      });

      if (res.ok) {
        setIsSuccess(true);
        (e.target as HTMLFormElement).reset();
        setTurnstileToken(""); // Reset token
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        const errData = await res.json();
        setErrorHeader(errData.error || "Įvyko klaida. Bandykite dar kartą.");
      }
    } catch (err) {
      console.error("Klaida siunčiant užklausą:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 bg-[#111827] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2563EB] rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        </div>
        
        <div className="container px-4 mx-auto max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <FadeIn>
              <h1 className="text-5xl md:text-7xl font-sans font-extrabold mb-6 tracking-tight leading-none">Susisiekime</h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl leading-relaxed">Pasirengę parduoti ar investuoti? Susisiekite ir aptarkime Jūsų lūkesčius bei mano strategiją.</p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="-mt-10 relative z-20 pb-24">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Contact Details Cards */}
            <div className="lg:col-span-5 w-full">
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                
                <StaggerItem>
                  <div className="bg-white rounded-3xl p-8 shadow-xl shadow-[#1E3A8A]/5 border border-slate-100 flex items-start group hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mr-6 group-hover:bg-[#2563EB] transition-colors flex-shrink-0">
                      <Phone className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Telefonas</p>
                      <a href="tel:+37064541892" className="text-2xl font-extrabold text-[#111827] hover:text-[#2563EB] transition-colors">
                        +370 645 41892
                      </a>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="bg-white rounded-3xl p-8 shadow-xl shadow-[#1E3A8A]/5 border border-slate-100 flex items-start group hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mr-6 group-hover:bg-[#2563EB] transition-colors flex-shrink-0">
                      <Mail className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">El. Paštas</p>
                      <a href="mailto:info@katkevicius.lt" className="text-xl font-extrabold text-[#111827] hover:text-[#2563EB] transition-colors break-all">
                        info@katkevicius.lt
                      </a>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="bg-white rounded-3xl p-8 shadow-xl shadow-[#1E3A8A]/5 border border-slate-100 flex items-start group hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mr-6 group-hover:bg-[#2563EB] transition-colors flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Vietovė</p>
                      <p className="text-xl font-extrabold text-[#111827]">Kauno regionas<br />Lietuva
                      </p>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] rounded-3xl p-8 shadow-xl shadow-[#2563EB]/20 text-white flex items-start">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mr-6 backdrop-blur-sm flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#BFDBFE] uppercase tracking-wider mb-2">Darbo Laikas</p>
                      <div className="space-y-1 font-medium">
                        <p className="flex justify-between gap-8"><span>I - V:</span> <span>09:00 - 18:00</span></p>
                        <p className="flex justify-between gap-8"><span>VI:</span> <span>Pagal susitarimą</span></p>
                        <p className="flex justify-between gap-8 text-[#93C5FD]"><span>VII:</span> <span>Nedirbame</span></p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>

              </StaggerContainer>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7 w-full">
              <FadeIn delay={0.4}>
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-[#1E3A8A]/5 border border-slate-100 h-full">
                  <div className="flex items-center mb-8">
                    <MessageSquare className="w-8 h-8 text-[#2563EB] mr-4" />
                    <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight">Parašykite man</h2>
                  </div>
                  
                  {isSuccess ? (
                    <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
                      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <h3 className="text-3xl font-bold text-[#111827] mb-4">Žinutė gauta!</h3>
                      <p className="text-slate-500 text-lg font-medium">Ačiū, kad susisiekėte. Atsakysiu Jums kuo greičiau.</p>
                      <Button variant="outline" onClick={() => setIsSuccess(false)} className="mt-8 border-slate-200">Siųsti kitą žinutę</Button>
                    </div>
                  ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      {errorHeader && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-300">
                          ⚠️ {errorHeader}
                        </div>
                      )}

                      {/* Honeypot Spamo Spąstai */}
                      <input type="text" name="b_name" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-wider text-slate-500">Vardas</Label>
                          <Input id="firstName" name="firstName" required className="h-14 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2563EB] transition-all" placeholder="Jūsų vardas" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider text-slate-500">Pavardė</Label>
                          <Input id="lastName" name="lastName" className="h-14 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2563EB] transition-all" placeholder="Jūsų pavardė" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">El. Paštas</Label>
                          <Input id="email" name="email" type="email" required className="h-14 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2563EB] transition-all" placeholder="vardas@pavyzdys.lt" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-slate-500">Telefonas</Label>
                          <Input id="phone" name="phone" type="tel" className="h-14 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2563EB] transition-all" placeholder="+370 600 00000" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-slate-500">Tema</Label>
                        <Input id="subject" name="subject" className="h-14 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2563EB] transition-all" placeholder="Pvz. Klausimas dėl nekilnojamojo turto pardavimo" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-slate-500">Žinutė</Label>
                        <textarea 
                          id="message" 
                          name="message"
                          required
                          className="w-full min-h-[160px] rounded-xl border border-slate-200 bg-slate-50 focus:bg-white p-4 text-base focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-sans transition-all resize-none"
                          placeholder="Aprašykite savo situaciją arba užduokite klausimą..."
                        />
                      </div>

                      <div className="flex justify-center flex-col items-center gap-3">
                        <Button 
                          disabled={isSubmitting || (!turnstileToken && typeof window !== "undefined" && window.location.hostname !== "localhost")} 
                          type="submit" 
                          className="w-full h-16 text-lg font-bold shadow-xl shadow-[#2563EB]/20 bg-[#2563EB] hover:bg-[#1d4ed8] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                        >
                          {isSubmitting ? "Siunčiama..." : "Siųsti žinutę"} <ArrowRight className="ml-2 w-6 h-6" />
                        </Button>

                        <Turnstile onVerify={setTurnstileToken} theme="light" />
                      </div>
                      <p className="text-center text-xs text-slate-400 font-medium">Spausdami „Siųsti žinutę“ jūs sutinkate su privatumo politika.</p>
                    </form>
                  )}
                </div>
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
