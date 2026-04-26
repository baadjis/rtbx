/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Type, FileText, Plus, Trash2, Settings2 } from "lucide-react"
import { Data } from "./data"

export default function QRValueInput({
  lang,
  onChange,
}: {
  lang: "fr" | "en"
  onChange: (value: string) => void
}) {
  const t = Data[lang]

  const [mode, setMode] = useState<"url" | "kv">("url")
  const [url, setUrl] = useState("https://rtbx.space")
  const [kvData, setKvData] = useState([{ key: "", val: "" }])

  const addRow = () => setKvData([...kvData, { key: "", val: "" }])

  const removeRow = (index: number) => {
    if (kvData.length > 1) {
      setKvData(kvData.filter((_, i) => i !== index))
    }
  }

  const updateRow = (index: number, field: "key" | "val", value: string) => {
    const newData = [...kvData]
    // @ts-ignore
    
    newData[index][field] = value
    setKvData(newData)
  }

  const computeValue = () => {
    if (mode === "url") return url || " "
    return (
      kvData
        .map((d) => (d.key || d.val ? `${d.key}: ${d.val}` : ""))
        .filter(Boolean)
        .join("\n") || " "
    )
  }

  // 🔥 sync parent
  useState(() => {
    onChange(computeValue())
  })

  return (
    <div className="space-y-6">
      {/* MODE */}
      <div className="space-y-2">
        <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase flex items-center gap-2">
          <Settings2 size={14} /> {t.label_mode}
        </label>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as any)}
          className="w-full p-3 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white"
        >
          <option value="url">{t.opt_url}</option>
          <option value="kv">{t.opt_kv}</option>
        </select>
      </div>

      {/* INPUT */}
      {mode === "url" ? (
        <input
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            onChange(e.target.value)
          }}
          placeholder={t.ph_text}
          className="w-full p-4 rounded-xl bg-gray-50 dark:bg-slate-800"
        />
      ) : (
        <div className="space-y-3">
          {kvData.map((row, i) => (
            <div key={i} className="space-y-2">
              <div className="flex gap-2">
                <input
                  placeholder={t.ph_key}
                  value={row.key}
                  onChange={(e) => updateRow(i, "key", e.target.value)}
                  className="flex-1 p-3 rounded-xl bg-gray-50 dark:bg-slate-800"
                />
                <input
                  placeholder={t.ph_val}
                  value={row.val}
                  onChange={(e) => updateRow(i, "val", e.target.value)}
                  className="flex-1 p-3 rounded-xl bg-gray-50 dark:bg-slate-800"
                />
              </div>

              <button
                onClick={() => removeRow(i)}
                className="w-full text-xs text-red-500 flex items-center justify-center gap-1"
              >
                <Trash2 size={14} /> {lang === "fr" ? "Supprimer" : "Remove"}
              </button>
            </div>
          ))}

          <button
            onClick={addRow}
            className="w-full border-dashed border-2 p-3 rounded-xl"
          >
            <Plus size={16} /> {t.btn_add}
          </button>
        </div>
      )}
    </div>
  )
}