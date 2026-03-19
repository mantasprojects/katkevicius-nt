const fs = require('fs');
const path = require('path');

const pageFile = path.join(process.cwd(), 'src/app/naudinga-informacija/[slug]/page.tsx');
let page = fs.readFileSync(pageFile, 'utf8');

const regexToReplace = /const blogSchema = \{[\s\S]*?\};\n/g;

const replacement = \`// 1. Article / BlogPosting Schema
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
        "item": \`https://katkevicius.lt/naudinga-informacija?category=\${encodeURIComponent(article.category || '')}\`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": article.title,
        "item": \`https://katkevicius.lt/naudinga-informacija/\${slug}\`
      }
    ]
  };

  // 3. FAQ Schema (Extract H2/H3 and subsequent P tags)
  let faqSchema = null;
  if (article.content) {
    const rawContent = article.content;
    const headingRegex = /<h[23][^>]*>(.*?)<\\/h[23]>\\s*<p[^>]*>(.*?)<\\/p>/gi;
    const matches = [...rawContent.matchAll(headingRegex)];
    
    // Take exactly 2 reliable pairs to convert to Q&A
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

  const schemas = [blogSchema, breadcrumbSchema];
  if (faqSchema) schemas.push(faqSchema);
\`;

page = page.replace(regexToReplace, replacement);

const scriptTagRegex = /dangerouslySetInnerHTML=\{\{\s*__html:\s*JSON\.stringify\(blogSchema\)\s*\}\}/g;
page = page.replace(scriptTagRegex, 'dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}');

fs.writeFileSync(pageFile, page, 'utf8');
console.log('Schemas patched successfully.');
