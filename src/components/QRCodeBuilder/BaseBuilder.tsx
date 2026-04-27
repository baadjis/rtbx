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

  overrides?: Partial<Options>
}

// 🔥 merge profond safe (corrigé edge cases)
function deepMerge(target: any, source: any) {
  if (!source) return target

  const output = { ...target }

  Object.keys(source).forEach((key) => {
    const sourceVal = source[key]
    const targetVal = target?.[key]

    if (
      typeof sourceVal === "object" &&
      sourceVal !== null &&
      !Array.isArray(sourceVal)
    ) {
      output[key] = deepMerge(targetVal || {}, sourceVal)
    } else {
      output[key] = sourceVal
    }
  })

  return output
}

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

  // 🔹 BASE CLEAN
  const base: Options = {
    width: size,
    height: size,
    data: value || " ",

    image: logo || undefined,

    dotsOptions: {
      type: dotType,
      color: fgColor,
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
      imageSize: 0.2, // 🔥 important (default UX safe)
    },
  }

  // 🔹 TEMPLATE
  const template =
    QR_TEMPLATES.find((t) => t.name === templateName)?.options || {}

  // 🔹 MERGE BASE + TEMPLATE
  let finalOptions = deepMerge(base, template)

  // 🔹 USER OVERRIDE
  finalOptions = deepMerge(finalOptions, overrides)

  // 🔥 FIX CRITIQUE : gradient vs color
  if (finalOptions?.dotsOptions?.gradient) {
    delete finalOptions.dotsOptions.color
  }

  // 🔥 FIX : image null propre
  if (!logo) {
    delete finalOptions.image
  }

  return finalOptions
}