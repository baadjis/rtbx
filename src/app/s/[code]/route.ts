import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  // 1. Validation de sécurité
  if (!code || code.length > 20) {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  // Initialisation Supabase avec service_role pour bypasser le RLS
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );

  try {
    // 2. On récupère les infos du lien (on a besoin de l'ID pour le log)
    const { data, error } = await supabase
      .from('links')
      .select('id, long_url, clicks')
      .eq('short_code', code)
      .single();

    if (data && data.long_url) {
      // --- LOGIQUE DE TRACKING PRO (Non-bloquante) ---
      
      const userAgent = request.headers.get('user-agent') || '';
      const isMobile = /iPhone|Android|iPad|Mobile/i.test(userAgent);
      
      // ASTUCE PRO : Vercel fournit le pays via ce header automatiquement
      const country = request.headers.get('x-vercel-ip-country') || 'Unknown';
      const referrer = request.headers.get('referer') || 'Direct';

      // On lance les deux mises à jour en parallèle sans "await" 
      // pour que la redirection soit instantanée
      Promise.all([
        // A. Incrémenter le compteur global sur 'links'
        supabase
          .from('links')
          .update({ clicks: (data.clicks || 0) + 1 })
          .eq('id', data.id),

        // B. Ajouter une ligne détaillée dans 'link_logs'
        supabase
          .from('link_logs')
          .insert({
            link_id: data.id,
            device: isMobile ? 'Mobile' : 'Desktop',
            country: country,
            referrer: referrer,
            browser: userAgent.split(' ')[0] || 'Unknown'
          })
      ]).catch(e => console.error("Erreur log/stats:", e));

      // 3. REDIRECTION IMMÉDIATE (307 pour éviter le cache navigateur)
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

  // 4. Fallback si le lien n'existe pas
  return NextResponse.redirect(new URL('/not-found', request.url));
}