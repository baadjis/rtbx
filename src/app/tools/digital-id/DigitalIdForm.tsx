/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import Image from 'next/image'
import { 
  Download, Plus, Trash2, ArrowLeft, ShieldCheck, 
  Users, Settings2, Link2, Upload, X, Palette, 
  Loader2, CheckCircle2, ArrowRight, Mail, Scale, 
  Building2, User, Globe 
} from 'lucide-react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Data } from './data'
import { getQrIcon, ICON_PATHS } from '@/utils/qr-utils'
import { get_social_config } from '@/utils/social-config'
import { LangType } from '@/lib/lang/types'

export default function DigitalIDForm({ lang }: { lang: LangType }) {
  const t = Data[lang]
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [generatedId, setGeneratedId] = useState<string | null>(null)
  
  // --- ÉTATS FORMULAIRE ---
  const [accountType, setAccountType] = useState<'personal' | 'organization'>('personal')
  const [email, setEmail] = useState('')
  const [links, setLinks] = useState<any[]>([{ id: crypto.randomUUID(), network: 'Instagram', handle: '' }])
  
  // --- ÉTATS DESIGN ---
  const [fgColor, setFgColor] = useState('#4f46e5')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [logo, setLogo] = useState<string | null>(null)

  // --- ÉTATS JURIDIQUES ---
  const [legalTerms, setLegalTerms] = useState(false)
  const [legalAuth, setLegalAuth] = useState(false)
  const [orgNameField, setOrgNameField] = useState('') // Nouveau
  const [slug, setSlug] = useState('');
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const SOCIAL_CONFIG = get_social_config(lang)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) { setCurrentUser(user); setEmail(user.email || ''); }
    }
    checkUser()
  }, [supabase])

  // --- LOGIQUE DE VÉRIFICATION ---
useEffect(() => {
  const delayDebounce = setTimeout(async () => {
    if (slug.length >= 3) {
      const res = await fetch(`/api/spaces/check-slug?slug=${slug}`);
      const data = await res.json();
      setIsSlugAvailable(data.available);
    } else {
      setIsSlugAvailable(null);
    }
  }, 500);
  return () => clearTimeout(delayDebounce);
}, [slug]);
  // --- LOGIQUE ACTIONS ---

  const updateLink = (index: number, field: string, value: string) => {
    const newLinks = [...links]
    let cleanValue = value
    if (field === 'handle' && value.startsWith('@')) {
        cleanValue = value.substring(1)
    }
    newLinks[index] = { ...newLinks[index], [field]: cleanValue }
    setLinks(newLinks)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setLogo(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

 


const handleActivate = async () => {
    // Validation juridique
    if (!legalTerms || (accountType === 'organization' && !legalAuth)) {
        alert(t.error_legal); return;
    }

    // Vérification de la disponibilité du slug avant envoi
    if (isSlugAvailable === false) {
        alert(lang === 'fr' ? "Ce pseudo est déjà pris" : "This handle is taken");
        return;
    }

    setLoading(true);
    
    const payload = {
        user_id: currentUser?.id || null,
        email: email.toLowerCase().trim(),
        slug: slug.toLowerCase().trim(), // On envoie le pseudo pour l'URL
        account_type: accountType,
        organization_name: accountType === 'organization' ? orgNameField : null,
        social_data: links.filter((l: any) => l.handle.trim() !== ''),
        theme_color: fgColor,
        bg_color: bgColor,
        logo_url: logo,
        legal_accepted_at: new Date().toISOString(),
        is_authorized_representative: accountType === 'organization',
        lang: lang
    };

    try {
        const response = await fetch('/api/spaces/activate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
            setGeneratedId(result.id);
        } else {
            alert(result.error);
        }
    } catch (err) {
        console.log(err)
        alert("Erreur lors de l'activation");
    } finally {
        setLoading(false);
    }
};
  

  // FONCTION DE TÉLÉCHARGEMENT RECTIFIÉE
  const downloadQR = () => {
    const canvas = document.getElementById('did-qr-canvas') as HTMLCanvasElement
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `retailbox-identity-${accountType}.png`
    link.href = url
    link.click()
  }
  const handle= slug || generatedId;
  const publicUrl = generatedId ? `https://www.rtbx.space/@/${handle}` : "https://www.rtbx.space"

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        
        <Link href="/" className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 font-bold mb-10 no-underline border-none">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
            <ArrowLeft size={18} />
          </div>
          {t.back}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* --- COLONNE GAUCHE : CONFIGURATION --- */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight italic bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent leading-tight">
              {t.did_title}
            </h1>

            <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-8">
              
              {/* 1. TYPE DE COMPTE */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2"><Globe size={14}/> {t.label_account_type}</label>
                <div className="grid grid-cols-2 gap-4 p-1.5 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                    <button onClick={() => setAccountType('personal')} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all border-none cursor-pointer ${accountType === 'personal' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-gray-400'}`}>
                        <User size={14} /> {t.opt_personal}
                    </button>
                    <button onClick={() => setAccountType('organization')} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all border-none cursor-pointer ${accountType === 'organization' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-gray-400'}`}>
                        <Building2 size={14} /> {t.opt_organization}
                    </button>
                </div>
              </div>
              
                 {/* NOM DE L'ORGANISATION (DYNAMIQUE) */}
              {accountType === 'organization' && (
                <div className="space-y-2 animate-in slide-in-from-top-4 duration-500">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_org_name || "Nom de l'organisation"}</label>
                    <input value={orgNameField} onChange={(e) => setOrgNameField(e.target.value)} placeholder={t.ph_org_name || "Ex: Ma Boutique SARL"} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
              )}
              {/* 2. EMAIL DE GESTION */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2"><Mail size={14}/> Email de gestion</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!!currentUser} placeholder="votre@email.com" className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" />
              </div>

              <div className="space-y-4">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Choisir votre lien public</label>
    <div className={`flex items-center bg-gray-50 dark:bg-slate-800 rounded-2xl px-4 border-2 transition-all ${
        isSlugAvailable === true ? 'border-green-500' : isSlugAvailable === false ? 'border-red-500' : 'border-transparent'
    }`}>
        <span className="text-gray-400 font-bold border-r border-gray-200 dark:border-slate-700 pr-3 text-sm">rtbx.space/@/</span>
        <input 
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="votre-nom"
            className="flex-1 p-4 bg-transparent border-none focus:ring-0 font-bold dark:text-white"
        />
        {isSlugAvailable === true && <CheckCircle2 className="text-green-500 ml-2" size={18} />}
        {isSlugAvailable === false && <X className="text-red-500 ml-2" size={18} />}
    </div>
    {isSlugAvailable === false && <p className="text-[10px] text-red-500 font-bold ml-4">Ce nom est déjà pris.</p>}
</div>

              {/* 3. RÉSEAUX SOCIAUX */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2"><Link2 size={14}/> {t.label_socials || "Réseaux Sociaux"}</label>
                {links.map((link, i) => {
                  const networkConfig = SOCIAL_CONFIG[link.network as keyof typeof SOCIAL_CONFIG];
                  return(
                    <div key={link.id} className="flex flex-col p-5 bg-gray-50 dark:bg-slate-800/50 rounded-[2rem] border border-gray-100 dark:border-slate-700 gap-3 animate-in fade-in">
                        <div className="flex gap-2">
                            <select value={link.network} onChange={e => updateLink(i, 'network', e.target.value)} className="flex-1 p-3 bg-white dark:bg-slate-800 border-none rounded-xl font-bold text-sm dark:text-white">
                                {Object.keys(SOCIAL_CONFIG).map(net => <option key={net} value={net}>{net}</option>)}
                            </select>
                            <button onClick={() => setLinks(links.filter((_, idx) => idx !== i))} className="p-3 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl border-none cursor-pointer hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={18}/></button>
                        </div>
                        <input value={link.handle} onChange={
                          (e) => updateLink(i, 'handle', e.target.value)} placeholder={networkConfig.ph || t.ph_handle } className="w-full p-4 bg-white dark:bg-slate-800 border-none rounded-xl font-bold text-sm dark:text-white focus:ring-2 focus:ring-indigo-500" />
                    </div>
                )})}
                <button onClick={() => setLinks([...links, { id: crypto.randomUUID(), network: 'Instagram', handle: '' }])} className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl text-gray-400 font-bold hover:border-indigo-400 transition-all bg-transparent cursor-pointer">
                    <Plus size={18} /> {t.btn_add_net}
                </button>
              </div>

              {/* 4. DESIGN (COULEURS & LOGO) */}
              <div className="pt-6 border-t border-gray-100 dark:border-slate-800 space-y-6">
                <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><Palette size={14}/> {lang === 'fr' ? 'Personnalisation' : 'Customization'}</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Couleur QR</label>
                        <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-gray-50 dark:bg-slate-800 p-1" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Fond</label>
                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-gray-50 dark:bg-slate-800 p-1" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-2 flex justify-between">
                        {t.label_logo}
                        {logo && <button onClick={() => setLogo(null)} className="text-red-500 text-[9px] font-bold bg-transparent border-none cursor-pointer hover:underline">Supprimer</button>}
                    </label>
                    <div className="relative group h-14 bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center hover:border-indigo-400 transition-colors">
                        {logo ? 
                        <Image
                         src={logo} 
                         alt="Logo" 
                         className="h-10 object-contain" 
                         width={40} height={40}

                          /> : <Upload size={20} className="text-gray-300" />}
                        <input type="file" onChange={handleLogoUpload} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                </div>
              </div>

              {/* 5. ENGAGEMENT JURIDIQUE */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-gray-100 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-3 mb-2 text-indigo-600 dark:text-indigo-400">
                    <Scale size={18} />
                    <h4 className="text-xs font-black uppercase tracking-widest">{t.legal_title}</h4>
                </div>
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" checked={legalTerms} onChange={e => setLegalTerms(e.target.checked)} className="mt-1 accent-indigo-600 w-4 h-4" />
                    <span className="text-[11px] text-gray-500 dark:text-slate-400 font-medium leading-relaxed group-hover:text-gray-800 dark:group-hover:text-white transition-colors">{t.legal_terms}</span>
                </label>
                {accountType === 'organization' && (
                    <label className="flex items-start gap-3 cursor-pointer group animate-in slide-in-from-top-2">
                        <input type="checkbox" checked={legalAuth} onChange={e => setLegalAuth(e.target.checked)} className="mt-1 accent-indigo-600 w-4 h-4" />
                        <span className="text-[11px] text-gray-500 dark:text-slate-400 font-medium leading-relaxed italic">{t.legal_auth}</span>
                    </label>
                )}
              </div>

              {!generatedId ? (
                <button onClick={handleActivate} disabled={loading} className={`w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all border-none cursor-pointer flex items-center justify-center gap-3 ${(!legalTerms || (accountType === 'organization' && !legalAuth)) ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}>
                  {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />} {t.btn_activate}
                </button>
              ) : (
                <div className="p-5 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-3xl border border-green-100 dark:border-green-900/30 flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest animate-in zoom-in">
                    <CheckCircle2 size={20} /> { t.identity_activated}
                </div>
              )}
            </div>
          </div>

          {/* --- COLONNE DROITE : PREVIEW --- */}
          <div className="lg:sticky lg:top-24 text-center">
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 dark:border-slate-800 flex flex-col items-center transition-colors">
              <div className="p-8 bg-white rounded-[2.5rem] mb-10 border border-gray-50 shadow-inner relative group overflow-hidden">
                <QRCodeCanvas 
                  id="did-qr-canvas" value={publicUrl} size={260} level="H" marginSize={4} fgColor={fgColor} bgColor={bgColor}
                  imageSettings={logo ? { src: logo, height: 50, width: 50, excavate: true } : { src: getQrIcon(ICON_PATHS.users, fgColor), height: 40, width: 40, excavate: true }}
                />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">
                {accountType === 'organization' ? 'Organization Space' : 'Personal Space'}
              </h3>
              {generatedId && (
                <div className="mb-8 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
                    <p className="text-indigo-600 dark:text-indigo-400 font-black text-sm tracking-tight">rtbx.space/@/{generatedId}</p>
                </div>
              )}
              <div className="space-y-4 w-full">
                <button onClick={downloadQR} disabled={!generatedId} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-30 border-none cursor-pointer">
                    <Download className="w-6 h-6" /> {t.btn_dl_did}
                </button>
                {generatedId && (
                    <Link href={`/@/${generatedId}`} target="_blank" className="w-full py-4 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded-2xl font-black border border-gray-100 dark:border-slate-800 no-underline flex items-center justify-center gap-2 hover:bg-gray-100 transition-all">
                        {t.open_page} <ArrowRight size={18} />
                    </Link>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}