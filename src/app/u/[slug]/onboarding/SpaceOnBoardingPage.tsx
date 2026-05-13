/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from 'next/link'

import {
  Sparkles,
  ArrowRight,
  QrCode,
  Pencil,
  ShieldCheck,
  CheckCircle2,
  Rocket,
  ExternalLink,
  UserPlus
} from 'lucide-react'
import { LangType } from '@/lib/lang/types'

const onboardingData = {
  fr: {
    badge: 'Votre Space est en ligne',

    title_1: 'Bienvenue sur',
    title_2: 'rtbx.space',

    subtitle:
      'Votre identité digitale est maintenant accessible en ligne. Personnalisez-la et partagez-la.',

    view_title: 'Voir le Space',
    view_desc:
      'Ouvrez votre page publique et découvrez votre identité digitale.',

    edit_title: 'Personnaliser',
    edit_desc:
      'Ajoutez plus de liens, modifiez votre branding et améliorez votre expérience.',

    qr_title: 'QR Code',
    qr_desc:
      'Générez de magnifiques QR codes pour cartes, stickers et partage social.',

    claim_title: 'Sécuriser le Space',
    claim_desc:
      'Créez un compte pour gérer plusieurs Spaces et débloquer les futures fonctionnalités.',

    btn_view: 'Ouvrir le Space',
    btn_edit: 'Modifier le Space',
    btn_qr: 'Créer le QR',
    btn_claim: 'Créer un compte',

    progress_title: 'Progression',
    progress_subtitle:
      'Complétez votre identité digitale moderne.',

    tips_title: 'Conseils',

    tip_1:
      'Ajoutez un avatar pour rendre votre Space immédiatement reconnaissable.',

    tip_2:
      'Placez votre QR code sur vos cartes, menus ou emballages.',

    tip_3:
      'Personnalisez vos couleurs et liens pour refléter votre identité.',

    checklist_created: 'Space créé',
    checklist_avatar: 'Ajouter un avatar',
    checklist_socials: 'Ajouter des réseaux',
    checklist_branding: 'Personnaliser le branding',
    checklist_qr: 'Créer le QR code'
  },

  en: {
    badge: 'Your Space Is Live',

    title_1: 'Welcome to',
    title_2: 'rtbx.space',

    subtitle:
      'Your digital identity is now online. Customize it and share it everywhere.',

    view_title: 'View Space',
    view_desc:
      'Open your public page and discover your digital identity.',

    edit_title: 'Customize',
    edit_desc:
      'Add more links, update your branding and improve your experience.',

    qr_title: 'QR Code',
    qr_desc:
      'Generate beautiful QR codes for cards, stickers and social sharing.',

    claim_title: 'Secure Your Space',
    claim_desc:
      'Create an account to manage multiple Spaces and unlock future features.',

    btn_view: 'Open Space',
    btn_edit: 'Edit Space',
    btn_qr: 'Generate QR',
    btn_claim: 'Create account',

    progress_title: 'Setup Progress',
    progress_subtitle:
      'Complete your modern digital identity.',

    tips_title: 'Pro Tips',

    tip_1:
      'Add a profile avatar to make your Space instantly recognizable.',

    tip_2:
      'Place your QR code on business cards, menus or packaging.',

    tip_3:
      'Customize your colors and links to match your brand identity.',

    checklist_created: 'Space created',
    checklist_avatar: 'Add profile avatar',
    checklist_socials: 'Add social links',
    checklist_branding: 'Customize branding',
    checklist_qr: 'Generate QR code'
  }
}

export default function SpaceOnboardingPage({
  space,
  token,
  lang = 'en'
}: {
  space: any
  token?: string
  lang?: LangType 
}) {

  const t = onboardingData[lang]

  const publicUrl = `https://rtbx.space/u/${space.slug}`

  const checklist = [
    {
      done: true,
      label: t.checklist_created
    },
    {
      done: !!space.avatar_url,
      label: t.checklist_avatar
    },
    {
      done: (space.social_data || []).length > 0,
      label: t.checklist_socials
    },
    {
      done: !!space.theme_color,
      label: t.checklist_branding
    },
    {
      done: false,
      label: t.checklist_qr
    }
  ]

  return (
    <div className="min-h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#020617] relative">

      {/* BACKGROUND */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-indigo-500/10 blur-[180px] rounded-full" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[140px] rounded-full" />

      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 md:py-16">

        {/* HERO */}

        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-black uppercase tracking-[0.25em] mb-6">
            <Sparkles size={14} />
            {t.badge}
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
            {t.title_1}
            <br />
            {t.title_2}
          </h1>

          <p className="mt-6 text-base md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            {t.subtitle}
          </p>

        </div>

        {/* PREVIEW */}

        <div className="relative max-w-2xl mx-auto mb-16">

          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 rounded-[3rem] blur opacity-30" />

          <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-slate-800 rounded-[3rem] p-8 md:p-10 shadow-[0_40px_120px_rgba(79,70,229,0.12)] overflow-hidden">

            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />

            <div className="relative flex flex-col items-center text-center">

              <div
                className="w-32 h-32 rounded-[2.8rem] p-[2px] shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${space.theme_color || '#6366f1'}, #9333ea)`
                }}
              >
                <div className="w-full h-full rounded-[2.6rem] bg-slate-950 flex items-center justify-center overflow-hidden text-white text-5xl font-black uppercase">
                  {space.entity_name?.[0] || space.slug?.[0] || 'R'}
                </div>
              </div>

              <h2 className="mt-6 text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                @{space.slug}
              </h2>

              <p className="mt-2 text-sm uppercase tracking-[0.25em] font-black text-slate-400">
                {space.space_type || 'personal'} space
              </p>

              <div className="mt-8 inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-black text-slate-600 dark:text-slate-300">
                <Rocket size={16} />
                {publicUrl}
              </div>

            </div>

          </div>

        </div>

        {/* MAIN GRID */}

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8 items-start">

          {/* LEFT */}

          <div className="space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* VIEW */}

              <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-7 shadow-xl hover:-translate-y-1 transition-all duration-500">

                <div className="space-y-6">

                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                    <ExternalLink size={24} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {t.view_title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.view_desc}
                    </p>
                  </div>

                  <Link
                    href={`/u/${space.slug}`}
                    className="inline-flex items-center gap-2 text-indigo-600 font-black hover:gap-3 transition-all no-underline"
                  >
                    {t.btn_view}
                    <ArrowRight size={18} />
                  </Link>

                </div>

              </div>

              {/* EDIT */}

              <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-7 shadow-xl hover:-translate-y-1 transition-all duration-500">

                <div className="space-y-6">

                  <div className="w-14 h-14 rounded-2xl bg-violet-500/10 text-violet-600 flex items-center justify-center">
                    <Pencil size={24} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {t.edit_title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.edit_desc}
                    </p>
                  </div>

                  <Link
                    href={{ pathname:`/edit` ,query:{token:token}}}
                    className="inline-flex items-center gap-2 text-violet-600 font-black hover:gap-3 transition-all no-underline"
                  >
                    {t.btn_edit}
                    <ArrowRight size={18} />
                  </Link>

                </div>

              </div>

              {/* QR */}

              <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-7 shadow-xl hover:-translate-y-1 transition-all duration-500">

                <div className="space-y-6">

                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                    <QrCode size={24} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {t.qr_title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.qr_desc}
                    </p>
                  </div>

                  <Link
  href={`/u/${space.slug}/qrcode`}
  className="inline-flex items-center gap-2 text-cyan-600 font-black hover:gap-3 transition-all no-underline"
>
  {t.btn_qr}
  <ArrowRight size={18} />
</Link>

                </div>

              </div>

              {/* CLAIM */}

              <div className="group relative overflow-hidden rounded-[2.5rem] border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 backdrop-blur-xl p-7 shadow-xl hover:-translate-y-1 transition-all duration-500">

                <div className="space-y-6">

                  <div className="w-14 h-14 rounded-2xl bg-white/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
                    <ShieldCheck size={24} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {t.claim_title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {t.claim_desc}
                    </p>
                  </div>

                  <button className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 text-white font-black border-none cursor-pointer hover:bg-indigo-700 transition-all">
                    <UserPlus size={18} />
                    {t.btn_claim}
                  </button>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="space-y-8">

            {/* CHECKLIST */}

            <div className="rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 shadow-xl">

              <div className="flex items-center gap-3 mb-8">

                <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center">
                  <CheckCircle2 size={22} />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {t.progress_title}
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {t.progress_subtitle}
                  </p>
                </div>

              </div>

              <div className="space-y-4">

                {checklist.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700"
                  >

                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${
                        item.done
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                      }
                    `}>
                      <CheckCircle2 size={16} />
                    </div>

                    <span className={`
                      text-sm font-bold
                      ${
                        item.done
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-400'
                      }
                    `}>
                      {item.label}
                    </span>

                  </div>
                ))}

              </div>

            </div>

            {/* TIPS */}

            <div className="rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 shadow-xl">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Sparkles size={22} />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {t.tips_title}
                  </h3>
                </div>

              </div>

              <div className="space-y-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">

                <p>{t.tip_1}</p>

                <p>{t.tip_2}</p>

                <p>{t.tip_3}</p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}