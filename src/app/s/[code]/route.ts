import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  // 1. Validation rapide du code (sécurité anti-injection)
  if (!code || code.length > 20) {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  // Initialisation Supabase avec la clé service_role (bypass RLS pour la rapidité)
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );

  try {
    // 2. Récupération de l'URL d'un seul coup
    const { data, error } = await supabase
      .from('links')
      .select('long_url, clicks')
      .eq('short_code', code)
      .single();

    // 3. Si le lien existe, on lance la magie
    if (data && data.long_url) {
      
      // MISE À JOUR DES CLICS (Non-blocking)
      // On ne met pas 'await' pour que l'utilisateur n'attende pas la base de données
      supabase
        .from('links')
        .update({ clicks: (data.clicks || 0) + 1 })
        .eq('short_code', code)
        .then(({ error }) => {
            if (error) console.error("Erreur stats clics:", error);
        });

      // REDIRECTION INSTANTANÉE (307 Temporary Redirect pour ne pas polluer le cache navigateur)
      return NextResponse.redirect(new URL(data.long_url), {
        status: 307,
        headers: {
          'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        },
      });
    }
  } catch (err) {
    console.error("Erreur système redirection:", err);
  }

  // 4. SI ÉCHEC : On redirige vers une page "Lien Invalide" pro (ou la 404 qu'on a créée)
  // Cela permet de faire de la pub pour RetailBox au lieu d'afficher une erreur
  return NextResponse.redirect(new URL('/not-found', request.url));
}