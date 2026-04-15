/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import FormBuilder from '@/components/FormBuilder/FormBuilder';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';


export default function EditFormClient({ t,lang, form }: any) {
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(form.title);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpdate = async (fields: any) => {
    setLoading(true);
    const { error } = await supabase
      .from('forms')
      .update({
        title: title,
        fields_json: fields,
        updated_at: new Date().toISOString()
      })
      .eq('id', form.id);

    if (!error) {
      router.push(`/dashboard/forms/${form.id}`);
      router.refresh();
    } else {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Link href={`/dashboard/forms/${form.id}`} className="inline-flex items-center gap-2 text-gray-400 font-bold no-underline hover:text-indigo-600 transition-colors">
        <ArrowLeft size={16} /> {t.back_home}
      </Link>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-4 rounded-2xl flex items-start gap-3">
        <AlertTriangle className="text-amber-600 flex-shrink-0" size={20} />
        <p className="text-xs text-amber-800 dark:text-amber-200 font-medium leading-relaxed">
          {t.edit_warning}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm mb-8">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Titre du formulaire</label>
        <input 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-3xl font-black bg-transparent border-none focus:ring-0 p-0 dark:text-white mt-2"
        />
      </div>

      {/* On passe les champs actuels au Builder */}
      <FormBuilder 
        initialFields={form.fields_json} 
        onSave={handleUpdate} 
        lang={lang} 
        loading={loading} 
      />
    </div>
  );
}