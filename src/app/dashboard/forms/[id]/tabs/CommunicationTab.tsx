/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { 
  Copy, Download, 
  Mail, Link2, CheckCircle2 ,
   QrCode, Smartphone 
} from 'lucide-react'
import UniversalImporter from '@/components/shared/UniversalImporter'

export default function CommunicationTab({ form, lang }: any) {
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const publicUrl = `https://www.rtbx.space/f/${form.id}`

  const t = {
    fr: {
        share_title: "Diffusion & QR Code",
        share_sub: "Utilisez ces outils pour collecter des réponses sur vos points de vente.",
        btn_copy: "Copier le lien",
        btn_dl_qr: "Télécharger le QR",
        invite_title: "Campagne d'invitation",
        invite_sub: "Importez vos clients pour leur envoyer le formulaire par e-mail.",
        import_title: "Importer des contacts",
        import_desc: "Collez ou uploadez un fichier (CSV, Excel) contenant les e-mails."
    },
    en: {
        share_title: "Sharing & QR Code",
        share_sub: "Use these tools to collect responses at your points of sale.",
        btn_copy: "Copy link",
        btn_dl_qr: "Download QR",
        invite_title: "Invitation Campaign",
        invite_sub: "Import your customers to send them the form by email.",
        import_title: "Import contacts",
        import_desc: "Paste or upload a file (CSV, Excel) containing emails."
    }
  }[lang as 'fr' | 'en']

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQR = () => {
    const canvas = document.getElementById('form-qr-canvas') as HTMLCanvasElement
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `qr-form-${form.title}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  // --- LOGIQUE DE L'UNIVERSAL IMPORTER ---
  const handleBulkInvite = async (data: any[]) => {
    setLoading(true)
    const emails = data.map(item => item.email).filter(Boolean)
    
    try {
      const res = await fetch(`/api/forms/send-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails, formId: form.id, lang })
      })
      if (res.ok) {
        alert(lang === 'fr' ? "Invitations envoyées !" : "Invitations sent!")
      }
    } catch (err) {
      alert("Error sending emails")
    }
    setLoading(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start animate-in slide-in-from-bottom-4 duration-500">
      
      {/* --- COLONNE GAUCHE : QR & LIEN --- */}
      <div className="space-y-8">
        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm text-center">
            <div className="flex items-center gap-3 mb-8 text-left">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600">
                    <QrCode size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">{t.share_title}</h3>
                    <p className="text-sm text-gray-400 font-medium">{t.share_sub}</p>
                </div>
            </div>

            <div className="p-8 bg-white rounded-[2.5rem] shadow-inner border border-gray-50 inline-block mb-8 relative group">
                <QRCodeCanvas 
                    id="form-qr-canvas"
                    value={publicUrl}
                    size={220}
                    level="H"
                    includeMargin={true}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]">
                    <Smartphone size={40} className="text-indigo-600 animate-bounce" />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                    <Link2 size={18} className="text-gray-400" />
                    <input readOnly value={publicUrl} className="flex-1 bg-transparent border-none text-sm font-bold truncate dark:text-white" />
                    <button onClick={copyLink} className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all border-none bg-transparent cursor-pointer">
                        {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                    </button>
                </div>

                <button 
                  onClick={downloadQR}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
                >
                    <Download size={20} /> {t.btn_dl_qr}
                </button>
            </div>
        </div>
      </div>

      {/* --- COLONNE DROITE : UNIVERSAL IMPORTER --- */}
      <div className="space-y-8">
        <UniversalImporter 
            title={t.import_title}
            description={t.import_desc}
            lang={lang}
            requiredFields={['email']}
            availableFields={[
                { value: 'email', label: 'E-mail' },
                { value: 'full_name', label: 'Nom Complet' }
            ]}
            onImport={handleBulkInvite}
        />

        <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800 flex gap-4">
            <Mail className="text-indigo-600 w-6 h-6 flex-shrink-0" />
            <p className="text-sm text-indigo-900 dark:text-indigo-200 font-medium italic leading-relaxed">
                Les invitations utilisent le template RetailBox. Vos clients recevront un lien direct pour répondre au sondage sur leur mobile.
            </p>
        </div>
      </div>

    </div>
  )
}