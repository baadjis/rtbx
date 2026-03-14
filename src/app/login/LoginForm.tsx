'use client'
import { createBrowserClient } from '@supabase/ssr'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Link from 'next/link'
import { DICT } from '@/lib/locales'
import { BrandLogo } from '@/components/BrandLogo'

export default function LoginForm({ lang }: { lang: 'en' | 'fr' }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const t = DICT[lang]

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col justify-center py-12 px-4" 
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo />
        <h2 className="text-xl font-bold text-gray-900">{t.login_title}</h2>
        <p className="mt-2 text-sm text-gray-500 font-medium">{t.login_sub}</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-[0_20px_50px_rgba(79,70,229,0.1)] border border-gray-100 rounded-[2.5rem]">
          <Auth
            supabaseClient={supabase}
            view="sign_in" 
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: { brand: '#4f46e5', brandAccent: '#9333ea' },
                  radii: { borderRadiusButton: '16px', inputBorderRadius: '16px' }
                }
              }
            }}
            theme="light"
            showLinks={false}
            providers={['google']}
            // On s'assure que l'origine est correcte pour la redirection
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
          />

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500 font-medium">
              {t.no_account}{' '}
              <Link href="/register" className="text-indigo-600 font-bold hover:text-purple-600 transition-colors">
                {t.register_free}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}