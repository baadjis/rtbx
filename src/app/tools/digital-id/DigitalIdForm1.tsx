/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import Image from 'next/image'
import Link from 'next/link'

import {
  Download,
  Plus,
  Trash2,
  ArrowLeft,
  ShieldCheck,
  Link2,
  Upload,
  X,
  Palette,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Mail,
  Scale
} from 'lucide-react'

import { createBrowserClient } from '@supabase/ssr'

import { Data } from './data'
import { LangType } from '@/lib/lang/types'

import { get_social_config } from '@/utils/social-config'
import { getQrIcon, ICON_PATHS } from '@/utils/qr-utils'

import SpaceTypeSelect from './SpaceTypeSelect'
import OrganizationSubcategorySelect from './OrganisationForm'
import PersonalSubcategorySelect from './PersonalForm'

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

  const SOCIAL_CONFIG = get_social_config(lang)

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

  const [bgColor, setBgColor] =
    useState('#ffffff')

  const [logo, setLogo] =
    useState<string | null>(null)

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

  const handleLogoUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0]

    if (file) {

      const reader = new FileReader()

      reader.onloadend = () =>
        setLogo(reader.result as string)

      reader.readAsDataURL(file)
    }
  }

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

      bg_color: bgColor,

      logo_url: logo,

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

  // =========================================================
  // DOWNLOAD
  // =========================================================

  const downloadQR = () => {

    const canvas = document.getElementById(
      'did-qr-canvas'
    ) as HTMLCanvasElement

    if (!canvas) return

    const url = canvas.toDataURL('image/png')

    const link = document.createElement('a')

    link.download =
      `retailbox-space-${spaceType}.png`

    link.href = url

    link.click()
  }

  // =========================================================
  // URL
  // =========================================================

  const handle = slug || generatedId

  const publicUrl = handle
    ? `https://www.rtbx.space/u/${handle}`
    : 'https://www.rtbx.space'

  // =========================================================
  // UI
  // =========================================================

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

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start lg:items-start">          {/* ================================================= */}
          {/* LEFT */}
          {/* ================================================= */}

       <div className="space-y-8 self-start">
            <h1 className="text-center text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight italic bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent leading-tight">          
                  {t.did_title}
            </h1>

            <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-8">

              {/* SPACE TYPE */}

              <SpaceTypeSelect
                accountType={spaceType}
                setAccountType={setSpaceType}
                t={t}
              />

              {/* ORGANIZATION */}

              {spaceType === 'organization' && (
                <OrganizationSubcategorySelect
                  subcategory={spaceSubType}
                  setSubcategory={setSpaceSubType}
                  t={t}
                />
              )}

              {/* PERSONAL */}

              {spaceType === 'personal' && (
                <PersonalSubcategorySelect
                  subcategory={spaceSubType}
                  setSubcategory={setSpaceSubType}
                  t={t}
                />
              )}

              {/* ENTITY NAME */}

              {spaceType !== 'personal' && (

                <div className="space-y-2 animate-in slide-in-from-top-4 duration-500">

                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
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

                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">

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
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                />

              </div>

              {/* SLUG */}

              <div className="space-y-4">

                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
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

                  <span className="text-gray-400 font-bold border-r border-gray-200 dark:border-slate-700 pr-3 text-sm">
                    rtbx.space/u/
                  </span>

                  <input
                    value={slug}
                    onChange={(e) =>
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(
                            /[^a-z0-9-]/g,
                            ''
                          )
                      )
                    }
                    placeholder="votre-nom"
                    className="flex-1 p-4 bg-transparent border-none focus:ring-0 font-bold dark:text-white"
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

              {/* SOCIALS */}

              <div className="space-y-4">

                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">

                  <Link2 size={14} />

                  {t.label_socials || 'Réseaux sociaux'}

                </label>

                {links.map((link, i) => {

                  const networkConfig =
                    SOCIAL_CONFIG[
                      link.network as keyof typeof SOCIAL_CONFIG
                    ]

                  return (

                    <div
                      key={link.id}
                      className="
                        flex flex-col
                        p-5
                        bg-gray-50 dark:bg-slate-800/50
                        rounded-[2rem]
                        border border-gray-100 dark:border-slate-700
                        gap-3
                      "
                    >

                      <div className="flex gap-2">

                        <select
                          value={link.network}
                          onChange={(e) =>
                            updateLink(
                              i,
                              'network',
                              e.target.value
                            )
                          }
                          className="
                            flex-1 p-3
                            bg-white dark:bg-slate-800
                            border-none rounded-xl
                            font-bold text-sm
                            dark:text-white
                          "
                        >

                          {Object.keys(SOCIAL_CONFIG).map(net => (
                            <option
                              key={net}
                              value={net}
                            >
                              {net}
                            </option>
                          ))}

                        </select>

                        <button
                          onClick={() =>
                            setLinks(
                              links.filter(
                                (_, idx) => idx !== i
                              )
                            )
                          }
                          className="
                            p-3
                            text-red-500
                            bg-red-50
                            dark:bg-red-900/20
                            rounded-xl
                            border-none
                            cursor-pointer
                          "
                        >

                          <Trash2 size={18} />

                        </button>

                      </div>

                      <input
                        value={link.handle}
                        onChange={(e) =>
                          updateLink(
                            i,
                            'handle',
                            e.target.value
                          )
                        }
                        placeholder={
                          networkConfig.ph ||
                          t.ph_handle
                        }
                        className="
                          w-full p-4
                          bg-white dark:bg-slate-800
                          border-none rounded-xl
                          font-bold text-sm
                          dark:text-white
                          focus:ring-2 focus:ring-indigo-500
                        "
                      />

                    </div>
                  )
                })}

                <button
                  onClick={() =>
                    setLinks([
                      ...links,
                      {
                        id: crypto.randomUUID(),
                        network: 'Instagram',
                        handle: ''
                      }
                    ])
                  }
                  className="
                    w-full py-4
                    border-2 border-dashed
                    border-gray-200 dark:border-slate-700
                    rounded-3xl
                    text-gray-400
                    font-bold
                    hover:border-indigo-400
                    transition-all
                    bg-transparent
                    cursor-pointer
                    flex items-center justify-center gap-2
                  "
                >

                  <Plus size={18} />

                  {t.btn_add_net}

                </button>

              </div>

              

              {/* LEGAL */}

              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-gray-100 dark:border-slate-700 space-y-4">

                <div className="flex items-center gap-3 mb-2 text-indigo-600 dark:text-indigo-400">

                  <Scale size={18} />

                  <h4 className="text-xs font-black uppercase tracking-widest">
                    {t.legal_title}
                  </h4>

                </div>

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

              </div>

              {/* BUTTON */}

              {!generatedId ? (

                <button
                  onClick={handleActivate}
                  disabled={loading}
                  className="
                    w-full py-5
                    bg-indigo-600
                    text-white
                    rounded-[2rem]
                    font-black text-lg
                    shadow-xl shadow-indigo-200
                    hover:bg-indigo-700
                    transition-all
                    border-none
                    cursor-pointer
                    flex items-center justify-center gap-3
                  "
                >

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

          </div>

          {/* ================================================= */}
          {/* RIGHT */}
          {/* ================================================= */}

      <div className="self-start lg:sticky lg:top-8"> 
      
      <div className="mb-8">
  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
    QRCode
  </h2>

  <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
    Design
  </p>
</div>
           
      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 dark:border-slate-800 flex flex-col items-center transition-colors">
              {/* DESIGN */}

              {/* 4. DESIGN */}
<div className="mb-8 bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 space-y-6">
  
  <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
    <Palette size={14}/>
    {lang === 'fr' ? 'Personnalisation' : 'Customization'}
  </h4>

  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <label className="text-[9px] font-black text-gray-400 uppercase ml-2">
        {t.label_qr}
      </label>

      <input
        type="color"
        value={fgColor}
        onChange={(e) => setFgColor(e.target.value)}
        className="w-full h-12 rounded-xl cursor-pointer border-none bg-gray-50 dark:bg-slate-800 p-1"
      />
    </div>

    <div className="space-y-2">
      <label className="text-[9px] font-black text-gray-400 uppercase ml-2">
        Fond
      </label>

      <input
        type="color"
        value={bgColor}
        onChange={(e) => setBgColor(e.target.value)}
        className="w-full h-12 rounded-xl cursor-pointer border-none bg-gray-50 dark:bg-slate-800 p-1"
      />
    </div>
  </div>

  <div className="space-y-2">
    <label className="text-[9px] font-black text-gray-400 uppercase ml-2 flex justify-between">
      {t.label_logo}

      {logo && (
        <button
          onClick={() => setLogo(null)}
          className="text-red-500 text-[9px] font-bold bg-transparent border-none cursor-pointer hover:underline"
        >
          Supprimer
        </button>
      )}
    </label>

    <div className="relative group h-14 bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center hover:border-indigo-400 transition-colors">
      
      {logo ? (
        <Image
          src={logo}
          alt="Logo"
          className="h-10 object-contain"
          width={40}
          height={40}
        />
      ) : (
        <Upload size={20} className="text-gray-300" />
      )}

      <input
        type="file"
        onChange={handleLogoUpload}
        accept="image/*"
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
  </div>
</div>
              <div className="p-8 bg-white rounded-[2.5rem] mb-10 border border-gray-50 shadow-inner relative group overflow-hidden">

                <QRCodeCanvas
                  id="did-qr-canvas"
                  value={publicUrl}
                  size={260}
                  level="H"
                  marginSize={4}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  imageSettings={
                    logo
                      ? {
                          src: logo,
                          height: 50,
                          width: 50,
                          excavate: true
                        }
                      : {
                          src: getQrIcon(
                            ICON_PATHS.users,
                            fgColor
                          ),
                          height: 40,
                          width: 40,
                          excavate: true
                        }
                  }
                />

              </div>

              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">

                {spaceType} Space

              </h3>

              {generatedId && (

                <div className="mb-8 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">

                  <p className="text-indigo-600 dark:text-indigo-400 font-black text-sm tracking-tight">
                    rtbx.space/@/{handle}
                  </p>

                </div>

              )}

              <div className="space-y-4 w-full">

                <button
                  onClick={downloadQR}
                  disabled={!handle}
                  className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-30 border-none cursor-pointer"
                >

                  <Download className="w-6 h-6" />

                  {t.btn_dl_did}

                </button>

                {generatedId && (

                  <Link
                    href={`/u/${handle}`}
                    target="_blank"
                    className="w-full py-4 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded-2xl font-black border border-gray-100 dark:border-slate-800 no-underline flex items-center justify-center gap-2 hover:bg-gray-100 transition-all"
                  >

                    {t.open_page}

                    <ArrowRight size={18} />

                  </Link>

                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}