"use client";

import { useState, useEffect } from "react";
import { Star, Quote, CheckCircle2, User, MessageCircle, ArrowRight, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import TestimonialCard from "@/components/ui/testimonial-card";
import Turnstile from "@/components/ui/Turnstile";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  status: "pending" | "approved";
  image?: string;
}

const STORAGE_KEY = "nt_reviews_master_v1";

export default function AtsiliepimaiPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "", image: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [errorHeader, setErrorHeader] = useState("");

  useEffect(() => {
    setIsMounted(true);
    fetch("/api/reviews")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } else {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) setReviews(JSON.parse(saved));
        }
      })
      .catch(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setReviews(JSON.parse(saved));
      });
  }, []);

  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const approvedReviews = reviews
    .filter(r => r.status === "approved")
    .filter(r => filterRating === null || r.rating === filterRating)
    .sort((a, b) => {
      const dateA = new Date(a.date.replace(/\./g, "-")).getTime();
      const dateB = new Date(b.date.replace(/\./g, "-")).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

  const allApproved = reviews.filter(r => r.status === "approved");
  const stats = {
    total: allApproved.length,
    avg: allApproved.length > 0 
      ? (allApproved.reduce((acc, r) => acc + r.rating, 0) / allApproved.length).toFixed(1) 
      : "0.0",
    distribution: [5, 4, 3, 2, 1].map(star => ({
      star,
      count: allApproved.filter(r => r.rating === star).length,
      percentage: allApproved.length > 0 
        ? (allApproved.filter(r => r.rating === star).length / allApproved.length) * 100 
        : 0
    }))
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorHeader("");
    
    if (!turnstileToken) {
      setErrorHeader("Atsiprašome, jūsų užklausa neperėjo saugumo patikros.");
      setIsSubmitting(false);
      return;
    }
    
    let imageUrl = newReview.image;

    // Handle file upload if selected
    if (selectedFile) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("files", selectedFile);
        
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.urls && data.urls.length > 0) {
            imageUrl = data.urls[0];
          }
        }
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setIsUploading(false);
      }
    }
    
    // Create review object
    const review: Review = {
      id: Math.random().toString(36).substr(2, 9),
      ...newReview,
      image: imageUrl,
      date: new Date().toLocaleDateString("lt-LT"),
      status: "pending"
    };

    const updatedReviews = [...reviews, review];
    setReviews(updatedReviews);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReviews));

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updatedReviews, turnstileToken }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Užklausa neperėjo saugumo patikros.");
      }
    } catch (err: any) {
      console.error("Klaida pateikiant atsiliepimą:", err);
      setErrorHeader(err.message || "Nepavyko išsaugoti atsiliepimo.");
      setIsSubmitting(false);
      return;
    }
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsModalOpen(false);
      setNewReview({ name: "", rating: 5, comment: "", image: "" });
      setSelectedFile(null);
    }, 3000);
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-[#111827] text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-primary/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container px-4 mx-auto max-w-6xl relative z-10">
          <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-sans font-bold mb-6 tracking-tight leading-[1.1]">Pasitikėjimas kuria <span className="text-primary italic font-light">vertę</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed mb-10 text-balance">Džiaugiuosi kiekviena sėkmės istorija ir vertinu kiekvieną atsiliepimą. Tai mano motyvacija judėti į priekį.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="h-14 px-8 bg-primary hover:bg-white hover:text-primary text-white font-bold rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
                >Rašyti atsiliepimą<ArrowRight className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-3 px-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                  <div className="flex -space-x-4">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-2 border-[#111827] bg-slate-800 flex items-center justify-center text-sm font-black shadow-md">
                        {i === 3 ? "100+" : <User className="w-5 h-5 text-slate-400" />}
                      </div>
                    ))}
                  </div>


                  <div className="text-left py-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-current" />
                      <span className="text-sm font-bold">{stats.avg}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{stats.total} "Atsiliepimų"</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats & Filter Section */}
      <section className="py-12 -mt-10 relative z-20">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Avg Rating Card */}
              <div className="lg:col-span-3 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-slate-100 pb-8 lg:pb-0 lg:pr-12">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Vidutinis įvertinimas</h3>
                <div className="text-7xl font-sans font-black text-[#111827] mb-4">{stats.avg}</div>
                <div className="flex justify-center lg:justify-start gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(Number(stats.avg)) ? "text-amber-400 fill-current" : "text-slate-200"}`} />
                  ))}
                </div>
                <p className="text-sm text-slate-500 font-medium">{"Iš viso {total} atsiliepimų".replace("{total}", stats.total.toString())}</p>
              </div>

              {/* Distribution */}
              <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-slate-100 pb-8 lg:pb-0 lg:px-12">
                <div className="space-y-3">
                  {stats.distribution.map((item) => (
                    <button 
                      key={item.star}
                      onClick={() => setFilterRating(filterRating === item.star ? null : item.star)}
                      className={cn(
                        "w-full group flex items-center gap-4 hover:opacity-80 transition-opacity",
                        filterRating !== null && filterRating !== item.star && "opacity-40"
                      )}
                    >
                      <div className="flex items-center gap-1 w-10 shrink-0">
                        <span className="text-xs font-bold text-slate-600">{item.star}</span>
                        <Star className="w-3 h-3 text-amber-400 fill-current" />
                      </div>
                      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-[#111827]"
                        />
                      </div>
                      <div className="w-8 shrink-0 text-right">
                        <span className="text-xs font-bold text-slate-400">{item.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters & Actions */}
              <div className="lg:col-span-4 lg:pl-12">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Filtruoti ir rūšiuoti</h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setFilterRating(null)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                        filterRating === null ? "bg-[#111827] text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      )}
                    >Visi</button>
                    {[5, 4, 3].map(star => (
                      <button 
                        key={star}
                        onClick={() => setFilterRating(star)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all",
                          filterRating === star ? "bg-[#111827] text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        )}
                      >
                        {star} <Star className={cn("w-3 h-3", filterRating === star ? "text-amber-400 fill-current" : "text-slate-400")} />
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-3 pt-2">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="flex-1 h-12 rounded-xl border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                    >
                      <option value="newest">Naujausi viršuje</option>
                      <option value="oldest">Seniausi viršuje</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="pb-24 pt-8" id="reviews-grid">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-[#111827]">
              {filterRating ? `Rodomi ${filterRating} žvaigždučių atsiliepimai` : "Visi"}
              <span className="ml-3 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">
                {approvedReviews.length}
              </span>
            </h2>
            {filterRating && (
              <button 
                onClick={() => setFilterRating(null)}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Išvalyti filtrą
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {approvedReviews.map((review, idx) => (
                <TestimonialCard 
                  key={review.id}
                  id={review.id}
                  name={review.name}
                  rating={review.rating}
                  comment={review.comment}
                  date={review.date}
                  image={review.image}
                  delay={idx * 0.1}
                />
              ))}
            </AnimatePresence>
          </div>

          {approvedReviews.length === 0 && (
            <div className="text-center py-20 px-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-slate-100">
                <MessageCircle className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-[#111827] mb-2">Dar nėra atsiliepimų</h3>
              <p className="text-slate-500">Būkite pirmas, palikęs atsiliepimą!</p>
            </div>
          )}
        </div>
      </section>

      {/* Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4 pt-24 pb-24 sm:p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isSubmitting && setIsModalOpen(false)}
                className="fixed inset-0 bg-[#111827]/60 backdrop-blur-sm"
              ></motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl relative z-10 overflow-hidden flex flex-col my-8"
              >
                <div className="p-6 md:p-8">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-5 right-6 p-2 text-slate-400 hover:text-[#111827] transition-colors z-20"
                >
                  <X className="w-6 h-6" />
                </button>

                {isSuccess ? (
                    <div className="text-center py-10 flex flex-col items-center relative">
                      {/* Confetti Burst */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(20)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ 
                              x: "50%", 
                              y: "50%", 
                              scale: 0,
                              opacity: 1
                            }}
                            animate={{ 
                              x: `${Math.random() * 100}%`, 
                              y: `${Math.random() * 100}%`, 
                              scale: [0, 1, 0.5],
                              opacity: [1, 1, 0],
                              rotate: Math.random() * 360
                            }}
                            transition={{ 
                              duration: 2,
                              ease: "easeOut",
                              delay: i * 0.05
                            }}
                            className={cn(
                              "absolute w-2 h-2 rounded-full",
                              ["bg-primary", "bg-amber-400", "bg-blue-400", "bg-pink-400"][i % 4]
                            )}
                          />
                        ))}
                      </div>

                      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 relative z-10">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                      </div>
                      <h2 className="text-3xl font-bold text-[#111827] mb-4 relative z-10">Ačiū už Jūsų nuomonę!</h2>
                      <p className="text-slate-500 text-lg relative z-10">Jūsų atsiliepimas buvo išsiųstas moderavimui ir netrukus pasirodys svetainėje.</p>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-[#111827] mb-1">Palikite atsiliepimą</h2>
                      <p className="text-slate-500 mb-6 text-sm italic">„Jūsų nuomonė — mūsų augimo variklis.“</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {errorHeader && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-medium animate-in fade-in duration-300">
                          ⚠️ {errorHeader}
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-[13px] font-bold text-slate-700 ml-1">Jūsų vardas</Label>
                          <Input 
                            required 
                            value={newReview.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewReview({...newReview, name: e.target.value})}
                            className="h-11 border-slate-200 rounded-xl px-4 focus:ring-primary text-sm" 
                            placeholder="Vardas Pavardė" 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[13px] font-bold text-slate-700 ml-1">Įvertinimas</Label>
                          <div className="flex gap-1 bg-slate-50 h-11 items-center px-4 rounded-xl border border-slate-200">
                            {[1,2,3,4,5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewReview({...newReview, rating: star})}
                                className="focus:outline-none transition-transform active:scale-90"
                              >
                                <Star className={cn(
                                  "w-5 h-5",
                                  star <= newReview.rating ? "text-amber-400 fill-current" : "text-slate-200"
                                )} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[13px] font-bold text-slate-700 ml-1">Komentaras</Label>
                        <Textarea 
                          required 
                          rows={3}
                          value={newReview.comment}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewReview({...newReview, comment: e.target.value})}
                          className="border-slate-200 rounded-xl px-4 py-3 focus:ring-primary resize-none text-sm min-h-[100px]" 
                          placeholder="Pasidalinkite savo patirtimi..." 
                        />
                      </div>

                       <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center gap-4 transition-all hover:bg-slate-100/50">
                          <div className="w-10 h-10 shrink-0 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                            <Camera className="w-5 h-5" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const file = e.target.files?.[0];
                                if (file) setSelectedFile(file);
                              }}
                              className="hidden" 
                              id="review-image-upload"
                            />
                            <label 
                              htmlFor="review-image-upload"
                              className="flex h-10 items-center justify-between w-full rounded-lg bg-white border border-slate-200 text-[13px] font-medium text-slate-600 cursor-pointer hover:border-primary hover:text-primary transition-all overflow-hidden px-3"
                            >
                              <span className="truncate">{selectedFile ? selectedFile.name : "Pridėti nuotrauką"}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0 ml-2">PNG, JPG</span>
                            </label>
                            <p className="text-[11px] text-slate-400 mt-1 font-medium leading-tight px-1">Rekomenduojama kvadratinė nuotrauka. Tai bus jūsų profilio nuotrauka.</p>
                          </div>
                        </div>


                         {isUploading && (
                           <div className="w-full bg-slate-200 rounded-full h-1 mt-2 overflow-hidden">
                             <motion.div 
                               initial={{ x: "-100%" }}
                               animate={{ x: "0%" }}
                               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                               className="w-1/2 h-full bg-primary"
                             />
                           </div>
                         )}

                        <Button 
                          disabled={isSubmitting || (!turnstileToken && typeof window !== "undefined" && window.location.hostname !== "localhost")}
                          className="w-full h-12 bg-[#111827] hover:bg-primary text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Siunčiama...</div>
                          ) : (
                            "Siųsti atsiliepimą"
                          )}
                        </Button>

                        <div className="flex justify-center mt-4">
                          <Turnstile onVerify={setTurnstileToken} theme="light" />
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
      </div>
    );
}
