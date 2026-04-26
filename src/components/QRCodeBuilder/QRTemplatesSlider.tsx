/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useMemo } from "react"
import { QR_TEMPLATES } from "./Templates"
import { baseQRBuilder } from "./BaseBuilder"
import QRCodeStyling from "qr-code-styling"
import { useEffect, useRef } from "react"

type Orientation = "horizontal" | "vertical"

export default function QRTemplatesSlider({
  value,
  logo,
  selected,
  onSelect,
  orientation = "horizontal",
  size = 120,
}: {
  value?: string
  logo?: string | null
  selected?: string
  onSelect: (name: string) => void
  orientation?: Orientation
  size?: number
}) {
  const containerClass =
    orientation === "horizontal"
      ? "flex gap-4 overflow-x-auto pb-2"
      : "flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2"

  return (
    <div className={containerClass}>
      {QR_TEMPLATES.map((tpl) => (
        <TemplateItem
          key={tpl.name}
          templateName={tpl.name}
          label={tpl.label}
          value={value}
          logo={logo}
          active={selected === tpl.name}
          onClick={() => onSelect(tpl.name)}
          size={size}
        />
      ))}
    </div>
  )
}

/* 🔹 ITEM PREVIEW */
function TemplateItem({
  templateName,
  label,
  value,
  logo,
  active,
  onClick,
  size,
}: any) {
  const ref = useRef<HTMLDivElement>(null)
  const qr = useRef<QRCodeStyling | null>(null)

  // ⚡ build options (reactif value + logo)
  const options = useMemo(() => {
    return baseQRBuilder({
      value: value || "Preview",
      logo: logo || undefined,
      templateName,
      size,
    })
  }, [value, logo, templateName, size])

  useEffect(() => {
    if (!qr.current) {
      qr.current = new QRCodeStyling(options)
      qr.current.append(ref.current!)
    } else {
      qr.current.update(options)
    }
  }, [options])

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all min-w-[${size}px]
      ${
        active
          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
          : "border-gray-200 dark:border-slate-700"
      }`}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-xl p-2 shadow-inner"
        style={{ width: size, height: size }}
      >
        <div ref={ref} />
      </div>

      <span className="text-xs font-bold text-gray-600 dark:text-slate-300">
        {label}
      </span>
    </button>
  )
}