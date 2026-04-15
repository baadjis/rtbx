/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import FormBuilder from '@/components/FormBuilder/FormBuilder';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const handleSave = async (fields: any) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase.from('forms').insert([{
      user_id: user?.id,
      title: "New Form", // Tu pourras ajouter un input pour le titre plus tard
      fields_json: fields,
      settings: { active: true, theme: 'indigo' }
    }]).select().single();

    if (!error) {
      router.push(`/dashboard/forms/${data.id}`);
    } else {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <FormBuilder onSave={handleSave} loading={loading} />
    </div>
  );
}