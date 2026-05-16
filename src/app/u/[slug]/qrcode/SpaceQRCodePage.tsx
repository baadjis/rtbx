/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useMemo, useState } from 'react'

import Image from 'next/image'

import { QRCodeCanvas } from 'qrcode.react'

import {
  Download,
  Check,
  Sparkles,
  Palette,
  QrCode,
  ArrowLeft,
  ImageIcon
} from 'lucide-react'

import Link from 'next/link'
import { LangType } from '@/lib/lang/types'
import { Data } from './data'


export default function SpaceQRCodePage({
  space,
  lang
}: {
  space: any,
  lang:LangType

}) {
  
  const publicUrl = `https://rtbx.space/u/${space.slug}`
  const t= Data[lang]

  const [fgColor, setFgColor] = useState(
    space.theme_color || '#4f46e5'
  )

  const [bgColor, setBgColor] = useState(
    '#ffffff'
  )

  const [size, setSize] = useState(340)

  const qrLogo = useMemo(() => {
    return (
      space.qr_logo ||
      space.avatar_url ||
      null
    )
  }, [space])

  const downloadQR = () => {

    const canvas =
      document.getElementById(
        'space-qr'
      ) as HTMLCanvasElement

    if (!canvas) return

    const url = canvas.toDataURL('image/png')

    const link = document.createElement('a')

    link.href = url

    link.download = `${space.slug}-qr.png`

    link.click()
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] overflow-hidden relative">

      {/* BACKGROUND */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-indigo-500/10 blur-[180px] rounded-full" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-fuchsia-500/10 blur-[160px] rounded-full" />

      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-14">

        {/* TOP */}

        <div className="flex items-center justify-between mb-10">

          <Link
            href={`/u/${space.slug}/onboarding`}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors no-underline"
          >
            <ArrowLeft size={18} />
            {t.back}
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 text-xs font-black uppercase tracking-[0.25em]">
            <Sparkles size={14} />
            {t.badge}
          </div>

        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-10 items-start">

          {/* LEFT */}

          <div className="relative">

            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 rounded-[3rem] blur opacity-20" />

            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-slate-800 rounded-[3rem] p-6 md:p-10 shadow-[0_40px_120px_rgba(79,70,229,0.12)] overflow-hidden">

              <div className="flex flex-col items-center text-center">

                {/* SPACE */}

                <div
                  className="w-28 h-28 rounded-[2.8rem] p-[2px] shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${fgColor}, #9333ea)`
                  }}
                >
                  <div className="w-full h-full rounded-[2.6rem] bg-slate-950 overflow-hidden flex items-center justify-center text-white text-4xl font-black uppercase">

                    {space.avatar_url ? (

                      <Image
                        src={space.avatar_url}
                        alt="Avatar"
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                        unoptimized
                      />

                    ) : (

                      <span>
                        {space.entity_name?.[0] || space.slug?.[0]}
                      </span>

                    )}

                  </div>
                </div>

                <h1 className="mt-6 text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                  @{space.slug}
                </h1>

                <p className="mt-3 text-slate-500 dark:text-slate-400 font-medium">
                  {t.scan_share_connect}
                </p>

                {/* QR */}

                <div className="mt-10 p-5 md:p-7 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">

                  <QRCodeCanvas
                    id="space-qr"
                    value={publicUrl}
                    size={size}
                    level="H"
                    marginSize={3}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    imageSettings={
                      qrLogo
                        ? {
                            src: qrLogo,
                            height: size * 0.18,
                            width: size * 0.18,
                            excavate: true
                          }
                        : undefined
                    }
                  />

                </div>

                {/* URL */}

                <div className="mt-8 inline-flex items-center gap-2 px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-black text-slate-600 dark:text-slate-300">
                  <Check size={16} />
                  {publicUrl}
                </div>

                {/* BUTTON */}

                <button
                  onClick={downloadQR}
                  className="mt-8 inline-flex items-center gap-3 px-8 py-5 rounded-[1.8rem] bg-indigo-600 text-white font-black shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-[1.02] transition-all border-none cursor-pointer"
                >
                  <Download size={20} />
                  {t.download_qr}
                </button>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="space-y-8">

            {/* COLORS */}

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-slate-800 rounded-[2.5rem] p-7 shadow-xl">

              <div className="flex items-center gap-3 mb-7">

                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Palette size={22} />
                </div>

                <div>

                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {t.title_colors}
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {t.subtitle_colors}
                  </p>

                </div>

              </div>

              <div className="space-y-5">

                <div className="space-y-2">

                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    QR Color
                  </label>

                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) =>
                      setFgColor(e.target.value)
                    }
                    className="w-full h-14 rounded-2xl cursor-pointer border-none bg-slate-100 dark:bg-slate-800 p-1"
                  />

                </div>

                <div className="space-y-2">

                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {t.qr_background}
                  </label>

                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) =>
                      setBgColor(e.target.value)
                    }
                    className="w-full h-14 rounded-2xl cursor-pointer border-none bg-slate-100 dark:bg-slate-800 p-1"
                  />

                </div>

              </div>

            </div>

            {/* SIZE */}

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-slate-800 rounded-[2.5rem] p-7 shadow-xl">

              <div className="flex items-center gap-3 mb-7">

                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                  <QrCode size={22} />
                </div>

                <div>

                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {t.title_size}
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {t.subtitle_size}
                  </p>

                </div>

              </div>

              <input
                type="range"
                min={180}
                max={600}
                step={10}
                value={size}
                onChange={(e) =>
                  setSize(Number(e.target.value))
                }
                className="w-full"
              />

              <div className="mt-4 text-sm font-black text-indigo-600">
                {size}px
              </div>

            </div>

            {/* LOGO */}

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-slate-800 rounded-[2.5rem] p-7 shadow-xl">

              <div className="flex items-center gap-3 mb-7">

                <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 text-fuchsia-600 flex items-center justify-center">
                  <ImageIcon size={22} />
                </div>

                <div>

                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {t.title_logo}
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {t.subtitle_logo}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">

                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white flex items-center justify-center">

                  {qrLogo ? (

                    <Image
                      src={qrLogo}
                      alt="QR Logo"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />

                  ) : (

                    <div className="text-slate-300">
                      <ImageIcon size={22} />
                    </div>

                  )}

                </div>

                <div>

                  <p className="font-black text-slate-900 dark:text-white">
                    {t.qr_branding}
                  </p>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t.qr_branding_desc}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}