// /lib/qrTemplates.ts
import { Options } from "qr-code-styling"

export type QRTemplate = {
  name: string
  label: string
  options: Partial<Options>
}

export const QR_TEMPLATES: QRTemplate[] = [
  {
    name: "default",
    label: "Default",
    options: {},
  },
  {
    name: "dots",
    label: "Dots",
    options: {
      dotsOptions: {
        type: "dots",
      },
    },
  },
  {
    name: "rounded",
    label: "Rounded",
    options: {
      dotsOptions: {
        type: "rounded",
      },
      cornersSquareOptions: {
        type: "extra-rounded",
      },
    },
  },
  {
    name: "classy",
    label: "Classy",
    options: {
      dotsOptions: {
        type: "classy",
      },
      cornersDotOptions: {
        type: "dot",
      },
    },
  },
  {
    name: "neon",
    label: "Neon",
    options: {
      dotsOptions: {
        type: "dots",
        color: "#00F5FF",
      },
      backgroundOptions: {
        color: "#000000",
      },
    },
  },
  {
    name: "gold",
    label: "Gold",
    options: {
      dotsOptions: {
        type: "classy",
        color: "#C9A227",
      },
    },
  },
]