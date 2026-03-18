import { ChevronLeft, CalendarDays, Clock, ArrowRight } from "lucide-react"
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Metadata } from 'next'
import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"
import { incrementView } from "@/lib/blog-views"


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

function getPosts(): BlogPost[] {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "blog-posts.json");
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export const dynamic = "force-dynamic";

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> => {
  const { slug } = await params;
  const posts = getPosts();
  const article = posts.find(a => a.slug === slug);
  
  if (!article) {
    return { title: "Straipsnis nerastas | Mantas Katkevičius" };
  }

  const siteUrl = "https://katkevicius.lt";
  const metaTitle = `${article.title} | Naudinga informacija | Mantas Katkevičius`;
  const metaDesc = article.excerpt.substring(0, 155);

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      type: 'article',
      title: metaTitle,
      description: metaDesc,
      url: `${siteUrl}/naudinga-informacija/${slug}`,
      images: article.image ? [{
        url: article.image,
        width: 1200,
        height: 630,
        alt: article.title
      }] : [],
      publishedTime: article.date,
    }
  }
}

export default async function SingleArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = getPosts();
  const article = posts.find(a => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Increment view count
  incrementView(slug);


  // Estimate reading time based on content length
  const wordCount = (article.content || "").replace(/<[^>]*>/g, "").split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.image,
    "datePublished": article.date,
    "author": {
      "@type": "Person",
      "name": article.author || "Mantas Katkevičius"
    },
    "publisher": {
      "@type": "Person",
      "name": "Mantas Katkevičius"
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <div className="bg-white border-b border-slate-200 pt-8 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <Link href="/naudinga-informacija" className="inline-flex items-center text-slate-500 hover:text-[#1E3A8A] transition-colors text-sm font-medium">
              <ChevronLeft className="w-4 h-4 mr-1" /> Visi straipsniai
            </Link>
          </div>
          
          <div className="mb-6">
            <div className="inline-block bg-[#1E3A8A] text-white text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded-md shadow-sm">
              {article.category}
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-sans font-bold text-[#111827] mb-6 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-6 text-slate-500 text-sm font-medium mb-10">
            <span className="flex items-center"><CalendarDays className="w-4 h-4 mr-2 text-[#2563EB]" /> {article.date}</span>
            <span className="flex items-center"><Clock className="w-4 h-4 mr-2 text-[#2563EB]" /> {readingTime} min. skaitymo</span>
          </div>

          {article.image && (
            <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-200 aspect-video mb-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {article.content ? (
            <div
              className="prose prose-lg max-w-none text-slate-600 prose-headings:text-[#111827] prose-headings:font-bold prose-a:text-[#2563EB] prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ 
                __html: article.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
              }}
            />
          ) : (
            <div className="prose prose-lg max-w-none text-slate-600">
              <p>{article.excerpt}</p>
            </div>
          )}

          <div className="mt-16 bg-slate-50 rounded-2xl p-8 border border-slate-200 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#111827] mb-2">Reikia asmeninės konsultacijos?</h3>
              <p className="text-slate-600">Aptarkime jūsų situaciją individualiai ir suraskime geriausią sprendimą.</p>
            </div>
            <Link href="/konsultacija" className="shrink-0 w-full md:w-auto">
              <Button className="w-full h-12 px-8 bg-[#2563EB] hover:bg-[#1E3A8A] text-white cursor-pointer">
                Susisiekti <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* GA4 Reading Timer */}
      <script dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var startTime = Date.now();
            var triggered = false;
            window.addEventListener('scroll', function() {
              if (triggered) return;
              var scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
              var timeSpent = (Date.now() - startTime) / 1000;
              if (timeSpent > 60 && scrollPercent > 0.3) {
                if (typeof window.gtag === 'function') {
                  window.gtag('event', 'naudinga_info_skaitymas', {
                    'article_title': "${article.title.replace(/"/g, '\\"')}"
                  });
                  triggered = true;
                }
              }
            });
          })();
        `
      }} />
    </div>
  )
}
