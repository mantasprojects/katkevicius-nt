const fs = require('fs');
const path = require('path');

// 1. UPDATE ARTICLES GRID (Move fetch here)
const articlesFile = path.join(process.cwd(), 'src/components/home/ArticlesGrid.tsx');
let articlesContent = `
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

export default function ArticlesGrid() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then(res => res.json())
      .then(data => {
        const postsArray = Array.isArray(data) ? data : (data.posts || []);
        const published = postsArray.filter((p: any) => p.status === "published");
        setArticles(published.slice(0, 3));
        setLoading(false);
      })
      .catch(err => {
        console.error("Klaida kraunant straipsnius:", err);
        setLoading(false);
      });
  }, []);

  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {loading || articles.length === 0 ? (
        [1, 2, 3].map((_, i) => (
          <div key={i} className="bg-slate-50 rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col h-[200px] animate-pulse">
            <div className="h-4 bg-slate-200 rounded-full w-24 mb-4"></div>
            <div className="h-7 bg-slate-200 rounded-full w-5/6 mb-3"></div>
            <div className="h-4 bg-slate-200 rounded-full w-full mb-2"></div>
          </div>
        ))
      ) : (
        articles.map(article => (
          <StaggerItem key={article.id}>
            <Link href={\`/naudinga-informacija/\${article.slug}\`} className="group bg-white rounded-3xl p-8 hover:bg-slate-50 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full hover:-translate-y-1">
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
`;
fs.writeFileSync(articlesFile, articlesContent.trim(), 'utf8');

// 2. UPDATE PAGE.TSX
const pageFile = path.join(process.cwd(), 'src/app/page.tsx');
let page = fs.readFileSync(pageFile, 'utf8');

// A. Pašalinti nereikalingus lucide importus į atskirus failus and useState/useEffect
page = page.replace('import { useState, useEffect } from "react";\n', '');
page = page.replace(
    'import { ArrowRight, Star, Quote, CheckCircle2, Zap, TrendingUp, ShieldCheck } from "lucide-react";',
    'import { ArrowRight } from "lucide-react";'
);

// B. Pašalinti fetch bloką
const useEffectRegex = /useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/;
page = page.replace(useEffectRegex, '');

// C. Pašalinti state kintamuosius
page = page.replace('const [isMounted, setIsMounted] = useState(false);\n', '');
page = page.replace('const [articles, setArticles] = useState<any[]>([]);\n', '');
page = page.replace('const [index, setIndex] = useState(0);\n', '');

// D. Pakeisti <ArticlesGrid articles={articles} /> į <ArticlesGrid />
page = page.replace('<ArticlesGrid articles={articles} />', '<ArticlesGrid />');

// E. PAŠALINTI LCP animaciją: <m.div initial={{ opacity: 0...> -> <div... ok
const lcpAnimationRegex = /<m\.div\s*initial=\{\{\s*opacity:\s*0,\s*scale:\s*0\.95\s*\}\}\s*animate=\{\{\s*opacity:\s*1,\s*scale:\s*1\s*\}\}\s*transition=\{\{\s*duration:\s*1,\s*ease:\s*"easeOut"\s*\}\}\s*(className="[^"]*?")\s*>/;
page = page.replace(lcpAnimationRegex, '<div $1>');
page = page.replace('</m.div>\n        </div>\n      </section>', '</div>\n        </div>\n      </section>');

fs.writeFileSync(pageFile, page, 'utf8');
console.log("Extreme optimizacija baigta sėkmingai!");
