/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useRef } from 'react'
import Barcode from 'react-barcode'
import { Download, Plus, Trash2, ArrowLeft, Barcode as BarcodeIcon, Settings2 } from 'lucide-react'
import Link from 'next/link'

const DICT = {
  fr: {
    title: "Générateur de Barcode Expert",
    sub: "Créez des codes-barres conformes aux standards EAN-13 et Code 128.",
    label_type: "Format du code",
    opt_ean: "EAN-13 (Standard Commerce)",
    opt_128: "Code 128 (Logistique / Données)",
    label_data: "Données du code",
    ph_ean: "Entrez 12 chiffres",
    label_kv: "Fiche de données (Clé:Valeur)",
    btn_add: "Ajouter une donnée",
    preview: "Aperçu du Barcode",
    btn_dl: "TÉLÉCHARGER PNG",
    back: "Retour",
    error_ean: "L'EAN-13 nécessite exactement 12 chiffres numériques."
  },
  en: {
    title: "Expert Barcode Generator",
    sub: "Create barcodes compliant with EAN-13 and Code 128 standards.",
    label_type: "Barcode Format",
    opt_ean: "EAN-13 (Retail Standard)",
    opt_128: "Code 128 (Logistics / Data)",
    label_data: "Barcode Data",
    ph_ean: "Enter 12 digits",
    label_kv: "Data Sheet (Key:Value)",
    btn_add: "Add data row",
    preview: "Barcode Preview",
    btn_dl: "DOWNLOAD PNG",
    back: "Back",
    error_ean: "EAN-13 requires exactly 12 numeric digits."
  }
}

export default function BarcodeForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = DICT[lang]
  const [type, setType] = useState<'ean13' | 'code128'>('ean13')
  const [singleData, setSingleData] = useState('123456789012')
  const [kvData, setKvData] = useState([{ key: '', val: '' }])
  const barcodeRef = useRef<any>(null)

  const addRow = () => setKvData([...kvData, { key: '', val: '' }])
  const removeRow = (index: number) => setKvData(kvData.filter((_, i) => i !== index))
  const updateRow = (index: number, field: 'key' | 'val', value: string) => {
    const newData = [...kvData]
    newData[index][field] = value
    setKvData(newData)
  }

  // Calcul des données finales pour le rendu
  const getEncodedData = () => {
    if (type === 'ean13') return singleData.replace(/[^0-9]/g, '').slice(0, 12)
    return kvData.map(d => d.key && d.val ? `${d.key}:${d.val}` : d.key || d.val).filter(Boolean).join(' ') || 'RETAILBOX'
  }

  const downloadBarcode = () => {
    const svg = document.getElementById('barcode-svg')
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new (window as any).Image()
    img.onload = () => {
      canvas.width = img.width * 2 // Haute définition
      canvas.height = img.height * 2
      ctx?.scale(2, 2)
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = `barcode-${type}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* --- COLONNE GAUCHE : CONFIGURATION --- */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className="text-gray-500 font-medium text-lg">{t.sub}</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
            {/* SÉLECTEUR DE TYPE */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Settings2 className="w-4 h-4" /> {t.label_type}
              </label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value as any)}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 appearance-none"
              >
                <option value="ean13">{t.opt_ean}</option>
                <option value="code128">{t.opt_128}</option>
              </select>
            </div>

            {/* ENTRÉE DES DONNÉES */}
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {type === 'ean13' ? t.label_data : t.label_kv}
              </label>

              {type === 'ean13' ? (
                <input 
                  type="text" 
                  maxLength={12}
                  value={singleData}
                  onChange={(e) => setSingleData(e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-xl tracking-[0.3em]"
                  placeholder={t.ph_ean}
                />
              ) : (
                <div className="space-y-3">
                  {kvData.map((row, index) => (
                    <div key={index} className="flex gap-2 group">
                      <input 
                        placeholder="Clé" 
                        value={row.key}
                        onChange={(e) => updateRow(index, 'key', e.target.value)}
                        className="flex-1 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                      />
                      <input 
                        placeholder="Valeur" 
                        value={row.val}
                        onChange={(e) => updateRow(index, 'val', e.target.value)}
                        className="flex-1 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                      />
                      <button onClick={() => removeRow(index)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={addRow}
                    className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold text-sm hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> {t.btn_add}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- COLONNE DROITE : APERÇU --- */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100 text-center flex flex-col items-center">
            <div className="p-10 bg-white rounded-[2rem] mb-8 border border-gray-100 min-h-[200px] flex items-center justify-center w-full">
              <div id="barcode-svg-container">
                <Barcode 
                  id="barcode-svg"
                  value={getEncodedData()} 
                  format={type === 'ean13' ? 'EAN13' : 'CODE128'}
                  width={2}
                  height={100}
                  background="#ffffff"
                />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-1">{t.preview}</h3>
            <p className="text-gray-400 text-sm mb-8 font-medium">Format {type.toUpperCase()}</p>
            
            <button 
                onClick={downloadBarcode}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" /> {t.btn_dl}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}