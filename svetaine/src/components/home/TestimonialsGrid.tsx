"use client";

import { useState, useEffect } from "react";
import TestimonialCard from "@/components/ui/testimonial-card";
import { Quote } from "lucide-react";

export default function TestimonialsGrid() {
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
