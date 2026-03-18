import { Star, Quote, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TestimonialProps {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  image?: string;
  delay?: number;
  dark?: boolean;
}

export default function TestimonialCard({ name, rating = 5, comment, date, image, delay = 0, dark = false }: TestimonialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className={cn(
        "bg-white rounded-[2.5rem] p-10 premium-shadow border border-slate-100/80 flex flex-col h-full hover:border-primary/20 transition-all duration-500 relative z-10 group",
        dark && "bg-white/5 border-white/10 shadow-none backdrop-blur-md hover:bg-white/10"
      )}
    >
      <Quote className={cn("absolute top-8 right-8 w-12 h-12 text-slate-100/40 pointer-events-none group-hover:text-primary/10 transition-colors duration-500", dark && "text-white/10")} />
      
      <div className="flex gap-1.5 mb-8">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-5 h-5 ${i < rating ? "text-amber-400 fill-current" : dark ? "text-white/20" : "text-slate-100"}`} />
        ))}
      </div>
      
      <p className={cn("text-slate-600 font-medium italic mb-10 flex-1 leading-relaxed text-lg", dark && "text-slate-200")}>&quot;{comment}&quot;</p>
      
      <div className={cn("flex items-center gap-5 pt-8 border-t border-slate-50 mt-auto", dark && "border-white/10")}>
        <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] flex items-center justify-center overflow-hidden border-2 border-white shadow-sm shrink-0 group-hover:border-primary/20 transition-colors", dark && "from-white/10 to-white/5 border-white/10")}>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-black text-primary text-base uppercase">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className={cn("font-extrabold text-[#111827] text-base truncate mb-0.5 flex items-center gap-1.5", dark && "text-white")}>
            {name}
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </p>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{date}</p>
        </div>
      </div>
    </motion.div>
  );
}
