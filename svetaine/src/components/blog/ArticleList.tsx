"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  image: string;
  date: string;
  status: "published" | "draft";
}

interface ArticleListProps {
  initialArticles: BlogPost[];
  hasMoreInitial: boolean;
  category?: string;
  search?: string;
  activeCategories: { id: string; name: string; color: string }[];
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect width="${w}" height="${h}" fill="url(#g)" />
  <animate attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"/>
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export default function ArticleList({
  initialArticles,
  hasMoreInitial,
  category,
  search,
  activeCategories,
}: ArticleListProps) {
  const [articles, setArticles] = useState<BlogPost[]>(initialArticles);
  const [hasMore, setHasMore] = useState(hasMoreInitial);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    setIsLoading(true);
    try {
      const offset = articles.length;
      let url = `/api/blog?offset=${offset}&limit=18`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.posts) {
        setArticles((prev) => [...prev, ...data.posts]);
        setHasMore(data.hasMore);
      }
    } catch (err) {
      console.error("Failed to load more posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => {
          const catColor = activeCategories.find((c) => c.name === article.category)?.color || "#2563EB";
          return (
            <Link
              href={`/naudinga-informacija/${article.slug}`}
              key={article.id}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 border border-slate-100 hover:-translate-y-1"
            >
              <div className="relative h-[220px] overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-md"
                    style={{ backgroundColor: catColor }}
                  >
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-extrabold text-[#111827] group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug mb-3">
                  {article.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed flex-1 mb-5">
                  {article.excerpt}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {article.date}
                  </span>
                  <span className="text-xs font-bold text-[#2563EB] group-hover:gap-1.5 gap-1 transition-all flex items-center">
                    Skaityti <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-3 bg-[#1E3A8A] hover:bg-[#111827] text-white text-sm font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Rodyti daugiau"}
          </button>
        </div>
      )}
    </div>
  );
}
