import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  
  // Le "code" est envoyé par Supabase après la validation Google/Email
  const code = searchParams.get('code')
  
  // "next" est l'endroit où l'on veut rediriger après (par défaut le dashboard)
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    
    // Échange le code contre une session utilisateur (et écrit les cookies)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Stratégie de redirection pro : 
      // On vérifie si on est sur un environnement de déploiement (Vercel) 
      // ou en local pour construire l'URL de retour parfaite.
      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // EN CAS D'ERREUR : Redirection vers le login avec un message d'erreur
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}