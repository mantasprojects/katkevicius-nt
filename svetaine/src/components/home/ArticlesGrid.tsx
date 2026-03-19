"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

export default function ArticlesGrid({ articles }: { articles: any[] }) {
  return (
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
  );
}
