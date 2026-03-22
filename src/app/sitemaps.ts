import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rtbx.space';
  const lastModified = new Date();

  // Liste des pages statiques de haute valeur
  const staticRoutes = [
    '',
    '/blog',
    '/guide',
    '/faq',
    '/about',
    '/contact',
    '/login',
    '/register',
    '/terms',
    '/privacy',
    '/ugc',
    '/dashboard',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Liste des outils (C'est ce qui va attirer ton trafic !)
  const toolRoutes = [
    '/tools/qrcode',
    '/tools/barcode',
    '/tools/rembg',
    '/tools/soldes',
    '/tools/vcard',
    '/tools/whatsapp',
    '/tools/wifi',
    '/tools/digital-id',
    '/tools/google-reviews',
    '/shortener',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...toolRoutes];
}