/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useRef, useState } from 'react'
import en from 'react-phone-number-input/locale/en.json'


import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'

import {
  ArrowLeft,
  Building2,
  Search,
  MapPin,
  Upload,
  Loader2,
  CheckCircle2,
  Palette,
  ShieldCheck,
  Phone
} from 'lucide-react'

import { createBrowserClient } from '@supabase/ssr'

import BuilderSection from './BuilderSection'

import { LangType } from '@/lib/lang/types'

import { Data } from './data'
import BusinessIdentity from './BusinessIdentity'
import ContactSection from './ContactSection'
import BusinessLocation from './BusinessLocation'
import { getCountryCode } from '@/lib/countries/GetCountryCode'
import { CountryCode } from 'libphonenumber-js/core'

export default function BusinessCreateForm({
  lang
}: {
  lang: LangType
}) {

  const t = Data[lang]

  // =====================================================
  // SUPABASE
  // =====================================================

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // =====================================================
  // USER
  // =====================================================

  const [currentUser, setCurrentUser] =
    useState<any>(null)

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] =
    useState(false)

  const [isScriptReady, setIsScriptReady] =
    useState(false)

  // =====================================================
  // GOOGLE
  // =====================================================

  const autoCompleteRef =
    useRef<HTMLInputElement>(null)

  // =====================================================
  // BUSINESS
  // =====================================================

  const [name, setName] =
    useState('')

  const [address, setAddress] =
    useState('')

  const [postal_code, setPostalCode] =
    useState('')

  const [businessType, setBusinessType] =
    useState('')

  const [googlePlaceId, setGooglePlaceId] =
    useState('')
  const [city,setCity]=useState('')
  const [country,setCountry]=useState<CountryCode>('FR')


  // =====================================================
  // BRANDING
  // =====================================================

  const [avatar, setAvatar] =
    useState<string | null>(null)

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)

  const [themeColor, setThemeColor] =
    useState('#4f46e5')

  // =====================================================
  // Contact
  // =====================================================

   const [email, setEmail]=useState('')
   const  [phone,setPhone]=useState('')

  // =====================================================
  // CREATED
  // =====================================================

  const [createdBusiness, setCreatedBusiness] =
    useState<any>(null)

  // =====================================================
  // USER CHECK
  // =====================================================

  useEffect(() => {

    const checkUser = async () => {

      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (user) {
        setCurrentUser(user)
      }

    }

    checkUser()

  }, [supabase])

  // =====================================================
  // GOOGLE AUTOCOMPLETE
  // =====================================================

  const initAutocomplete = () => {

    if (
      !autoCompleteRef.current ||
      !window.google
    ) return

    const autocomplete =
      new window.google.maps.places.Autocomplete(
        autoCompleteRef.current,
        {
          fields: [
            'place_id',
            'name',
            'formatted_address',
            'types'
          ],
          types: ['establishment']
        }
      )

    autocomplete.addListener(
      'place_changed',
      () => {

        const place =
          autocomplete.getPlace()

        if (!place.place_id) return

        const primaryType =
          place.types?.[0] ||
          'business'

        setGooglePlaceId(
          place.place_id
        )

        setName(
          place.name || ''
        )

        setAddress(
          place.formatted_address || ''
        )

        setBusinessType(
          primaryType
        )

      }
    )
  }

  // =====================================================
  // IMAGE
  // =====================================================

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      e.target.files?.[0]

    if (!file) return

    const reader =
      new FileReader()

    reader.onloadend = () =>
      setAvatar(
        reader.result as string
      )

    reader.readAsDataURL(file)

    setSelectedFile(file)

  }

  // =====================================================
  // CREATE
  // =====================================================

  const handleCreateBusiness =
    async () => {

      if (!currentUser) {

        alert(
          lang === 'fr'
            ? 'Veuillez vous connecter'
            : 'Please login'
        )

        return
      }

      if (!name.trim()) {

        alert(
          lang === 'fr'
            ? 'Nom requis'
            : 'Business name required'
        )

        return
      }

      setLoading(true)

      try {

        let avatarUrl: string | null =
          null

        // =================================================
        // UPLOAD AVATAR
        // =================================================

        if (selectedFile) {

          const fileExt =
            selectedFile.name
              .split('.')
              .pop()

          const fileName =
            `business-${Date.now()}.${fileExt}`

          const filePath =
            `businesses/${fileName}`

          const {
            error: uploadError
          } = await supabase.storage

            .from('uploads_digitalid')

            .upload(
              filePath,
              selectedFile,
              {
                cacheControl: '3600',
                upsert: true
              }
            )

          if (uploadError)
            throw uploadError

          const { data: publicUrl } =
            supabase.storage

              .from('uploads_digitalid')

              .getPublicUrl(filePath)

          avatarUrl =
            publicUrl.publicUrl

        }

        // =================================================
        // CREATE BUSINESS
        // =================================================

        const payload = {

          user_id:
            currentUser.id,

          name,

          address,
          country:en[country],
          postal_code,
          city,

          business_type:
            businessType,

          google_place_id:
            googlePlaceId,

          avatar_url:
            avatarUrl,

          theme_color:
            themeColor,

          source:
            googlePlaceId
              ? 'google'
              : 'manual',

          verified:
            !!googlePlaceId,

          status:
            'draft'

        }

        const response =
          await fetch(
            '/api/businesses',
            {
              method: 'POST',
              headers: {
                'Content-Type':
                  'application/json'
              },
              body:
                JSON.stringify(
                  payload
                )
            }
          )

        const result =
          await response.json()

        if (!result.success) {

          alert(
            result.error ||
            'Error'
          )

          return
        }

        setCreatedBusiness(
          result.data
        )

        window.location.href =
          `/dashboard/business/${result.data.id}`

      } catch (err) {

        console.error(err)

        alert(
          lang === 'fr'
            ? 'Erreur serveur'
            : 'Server error'
        )

      } finally {

        setLoading(false)

      }

    }

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">

      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="afterInteractive"
        onReady={() => {
          setIsScriptReady(true)
          initAutocomplete()
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">

        {/* BACK */}

        <Link
          href="/dashboard"
          className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 font-bold mb-10 no-underline"
        >

          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:-translate-x-1 transition-transform">

            <ArrowLeft size={18} />

          </div>

          {t.back}

        </Link>

        {/* HERO */}

        <div className="text-center space-y-5 mb-12">

          <div className="
            inline-flex items-center gap-2
            px-4 py-2 rounded-full
            bg-indigo-50 dark:bg-indigo-500/10
            border border-indigo-100 dark:border-indigo-500/20
            text-indigo-600
            text-xs font-black uppercase tracking-widest
          ">

            <Building2 size={14} />

            RTBX BUSINESS

          </div>

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

            {t.business_create_title}

          </h1>

          <p className="
            max-w-2xl mx-auto
            text-base md:text-lg
            text-gray-500 dark:text-slate-400
            leading-relaxed
            font-medium
          ">

            {t.business_create_subtitle}

          </p>

        </div>

        {/* FORM */}

        <div className="space-y-8">

          {/* SEARCH */}

          <BuilderSection
            icon={Search}
            title={t.search_business}
            subtitle={t.search_business_subtitle}
          >

            <div className="space-y-3">

              <label className="
                text-[10px]
                font-black
                text-gray-400
                uppercase
                tracking-widest
                ml-2
              ">

                Google Places

              </label>

              <div className="relative">

                <input
                  ref={autoCompleteRef}
                  type="text"
                  disabled={!isScriptReady}
                  placeholder={
                    !isScriptReady
                      ? t.loading_google
                      : t.search_business_placeholder
                  }
                  className="
                    w-full p-4 pl-12
                    bg-gray-50 dark:bg-slate-800
                    border-none rounded-2xl
                    focus:ring-2 focus:ring-indigo-500
                    font-bold
                    text-gray-900 dark:text-white
                  "
                />

                <MapPin
                  className="
                    absolute left-4 top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                  size={20}
                />

              </div>

            </div>

          </BuilderSection>

        
{/* ===================================================== */}
{/* BUSINESS IDENTITY */}
{/* ===================================================== */}

<BuilderSection
  icon={Building2}
  title={t.business_identity}
  subtitle={t.business_identity_subtitle}
>

  <BusinessIdentity
    name={name}
    businessType={businessType}
    setBusinessType={setBusinessType}
    setName={setName}
    t={t}
  />

</BuilderSection>

{/* ===================================================== */}
{/* LOCATION */}
{/* ===================================================== */}

<BuilderSection
  icon={MapPin}
  title={t.business_location}
  subtitle={t.business_location_subtitle}
>

  <BusinessLocation
    country={country}
    setCountry={setCountry}
    city={city}
    setCity={setCity}
    address={address}
    setAddress={setAddress}
    setPostalCode={setPostalCode}
    postal_code={postal_code}
    t={t}
  />

</BuilderSection>

{/* ===================================================== */}
{/* CONTACT */}
{/* ===================================================== */}

<BuilderSection
  icon={Phone}
  title={t.contact_information}
  subtitle={t.contact_information_subtitle}
>

  <ContactSection
    email={email}
    setEmail={setEmail}
    phone={phone}
    setPhone={setPhone}
    country={country}
    t={t}
  />

</BuilderSection>

          {/* BRANDING */}

          <BuilderSection
            icon={Palette}
            title={t.branding}
            subtitle={t.branding_subtitle}
          >

            <div className="space-y-6">

              {/* AVATAR */}

              <div className="flex items-center gap-6">

                <div
                  className="
                    w-28 h-28 rounded-[2rem]
                    overflow-hidden
                    bg-gray-100 dark:bg-slate-800
                    border border-gray-200 dark:border-slate-700
                    flex items-center justify-center
                  "
                  style={{
                    borderColor: themeColor
                  }}
                >

                  {avatar ? (

                    <Image
                      src={avatar}
                      alt="Business Avatar"
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <Building2
                      size={34}
                      className="text-gray-400"
                    />

                  )}

                </div>

                <label className="
                  cursor-pointer
                  inline-flex items-center gap-2
                  px-5 py-3 rounded-2xl
                  bg-indigo-600
                  text-white font-black
                  hover:bg-indigo-700
                  transition-all
                ">

                  <Upload size={18} />

                  {t.upload_logo}

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                  />

                </label>

              </div>

              {/* COLOR */}

              <div className="space-y-2">

                <label className="
                  text-[10px]
                  font-black
                  text-gray-400
                  uppercase
                  tracking-widest
                  ml-2
                ">

                  {t.theme_color}

                </label>

                <div className="flex items-center gap-4">

                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) =>
                      setThemeColor(
                        e.target.value
                      )
                    }
                    className="
                      w-20 h-14 rounded-2xl
                      border-none bg-transparent
                      cursor-pointer
                    "
                  />

                  <div className="
                    px-4 py-3 rounded-2xl
                    bg-gray-50 dark:bg-slate-800
                    font-black text-sm
                    text-gray-600 dark:text-white
                  ">
                    {themeColor}
                  </div>

                </div>

              </div>

            </div>

          </BuilderSection>

          {/* CTA */}

          {!createdBusiness ? (

            <button
              onClick={handleCreateBusiness}
              disabled={loading}
              className="
                w-full py-5
                rounded-[2rem]
                font-black text-lg
                shadow-xl shadow-indigo-200
                transition-all
                border-none
                flex items-center justify-center gap-3
                bg-indigo-600
                hover:bg-indigo-700
                text-white
                cursor-pointer
              "
            >

              {loading
                ? <Loader2 className="animate-spin" />
                : <ShieldCheck size={20} />
              }

              {t.create_business}

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

              {t.business_created}

            </div>

          )}

        </div>

      </div>

    </div>
  )
}