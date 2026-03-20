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

  // 1. Article / BlogPosting Schema
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.image,
    "datePublished": article.date,
    "dateModified": article.date,
    "author": {
      "@type": "Person",
      "name": "Mantas Katkevičius",
      "jobTitle": "NT pardavimų ekspertas",
      "url": "https://katkevicius.lt"
    },
    "publisher": {
      "@type": "Person",
      "name": "Mantas Katkevičius",
      "url": "https://katkevicius.lt"
    }
  };

  // 2. BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Pradžia",
        "item": "https://katkevicius.lt/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Naudinga informacija",
        "item": "https://katkevicius.lt/naudinga-informacija"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.category || "Patarimai",
        "item": `https://katkevicius.lt/naudinga-informacija?category=${encodeURIComponent(article.category || '')}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": article.title,
        "item": `https://katkevicius.lt/naudinga-informacija/${slug}`
      }
    ]
  };

  // 3. FAQ Schema (Extract H2/H3 and subsequent P tags)
  let faqSchema = null;
  if (article.content) {
    const rawContent = article.content;
    const headingRegex = /<h[23][^>]*>(.*?)<\/h[23]>\s*<p[^>]*>(.*?)<\/p>/gi;
    const matches = [...rawContent.matchAll(headingRegex)];
    
    const validFaqs = matches
      .map(m => ({
        q: m[1].replace(/<[^>]+>/g, '').trim(),
        a: m[2].replace(/<[^>]+>/g, '').trim()
      }))
      .filter(faq => faq.q.length > 10 && faq.a.length > 20)
      .slice(0, 2);

    if (validFaqs.length > 0) {
      faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": validFaqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      };
    }
  }

  const schemas: any[] = [blogSchema, breadcrumbSchema];
  if (faqSchema) schemas.push(faqSchema);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
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

          {/* Integrated Author & CTA Block (Max Tier Design) */}
          <div className="relative mt-20 md:mt-24 mb-10 overflow-hidden bg-white border border-slate-200/60 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] group transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(37,99,235,0.15)]">
            
            {/* Ambient Background Gradient inside card */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-50/80 via-transparent to-transparent opacity-70 pointer-events-none rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-slate-50/80 via-transparent to-transparent opacity-80 pointer-events-none rounded-tr-full" />
            
            <div className="p-10 md:p-16 relative z-10 flex flex-col items-center text-center">
              
              {/* Author Section */}
              <div className="mb-8">
                <h3 className="text-3xl md:text-[2.5rem] font-sans font-extrabold text-slate-950 tracking-tight mb-6">
                  Mantas Katkevičius
                </h3>
                <div className="inline-flex items-center bg-blue-50 border border-blue-100/80 rounded-full px-5 py-2 mb-6 shadow-sm">
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse mr-2" />
                  <p className="text-blue-700 text-sm md:text-[15px] font-bold uppercase tracking-widest leading-none m-0">NT Pardavimų Ekspertas</p>
                </div>
                <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                  kurio strateginis požiūris ir technologinis pranašumas užtikrina maksimalią turto vertę klientams.
                </p>
              </div>

              {/* Elegant Divider */}
              <div className="w-16 h-1 bg-slate-200 my-10 rounded-full" />

              {/* CTA Section */}
              <div className="w-full max-w-lg mx-auto">
                <h4 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">Reikia asmeninės konsultacijos?</h4>
                <p className="text-slate-500 mb-10 text-base md:text-lg px-4">
                  Aptarkime jūsų situaciją individualiai ir suraskime geriausią sprendimą.
                </p>
                
                <Link href="/kontaktai" className="block w-full sm:w-auto">
                  <Button className="h-16 w-full sm:w-auto px-12 rounded-2xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-bold text-lg shadow-[0_10px_30px_-10px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                    Susisiekti <ArrowRight className="w-6 h-6 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
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
