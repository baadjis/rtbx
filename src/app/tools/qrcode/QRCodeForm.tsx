'use client'
import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Palette, Type, ArrowLeft, Plus, Trash2, Settings2, FileText } from 'lucide-react'
import Link from 'next/link'

const DICT = {
  fr: {
    title: "Générateur QR Code Pro",
    sub: "Personnalisez votre QR Code pour vos menus, boutiques ou fiches techniques.",
    label_mode: "Type de contenu",
    opt_url: "Lien URL Simple",
    opt_kv: "Fiche de données (Clé:Valeur)",
    label_text: "Lien URL",
    ph_text: "https://votre-site.com",
    label_kv: "Détails de la fiche",
    ph_key: "Clé (ex: Prix)",
    ph_val: "Valeur (ex: 19.99€)",
    btn_add: "Ajouter une ligne",
    label_qr: "Couleur du QR",
    label_bg: "Couleur du Fond",
    label_logo: "Logo central (Optionnel)",
    preview: "Aperçu en direct",
    preview_sub: "Mise à jour instantanée",
    btn_dl: "TÉLÉCHARGER PNG HD",
    back: "Retour"
  },
  en: {
    title: "Pro QR Code Generator",
    sub: "Customize your QR Code for menus, shops, or technical sheets.",
    label_mode: "Content Type",
    opt_url: "Simple URL Link",
    opt_kv: "Data Sheet (Key:Value)",
    label_text: "URL Link",
    ph_text: "https://your-website.com",
    label_kv: "Data details",
    ph_key: "Key (e.g. Price)",
    ph_val: "Value (e.g. $19.99)",
    btn_add: "Add a row",
    label_qr: "QR Color",
    label_bg: "Background Color",
    label_logo: "Center Logo (Optional)",
    preview: "Live Preview",
    preview_sub: "Instant update",
    btn_dl: "DOWNLOAD HD PNG",
    back: "Back"
  }
}

export default function QRCodeForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = DICT[lang]
  
  // États
  const [mode, setMode] = useState<'url' | 'kv'>('url')
  const [url, setUrl] = useState('https://rtbx.space')
  const [kvData, setKvData] = useState([{ key: '', val: '' }])
  const [fgColor, setFgColor] = useState('#4f46e5')
  const [bgColor, setBgColor] = useState('#ffffff')

  // Logique Key-Value
  const addRow = () => setKvData([...kvData, { key: '', val: '' }])
  const removeRow = (index: number) => setKvData(kvData.filter((_, i) => i !== index))
  const updateRow = (index: number, field: 'key' | 'val', value: string) => {
    const newData = [...kvData]
    newData[index][field] = value
    setKvData(newData)
  }

  // Construction de la chaîne finale pour le QR
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
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* --- COLONNE GAUCHE : CONFIGURATION --- */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic">
              {t.title}
            </h1>
            <p className="text-gray-500 font-medium text-lg leading-relaxed">{t.sub}</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 space-y-8">
            
            {/* SÉLECTEUR DE MODE */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Settings2 className="w-4 h-4" /> {t.label_mode}
              </label>
              <select 
                value={mode} 
                onChange={(e) => setMode(e.target.value as 'url' | 'kv')}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 appearance-none"
              >
                <option value="url">{t.opt_url}</option>
                <option value="kv">{t.opt_kv}</option>
              </select>
            </div>

            {/* INPUTS DYNAMIQUES SELON MODE */}
            <div className="space-y-4">
               <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                {mode === 'url' ? <Type className="w-4 h-4"/> : <FileText className="w-4 h-4"/>}
                {mode === 'url' ? t.label_text : t.label_kv}
              </label>

              {mode === 'url' ? (
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={t.ph_text}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900"
                />
              ) : (
                <div className="space-y-3">
                  {kvData.map((row, index) => (
                    <div key={index} className="flex gap-2 group animate-in fade-in slide-in-from-left-2">
                      <input 
                        placeholder={t.ph_key}
                        value={row.key}
                        onChange={(e) => updateRow(index, 'key', e.target.value)}
                        className="flex-1 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                      />
                      <input 
                        placeholder={t.ph_val}
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
                    className="w-full py-3 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 font-bold text-sm hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> {t.btn_add}
                  </button>
                </div>
              )}
            </div>

            {/* COULEURS */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.label_qr}</label>
                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none p-1 bg-gray-50" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.label_bg}</label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none p-1 bg-gray-50" />
              </div>
            </div>
          </div>
        </div>

        {/* --- COLONNE DROITE : APERÇU --- */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-[3.5rem] p-10 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 text-center flex flex-col items-center">
            <div className="p-8 bg-white rounded-[2.5rem] mb-8 border border-gray-50 shadow-inner">
              <QRCodeCanvas 
                id="qr-canvas"
                value={getFinalData()} 
                size={260} 
                fgColor={fgColor}
                bgColor={bgColor}
                level="H"
                includeMargin={true}
              />
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 mb-1">{t.preview}</h3>
            <p className="text-gray-400 text-sm mb-10 font-medium italic">{t.preview_sub}</p>
            
            <button 
                onClick={downloadQR}
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
            >
              <Download className="w-6 h-6" /> {t.btn_dl}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}