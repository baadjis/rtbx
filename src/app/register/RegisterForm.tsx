'use client'
import { createBrowserClient } from '@supabase/ssr'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Link from 'next/link'
import { DICT } from '@/lib/locales'

const BrandLogo = () => (
  <div className="flex justify-center items-center gap-3 mb-6">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>
      </defs>
      <path d="M21 16V8l-9-5-9 5v8l9 5 9-5z" stroke="url(#logo-grad)" />
    </svg>
    <span className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
      RetailBox
    </span>
  </div>
);

export default function RegisterForm({ lang }: { lang: 'en' | 'fr' }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const t = DICT[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col justify-center py-12 px-4 transition-colors duration-300" 
         style={{backgroundImage: 'radial-gradient(at 0% 100%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t.register_title}
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400 font-medium">
            {t.register_sub}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-10 px-8 shadow-[0_20px_50px_rgba(79,70,229,0.1)] dark:shadow-none border border-gray-100 dark:border-slate-800 rounded-[2.5rem] transition-colors">
          <Auth
            supabaseClient={supabase}
            view="sign_up"
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    // ON UTILISE DES VARIABLES CSS ICI !
                    brand: '#4f46e5',
                    brandAccent: '#9333ea',
                    inputText: 'inherit', // Suit la couleur du texte du parent
                    inputBorder: 'var(--pico-border-color)', 
                    inputBackground: 'transparent',
                  },
                  radii: {
                    borderRadiusButton: '16px',
                    inputBorderRadius: '16px',
                  }
                }
              }
            }}
            // On laisse Supabase gérer son propre mode sombre ou clair
            // "default" est le plus stable pour Next.js
            theme="default" 
            showLinks={false}
            providers={['google']}
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
          />

          <div className="mt-8 pt-6 border-t border-gray-50 dark:border-slate-800 text-center">
            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
              {t.already_member}{' '}
              <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-purple-600 transition-colors no-underline">
                {t.login_link}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}