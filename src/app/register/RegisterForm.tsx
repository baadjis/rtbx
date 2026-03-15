'use client'
import { createBrowserClient } from '@supabase/ssr'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Link from 'next/link'
import { DICT } from '@/lib/locales'

// On crée le logo ici pour plus de propreté
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
    <div className="min-h-screen bg-[#ffffff] flex flex-col justify-center py-12 px-4" 
         style={{backgroundImage: 'radial-gradient(at 0% 100%, rgba(147, 51, 234, 0.05) 0px, transparent 50%)'}}>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo />
        <h2 className="text-xl font-bold text-gray-900">{t.register_title}</h2>
        <p className="mt-2 text-sm text-gray-500 font-medium">{t.register_sub}</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-[0_20px_50px_rgba(147,51,234,0.1)] border border-gray-100 rounded-[2.5rem]">
          <Auth
            supabaseClient={supabase}
            view="sign_up"
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: { brand: '#9333ea', brandAccent: '#4f46e5' },
                  radii: { borderRadiusButton: '16px', inputBorderRadius: '16px' }
                }
              }
            }}
            theme="light"
            showLinks={false}
            providers={['google']}
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
          />

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500 font-medium">
              {t.already_member}{' '}
              <Link href="/login" className="text-purple-600 font-bold hover:text-indigo-600 transition-colors">
                {t.login_link}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}