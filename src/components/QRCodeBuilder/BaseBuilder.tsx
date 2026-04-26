/* eslint-disable @typescript-eslint/no-explicit-any */
// /lib/baseQRBuilder.ts
import { Options } from "qr-code-styling"
import { QR_TEMPLATES } from "./Templates"


export type QRBuilderParams = {
  value: string

  size?: number

  fgColor?: string
  bgColor?: string

  dotType?: any

  logo?: string | null

  templateName?: string

  // override avancé libre
  overrides?: Partial<Options>
}

// 🔥 merge profond propre
function deepMerge(target: any, source: any) {
  const output = { ...target }

  if (typeof target === "object" && typeof source === "object") {
    Object.keys(source || {}).forEach((key) => {
      if (
        typeof source[key] === "object" &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        output[key] = deepMerge(target[key] || {}, source[key])
      } else {
        output[key] = source[key]
      }
    })
  }

  return output
}

// 🔥 BUILDER CENTRAL
export function baseQRBuilder(params: QRBuilderParams): Options {
  const {
    value,
    size = 260,
    fgColor = "#000000",
    bgColor = "#ffffff",
    dotType = "square",
    logo,
    templateName = "default",
    overrides = {},
  } = params

  // 1️⃣ BASE (stable)
  const base: Options = {
    width: size,
    height: size,
    data: value || " ",

    image: logo || undefined,

    dotsOptions: {
      color: fgColor,
      type: dotType,
    },

    backgroundOptions: {
      color: bgColor,
    },

    cornersSquareOptions: {
      type: "square",
    },

    cornersDotOptions: {
      type: "square",
    },

    imageOptions: {
      crossOrigin: "anonymous",
      margin: 5,
    },
  }

  // 2️⃣ TEMPLATE
  const template =
    QR_TEMPLATES.find((t) => t.name === templateName)?.options || {}

  // 3️⃣ MERGE FINAL (ordre important)
  let finalOptions = deepMerge(base, template)

  // 4️⃣ USER OVERRIDE (priorité max)
  finalOptions = deepMerge(finalOptions, overrides)

  return finalOptions
}