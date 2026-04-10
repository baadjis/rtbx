/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, QrCode } from 'lucide-react'

export default function EventQRCode({ eventId, themeColor, logo, t, lang }: any) {
  // Lien public avec tracking de l'origine
  const publicLink = `https://www.rtbx.space/events/${eventId}?origin=flyer`

  const downloadQR = () => {
    const canvas = document.getElementById('flyer-qr-canvas') as HTMLCanvasElement
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `retailbox-event-qr-${eventId}.png`
    link.href = url
    link.click()
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER DU BLOC */}
      <div className="w-full flex items-center gap-3 mb-2 text-left">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
          <QrCode size={20} />
        </div>
        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
          {t.qr_kit_title}
        </h3>
      </div>
      
      <p className="text-xs text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
        {t.qr_kit_desc}
      </p>

      {/* ZONE QR CODE */}
      <div className="p-6 bg-white rounded-[2.5rem] shadow-inner border border-gray-50 relative overflow-hidden">
        <QRCodeCanvas 
          id="flyer-qr-canvas"
          value={publicLink}
          size={200}
          level="H"
          fgColor={themeColor} // Utilise la couleur du thème choisie par le user
          marginSize={4}
          // LOGIQUE : imageSettings est indéfini si pas de logo, donc le QR est pur.
          imageSettings={logo ? {
            src: logo,
            height: 40,
            width: 40,
            excavate: true,
          } : undefined}
        />
      </div>

      <div className="w-full pt-4">
        <button 
          onClick={downloadQR}
          className="w-full py-4 bg-gray-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 dark:border-indigo-900 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Download size={16} /> {t.btn_dl_qr_hd}
        </button>
      </div>
    </div>
  )
}