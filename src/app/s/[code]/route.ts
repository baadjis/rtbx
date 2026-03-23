import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  // Initialisation Supabase
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );

  // 1. Récupération de l'URL longue
  const { data, error } = await supabase
    .from('links')
    .select('long_url, clicks')
    .eq('short_code', code)
    .single();

  if (data && data.long_url) {
    // 2. Incrémentation asynchrone des clics
    // On ne met pas de "await" ici si on veut que la redirection soit instantanée
    supabase
      .from('links')
      .update({ clicks: data.clicks + 1 })
      .eq('short_code', code)
      .then(); 

    // 3. Redirection vers l'URL d'origine
    return redirect(data.long_url);
  }

  // Si le code est invalide : retour vers le site principal Hugging Face
  return redirect('/');
}