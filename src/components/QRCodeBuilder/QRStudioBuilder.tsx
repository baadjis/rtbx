"use client"

import { useState, useMemo } from "react"
import QRCodeStyling from "qr-code-styling"
import { baseQRBuilder } from "./BaseBuilder"

import QRTemplatesSlider from "./QRTemplatesSlider"
import QRValueInput from "./QRValueInput"
import QRDesignSettings from "./QRDesignSettings"

import { Download } from "lucide-react"
import { Data } from "./data"
import PreviewPanel from "./PreviewPanel"

export default function QRStudioBuilder({
  lang,
  templateOrientation = "horizontal",
}: {
  lang: "fr" | "en"
  templateOrientation?: "horizontal" | "vertical"
}) {
  const t = Data[lang]

  // 🔹 STATE GLOBAL
  const [value, setValue] = useState("https://rtbx.space")
  const [template, setTemplate] = useState("default")

  const [design, setDesign] = useState<{
    fgColor?: string
    bgColor?: string
    logo?: string | null
  }>({})

  // 🔹 BUILD OPTIONS (🔥 basebuilder utilisé ici)
  const options = useMemo(() => {
    return baseQRBuilder({
      value,
      fgColor: design.fgColor,
      bgColor: design.bgColor,
      logo: design.logo,
      templateName: template,
    })
  }, [value, design, template])

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 🟣 LEFT → TEMPLATES */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow border border-gray-100 dark:border-slate-800">
            <h2 className="font-black text-lg mb-4 text-gray-900 dark:text-white">
              Templates
            </h2>

            <QRTemplatesSlider
              value={value}
              logo={design.logo}
              selected={template}
              onSelect={setTemplate}
              orientation={templateOrientation}
            />
          </div>

          {/* 🟡 CENTER → FORM */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow border border-gray-100 dark:border-slate-800 space-y-8">
            
            {/* VALUE */}
            <div>
              <h3 className="font-black text-gray-900 dark:text-white mb-3">
                {t.label_text}
              </h3>
              <QRValueInput lang={lang} onChange={setValue} />
            </div>

            {/* DESIGN */}
            <div>
              <h3 className="font-black text-gray-900 dark:text-white mb-3">
                Design
              </h3>
              <QRDesignSettings lang={lang} onChange={setDesign} />
            </div>

          </div>

          {/* 🔵 RIGHT → PREVIEW */}
          <PreviewPanel options={options} lang={lang} />

        </div>
      </div>
    </div>
  )
}