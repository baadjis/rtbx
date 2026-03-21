/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useRef } from 'react'
import Barcode from 'react-barcode'
import { Download, Plus, Trash2, ArrowLeft, Settings2, Hash, Database } from 'lucide-react'
import Link from 'next/link'
import { Data } from './data'

export default function BarcodeForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang]
  const [type, setType] = useState<'ean13' | 'code128'>('ean13')
  const [singleData, setSingleData] = useState('123456789012')
  const [kvData, setKvData] = useState([{ key: '', val: '' }])

  const addRow = () => setKvData([...kvData, { key: '', val: '' }])
  const removeRow = (index: number) => {
    if (kvData.length > 1) {
      setKvData(kvData.filter((_, i) => i !== index))
    } else {
      setKvData([{ key: '', val: '' }])
    }
  }
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
      // Haute définition pour impression pro
      canvas.width = img.width * 2 
      canvas.height = img.height * 2
      if(ctx) {
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.scale(2, 2)
        ctx.drawImage(img, 0, 0)
      }
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = `barcode-retailbox-${type}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        {/* RETOUR */}
        <Link href="/" className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold mb-8 transition-colors no-underline">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
            <ArrowLeft className="w-4 h-4" />
          </div>
          {t.back}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* --- COLONNE GAUCHE : CONFIGURATION --- */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic tracking-tight">
                {t.title}
              </h1>
              <p className="text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed">{t.sub}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-8 transition-colors">
              
              {/* SÉLECTEUR DE TYPE */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Settings2 className="w-4 h-4" /> {t.label_type}
                </label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white appearance-none transition-colors"
                >
                  <option value="ean13">{t.opt_ean}</option>
                  <option value="code128">{t.opt_128}</option>
                </select>
              </div>

              {/* ENTRÉE DES DONNÉES */}
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                   {type === 'ean13' ? <Hash className="w-4 h-4" /> : <Database className="w-4 h-4" />}
                   {type === 'ean13' ? t.label_data : t.label_kv}
                </label>

                {type === 'ean13' ? (
                  <input 
                    type="text" 
                    maxLength={12}
                    value={singleData}
                    onChange={(e) => setSingleData(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-2xl tracking-[0.3em] dark:text-white transition-colors"
                    placeholder={t.ph_ean}
                  />
                ) : (
                  <div className="space-y-3">
                    {kvData.map((row, index) => (
                      <div key={index} className="flex flex-col p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex gap-3">
                          <input 
                            placeholder="Clé (ex: SKU)" 
                            value={row.key}
                            onChange={(e) => updateRow(index, 'key', e.target.value)}
                            className="flex-1 p-3 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold dark:text-white transition-colors"
                          />
                          <button 
                            onClick={() => removeRow(index)} 
                            className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <input 
                          placeholder="Valeur" 
                          value={row.val}
                          onChange={(e) => updateRow(index, 'val', e.target.value)}
                          className="w-full p-3 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-medium dark:text-white transition-colors"
                        />
                      </div>
                    ))}
                    <button 
                      onClick={addRow}
                      className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl text-gray-400 dark:text-slate-500 font-bold hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center gap-2 bg-transparent"
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
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center transition-colors">
              
              {/* Le barcode DOIT rester sur fond blanc pour être lisible par les scanners */}
              <div className="p-8 bg-white rounded-[2.5rem] mb-10 border border-gray-50 shadow-inner min-h-[200px] flex items-center justify-center w-full overflow-hidden">
                <div id="barcode-svg-container" className="scale-110 md:scale-125">
                  <Barcode 
                    id="barcode-svg"
                    value={getEncodedData() || ' '} 
                    format={type === 'ean13' ? 'EAN13' : 'CODE128'}
                    width={1.8}
                    height={80}
                    fontSize={14}
                    background="#ffffff"
                  />
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">
                  {t.preview}
              </h3>
              <p className="text-gray-400 dark:text-slate-500 font-bold text-sm mb-10 tracking-widest uppercase">
                  Format {type.toUpperCase()}
              </p>
              
              <button 
                  onClick={downloadBarcode}
                  className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <Download className="w-6 h-6" /> {t.btn_dl}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}