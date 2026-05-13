/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import {
  ArrowLeft,
  ShieldCheck,
  X,
  Loader2,
  CheckCircle2,
  Mail,
  Scale,
  Globe,
  Users,
  User,
  Link2,
  Upload
} from 'lucide-react'

import { createBrowserClient } from '@supabase/ssr'

import { Data } from './data'
import { LangType } from '@/lib/lang/types'


import SpaceTypeSelect from './SpaceTypeSelect'
import OrganizationSubcategorySelect from './OrganisationForm'
import PersonalSubcategorySelect from './PersonalForm'
import QRCodeDesign from './QRcodeDesign'
import SocialLinksAdd from './SocialLinksAdd'
import BuilderSection from './BuilderSection'

export default function DigitalIDForm({
  lang
}: {
  lang: LangType
}) {

  const t = Data[lang]

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [avatar, setAvatar]=useState<string|null>(null)

  // =========================================================
  // USER
  // =========================================================

  const [currentUser, setCurrentUser] = useState<any>(null)

  // =========================================================
  // GENERAL
  // =========================================================

  const [loading, setLoading] = useState(false)

  const [generatedId, setGeneratedId] =
    useState<string | null>(null)

  // =========================================================
  // SPACE TYPES
  // =========================================================

  const [spaceType, setSpaceType] = useState<
    'personal' |
    'organization' |
    'developer' |
    'startup' |
    'business'
  >('personal')

  const [spaceSubType, setSpaceSubType] =
    useState('')

  // =========================================================
  // ENTITY NAME
  // =========================================================

  const [entityName, setEntityName] =
    useState('')

  // =========================================================
  // EMAIL
  // =========================================================

  const [email, setEmail] = useState('')

  // =========================================================
  // LINKS
  // =========================================================

  const [links, setLinks] = useState<any[]>([
    {
      id: crypto.randomUUID(),
      network: 'Instagram',
      handle: ''
    }
  ])

  // =========================================================
  // DESIGN
  // =========================================================

  const [fgColor, setFgColor] =
    useState('#4f46e5')

  

 

  // =========================================================
  // LEGAL
  // =========================================================

  const [legalTerms, setLegalTerms] =
    useState(false)

  const [legalAuth, setLegalAuth] =
    useState(false)



  // =========================================================
  // SLUG
  // =========================================================

  const [slug, setSlug] = useState('')

  const [isSlugAvailable, setIsSlugAvailable] =
    useState<boolean | null>(null)

  // =========================================================
  // USER CHECK
  // =========================================================

  useEffect(() => {

    const checkUser = async () => {

      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (user) {
        setCurrentUser(user)
        setEmail(user.email || '')
      }
    }

    checkUser()

  }, [supabase])

  // =========================================================
  // SLUG CHECK
  // =========================================================

  useEffect(() => {

    const delayDebounce = setTimeout(async () => {

      if (slug.length >= 3) {

        const res = await fetch(
          `/api/spaces/check-slug?slug=${slug}`
        )

        const data = await res.json()

        setIsSlugAvailable(data.available)

      } else {

        setIsSlugAvailable(null)

      }

    }, 500)

    return () => clearTimeout(delayDebounce)

  }, [slug])

  // =========================================================
  // UPDATE LINK
  // =========================================================

  const updateLink = (
    index: number,
    field: string,
    value: string
  ) => {

    const newLinks = [...links]

    let cleanValue = value

    if (
      field === 'handle' &&
      value.startsWith('@')
    ) {
      cleanValue = value.substring(1)
    }

    newLinks[index] = {
      ...newLinks[index],
      [field]: cleanValue
    }

    setLinks(newLinks)
  }

  // =========================================================
  // LOGO
  // =========================================================

 

  // =========================================================
  // ACTIVATE
  // =========================================================

  const handleActivate = async () => {

    if (
      !legalTerms ||
      (
        spaceType === 'organization' &&
        !legalAuth
      )
    ) {
      alert(t.error_legal)
      return
    }

    if (isSlugAvailable === false) {

      alert(
        lang === 'fr'
          ? 'Ce pseudo est déjà pris'
          : 'This handle is taken'
      )

      return
    }

    setLoading(true)

    const payload = {

      user_id: currentUser?.id || null,

      email: email.toLowerCase().trim(),

      slug: slug.toLowerCase().trim(),

      space_type: spaceType,

      space_subtype: spaceSubType || null,

      entity_name: entityName || null,

      social_data: links.filter(
        (l: any) => l.handle.trim() !== ''
      ),

      theme_color: fgColor,
      avatar_url: avatar,

      legal_accepted_at:
        new Date().toISOString(),

      is_authorized_representative:
        spaceType === 'organization',

      lang
    }

    try {

      const response = await fetch(
        '/api/spaces/activate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      )

      const result = await response.json()
    

      if (result.success) {

        setGeneratedId(result.id)
        window.location.href =
    `/u/${result.slug}/onboarding?token=${result.edit_token}`

      } else {

        alert(result.error)

      }

    } catch (err) {

      console.log(err)

      alert('Erreur lors de l’activation')

    } finally {

      setLoading(false)

    }
  }

  const handleImageUpload = (
  e: React.ChangeEvent<HTMLInputElement>,
  setter: (v: string | null) => void
) => {

  const file = e.target.files?.[0]

  if (!file) return

  const reader = new FileReader()

  reader.onloadend = () =>
    setter(reader.result as string)

  reader.readAsDataURL(file)
}

 

  // =========================================================
  // URL
  // =========================================================

  const handle = slug || generatedId

  

  // =========================================================
  // UI
  // =========================================================

  function Left(){
    const hasValidLinks = links.some(
  (link: any) => link.handle?.trim() !== ''
)

const canActivate =
  legalTerms &&
  (spaceType !== 'organization' || legalAuth) &&
  hasValidLinks
    return( 

       <div className="space-y-10">
           
           <div className="text-center space-y-5">

  <div className="
    inline-flex items-center gap-2
    px-4 py-2
    rounded-full
    bg-indigo-50 dark:bg-indigo-500/10
    border border-indigo-100 dark:border-indigo-500/20
    text-indigo-600
    text-xs font-black uppercase tracking-widest
  ">
    <Globe size={14} />
    RTBX SPACE
  </div>

  <div className="space-y-4">

    <h1 className="
      text-5xl md:text-6xl
      font-black
      tracking-tight
      leading-[0.95]
      bg-gradient-to-r
      from-indigo-600
      via-violet-600
      to-cyan-500
      bg-clip-text
      text-transparent
    ">
      {t.did_title}
    </h1>

    <p className="
      max-w-2xl mx-auto
      text-base md:text-lg
      text-gray-500 dark:text-slate-400
      leading-relaxed
      font-medium
    ">
      {t.did_subtitle}
    </p>

  </div>

</div>

            <div className="space-y-8">

              {/* SPACE TYPE */}

              <BuilderSection
              icon={Globe}
              title={t.space_type_title}
             subtitle={t.space_type_subtitle}
            >

  <SpaceTypeSelect
    accountType={spaceType}
    setAccountType={setSpaceType}
    t={t}
  />

</BuilderSection>

              {/* ORGANIZATION */}

              {spaceType === 'organization' && (

  <BuilderSection
    icon={Link2}
    title={t.template_title}
    subtitle={t.template_subtitle}
  >

    <OrganizationSubcategorySelect
      subcategory={spaceSubType}
      setSubcategory={setSpaceSubType}
      t={t}
    />

  </BuilderSection>

)}

              {/* PERSONAL */}

             {spaceType === 'personal' && (

  <BuilderSection
    icon={User}
    title={t.template_title}
    subtitle={t.template_subtitle}
  >

    <PersonalSubcategorySelect
      subcategory={spaceSubType}
      setSubcategory={setSpaceSubType}
      t={t}
    />

  </BuilderSection>

)}

             {/* IDENTITY */}

<BuilderSection
  icon={Link2}
  title={t.identity_title}
  subtitle={t.identity_subtitle}
>

  {/* ENTITY NAME */}

  {spaceType !== 'personal' && (

    <div className="space-y-2">

      <label className="
        text-[10px]
        font-black
        text-gray-400
        uppercase
        tracking-widest
        ml-2
      ">
        {t.label_entity_name}
      </label>

      <input
        value={entityName}
        onChange={(e) =>
          setEntityName(e.target.value)
        }
        placeholder={t.ph_entity_name}
        className="
          w-full p-4
          bg-gray-50 dark:bg-slate-800
          border-none rounded-2xl
          font-bold dark:text-white
          focus:ring-2 focus:ring-indigo-500
        "
      />

    </div>

  )}

  {/* EMAIL */}

  <div className="space-y-2">

    <label className="
      text-[10px]
      font-black
      text-gray-400
      uppercase
      tracking-widest
      ml-2 flex items-center gap-2
    ">

      <Mail size={14} />

      {t.manangement_email}

    </label>

    <input
      type="email"
      value={email}
      onChange={(e) =>
        setEmail(e.target.value)
      }
      disabled={!!currentUser}
      placeholder="votre@email.com"
      className="
        w-full p-4
        bg-gray-50 dark:bg-slate-800
        border-none rounded-2xl
        font-bold dark:text-white
        focus:ring-2 focus:ring-indigo-500
        disabled:opacity-50
      "
    />

  </div>

  {/* SLUG */}

  <div className="space-y-4">

    <label className="
      text-[10px]
      font-black
      text-gray-400
      uppercase
      tracking-widest
      ml-2
    ">
      {t.choose_public_link}
    </label>

    <div
      className={`
        flex items-center
        bg-gray-50 dark:bg-slate-800
        rounded-2xl px-4
        border-2 transition-all

        ${
          isSlugAvailable === true
            ? 'border-green-500'
            : isSlugAvailable === false
            ? 'border-red-500'
            : 'border-transparent'
        }
      `}
    >

      <span className="
        text-gray-400
        font-bold
        border-r border-gray-200
        dark:border-slate-700
        pr-3 text-sm
      ">
        rtbx.space/u/
      </span>

      <input
        value={slug}
        onChange={(e) =>
          setSlug(
            e.target.value
              .toLowerCase()
              .replace(/[^a-z0-9-]/g, '')
          )
        }
        placeholder="votre-nom"
        className="
          flex-1 p-4
          bg-transparent
          border-none
          focus:ring-0
          font-bold
          dark:text-white
        "
      />

      {isSlugAvailable === true && (
        <CheckCircle2
          className="text-green-500 ml-2"
          size={18}
        />
      )}

      {isSlugAvailable === false && (
        <X
          className="text-red-500 ml-2"
          size={18}
        />
      )}

    </div>

  </div>

</BuilderSection>

{/* SOCIALS */} 
<BuilderSection icon={Users} title={t.socials_title} subtitle={t.socials_subtitle} > 
  <SocialLinksAdd links={links} setLinks={setLinks} 
  updateLink={updateLink} t={t} 
  lang={lang}/>

</BuilderSection>

{/* BRANDING */}

<BuilderSection
  icon={Upload}
  title={t.branding_title}
  subtitle={t.branding_subtitle}
>

  <div className="grid md:grid-cols-2 gap-6">

    {/* AVATAR */}

    <div className="space-y-3">

      <div className="flex items-center justify-between">

        <div>

          <label className="
            text-[10px]
            font-black
            text-gray-400
            uppercase
            tracking-widest
            ml-2
          ">
            {t.label_avatar}
          </label>

          <p className="
            text-[11px]
            text-gray-400
            ml-2 mt-1
          ">
            {t.avatar_hint}
          </p>

        </div>

        {avatar && (
          <button
            onClick={() => setAvatar(null)}
            className="
              text-red-500
              text-[10px]
              font-bold
              hover:underline
            "
          >
            {t.remove}
          </button>
        )}

      </div>

      <div className="
        relative
        h-44
        rounded-[2rem]
        overflow-hidden
        border-2 border-dashed
        border-gray-200 dark:border-slate-700
        bg-gray-50 dark:bg-slate-800
        hover:border-indigo-400
        transition-all
      ">

        {avatar ? (

          <Image
            src={avatar}
            alt="Avatar"
            fill
            className="object-cover"
            unoptimized
          />

        ) : (

          <div className="
            absolute inset-0
            flex flex-col items-center justify-center
            gap-3
            text-gray-400
          ">

            <Upload size={24} />

            <span className="text-xs font-bold">
              {t.upload_avatar}
            </span>

          </div>

        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            handleImageUpload(e, setAvatar)
          }
          className="
            absolute inset-0
            opacity-0
            cursor-pointer
          "
        />

      </div>

    </div>

    {/* THEME + QR */}

    <div className="space-y-6">

      {/* THEME COLOR */}

      <div className="space-y-2">

        <label className="
          text-[10px]
          font-black
          text-gray-400
          uppercase
          tracking-widest
          ml-2
        ">
          {t.label_theme_color}
        </label>

        <div className="
          flex items-center gap-4
          p-4 rounded-2xl
          bg-gray-50 dark:bg-slate-800
        ">

          <input
            type="color"
            value={fgColor}
            onChange={(e) =>
              setFgColor(e.target.value)
            }
            className="
              w-16 h-16
              rounded-2xl
              border-none
              cursor-pointer
              bg-transparent
            "
          />

          <div>

            <p className="
              font-black text-sm
              dark:text-white
            ">
              {fgColor}
            </p>

            <p className="
              text-xs text-gray-400
            ">
              {t.theme_color_hint}
            </p>

          </div>

        </div>

      </div>

      {/* QR LOGO */}

     

    </div>

  </div>

  </BuilderSection>


  {/* LEGAL */}
              
  <BuilderSection
      icon={Scale}
      title={t.legal_title}
      subtitle={t.legal_subtitle}
  >

                {/* legal stuff */}

                <label className="flex items-start gap-3 cursor-pointer group">

                  <input
                    type="checkbox"
                    checked={legalTerms}
                    onChange={e =>
                      setLegalTerms(
                        e.target.checked
                      )
                    }
                    className="mt-1 accent-indigo-600 w-4 h-4"
                  />

                  <span className="text-[11px] text-gray-500 dark:text-slate-400 font-medium leading-relaxed">

                    {t.legal_terms}

                  </span>

                </label>

                {spaceType === 'organization' && (

                  <label className="flex items-start gap-3 cursor-pointer group">

                    <input
                      type="checkbox"
                      checked={legalAuth}
                      onChange={e =>
                        setLegalAuth(
                          e.target.checked
                        )
                      }
                      className="mt-1 accent-indigo-600 w-4 h-4"
                    />

                    <span className="text-[11px] text-gray-500 dark:text-slate-400 font-medium leading-relaxed italic">

                      {t.legal_auth}

                    </span>

                  </label>

                )}
              </BuilderSection>
            

              {/* BUTTON */}

              {!generatedId ? (

                <button
                  onClick={handleActivate}
                  disabled={loading || !canActivate}
                  className={`
  w-full py-5
  rounded-[2rem]
  font-black text-lg
  shadow-xl shadow-indigo-200
  transition-all
  border-none
  flex items-center justify-center gap-3

  ${
    canActivate
      ? `
        bg-indigo-600
        hover:bg-indigo-700
        cursor-pointer
        text-white
      `
      : `
        bg-gray-200 dark:bg-slate-800
        text-gray-400
        cursor-not-allowed
        shadow-none
      `
  }
`} >

                  {loading
                    ? <Loader2 className="animate-spin" />
                    : <ShieldCheck size={20} />
                  }

                  {t.btn_activate}

                </button>

              ) : (

                <div className="
                  p-5
                  bg-green-50
                  text-green-600
                  rounded-3xl
                  border border-green-100
                  flex items-center justify-center gap-3
                  font-black uppercase text-xs
                  tracking-widest
                ">

                  <CheckCircle2 size={20} />

                  {t.identity_activated}

                </div>

              )}

            </div>

          </div>)
  }

  return (

    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">

        {/* BACK */}

        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 font-bold mb-10 no-underline border-none"
        >

          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:-translate-x-1 transition-transform">

            <ArrowLeft size={18} />

          </div>

          {t.back}

        </Link>
          <div className="max-w-5xl mx-auto">
           <Left/>

         

        </div>

      </div>

    </div>
  )
}