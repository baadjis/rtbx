import { Options } from "qr-code-styling"

export type QRPreset = {
  name: string
  label: string
  options: Partial<Options>
}

export const QR_PRESETS: QRPreset[] = [
  {
    name: "modern",
    label: "Modern",
    options: {
      dotsOptions: { type: "square" },
    },
  },
  {
    name: "dots",
    label: "Dots",
    options: {
      dotsOptions: { type: "dots" },
    },
  },
  {
    name: "rounded",
    label: "Rounded",
    options: {
      dotsOptions: { type: "rounded" },
      cornersSquareOptions: { type: "extra-rounded" },
    },
  },
  {
    name: "neon",
    label: "Neon",
    options: {
      dotsOptions: { type: "dots", color: "#00F5FF" },
      backgroundOptions: { color: "#000" },
    },
  },
]