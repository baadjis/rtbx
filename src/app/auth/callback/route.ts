import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // On récupère le paramètre 'next' ou on force /dashboard
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    // On échange le code contre une session réelle
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // On crée une URL de redirection PROPRE sans les paramètres ?code=
      const protocol = request.headers.get('x-forwarded-proto') || 'https'
      const host = request.headers.get('host')
      const redirectUrl = new URL(next, `${protocol}://${host}`)
      
      return NextResponse.redirect(redirectUrl)
    }
  }

  // En cas d'erreur (code expiré ou invalide), retour au login avec un message
  return NextResponse.redirect(new URL('/login?error=auth-code-error', request.url))
}