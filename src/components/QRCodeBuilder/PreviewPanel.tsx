/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useRef } from "react"
import QRCodeStyling from "qr-code-styling"
import { Download } from "lucide-react"
import { Data } from "./data"

export default function PreviewPanel({
  options,
  lang,
}: {options:any,lang:'fr'|'en'}) {
  const ref = useRef<HTMLDivElement>(null)
  const qr = useRef<QRCodeStyling | null>(null)

  const t = Data[lang]

  useEffect(() => {
    if (!qr.current) {
      qr.current = new QRCodeStyling(options)
      qr.current.append(ref.current!)
    } else {
      qr.current.update(options)
    }
  }, [options])

  const download = () => {
    qr.current?.download({
      name: "qr-code",
      extension: "png",
    })
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow border border-gray-100 dark:border-slate-800 flex flex-col items-center">

      <div className="p-6 bg-white rounded-2xl mb-6 shadow-inner">
        <div ref={ref} />
      </div>

      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
        {t.preview}
      </h3>

      <p className="text-gray-400 text-sm mb-6">
        {t.preview_sub}
      </p>

      <button
        onClick={download}
        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
      >
        <Download size={18} /> {t.btn_dl}
      </button>
    </div>
  )
}