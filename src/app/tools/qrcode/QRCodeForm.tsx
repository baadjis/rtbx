'use client'
import { useState, useCallback } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Palette, Type, ArrowLeft, Plus, Trash2, Settings2, FileText, Upload, X } from 'lucide-react'
import Link from 'next/link'
import { Data } from './data'



export default function QRCodeForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang]
  
  // États
  const [mode, setMode] = useState<'url' | 'kv'>('url')
  const [url, setUrl] = useState('https://rtbx.space')
  const [kvData, setKvData] = useState([{ key: '', val: '' }])
  const [fgColor, setFgColor] = useState('#4f46e5')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [logo, setLogo] = useState<string | null>(null)

  // Logique Logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setLogo(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  // Logique Key-Value
  const addRow = () => setKvData([...kvData, { key: '', val: '' }])
  const removeRow = (index: number) => setKvData(kvData.filter((_, i) => i !== index))
  const updateRow = (index: number, field: 'key' | 'val', value: string) => {
    const newData = [...kvData]
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 font-bold mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* --- COLONNE GAUCHE : CONFIGURATION --- */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic">
              {t.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed">{t.sub}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-8 transition-colors">
            
            {/* SÉLECTEUR DE MODE */}
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

            {/* INPUTS DYNAMIQUES */}
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
                <div className="space-y-3">
                  {kvData.map((row, index) => (
                    <div key={index} className="flex gap-2 group animate-in fade-in slide-in-from-left-2">
                      <input 
                        placeholder={t.ph_key}
                        value={row.key}
                        onChange={(e) => updateRow(index, 'key', e.target.value)}
                        className="flex-1 p-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold dark:text-white"
                      />
                      <input 
                        placeholder={t.ph_val}
                        value={row.val}
                        onChange={(e) => updateRow(index, 'val', e.target.value)}
                        className="flex-1 p-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold dark:text-white"
                      />
                      <button onClick={() => removeRow(index)} className="p-3 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={addRow}
                    className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl text-gray-400 font-bold text-sm hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> {t.btn_add}
                  </button>
                </div>
              )}
            </div>

            {/* COULEURS ET LOGO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 dark:border-slate-800">
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.label_qr}</label>
                <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                    <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border-none bg-transparent" />
                    <span className="text-sm font-bold dark:text-white uppercase">{fgColor}</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.label_bg}</label>
                <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border-none bg-transparent" />
                    <span className="text-sm font-bold dark:text-white uppercase">{bgColor}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex justify-between">
                    {t.label_logo}
                    {logo && <button onClick={() => setLogo(null)} className="text-red-500 flex items-center gap-1 text-[10px] hover:underline"><X size={12}/> Supprimer</button>}
                </label>
                <div className="relative group">
                    <input 
                        type="file" 
                        onChange={handleLogoUpload} 
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-3 group-hover:border-indigo-400 transition-colors">
                        <Upload size={20} className="text-gray-400" />
                        <span className="text-sm font-bold text-gray-500 italic">
                            {logo ? "Changer de logo" : "Uploader un logo (PNG/JPG)"}
                        </span>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* --- COLONNE DROITE : PREVIEW --- */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center transition-colors">
            <div className="p-8 bg-white rounded-[2.5rem] mb-8 border border-gray-50 shadow-inner overflow-hidden">
              <QRCodeCanvas 
                id="qr-canvas"
                value={getFinalData()} 
                size={260} 
                fgColor={fgColor}
                bgColor={bgColor}
                level="H"
                includeMargin={true}
                imageSettings={logo ? {
                    src: logo,
                    x: undefined,
                    y: undefined,
                    height: 50,
                    width: 50,
                    excavate: true,
                } : undefined}
              />
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{t.preview}</h3>
            <p className="text-gray-400 text-sm mb-10 font-medium italic">{t.preview_sub}</p>
            
            <button 
                onClick={downloadQR}
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
            >
              <Download className="w-6 h-6" /> {t.btn_dl}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}