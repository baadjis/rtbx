import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { Data } from '../data';
import FormRenderer from './FormRenderer';
import { BrandLogo } from '@/components/BrandLogo';

export default async function PublicFormPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const { id } = await params;
  const sParams = await searchParams;
  const origin = (sParams.origin as string) || 'direct';
  const supabase = await createClient();
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'en' | 'fr';
  const t = Data[lang];

  // 1. Récupération du formulaire
  const { data: form } = await supabase
    .from('forms')
    .select('*')
    .eq('id', id)
    .single();

if (!form || !form.is_published) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center p-10 bg-white rounded-[3rem] shadow-xl border border-gray-100 max-w-md">
        <h1 className="text-2xl font-black text-gray-900 mb-4">{lang=="fr"?"Formulaire non disponible":"Form not found"}</h1>
        <p className="text-gray-500 font-medium">{lang=="fr"?"Ce formulaire est actuellement en mode brouillon ou a été désactivé par son propriétaire.":"This is inactive or is a draft "}</p>
        <a href="https://rtbx.space" className="mt-6 inline-block font-bold text-indigo-600">RetailBox.space</a>
      </div>
    </div>
  );
}
  // 2. Vérification si actif
  if (form.settings && form.settings.active === false) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center space-y-4 max-w-md">
                <h1 className="text-2xl font-black text-gray-900">{t.closed_title}</h1>
                <p className="text-gray-500 font-medium">{t.closed_msg}</p>
                <a href="https://rtbx.space" className="block font-bold text-indigo-600 underline pt-4">RetailBox.space</a>
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300"
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      <main className="max-w-2xl mx-auto px-6 py-12 md:py-24 relative z-10">
        
        <div className="text-center mb-12">
            <div className="mb-8 scale-110 flex justify-center"><BrandLogo /></div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
                {form.title}
            </h1>
            {form.description && (
                <p className="text-gray-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
                    {form.description}
                </p>
            )}
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800">
            <FormRenderer form={form} lang={lang} t={t} origin={origin}/>
        </div>

        <div className="mt-12 text-center opacity-30 grayscale pointer-events-none">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Secured by RetailBox 
            </p>
        </div>

      </main>
    </div>
  );
}