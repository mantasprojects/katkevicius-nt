import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import { getViews } from "@/lib/blog-views";
 
 const DATA_FILE = path.join(process.cwd(), "src", "data", "blog-posts.json");
 
 function readPosts() {
   try {
     const data = fs.readFileSync(DATA_FILE, "utf-8");
     const posts = JSON.parse(data);
     const views = getViews();
     return posts.map((p: any) => ({ ...p, views: views[p.slug] || 0 }));
   } catch {
     return [];
   }
 }


function writePosts(posts: unknown[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

import { createClient } from "@/utils/supabase/server";

// GET posts with pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "18", 10);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const supabase = await createClient();

    // 1. Single Post Check
    if (id) {
      const { data: dbPost, error } = await supabase
        .from("tinklarastis_irasai")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && dbPost) {
        return NextResponse.json({
          id: dbPost.id,
          title: dbPost.pavadinimas,
          slug: dbPost.slug,
          content: dbPost.turinys,
          category: dbPost.kategorija,
          image: dbPost.nuotrauka_url,
          author: "Mantas Katkevičius",
          date: dbPost.created_at ? dbPost.created_at.split("T")[0] : "",
          views: dbPost.perziuros || 0,
          status: "published" as const,
          seo_title: dbPost.seo_title || "",
          seo_description: dbPost.seo_description || "",
          focus_keywords: dbPost.focus_keywords || ""
        });
      } else {
        return NextResponse.json({ error: "Straipsnis nerastas." }, { status: 404 });
      }
    }

    // 2. Fetching multiple from Supabase
    let query = supabase
      .from("tinklarastis_irasai")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (category) {
      query = query.eq("kategorija", category);
    }
    
    if (search) {
      query = query.or(`pavadinimas.ilike.%${search}%,turinys.ilike.%${search}%`);
    }

    const { data: dbPosts, error, count } = await query;

    if (!error && dbPosts && dbPosts.length > 0) {
      // Map to frontend structure
      const mappedPosts = dbPosts.map((p: any) => ({
        id: p.id,
        title: p.pavadinimas,
        slug: p.slug,
        content: p.turinys,
        category: p.kategorija,
        image: p.nuotrauka_url,
        author: "Mantas Katkevičius", // default
        date: p.created_at ? p.created_at.split("T")[0] : "",
        views: p.perziuros || 0,
        status: "published" as const,
        seo_title: p.seo_title || "",
        seo_description: p.seo_description || "",
        focus_keywords: p.focus_keywords || ""
      }));

      return NextResponse.json({
        posts: mappedPosts,
        hasMore: (count || 0) > offset + limit
      });
    }

    // 2. Fallback to JSON if Supabase is empty or fails
    console.log("Supabase tuščias arba klaida, naudojamas JSON.");
    const allPosts = readPosts();
    let filtered = allPosts;

    if (category) {
      filtered = filtered.filter((p: any) => p.category === category);
    }
    
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((p: any) => 
        p.title.toLowerCase().includes(q) || 
        (p.content && p.content.toLowerCase().includes(q)) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q))
      );
    }

    const paginated = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      posts: paginated,
      hasMore: filtered.length > offset + limit
    });

  } catch (err) {
    console.error("Blog GET error:", err);
    return NextResponse.json({ error: "Klaida užkraunant straipsnius." }, { status: 500 });
  }
}

// POST — create or update a post
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const posts = readPosts();

    // Generate slug from title if not provided
    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[ąčęėįšųūž]/g, (c: string) => {
          const map: Record<string, string> = { ą: "a", č: "c", ę: "e", ė: "e", į: "i", š: "s", ų: "u", ū: "u", ž: "z" };
          return map[c] || c;
        })
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    // If id exists, update
    const existingIndex = posts.findIndex((p: { id: string }) => p.id === body.id);
    if (existingIndex >= 0) {
      posts[existingIndex] = { ...posts[existingIndex], ...body };
    } else {
      // New post
      body.id = body.slug || Math.random().toString(36).substr(2, 9);
      body.date = body.date || new Date().toISOString().split("T")[0];
      body.author = body.author || "Mantas Katkevičius";
      body.status = body.status || "draft";
      posts.unshift(body);
    }

    writePosts(posts);
    return NextResponse.json({ success: true, post: body });
  } catch (error) {
    console.error("Blog API error:", error);
    return NextResponse.json({ error: "Klaida tvarkant straipsnį." }, { status: 500 });
  }
}

// DELETE — remove post by id
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Trūksta ID." }, { status: 400 });
    }

    const posts = readPosts();
    const filtered = posts.filter((p: { id: string }) => p.id !== id);
    writePosts(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Blog DELETE error:", error);
    return NextResponse.json({ error: "Klaida trinant straipsnį." }, { status: 500 });
  }
}
