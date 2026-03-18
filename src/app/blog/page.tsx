import { cookies } from 'next/headers';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { BrandLogo } from '@/components/BrandLogo';
import { Data } from './data';
export default async function BlogPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr') as 'en' | 'fr';
  const t = Data[lang];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <main className="max-w-6xl mx-auto px-6 py-20">
        <BrandLogo />
        <h1 className="text-4xl md:text-6xl font-black mb-4 text-gray-900 tracking-tight">{t.blog_title}</h1>
        <p className="text-xl text-gray-500 font-medium mb-16">{t.blog_sub}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {t.posts.map(p => (
            <Link key={p.id} href={`/blog/${p.id}`} className="group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-indigo-600 transition-colors">{p.title}</h2>
                <p className="text-gray-500 mb-8 line-clamp-2 font-medium">{p.intro}</p>
                <span className="inline-flex items-center gap-2 text-indigo-600 font-black uppercase text-xs tracking-widest">
                    {lang === 'fr' ? 'Lire la suite' : 'Read more'} →
                </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}