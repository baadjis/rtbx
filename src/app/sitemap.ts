import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  // CONFIGURATION AVEC WWW
  const baseUrl = 'https://www.rtbx.space'; 
  const lastModified = new Date();

  const staticRoutes = [
    '', '/blog', '/guide', '/faq', '/about', '/contact',
    '/login', '/register', '/terms', '/privacy', '/ugc', '/dashboard',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const toolRoutes = [
    '/tools/qrcode', '/tools/barcode', '/tools/rembg',
    '/tools/soldes', '/tools/vcard', '/tools/whatsapp',
    '/tools/wifi', '/tools/digital-id', '/tools/google-reviews', '/shortener',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...toolRoutes];
}