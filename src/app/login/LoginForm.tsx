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
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col justify-center py-12 px-4 transition-colors duration-300" 
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t.login_title}
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400 font-medium">
            {t.login_sub}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-10 px-8 shadow-[0_20px_50px_rgba(79,70,229,0.1)] dark:shadow-none border border-gray-100 dark:border-slate-800 rounded-[2.5rem] transition-colors">
          <Auth
            supabaseClient={supabase}
            view="sign_in" 
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#4f46e5',
                    brandAccent: '#9333ea',
                    inputText: 'inherit', // Utilise la couleur blanche en dark mode via CSS
                    inputBackground: 'transparent',
                    inputBorder: 'rgba(148, 163, 184, 0.2)',
                  },
                  radii: {
                    borderRadiusButton: '16px',
                    inputBorderRadius: '16px',
                  }
                }
              }
            }}
            // "default" permet à Supabase de détecter le mode sombre du système sans crash React
            theme="default" 
            showLinks={false}
            providers={['google']}
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
          />

          <div className="mt-8 pt-6 border-t border-gray-50 dark:border-slate-800 text-center">
            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
              {t.no_account}{' '}
              <Link href="/register" className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-purple-600 transition-colors no-underline">
                {t.register_free}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}