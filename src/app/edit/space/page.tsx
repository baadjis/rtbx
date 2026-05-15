import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import EditSpaceClient from './EditSpaceClient1';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getLang } from '@/lib/lang/lang-getter';

export default async function EditSpacePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ token?: string }> 
}) {
  const { token } = await searchParams;

  // Si pas de token, on ne peut pas éditer
  if (!token) redirect('/');

  const supabase = await createClient();

  // On cherche le space qui possède ce jeton d'édition secret
  const { data: space, error } = await supabase
    .from('spaces')
    .select('*')
    .eq('edit_token', token)
    .single();

  if (error || !space) return notFound();


  const lang = await getLang()

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-500">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        {/* On passe les données au composant Client */}
        <EditSpaceClient space={space} lang={lang} token={token} />
      </main>
      <Footer />
    </div>
  );
}