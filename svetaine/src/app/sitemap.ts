import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://katkevicius.lt';

  // 1. Static routes
  const staticRoutes = [
    '',
    '/pirkimas',
    '/pardavimas',
    '/nuoma',
    '/konsultacija',
    '/objektai',
    '/naudinga-informacija',
    '/atsiliepimai',
    '/duk',
    '/kontaktai',
    '/privatumo-politika'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
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
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.error("Sitemap properties err", err);
  }

  // 3. Dynamic blog posts
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogPath = path.join(process.cwd(), 'src/data/blog-posts.json');
    if (fs.existsSync(blogPath)) {
      const posts = JSON.parse(fs.readFileSync(blogPath, 'utf8'));
      blogRoutes = posts
        .filter((post: any) => post.status === 'published')
        .map((post: any) => ({
          url: `${baseUrl}/naudinga-informacija/${post.slug}`,
          lastModified: new Date(post.date || Date.now()),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }));
    }
  } catch (err) {
    console.error("Sitemap blog err", err);
  }

  return [...staticRoutes, ...propertyRoutes, ...blogRoutes];
}
