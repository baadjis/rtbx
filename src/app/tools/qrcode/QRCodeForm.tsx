/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client'
import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Type, ArrowLeft, Plus, Trash2, Settings2, FileText, Upload, X } from 'lucide-react'
import Link from 'next/link'
import { Data } from './data'

export default function QRCodeForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang]
  
  const [mode, setMode] = useState<'url' | 'kv'>('url')
  const [url, setUrl] = useState('https://rtbx.space')
  const [kvData, setKvData] = useState([{ key: '', val: '' }])
  const [fgColor, setFgColor] = useState('#4f46e5')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [logo, setLogo] = useState<string | null>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setLogo(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

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
    // @ts-ignore
    newData[index][field] = value
    setKvData(newData)
  }

  const getFinalData = () => {
    if (mode === 'url') return url || ' '
    return kvData
      .map(d => (d.key || d.val ? `${d.key}: ${d.val}` : ''))
      .filter(Boolean)
      .join('\n') || ' '
  }

  const downloadQR = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement
    if (!canvas) return
    const pngUrl = canvas.toDataURL('image/png')
    const downloadLink = document.createElement('a')
    downloadLink.href = pngUrl
    downloadLink.download = `retailbox-qr-${mode}.png`
    downloadLink.click()
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        {/* BOUTON RETOUR */}
        <Link href="/" className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold mb-8 transition-colors no-underline">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
            <ArrowLeft className="w-4 h-4" />
          </div>
          {t.back}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* --- COLONNE GAUCHE : FORMULAIRE --- */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic tracking-tight">
                {t.title}
              </h1>
              <p className="text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed">{t.sub}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-8 transition-colors">
              
              {/* MODE SELECT */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Settings2 className="w-4 h-4" /> {t.label_mode}
                </label>
                <select 
                  value={mode} 
                  onChange={(e) => setMode(e.target.value as 'url' | 'kv')}
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white appearance-none transition-colors"
                >
                  <option value="url">{t.opt_url}</option>
                  <option value="kv">{t.opt_kv}</option>
                </select>
              </div>

              {/* DYNAMIC INPUTS */}
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  {mode === 'url' ? <Type className="w-4 h-4"/> : <FileText className="w-4 h-4"/>}
                  {mode === 'url' ? t.label_text : t.label_kv}
                </label>

                {mode === 'url' ? (
                  <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={t.ph_text}
                    className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white transition-colors"
                  />
                ) : (
                  <div className="space-y-4">
                    {kvData.map((row, index) => (
                      <div key={index} className="flex flex-col p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex gap-2">
                          <input 
                            placeholder={t.ph_key}
                            value={row.key}
                            onChange={(e) => updateRow(index, 'key', e.target.value)}
                            className="flex-1 p-3 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold dark:text-white transition-colors"
                          />
                          <input 
                            placeholder={t.ph_val}
                            value={row.val}
                            onChange={(e) => updateRow(index, 'val', e.target.value)}
                            className="flex-1 p-3 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold dark:text-white transition-colors"
                          />
                        </div>
                        {/* Bouton Supprimer large en bas de ligne sur mobile */}
                        <button 
                          type="button"
                          onClick={() => removeRow(index)}
                          className="w-full py-2 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-xs"
                        >
                          <Trash2 size={14} /> {lang === 'fr' ? 'Supprimer' : 'Remove'}
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={addRow}
                      className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl text-gray-400 dark:text-slate-500 font-bold hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center gap-2 bg-transparent"
                    >
                      <Plus className="w-5 h-5" /> {t.btn_add}
                    </button>
                  </div>
                )}
              </div>

              {/* COULEURS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 dark:border-slate-800">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.label_qr}</label>
                  <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                      <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border-none bg-transparent" />
                      <span className="text-sm font-bold dark:text-white uppercase">{fgColor}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.label_bg}</label>
                  <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                      <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border-none bg-transparent" />
                      <span className="text-sm font-bold dark:text-white uppercase">{bgColor}</span>
                  </div>
                </div>
              </div>

              {/* LOGO UPLOAD */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex justify-between">
                    {t.label_logo}
                    {logo && <button onClick={() => setLogo(null)} className="text-red-500 flex items-center gap-1 text-[10px] hover:underline font-bold"><X size={12}/> Supprimer</button>}
                </label>
                <div className="relative group">
                    <input type="file" onChange={handleLogoUpload} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-3 group-hover:border-indigo-400 transition-colors">
                        <Upload size={20} className="text-gray-400" />
                        <span className="text-sm font-bold text-gray-500 dark:text-slate-400 italic">{logo ? (lang === 'fr' ? "Changer de logo" : "Change logo") : t.label_logo}</span>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- COLONNE DROITE : PREVIEW --- */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center transition-colors">
              <div className="p-8 bg-white rounded-[2.5rem] mb-10 border border-gray-50 shadow-inner overflow-hidden">
                <QRCodeCanvas 
                  id="qr-canvas"
                  value={getFinalData()} 
                  size={260} 
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level="H"
                  marginSize={4}
                  imageSettings={logo ? { src: logo, height: 50, width: 50, excavate: true } : undefined}
                />
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">{t.preview}</h3>
              <p className="text-gray-400 dark:text-slate-500 text-sm mb-10 font-bold tracking-widest uppercase italic">{t.preview_sub}</p>
              
              <button onClick={downloadQR} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95">
                <Download className="w-6 h-6" /> {t.btn_dl}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}