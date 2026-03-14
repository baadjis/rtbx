'use client'
import { createBrowserClient } from '@supabase/ssr'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { UserPlus } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  // Client côté navigateur
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col justify-center py-12 px-4" 
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
            <UserPlus className="w-10 h-10 text-indigo-600" />
            <span className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                RetailBox
            </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Créer un compte professionnel</h2>
        <p className="mt-2 text-sm text-gray-500 font-medium">Rejoignez les commerçants qui optimisent leurs ventes</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-2xl border border-gray-100 rounded-3xl">
          <Auth
            supabaseClient={supabase}
            view="sign_up"
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: { brand: '#4f46e5', brandAccent: '#4338ca' },
                  radii: { borderRadiusButton: '14px', inputBorderRadius: '14px' }
                }
              }
            }}
            providers={['google']}
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
          />
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Déjà membre ?{' '}
              <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}