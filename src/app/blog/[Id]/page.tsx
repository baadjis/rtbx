import { cookies } from 'next/headers';
import { DICT } from '@/lib/locales';
import Footer from '@/components/Footer';
import { BrandLogo } from '@/components/BrandLogo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Data } from '../data';

export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr') as 'en' | 'fr';
  const t = Data[lang];
  const post = t.posts.find((p: { id: string; }) => p.id === id);

  if (!post) return <div className="p-20 text-center font-bold">Article not found</div>;

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto px-6 py-20">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 font-bold hover:text-indigo-600 mb-12 transition-colors">
            <ArrowLeft className="w-4 h-4" /> {lang === 'fr' ? 'Retour au blog' : 'Back to blog'}
        </Link>
        <h1 className="text-4xl md:text-5xl font-black mb-8 leading-tight text-gray-900">{post.title}</h1>
        <div className="bg-indigo-50 p-8 rounded-[2.5rem] mb-12 border border-indigo-100">
            <p className="text-indigo-900 font-bold text-lg italic tracking-tight italic">{post.intro}</p>
        </div>
        <div className="prose prose-slate max-w-none text-gray-600 text-lg leading-relaxed space-y-6 font-medium">
            {post.content.split('\n').map((para, i) => <p key={i}>{para}</p>)}
        </div>
      </main>
      <Footer />
    </div>
  );
}