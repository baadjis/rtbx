import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();

  // 1. Vérifier si l'utilisateur est connecté avant de déconnecter
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // 2. Déconnexion de Supabase (supprime la session côté serveur)
    await supabase.auth.signOut();
  }

  // 3. On nettoie le cache du dashboard pour éviter les données fantômes
  revalidatePath('/', 'layout');

  // 4. Redirection vers la page d'accueil
  const url = new URL(request.url);
  return NextResponse.redirect(new URL('/', url.origin), {
    status: 302,
  });
}