/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Upload, X } from "lucide-react"
import { Data } from "./data"
import { useState } from "react"

export default function QRDesignSettings({
  lang,
  onChange,
}: {
  lang: "fr" | "en"
  onChange: (data: {
    fgColor: string
    bgColor: string
    logo: string | null
  }) => void
}) {
  const t = Data[lang]

  const [fgColor, setFgColor] = useState("#4f46e5")
  const [bgColor, setBgColor] = useState("#ffffff")
  const [logo, setLogo] = useState<string | null>(null)

  const update = (newState: any) => {
    onChange({
      fgColor,
      bgColor,
      logo,
      ...newState,
    })
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setLogo(reader.result as string)
      update({ logo: reader.result })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      {/* COLORS */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="color"
          value={fgColor}
          onChange={(e) => {
            setFgColor(e.target.value)
            update({ fgColor: e.target.value })
          }}
        />

        <input
          type="color"
          value={bgColor}
          onChange={(e) => {
            setBgColor(e.target.value)
            update({ bgColor: e.target.value })
          }}
        />
      </div>

      {/* LOGO */}
      <div>
        <input type="file" onChange={handleLogoUpload} />
        {logo && (
          <button onClick={() => setLogo(null)}>
            <X /> Remove
          </button>
        )}
      </div>
    </div>
  )
}