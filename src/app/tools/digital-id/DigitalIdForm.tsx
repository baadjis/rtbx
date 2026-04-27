/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client'
import { useState, useEffect, useMemo } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { 
  Download, Plus, Trash2, ArrowLeft, 
  ShieldCheck, Users, Settings2, Link2,
  Upload, X, Palette, Loader2, CheckCircle2, ArrowRight, Info
} from 'lucide-react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Data } from './data'
import { getQrIcon, ICON_PATHS } from '@/utils/qr-utils'
import { SOCIAL_CONFIG, formatSocialUrl } from '@/utils/social-config'

export default function DigitalIDForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang]
  const [user, setUser] = useState<any>(null)
  const [links, setLinks] = useState<any[]>([{ network: 'Instagram', handle: '' }])
  const [fgColor, setFgColor] = useState('#4f46e5')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [logo, setLogo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 1. Chargement initial de l'utilisateur
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('social_data').eq('id', user.id).single()
        if (profile?.social_data && Array.isArray(profile.social_data) && profile.social_data.length > 0) {
            setLinks(profile.social_data)
        }
      }
    }
    checkUser()
  }, [supabase])

  // 2. Mise à jour d'un lien avec nettoyage automatique
  const updateLink = (index: number, field: string, value: string) => {
    const newLinks = [...links];
    let cleanValue = value;
    
    if (field === 'handle' && value.startsWith('@')) {
        cleanValue = value.substring(1);
    }

    newLinks[index] = { 
        ...newLinks[index], 
        [field]: cleanValue 
    };
    setLinks(newLinks);
  };

  // 3. LOGIQUE DU QR CODE : Calculée dynamiquement (useMemo pour la performance)
  const qrValue = useMemo(() => {
    // Cas 1 : Utilisateur connecté (Page de profil pro)
    // C'est la solution la plus fiable pour le clic direct
    if (user) return `https://www.rtbx.space/@/${user.id}`;
    
    // Cas 2 : Mode Anonyme (Multi-liens)
    const validLinks = links.filter(l => l.handle && l.handle.trim() !== '');
    
    if (validLinks.length === 0) return 'RetailBox Identity';

    // ASTUCE TECHNIQUE : On ajoute un titre et on préfixe chaque ligne. 
    // Le fait de ne pas commencer par "http" directement aide le scanner 
    // à traiter le bloc comme une fiche texte où chaque URL est détectée.
    const header = lang === 'fr' ? "MA CARTE DIGITALE :\n" : "MY DIGITAL CARD:\n";
    
    const content = validLinks
      .map(l => {
        const url = formatSocialUrl(l.network, l.handle);
        return `${l.network}: ${url}`;
      })
      .join('\n\n'); // Double retour à la ligne pour la lisibilité

    return `${header}${content}`;
  }, [links, user, lang]);

  const handleSaveAndSync = async () => {
    if (!user) return
    setLoading(true)
    const { error } = await supabase.from('profiles').update({ social_data: links }).eq('id', user.id)
    if (!error) alert(lang === 'fr' ? "Identité synchronisée !" : "Identity synced!")
    setLoading(false)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setLogo(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const downloadQR = () => {
    const canvas = document.getElementById('did-qr-canvas') as HTMLCanvasElement
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `retailbox-identity.png`
    link.href = url
    link.click()
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <Link href="/" className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 font-bold mb-8 no-underline border-none">
          <ArrowLeft size={18} /> {t.back}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* --- COLONNE GAUCHE : FORMULAIRE --- */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight italic bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {t.did_title}
            </h1>

            {/* CARTE CONFIGURATION RÉSEAUX */}
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-6 transition-colors">
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <Settings2 size={14} /> {lang === 'fr' ? 'Configuration des liens' : 'Link Configuration'}
                </label>
                
                <div className="space-y-4">
                    {links.map((link, index) => (
                    <div key={index} className="flex flex-col p-5 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-700 gap-4 animate-in fade-in slide-in-from-top-2">
                        <div className="flex gap-3">
                        <select 
                            value={link.network} 
                            onChange={(e) => updateLink(index, 'network', e.target.value)} 
                            className="flex-1 p-3 bg-white dark:bg-slate-800 border-none rounded-xl font-bold text-sm text-gray-900 dark:text-white shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {Object.keys(SOCIAL_CONFIG).map(net => <option key={net} value={net}>{net}</option>)}
                        </select>
                        <button onClick={() => setLinks(links.filter((_, i) => i !== index))} className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl border-none transition-all cursor-pointer">
                            <Trash2 size={18} />
                        </button>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="relative">
                                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    placeholder={t.ph_handle}
                                    value={link.handle} 
                                    onChange={(e) => updateLink(index, 'handle', e.target.value)} 
                                    className="w-full p-4 pl-12 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white shadow-sm" 
                                />
                            </div>
                            {SOCIAL_CONFIG[link.network]?.baseUrl && (
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-4">
                                    Format : {SOCIAL_CONFIG[link.network].baseUrl}[handle]
                                </p>
                            )}
                        </div>
                    </div>
                    ))}
                </div>
              </div>

              <button onClick={() => setLinks([...links, { network: 'Instagram', handle: '' }])} className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl text-gray-400 font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 bg-transparent cursor-pointer">
                <Plus size={18} /> {t.btn_add_net}
              </button>

              {user && (
                <button onClick={handleSaveAndSync} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl hover:bg-indigo-700 transition-all border-none cursor-pointer uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                   {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />} {lang === 'fr' ? "Sauvegarder mon Space" : "Save my Space"}
                </button>
              )}
            </div>

            {/* CARTE DESIGN */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl space-y-8 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_qr}</label>
                        <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                            <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border-none bg-transparent" />
                            <span className="text-xs font-black dark:text-white uppercase">{fgColor}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_bg}</label>
                        <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border-none bg-transparent" />
                            <span className="text-xs font-black dark:text-white uppercase">{bgColor}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex justify-between">
                        {t.label_logo}
                        {logo && <button onClick={() => setLogo(null)} className="text-red-500 font-bold text-[10px] hover:underline bg-transparent border-none cursor-pointer">Supprimer</button>}
                    </label>
                    <div className="relative group">
                        <input type="file" onChange={handleLogoUpload} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="p-5 bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl flex items-center justify-center gap-3 group-hover:border-indigo-400 transition-colors">
                            <Upload size={20} className="text-gray-400" />
                            <span className="text-sm font-bold text-gray-500">{logo ? "Logo ajouté" : "Ajouter un logo central"}</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* --- COLONNE DROITE : APERÇU (REACTIVE) --- */}
          <div className="lg:sticky lg:top-24 text-center">
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 dark:border-slate-800 flex flex-col items-center transition-colors">
              
              <div className="p-8 bg-white rounded-[2.5rem] mb-10 border border-gray-50 shadow-inner relative group">
                <QRCodeCanvas 
                  id="did-qr-canvas" 
                  value={qrValue} 
                  size={260} 
                  level="H" 
                  marginSize={4} 
                  fgColor={fgColor} 
                  bgColor={bgColor}
                  imageSettings={logo ? {
                    src: logo,
                    height: 50,
                    width: 50,
                    excavate: true,
                  } : undefined}
                />
                {!logo && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-xl border border-gray-50 group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-8 h-8 text-indigo-600" />
                    </div>
                )}
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">
                  {user ? 'SPACE PRO' : 'GUEST CARD'}
              </h3>
              <p className="text-gray-400 dark:text-slate-500 font-bold text-xs mb-10 tracking-[0.2em] uppercase">
                  {user ? (lang === 'fr' ? 'Lien de profil actif' : 'Profile link active') : (lang === 'fr' ? 'Mode texte brut' : 'Plain text mode')}
              </p>
              
              <div className="space-y-4 w-full">
                <button onClick={downloadQR} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95 border-none cursor-pointer">
                    <Download className="w-6 h-6" /> {t.btn_dl_did}
                </button>
                
                {user && (
                    <Link href={`/@/${user.id}`} target="_blank" className="w-full py-4 bg-gray-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black border border-indigo-100 dark:border-indigo-900 no-underline flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all">
                        {lang === 'fr' ? "Voir mon profil public" : "View public profile"} <ArrowRight size={18} />
                    </Link>
                )}
              </div>

              {!user && (
                <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/30 flex gap-4 text-left">
                    <Info size={24} className="text-amber-600 shrink-0" />
                    <p className="text-xs text-amber-900 dark:text-amber-200 font-medium leading-relaxed italic">
                        {lang === 'fr' 
                          ? "Inscrivez-vous pour transformer ce QR en une page web splendide avec icônes cliquables et analytics."
                          : "Sign up to transform this QR into a beautiful landing page with clickable icons and analytics."}
                    </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}