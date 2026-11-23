import { getProperties, generateSlug } from '@/data/properties';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaipurelitehomes.com';

export default async function sitemap() {
  // Fetch all properties for dynamic routes
  const properties = await getProperties();
  
  // Static pages
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
  
  // Dynamic property pages with SEO-friendly slugs
  const propertyPages = properties.map((property) => {
    const slug = property.slug || generateSlug(property.title, property.location, property.type, property.id);
    return {
      url: `${SITE_URL}/property/${slug}`,
      lastModified: new Date(property.updated_at || property.created_at || new Date()),
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  });
  
  return [...staticPages, ...propertyPages];
}
