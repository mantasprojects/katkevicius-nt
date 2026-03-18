"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText, Plus, Pencil, Trash2, Eye, Search,
  Calendar, Tag, CheckCircle2, Clock, AlertCircle, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { deletePost } from "@/app/actions/blog";
import { useState as useReactState } from "react";
import { Input } from "@/components/ui/input";

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
  views?: number;
}


export default function AdminBlogPage() {
  const supabase = createClient();
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const showNotice = (m: string, t: 'success' | 'error' = 'success') => { setNotification({ message: m, type: t }); setTimeout(() => setNotification(null), 3000); };
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalStats, setTotalStats] = useState({ total: 0, published: 0, draft: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
         setOffset(0);
         fetchPosts(false, search);
    }, 500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchPosts = async (isAppend: boolean = false, currentSearch: string = search) => {
    try {
      if (!isAppend) setLoading(true);
      
      if (!isAppend) {
         const { count: absCount } = await supabase.from('tinklarastis_irasai').select('*', { count: 'exact', head: true });
         setTotalStats({ total: absCount || 0, published: absCount || 0, draft: 0 });
      }
      
      let query = supabase
        .from('tinklarastis_irasai')
        .select('*');

      if (currentSearch.trim()) {
         query = query.or(`pavadinimas.ilike.%${currentSearch.trim()}%,kategorija.ilike.%${currentSearch.trim()}%`);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(isAppend ? offset : 0, (isAppend ? offset : 0) + 29);

      if (data) {
        const mapped = data.map((p: any) => ({
          id: p.id,
          title: p.pavadinimas,
          slug: p.slug,
          excerpt: p.turinys ? (p.turinys.substring(0, 100) + '...') : '',
          category: p.kategorija || 'Naujienos',
          author: 'Mantas',
          image: p.nuotrauka_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
          date: p.created_at ? p.created_at.split('T')[0] : '',
          status: 'published',
          views: p.perziuros || 0
        }));

        setPosts((prev) => isAppend ? [...prev, ...mapped] : mapped as any);
        setHasMore(data.length === 30);
      } else {
        if (!isAppend) setPosts([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error("Klaida gaunant straipsnius:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
     const nextOffset = offset + 30;
     setOffset(nextOffset);
     fetchPosts(true, search);
  };

  const handleDelete = async (id: string) => {
    const res = await deletePost(id);
    if (res.success) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      showNotice("Straipsnis sėkmingai ištrintas");
    } else {
      showNotice(res.error || "Klaida trinant", "error");
    }
    setDeleteConfirm(null);
  };

  const toggleStatus = async (post: BlogPost) => {
     showNotice("Statuso keitimas laikinai išjungtas", "error");
  };

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  if (loading) {
    
return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Kraunami straipsniai...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {notification && (
        <div className={`fixed top-6 right-6 p-4 rounded-xl shadow-2xl font-bold text-white transition-all transform z-50 ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {notification.message}
        </div>
      )}
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#2563EB]" />
            Tinklaraštis
          </h1>
          <p className="text-slate-500 mt-1">Valdykite savo straipsnius ir publikacijas</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/blog/categories">
            <Button variant="outline" className="h-12 px-5 font-bold rounded-xl border-slate-200 cursor-pointer">
              <Tag className="w-5 h-5 mr-2" /> Kategorijos
            </Button>
          </Link>
          <Link href="/admin/blog/edit">
            <Button className="h-12 px-6 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold rounded-xl shadow-lg shadow-[#2563EB]/20 cursor-pointer">
              <Plus className="w-5 h-5 mr-2" /> Naujas straipsnis
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#111827]">{totalStats.total}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Viso straipsnių</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#111827]">{totalStats.published}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Publikuoti</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#111827]">{totalStats.draft}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Juodraščiai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ieškoti straipsnių..."
            className="pl-10 h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white w-full"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                filter === f
                  ? "bg-[#2563EB] text-white shadow-md"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {f === "all" ? "Visi" : f === "published" ? "Publikuoti" : "Juodraščiai"}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Table */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 border border-slate-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-[#111827] mb-2">Straipsnių nerasta</h3>
          <p className="text-slate-500 mb-6">
            {search ? "Bandykite kitą paieškos frazę." : "Sukurkite savo pirmąjį straipsnį!"}
          </p>
          {!search && (
            <Link href="/admin/blog/edit">
              <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] cursor-pointer">
                <Plus className="w-4 h-4 mr-2" /> Kurti straipsnį
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredPosts.map((post) => (
              <div key={post.id} className="flex flex-col md:flex-row md:items-center gap-4 p-5 hover:bg-slate-50/50 transition-colors group">
                {/* Info Group (Image + Text) */}
                <div className="flex items-start gap-4 flex-1 min-w-0 w-full">
                  {/* Image */}
                  <div className="w-16 h-12 md:w-20 md:h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 mt-0.5">
                    {post.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#111827] text-sm md:text-base leading-snug group-hover:text-[#2563EB] transition-colors line-clamp-2 md:line-clamp-1" title={post.title}>
                      {post.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar className="w-3 h-3 flex-shrink-0" /> {post.date}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Tag className="w-3 h-3 flex-shrink-0" /> {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                        <Eye className="w-3 w-3 flex-shrink-0" /> {post.views || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions & Status Group */}
                <div className="flex items-center justify-between md:justify-end w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t border-slate-100 md:border-t-0 gap-3 flex-shrink-0">
                  {/* Status Button */}
                  <button
                    onClick={() => toggleStatus(post)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      post.status === "published"
                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                    }`}
                  >
                    {post.status === "published" ? "Publikuotas" : "Juodraštis"}
                  </button>

                  {/* Actions Buttons */}
                  <div className="flex items-center gap-1">
                    <Link href={`/naudinga-informacija/${post.slug}`} target="_blank">
                      <button className="w-9 h-9 rounded-lg bg-slate-50 hover:bg-[#EFF6FF] text-slate-400 hover:text-[#2563EB] flex items-center justify-center transition-colors cursor-pointer" title="Peržiūrėti">
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                    <Link href={`/admin/blog/edit?id=${post.id}`}>
                      <button className="w-9 h-9 rounded-lg bg-slate-50 hover:bg-[#EFF6FF] text-slate-400 hover:text-[#2563EB] flex items-center justify-center transition-colors cursor-pointer" title="Redaguoti">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </Link>

                    {deleteConfirm === post.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="w-9 h-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                          title="Patvirtinti"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="w-9 h-9 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
                          title="Atšaukti"
                        >
                          <AlertCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        className="w-9 h-9 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                        title="Trinti"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {hasMore && (
          <div className="flex justify-center mt-8 pb-10">
            <Button onClick={loadMore} className="h-12 px-8 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold rounded-xl shadow-lg shadow-[#2563EB]/20 cursor-pointer flex items-center gap-2">
              Rodyti daugiau <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
        </>
      )}
    </div>
    </>
  );
}
