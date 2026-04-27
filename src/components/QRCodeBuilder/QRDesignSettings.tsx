/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { Data } from "./data"

type DotType = "square" | "dots" | "rounded" | "classy" | "classy-rounded"

export default function QRDesignSettings({
  lang,
  onChange,
}: {
  lang: "fr" | "en"
  onChange: (data: any) => void
}) {
  const t = Data[lang]

  const [fgColor, setFgColor] = useState("#4f46e5")
  const [bgColor, setBgColor] = useState("#ffffff")
  const [logo, setLogo] = useState<string | null>(null)

  const [dotType, setDotType] = useState<DotType>("square")
  const [roundSize, setRoundSize] = useState(false)

  const [useGradient, setUseGradient] = useState(false)
  const [gradientStart, setGradientStart] = useState("#4f46e5")
  const [gradientEnd, setGradientEnd] = useState("#9333ea")

  const [logoSize, setLogoSize] = useState(0.2) // ratio (20%)
  const [logoMargin, setLogoMargin] = useState(5)

  const update = (override = {}) => {
    onChange({
      fgColor,
      bgColor,
      logo,
      overrides: {
        dotsOptions: {
          type: dotType,
          roundSize,
          ...(useGradient && {
            gradient: {
              type: "linear",
              rotation: 0,
              colorStops: [
                { offset: 0, color: gradientStart },
                { offset: 1, color: gradientEnd },
              ],
            },
          }),
        },
        imageOptions: {
          margin: logoMargin,
          imageSize: logoSize,
        },
      },
      ...override,
    })
  }

  // upload logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setLogo(result)
      update({ logo: result })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-8">

      {/* COLORS */}
       {/* 🎨 COLORS */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* QR COLOR */}
    <div className="space-y-2">
      <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase">
        {t.label_qr}
      </label>

      <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
        <input
          type="color"
          value={fgColor}
          onChange={(e) => {
            setFgColor(e.target.value)
            update({ fgColor: e.target.value })
          }}
          className="w-10 h-10 rounded cursor-pointer border-none bg-transparent"
        />
        <span className="text-sm font-bold dark:text-white uppercase">
          {fgColor}
        </span>
      </div>
    </div>

    {/* BG COLOR */}
    <div className="space-y-2">
      <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase">
        {t.label_bg}
      </label>

      <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
        <input
          type="color"
          value={bgColor}
          onChange={(e) => {
            setBgColor(e.target.value)
            update({ bgColor: e.target.value })
          }}
          className="w-10 h-10 rounded cursor-pointer border-none bg-transparent"
        />
        <span className="text-sm font-bold dark:text-white uppercase">
          {bgColor}
        </span>
      </div>
    </div>

  </div>

  {/* 🔵 DOT STYLE */}
  <div className="space-y-2">
    <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase">
      {lang === "fr" ? "Style des points" : "Dot style"}
    </label>

    <select
      value={dotType}
      onChange={(e) => {
        setDotType(e.target.value as DotType)
        update()
      }}
      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-100 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
    >
      <option value="square">Square</option>
      <option value="dots">Dots</option>
      <option value="rounded">Rounded</option>
      <option value="classy">Classy</option>
      <option value="classy-rounded">Classy Rounded</option>
    </select>
  </div>

      {/* ROUND SIZE */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={roundSize}
          onChange={(e) => {
            setRoundSize(e.target.checked)
            update()
          }}
        />
        Round edges
      </label>

      {/* 🎨 GRADIENT */}
      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useGradient}
            onChange={(e) => {
              setUseGradient(e.target.checked)
              update()
            }}
          />
          Gradient
        </label>

        {useGradient && (
          <div className="flex gap-4">
            <input
              type="color"
              value={gradientStart}
              onChange={(e) => {
                setGradientStart(e.target.value)
                update()
              }}
            />
            <input
              type="color"
              value={gradientEnd}
              onChange={(e) => {
                setGradientEnd(e.target.value)
                update()
              }}
            />
          </div>
        )}
      </div>

      {/* 🖼 LOGO */}
      <div className="space-y-3">
        <label className="font-bold">
          {lang === "fr" ? "Votre logo (optionnel)" : "Your logo (optional)"}
        </label>

        <div className="relative">
          <input
            type="file"
            onChange={handleLogoUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />

          <div className="p-6 border-dashed border-2 rounded-xl text-center">
            <Upload />
            <p>
              {logo
                ? "Change logo"
                : lang === "fr"
                ? "Cliquez pour ajouter"
                : "Click to upload"}
            </p>
          </div>
        </div>

        {logo && (
          <div className="flex items-center justify-between">
            <Image src={logo} alt="logo" width={40} height={40} />
            <button
              onClick={() => {
                setLogo(null)
                update({ logo: null })
              }}
            >
              <X /> Remove
            </button>
          </div>
        )}
      </div>

      {/* 📏 LOGO SIZE */}
      <div>
        <label>{t.logo_size}</label>
        <input
          type="range"
          min={0.1}
          max={0.4}
          step={0.05}
          value={logoSize}
          onChange={(e) => {
            const val = Number(e.target.value)
            setLogoSize(val)
            update()
          }}
        />
      </div>

      {/* 📐 LOGO MARGIN */}
      <div>
        <label>{t.logo_margin}</label>
        <input
          type="range"
          min={0}
          max={20}
          value={logoMargin}
          onChange={(e) => {
            const val = Number(e.target.value)
            setLogoMargin(val)
            update()
          }}
        />
      </div>
    </div>
  )
}