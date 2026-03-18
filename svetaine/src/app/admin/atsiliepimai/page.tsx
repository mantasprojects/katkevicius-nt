"use client";

import { useState, useEffect } from "react";
import { Star, Check, X, Trash2, User, Edit, MessageSquare, Layout, Camera, Search } from "lucide-react";


import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { deleteReview, updateReview } from "@/app/actions/reviews";
import { motion, AnimatePresence } from "framer-motion";

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

export default function AdminReviewsPage() {
  const supabase = createClient();
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const showNotice = (m: string, t: 'success' | 'error' = 'success') => { setNotification({ message: m, type: t }); setTimeout(() => setNotification(null), 3000); };
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingReview) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.urls && data.urls[0]) {
        setEditingReview({ ...editingReview, image: data.urls[0] });
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };


  useEffect(() => {
    setIsMounted(true);
    const loadReviews = async () => {
      try {
        const { data, error } = await supabase.from('atsiliepimai').select('*').order('created_at', { ascending: false });
        if (data) {
          const mapped: Review[] = data.map((r: any) => ({
            id: r.id,
            name: r.vardas,
            rating: r.reitingas,
            comment: r.komentaras,
            status: r.patvirtinta ? "approved" : "pending",
            date: r.created_at ? r.created_at.split('T')[0] : ""
          }));
          setReviews(mapped);
        }
      } catch (err) {
         console.error("Klaida nuskaitant atsiliepimus:", err);
      }
    };
    loadReviews();
  }, []);

  const handleStatusChange = async (id: string, status: "approved" | "pending") => {
    const res = await updateReview(id, { patvirtinta: status === "approved" });
    if (res.success) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      showNotice("Statusas atnaujintas");
    } else {
      showNotice(res.error || "Klaida atnaujinant", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Ar tikrai norite ištrinti šį atsiliepimą?")) {
      const res = await deleteReview(id);
      if (res.success) {
         setReviews(prev => prev.filter(r => r.id !== id));
         showNotice("Atsiliepimas ištrintas");
      } else {
         showNotice(res.error || "Klaida trinant", "error");
      }
    }
  };

  const handleEditSave = async () => {
    if (!editingReview) return;
    const res = await updateReview(editingReview.id, {
      vardas: editingReview.name,
      reitingas: editingReview.rating,
      komentaras: editingReview.comment
    });
    if (res.success) {
       setReviews(prev => prev.map(r => r.id === editingReview.id ? editingReview : r));
       showNotice("Atsiliepimas atnaujintas");
    } else {
       showNotice(res.error || "Klaida atnaujinant", "error");
    }
    setEditingReview(null);
  };

  if (!isMounted) return null;

  const pendingCount = reviews.filter(r => r.status === "pending").length;

  
  return (
    <>
      {notification && (
        <div className={`fixed top-6 right-6 p-4 rounded-xl shadow-2xl font-bold text-white transition-all transform z-50 ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {notification.message}
        </div>
      )}

    <div className="space-y-8 max-w-6xl relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#111827] tracking-tight">Atsiliepimų Valdymas</h1>
          <p className="text-slate-500 mt-1">Moderavimas ir klientų rekomendacijų publikavimas</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-700">Iš viso: {reviews.length} (Laukia: {pendingCount})</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Ieškoti pagal vardą arba tekstą..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {reviews
            .filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.comment.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((review) => (

            <motion.div
              key={review.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-white rounded-2xl p-6 shadow-sm border ${review.status === "pending" ? "border-amber-200 bg-amber-50/20" : "border-slate-100"}`}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden border-2 border-white shadow-sm">
                    {review.image ? <img src={review.image} className="w-full h-full object-cover" /> : <User className="w-8 h-8" />}
                  </div>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-[#111827] text-lg">{review.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-current" : "text-slate-200"}`} />
                          ))}
                        </div>
                        <span className="text-xs text-slate-400 font-medium">{review.date}</span>
                      </div>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        review.status === "approved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {review.status === "approved" ? "Patvirtinta" : "Laukia"}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 leading-relaxed italic">{review.comment}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {review.status === "pending" ? (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusChange(review.id, "approved")}
                        className="bg-green-600 hover:bg-green-700 text-white gap-1.5 rounded-lg"
                      >
                        <Check className="w-4 h-4" /> Patvirtinti
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusChange(review.id, "pending")}
                        className="text-slate-600 gap-1.5 rounded-lg border-slate-200"
                      >
                        <Layout className="w-4 h-4" /> Atšaukti
                      </Button>
                    )}

                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setEditingReview(review)}
                      className="text-blue-600 hover:bg-blue-50 border-slate-200 rounded-lg gap-1.5"
                    >
                      <Edit className="w-4 h-4" /> Redaguoti
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDelete(review.id)}
                      className="text-red-500 hover:bg-red-50 border-slate-200 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" /> Ištrinti
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {reviews.length === 0 && (
          <div className="bg-white rounded-3xl p-20 border-2 border-dashed border-slate-200 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Star className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-400">Atsiliepimų dar nėra</h3>
            <p className="text-slate-400">Visi klientų atsiliepimai pasirodys čia</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingReview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl relative"
            >
              <button 
                onClick={() => setEditingReview(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-slate-950">Redaguoti atsiliepimą</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vardas / Pavadinimas</label>
                  <input 
                    type="text" 
                    value={editingReview.name}
                    onChange={(e) => setEditingReview({ ...editingReview, name: e.target.value })}
                    className="w-full mt-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Įvertinimas (1-5)</label>
                  <div className="flex gap-2 mt-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button 
                        key={num}
                        onClick={() => setEditingReview({ ...editingReview, rating: num })}
                        className={`w-10 h-10 rounded-xl font-bold border ${
                          editingReview.rating === num ? "bg-amber-500 text-white border-amber-500" : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Atsiliepimo Telstas</label>
                  <textarea 
                    rows={4}
                    value={editingReview.comment}
                    onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                    className="w-full mt-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-primary resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Data</label>
                  <input 
                    type="text" 
                    value={editingReview.date}
                    onChange={(e) => setEditingReview({ ...editingReview, date: e.target.value })}
                    className="w-full mt-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nuotrauka</label>
                  <div className="flex items-center gap-4 mt-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-slate-400 overflow-hidden border border-slate-200 shadow-sm shrink-0">
                      {editingReview.image ? <img src={editingReview.image} className="w-full h-full object-cover" /> : <User className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 flex flex-wrap gap-2">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        id="admin-photo-edit" 
                      />
                      <label 
                        htmlFor="admin-photo-edit" 
                        className="px-3 py-2 bg-white border border-slate-200 hover:border-primary hover:text-primary transition-all rounded-xl text-xs font-bold text-slate-600 cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <Camera className="w-3.5 h-3.5" /> {isUploading ? "Įkeliama..." : "Pakeisti"}
                      </label>
                      {editingReview.image && (
                        <button 
                          onClick={() => setEditingReview({ ...editingReview, image: "" })} 
                          className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 transition-all rounded-xl text-xs font-bold flex items-center gap-1.5 border border-red-100 shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Pašalinti
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>


              <div className="flex gap-3 pt-2">
                <Button onClick={handleEditSave} className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl h-12">Išsaugoti</Button>
                <Button variant="outline" onClick={() => setEditingReview(null)} className="flex-1 rounded-xl h-12 border-slate-200 text-slate-600">Atšaukti</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
