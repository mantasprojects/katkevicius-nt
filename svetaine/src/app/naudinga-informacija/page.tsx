import Link from "next/link";
import { ArrowRight, Calendar, User, Search } from "lucide-react";
import { Metadata } from "next";
import fs from "fs";
import path from "path";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import ArticleList from "@/components/blog/ArticleList";

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

export const metadata: Metadata = {
  title: "Naudinga Informacija | Mantas Katkevičius",
  description: "Aktualijos, patarimai ir įžvalgos besidomintiems nekilnojamojo turto rinka. Profesionalūs patarimai iš nekilnojamojo turto pardavimų eksperto.",
};

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

interface Category {
  id: string;
  name: string;
  color: string;
}

function getPosts(): BlogPost[] {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "blog-posts.json");
    const data = fs.readFileSync(filePath, "utf-8");
    const posts: BlogPost[] = JSON.parse(data);
    return posts.filter((p) => p.status === "published");
  } catch {
    return [];
  }
}

function getCategories(): Category[] {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "blog-categories.json");
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

import { Suspense } from "react";
import SearchInput from "@/components/blog/SearchInput";

export const dynamic = "force-dynamic";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category;
  const searchQuery = params.search;

  const supabase = await createClient();
  const categories = getCategories();
  let articles: any[] = [];
  let hasMoreInitial = false;
  let allArticlesJson: BlogPost[] = [];

  try {
    allArticlesJson = getPosts();
  } catch {
    allArticlesJson = [];
  }

  // 1. Try Supabase
  let query = supabase
    .from("tinklarastis_irasai")
    .select("*", { count: "exact" })
    .range(0, 18) // Get 19 items: 1 for featured, 18 for list
    .order("created_at", { ascending: false });

  if (selectedCategory) {
    query = query.eq("kategorija", selectedCategory);
  }
  if (searchQuery) {
    query = query.or(`pavadinimas.ilike.%${searchQuery}%,turinys.ilike.%${searchQuery}%`);
  }

  const { data: dbPosts, error, count } = await query;

  let dbPostsMapped: BlogPost[] = [];
  if (!error && dbPosts && dbPosts.length > 0) {
    dbPostsMapped = dbPosts.map((p: any) => ({
      id: p.id,
      title: p.pavadinimas,
      slug: p.slug,
      excerpt: p.turinys ? p.turinys.replace(/<[^>]*>?/gm, '').substring(0, 160) + "..." : "",
      category: p.kategorija,
      image: p.nuotrauka_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
      author: "Mantas Katkevičius",
      date: p.created_at ? p.created_at.split("T")[0] : "",
      status: "published" as const
    }));
  }

  // Merge lists, deduplicating by slug (Supabase overrides JSON)
  const mergedPosts = [...dbPostsMapped];
  allArticlesJson.forEach(p => {
    if (!mergedPosts.some(m => m.slug === p.slug)) {
      mergedPosts.push(p);
    }
  });

  // Filter merged lists by search
  let filtered = [...mergedPosts];
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(q) || 
      (p.excerpt && p.excerpt.toLowerCase().includes(q))
    );
  }

  // Group by category to TOP instead of hiding others, so the grid is populated
  if (selectedCategory) {
    const matching = filtered.filter(p => p.category === selectedCategory);
    const nonMatching = filtered.filter(p => p.category !== selectedCategory);
    filtered = [...matching, ...nonMatching];
  }

  articles = filtered.slice(0, 19);
  hasMoreInitial = filtered.length > 19;

  const activeCategories = categories.filter((cat) =>
    mergedPosts.some((a) => a.category === cat.name)
  );

  const isEmptyMaster = mergedPosts.length === 0;

  if (isEmptyMaster) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <section className="pt-24 pb-16">
          <div className="container px-4 text-center max-w-3xl mx-auto">
            <p className="text-[#2563EB] font-semibold tracking-wider uppercase text-sm mb-4">Tinklaraštis</p>
            <h1 className="text-4xl md:text-5xl font-bold text-[#111827] tracking-tight mb-6">
              Naudinga <span className="text-[#2563EB]">Informacija</span>
            </h1>
            <p className="text-slate-500 text-lg">Straipsniai ruošiami. Grįžkite netrukus!</p>
          </div>
        </section>
      </div>
    );
  }

  const featured = articles[0];
  const rest = articles.slice(1);


  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#1E40AF] text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="container px-4 mx-auto max-w-7xl relative z-10 pt-24 pb-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">

              Naudinga{" "}
              <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                Informacija
              </span>
            </h1>
            <p className="text-blue-200/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
              Profesionalūs patarimai, teisinės įžvalgos bei nekilnojamojo turto rinkos aktualijos Jūsų sėkmingiems sprendimams.
            </p>

            {/* Search Input */}
            <Suspense fallback={<div className="h-14 bg-white/10 rounded-2xl animate-pulse max-w-xl mx-auto mb-8" />}>
              <SearchInput />
            </Suspense>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Link
              href="/naudinga-informacija"
              scroll={false}
              className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border transition-all ${
                !selectedCategory
                  ? "bg-white text-[#1E3A8A] border-white shadow-lg"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              }`}
            >
              Visi
            </Link>
            {activeCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/naudinga-informacija?category=${encodeURIComponent(cat.name)}`}
                scroll={false}
                className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border transition-all flex items-center gap-2 ${
                  selectedCategory === cat.name
                    ? "bg-white text-[#1E3A8A] border-white shadow-lg"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }`}
                style={selectedCategory === cat.name ? {} : { borderColor: `${cat.color}40` }}
              >
                <span 
                  className="w-2 h-2 rounded-full inline-block" 
                  style={{ backgroundColor: cat.color }} 
                />
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-[1px]">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full scale-y-110 origin-bottom">
            <path d="M0 80h1440V40c-240 30-480 50-720 40S240 30 0 50v30z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {articles.length === 0 ? (
        <section className="py-20 bg-[#F8FAFC] text-center">
          <div className="container px-4 mx-auto">
            <p className="text-slate-500 text-lg">Nėra straipsnių pagal nurodytus paieškos kriterijus.</p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Article */}
          <section className="py-12 bg-[#F8FAFC]">
            <div className="container px-4 mx-auto max-w-7xl">
              <Link
                href={`/naudinga-informacija/${featured.slug}`}
                className="group flex flex-col lg:flex-row gap-0 bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/80 transition-all duration-500 border border-slate-100"
              >
                <div className="w-full lg:w-3/5 h-[280px] lg:h-[420px] relative overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  sizes="(max-width: 1200px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(1200, 800))}`}
                />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/5" />
              <div className="absolute top-6 left-6">
                <span
                  className="px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg"
                  style={{
                    backgroundColor: activeCategories.find((c) => c.name === featured.category)?.color || "#2563EB",
                  }}
                >
                  {featured.category}
                </span>
              </div>
            </div>
            <div className="w-full lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center text-sm font-medium text-slate-400 mb-5 gap-5">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> {featured.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" /> {featured.author}
                </span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-[#111827] mb-4 group-hover:text-[#2563EB] transition-colors leading-tight">
                {featured.title}
              </h2>
              <p className="text-slate-500 text-base lg:text-lg leading-relaxed mb-8 line-clamp-3">
                {featured.excerpt}
              </p>
              <div className="inline-flex items-center font-bold text-[#2563EB] group-hover:gap-3 gap-2 transition-all mt-auto">
                Skaityti straipsnį
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Article Grid */}
      {rest.length > 0 && (
        <section className="py-16 bg-[#F8FAFC]">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight">
                Naujausi straipsniai
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent ml-6" />
            </div>

            <ArticleList 
              initialArticles={rest} 
              hasMoreInitial={hasMoreInitial} 
              category={selectedCategory || undefined} 
              search={searchQuery || undefined}
              activeCategories={activeCategories}
            />
          </div>
        </section>
      )}
      </>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container px-4 mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-extrabold text-[#111827] mb-4 tracking-tight">
            Turite klausimų apie nekilnojamąjį turtą?
          </h2>
          <p className="text-slate-500 text-lg mb-8 max-w-2xl mx-auto">
            Susisiekite ir gaukite profesionalią konsultaciją, pritaikytą jūsų situacijai.
          </p>
          <Link href="/konsultacija">
            <button className="h-14 px-10 bg-[#1E3A8A] hover:bg-[#111827] text-white text-base font-bold rounded-xl shadow-xl shadow-[#1E3A8A]/20 transition-all hover:-translate-y-0.5 cursor-pointer">
              Užsisakyti konsultaciją <ArrowRight className="w-5 h-5 inline ml-2" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
