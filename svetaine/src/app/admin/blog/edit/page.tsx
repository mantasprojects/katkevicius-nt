"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, Eye, Upload, Image as ImageIcon, 
  FileText, Globe, Clock, CheckCircle2, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
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

function BlogEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [post, setPost] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Patarimai",
    author: "Mantas Katkevičius",
    image: "",
    date: new Date().toISOString().split("T")[0],
    status: "draft",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(!!editId);
  const [categories, setCategories] = useState<Category[]>([]);
  const [viewMode, setViewMode] = useState<"visual" | "html">("visual");

  // Load categories
  useEffect(() => {
    fetch("/api/blog/categories")
      .then((res) => res.json())
      .then((data: Category[]) => setCategories(data))
      .catch(() => {});
  }, []);

  // Load existing post for editing
  useEffect(() => {
    if (editId) {
      fetch("/api/blog")
        .then((res) => res.json())
        .then((posts: BlogPost[]) => {
          const found = posts.find((p) => p.id === editId);
          if (found) setPost(found);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [editId]);

  // Auto-generate slug from title
  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[ąčęėįšųūž]/g, (c) => {
        const map: Record<string, string> = {
          ą: "a", č: "c", ę: "e", ė: "e", į: "i", š: "s", ų: "u", ū: "u", ž: "z",
        };
        return map[c] || c;
      })
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }, []);

  const handleTitleChange = (title: string) => {
    setPost((prev) => ({
      ...prev,
      title,
      slug: prev?.id ? prev.slug : generateSlug(title),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isInline = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // 1. Create Image object from File
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // 2. Setup Canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context is not available");

      // 3. Calculate dimension limits
      let width = img.width;
      let height = img.height;
      const maxWidth = isInline ? 1200 : 1920; // 1200px inline, 1920px featured

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // 4. Draw Image
      ctx.drawImage(img, 0, 0, width, height);

      // 5. Convert to WebP Blob with 80% quality
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/webp", 0.8);
      });

      if (!blob) throw new Error("Failed to create blob from canvas");

      // 6. Append to FormData
      const formData = new FormData();
      // Generate a clean webp filename
      const cleanName = file.name.split(".")[0].replace(/[^a-z0-9]/gi, "-").toLowerCase();
      formData.append("files", blob, `${cleanName}.webp`);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.urls?.[0]) {
        if (isInline) {
          // Inline mode handles insertion elsewhere, like returning URL
          return data.urls[0];
        } else {
          setPost((prev) => ({ ...prev, image: data.urls[0] }));
        }
      }
    } catch (err) {
      console.error("Klaida įkeliant nuotrauką:", err);
    } finally {
      setIsUploading(false);
      // Clean up object URL
      if (img.src) URL.revokeObjectURL(img.src);
    }
  };

  const handleSave = async (status?: "published" | "draft") => {
    setIsSaving(true);
    setIsSaved(false);

    const payload = { ...post };
    if (status) payload.status = status;

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsSaved(true);
        if (!editId && data.post?.id) {
          // Redirect to edit mode for the new post
          router.replace(`/admin/blog/edit?id=${data.post.id}`);
        }
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      console.error("Klaida saugant:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Kraunamas straipsnis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog">
            <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight">
              {editId ? "Redaguoti straipsnį" : "Naujas straipsnis"}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {post.status === "published" ? (
                <span className="flex items-center gap-1 text-emerald-600">
                  <Globe className="w-3.5 h-3.5" /> Publikuotas
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-600">
                  <Clock className="w-3.5 h-3.5" /> Juodraštis
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="flex items-center gap-1 text-emerald-600 text-sm font-bold animate-in fade-in duration-300">
              <CheckCircle2 className="w-4 h-4" /> Išsaugota!
            </span>
          )}
          <Button
            variant="outline"
            onClick={() => handleSave("draft")}
            disabled={isSaving}
            className="h-10 px-5 font-bold rounded-xl border-slate-200 cursor-pointer"
          >
            <Save className="w-4 h-4 mr-2" /> Juodraštis
          </Button>
          <Button
            onClick={() => handleSave("published")}
            disabled={isSaving}
            className="h-10 px-5 bg-[#2563EB] hover:bg-[#1d4ed8] font-bold rounded-xl shadow-lg shadow-[#2563EB]/20 cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Globe className="w-4 h-4 mr-2" />
            )}
            Publikuoti
          </Button>
          {post.slug && (
            <Link href={`/naudinga-informacija/${post.slug}`} target="_blank">
              <Button variant="outline" className="h-10 px-4 font-bold rounded-xl border-slate-200 cursor-pointer">
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block">
              Pavadinimas
            </Label>
            <Input
              value={post.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Įveskite straipsnio pavadinimą..."
              className="h-14 text-xl font-bold border-0 border-b border-slate-100 rounded-none px-0 focus:ring-0 focus-visible:ring-0 bg-transparent placeholder:text-slate-300"
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block">
              Trumpas aprašymas (SEO)
            </Label>
            <textarea
              value={post.excerpt}
              onChange={(e) => setPost((p) => ({ ...p, excerpt: e.target.value }))}
              placeholder="Trumpas aprašymas, kuris bus rodomas paieškos rezultatuose..."
              className="w-full min-h-[80px] border-0 border-b border-slate-100 bg-transparent p-0 text-base focus:outline-none focus:ring-0 resize-none placeholder:text-slate-300 font-sans"
              maxLength={300}
            />
            <p className="text-right text-xs text-slate-400 mt-2">
              {post.excerpt?.length || 0}/300
            </p>
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Turinys {viewMode === "html" ? "(HTML)" : "(Vizualus)"}
              </Label>
              <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode("visual")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    viewMode === "visual"
                      ? "bg-white shadow-sm text-slate-800"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Vizualus
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("html")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    viewMode === "html"
                      ? "bg-white shadow-sm text-slate-800"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Kodas (HTML)
                </button>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              {/* Simple toolbar */}
              <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 flex-wrap">
                {[
                  { label: "H2", tag: "<h2>, close: </h2>" },
                  { label: "H3", tag: "<h3>, close: </h3>" },
                  { label: "B", tag: "<strong>, close: </strong>" },
                  { label: "I", tag: "<em>, close: </em>" },
                  { label: "P", tag: "<p>, close: </p>" },
                  { label: "UL", tag: "<ul>\n<li>, close: </li>\n</ul>" },
                  { label: "LI", tag: "<li>, close: </li>" },
                  { label: "Link", tag: '<a href="">', close: "</a>" },
                  { label: "Img", tag: '<img src="" alt="" class="rounded-xl w-full" />', close: "" },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()} // Prevents contentEditable from losing focus!
                    onClick={() => {
                      if (viewMode === "html") {
                        const textarea = document.getElementById("blog-content") as HTMLTextAreaElement;
                        if (!textarea) return;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const selected = textarea.value.substring(start, end);
                        const replacement = `${btn.tag}${selected}${btn.close}`;
                        const newContent = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
                        setPost((p) => ({ ...p, content: newContent }));
                        setTimeout(() => {
                          textarea.focus();
                          textarea.selectionStart = start + btn.tag.length;
                          textarea.selectionEnd = start + btn.tag.length + selected.length;
                        }, 0);
                      } else {
                        // Visual Mode using execCommand
                        if (btn.label === "B") document.execCommand("bold");
                        else if (btn.label === "I") document.execCommand("italic");
                        else if (btn.label === "H2") document.execCommand("formatBlock", false, "<h2>");
                        else if (btn.label === "H3") document.execCommand("formatBlock", false, "<h3>");
                        else if (btn.label === "P") document.execCommand("formatBlock", false, "<p>");
                        else if (btn.label === "UL") document.execCommand("insertUnorderedList");
                        else if (btn.label === "LI") document.execCommand("insertHTML", false, "<li>naujas skirsnis</li>");
                        else if (btn.label === "Link") {
                          const url = prompt("Įveskite URL adresą:");
                          if (url) document.execCommand("createLink", false, url);
                        }
                        else if (btn.label === "Img") {
                          const url = prompt("Nuotraukos URL:");
                          if (url) document.execCommand("insertHTML", false, `<img src="${url}" class="rounded-xl w-full my-4" alt="" />`);
                        }
                        
                        const editDiv = document.getElementById("blog-content-visual");
                        if (editDiv) {
                          setPost(p => ({ ...p, content: editDiv.innerHTML }));
                        }
                      }
                    }}
                    className="px-3 py-1.5 rounded-md text-xs font-bold text-slate-600 hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                  >
                    {btn.label}
                  </button>
                ))}

                {/* Inline Image Upload */}
                <label className="px-3 py-1.5 rounded-md text-xs font-bold text-slate-600 hover:bg-white hover:shadow-sm transition-all cursor-pointer flex items-center gap-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const url = await handleImageUpload(e, true);
                      if (url) {
                        if (viewMode === "html") {
                          const textarea = document.getElementById("blog-content") as HTMLTextAreaElement;
                          if (textarea) {
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const replacement = `<img src="${url}" alt="" class="rounded-xl w-full my-4" />`;
                            const newContent = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
                            setPost((p) => ({ ...p, content: newContent }));
                          }
                        } else {
                          document.execCommand("insertHTML", false, `<img src="${url}" class="rounded-xl w-full my-4" alt="" />`);
                          const editDiv = document.getElementById("blog-content-visual");
                          if (editDiv) {
                            setPost(p => ({ ...p, content: editDiv.innerHTML }));
                          }
                        }
                      }
                    }}
                  />
                  <ImageIcon className="w-3.5 h-3.5" /> +Įkelti
                </label>
              </div>

              {viewMode === "html" ? (
                <textarea
                  id="blog-content"
                  value={post.content}
                  onChange={(e) => setPost((p) => ({ ...p, content: e.target.value }))}
                  placeholder="<h2>Antraštė</h2>\n<p>Jūsų straipsnio turinys...</p>"
                  className="w-full min-h-[400px] p-4 text-sm font-mono bg-white focus:outline-none resize-y border-0"
                />
              ) : (
                <div
                  id="blog-content-visual"
                  contentEditable={true}
                  onInput={(e) => {
                    const html = e.currentTarget.innerHTML;
                    setPost(p => p.content === html ? p : ({ ...p, content: html }));
                  }}
                  className="w-full min-h-[400px] p-6 text-base bg-white focus:outline-none resize-none border-0 prose max-w-none text-slate-700 font-sans [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#111827] [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#111827] [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:mb-1 [&_strong]:font-bold [&_em]:italic [&_a]:text-[#2563EB] [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: post.content || "" }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block">
              <ImageIcon className="w-4 h-4 inline mr-1" /> Pagrindinė nuotrauka
            </Label>
            {post.image ? (
              <div className="relative rounded-xl overflow-hidden mb-3 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.image} alt="Cover" className="w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={() => setPost((p) => ({ ...p, image: "" }))}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center mb-3">
                <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Nėra nuotraukos</p>
              </div>
            )}
            <div className="space-y-2">
              <label className="w-full">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <div className="flex items-center justify-center h-10 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 transition-colors cursor-pointer">
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  {isUploading ? "Keliama..." : "Įkelti nuotrauką"}
                </div>
              </label>
              <Input
                value={post.image}
                onChange={(e) => setPost((p) => ({ ...p, image: e.target.value }))}
                placeholder="arba įklijuokite URL..."
                className="h-9 text-xs rounded-lg border-slate-200"
              />
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              <FileText className="w-4 h-4 inline mr-1" /> Metaduomenys
            </Label>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-slate-500">Slug (URL)</Label>
              <Input
                value={post.slug}
                onChange={(e) => setPost((p) => ({ ...p, slug: e.target.value }))}
                placeholder="straipsnio-pavadinimas"
                className="h-9 text-sm rounded-lg border-slate-200 font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-slate-500">Kategorija</Label>
              <select
                value={post.category}
                onChange={(e) => setPost((p) => ({ ...p, category: e.target.value }))}
                className="w-full h-9 text-sm rounded-lg border border-slate-200 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-slate-500">Data</Label>
              <Input
                type="date"
                value={post.date}
                onChange={(e) => setPost((p) => ({ ...p, date: e.target.value }))}
                className="h-9 text-sm rounded-lg border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-slate-500">Autorius</Label>
              <Input
                value={post.author}
                onChange={(e) => setPost((p) => ({ ...p, author: e.target.value }))}
                className="h-9 text-sm rounded-lg border-slate-200"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogEditorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BlogEditorContent />
    </Suspense>
  );
}
