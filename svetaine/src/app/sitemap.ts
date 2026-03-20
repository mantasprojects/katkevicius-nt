import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://katkevicius.lt';

  // 1. Static and Service Routes (High Priority for indexability)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/pardavimas`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/pirkimas`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/nuoma`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/kontaktai`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/konsultacija`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/objektai`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/naudinga-informacija`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/atsiliepimai`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/duk`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/privatumo-politika`, priority: 0.5, changeFrequency: 'monthly' as const }
  ].map(route => ({
    ...route,
    lastModified: new Date()
  }));

  // 2. Dynamic properties
  let propertyRoutes: MetadataRoute.Sitemap = [];
  try {
    const propsPath = path.join(process.cwd(), 'src/data/properties.json');
    if (fs.existsSync(propsPath)) {
      const properties = JSON.parse(fs.readFileSync(propsPath, 'utf8'));
      propertyRoutes = properties.map((p: any) => ({
        url: `${baseUrl}/objektai/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error("Sitemap properties err", err);
  }

  // 3. Dynamic Blog Posts from Supabase (300+ records)
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: posts, error } = await supabase
      .from('tinklarastis_irasai')
      .select('slug, created_at');

    if (error) {
      console.error("Supabase sitemap fetch error:", error);
    } else if (posts) {
      blogRoutes = posts.map((post) => ({
        url: `${baseUrl}/naudinga-informacija/${post.slug}`,
        // Using created_at since updated_at is absent from DB currently. 
        // Fallback to Date.now() if invalid.
        lastModified: post.created_at ? new Date(post.created_at) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.error("Sitemap blog exception:", err);
  }

  // 4. Dynamic FAQs (from faq_irasai)
  // Currently, FAQ items are rendered as accordions inside /duk page.
  // We append them as hash links so Google is aware they exist, without 404s.
  // Example: /duk#faq-question-slug
  let faqRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: faqs, error: faqError } = await supabase
      .from('faq_irasai')
      .select('id, klausimas');
      
    if (!faqError && faqs && faqs.length > 0) {
      faqRoutes = faqs.map((faq) => {
        // Safe slugification to prevent spaces and uppercase issues in URLs
        const safeHash = faq.klausimas 
                    ? faq.klausimas.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                    : faq.id;
        
        return {
          url: `${baseUrl}/duk#${safeHash}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        };
      });
    }
  } catch (err) {
    console.error("Sitemap FAQ exception:", err);
  }

  return [...staticRoutes, ...propertyRoutes, ...blogRoutes, ...faqRoutes];
}
