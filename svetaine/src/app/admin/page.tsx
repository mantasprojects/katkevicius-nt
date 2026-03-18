"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, ArrowRight, Home, FileText } from "lucide-react"
import Link from "next/link";
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    activeObjects: 0,
    pendingReviews: 0,
    totalBlogPosts: 0
  });

  const [recentReviews, setRecentReviews] = useState<any[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      const supabase = createClient();
      
      try {
        const { count: objCount } = await supabase.from('nt_objektai').select('*', { count: 'exact', head: true });
        const { count: revCount } = await supabase.from('atsiliepimai').select('*', { count: 'exact', head: true }).eq('patvirtinta', false);
        const { count: blogCount } = await supabase.from('tinklarastis_irasai').select('*', { count: 'exact', head: true });

        setStats({
          activeObjects: objCount || 0,
          pendingReviews: revCount || 0,
          totalBlogPosts: blogCount || 0
        });

        // Load 3 recent reviews for the list
        const { data: revData } = await supabase
          .from('atsiliepimai')
          .select('*')
          .eq('patvirtinta', false)
          .order('created_at', { ascending: false })
          .limit(3);

        if (revData) {
           setRecentReviews(revData.map(r => ({
              name: r.vardas,
              rating: r.reitingas,
              status: "pending"
           })));
        }
      } catch (err) {
         console.error("Failed to load dashboard stats:", err);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-sans font-bold text-[#111827]">Sveiki, Mantai</h1>
        <p className="text-slate-500 mt-2 font-medium">Tai jūsų asmeninė NT operacijų erdvė.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm rounded-2xl bg-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/5 rounded-bl-full" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center">
               <Home className="w-4 h-4 mr-2" /> Objektai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-[#111827]">{stats.activeObjects}</p>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 shadow-sm rounded-2xl bg-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-bl-full" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center">
               <Star className="w-4 h-4 mr-2 text-amber-600" /> Nauji Atsiliepimai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-amber-700">{stats.pendingReviews}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm rounded-2xl bg-white overflow-hidden relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/5 rounded-bl-full" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center">
               <FileText className="w-4 h-4 mr-2" /> Įrašai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-[#111827]">{stats.totalBlogPosts}</p>
          </CardContent>
        </Card>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-sm rounded-2xl bg-white flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
            <CardTitle className="text-xl text-[#111827] font-bold">Laukiantys Patvirtinimo</CardTitle>
            <Link href="/admin/atsiliepimai" className="text-sm font-semibold text-[#2563EB] hover:text-[#1d4ed8] transition-colors flex items-center">
              Visi <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col">
            <div className="space-y-4">
              {recentReviews.length > 0 ? (
                recentReviews.map((r, i) => (
                  <div key={i} className="flex justify-between items-center p-5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                    <div>
                      <p className="font-bold text-[#1E3A8A]">{r.name}</p>
                      <p className="text-sm text-slate-500 mt-1 flex items-center">
                        <Star className="w-4 h-4 mr-1.5 text-amber-400 fill-current" /> 
                        {r.rating} / 5
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider rounded-md">
                      Laukia
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Star className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-medium font-sans">Naujų atsiliepimų nėra</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
