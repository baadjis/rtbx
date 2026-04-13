/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client'
import { useState } from 'react'
import { 
  Save, Loader2, UserCircle2, Building2, Type, 
  QrCode, ShieldCheck, Eye, Settings, 
  Layers, Printer, Info, Star 
} from 'lucide-react'
import BadgeBuilder from '@/components/shared/BadgeBuilder'
import Image from 'next/image'

// 1. COMPOSANT ISOLÉ (Extérieur pour éviter l'erreur de rendu)
const BadgeFace = ({ title, type, badgeFormat, themeColor, orgLogo, orgName, badgeSettings, usefulInfo, sponsors, eventTitle }: any) => {
  const isCard = badgeFormat === 'CR80';
  
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">{title}</span>
      <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border-4 flex flex-col relative transition-all duration-500
        ${isCard ? 'w-[320px] h-[200px]' : 'w-[260px] h-[360px]'}`}
           style={{ borderColor: themeColor }}>
        
        {/* Header de rôle (Couleur dynamique au Recto, gris au Verso) */}
        <div className="h-12 flex items-center justify-center text-white font-black uppercase tracking-widest text-xs shadow-sm"
             style={{ backgroundColor: type === 'front' ? themeColor : '#f1f5f9', color: type === 'front' ? 'white' : '#94a3b8' }}>
          {type === 'front' ? 'PARTICIPANT' : 'RETAILBOX'}
        </div>

        <div className="flex-1 p-6 flex flex-col items-center justify-between text-center relative">
            {type === 'front' ? (
              <>
                <div className="h-10 w-full flex items-center justify-center opacity-80 relative">
                  {orgLogo ? (
                    <Image src={orgLogo} alt="Logo" width={100} height={40} className="object-contain" unoptimized />
                  ) : <span className="text-[10px] font-bold text-gray-300 uppercase">{orgName || 'RetailBox'}</span>}
                </div>
                <div className="space-y-1">
                  {badgeSettings.showPhoto && (
                    <div className="w-16 h-16 bg-gray-50 rounded-full mx-auto border-2 border-dashed border-gray-200 flex items-center justify-center">
                        <UserCircle2 className="text-gray-300" size={30} />
                    </div>
                  )}
                  <h4 className="text-xl font-black text-gray-900 leading-tight">Jean Dupont</h4>
                  {badgeSettings.showCompany && <p className="text-xs font-bold text-gray-400">Ma Boutique SAS</p>}
                  {badgeSettings.showRole && <p className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">Directeur</p>}
                </div>
                <div className="p-3 bg-white border border-gray-100 rounded-xl shadow-inner">
                    <QrCode size={isCard ? 50 : 65} className="text-gray-900" />
                </div>
              </>
            ) : type === 'back' ? (
              <>
                <div className="w-full text-left space-y-4">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1"><Info size={12}/> Infos Pratiques</p>
                  <p className="text-[9px] text-gray-500 leading-relaxed line-clamp-6 font-medium">{usefulInfo || "Les informations utiles s'afficheront ici..."}</p>
                </div>
                <div className="w-full pt-4 border-t border-gray-50">
                  <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-2">Partenaires</p>
                  <div className="flex justify-center gap-2 h-6">
                    {sponsors?.slice(0,3).map((s:any, i:number) => (
                      <div key={i} className="relative w-10 h-6">
                        <Image src={s} alt="Sponsor" fill className="object-contain grayscale opacity-60" unoptimized />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-10">
                    <Layers size={40} className="text-gray-400" />
                    <p className="text-[10px] font-bold">INSIDE VIEW</p>
                </div>
            )}

            <div className="w-full pt-2">
                <p className="text-[6px] font-black text-gray-300 uppercase tracking-widest">rtbx.space • {eventTitle}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default function BadgesTab({ 
  lang, t, 
  badgeFormat, setBadgeFormat, 
  badgeSettings, setBadgeSettings,
  themeColor, setThemeColor,
  orgName, orgLogo, eventTitle,
  usefulInfo, sponsors,
  handleSave,
  loading 
}: any) {

  const [internalTab, setInternalTab] = useState<'config' | 'preview'>('config')

  // Props communes pour les faces de badges
  const commonBadgeProps = { badgeFormat, themeColor, orgLogo, orgName, badgeSettings, usefulInfo, sponsors, eventTitle };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* --- SOUS-NAVIGATION --- */}
      <div className="flex justify-center">
        <div className="inline-flex bg-gray-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-inner">
            <button 
                onClick={() => setInternalTab('config')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all border-none cursor-pointer ${internalTab === 'config' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-md' : 'text-gray-400'}`}
            >
                <Settings size={14} /> {lang === 'fr' ? 'Configuration' : 'Settings'}
            </button>
            <button 
                onClick={() => setInternalTab('preview')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all border-none cursor-pointer ${internalTab === 'preview' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-md' : 'text-gray-400'}`}
            >
                <Eye size={14} /> {lang === 'fr' ? 'Aperçu Direct' : 'Live Preview'}
            </button>
        </div>
      </div>

      {internalTab === 'config' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start animate-in slide-in-from-left-4">
          <div className="space-y-8">
            <BadgeBuilder 
                t={t}
                badgeFormat={badgeFormat} setBadgeFormat={setBadgeFormat}
                badgeSettings={badgeSettings} setBadgeSettings={setBadgeSettings}
                themeColor={themeColor} setThemeColor={setThemeColor}
            />
            <button onClick={handleSave} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 border-none cursor-pointer uppercase text-xs tracking-widest">
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} {t.btn_save_branding}
            </button>
          </div>
          
          <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
             <BadgeFace title={t.front_label} type="front" {...commonBadgeProps} />
             <p className="mt-8 text-xs font-bold text-gray-400 text-center leading-relaxed">
               {t.preview_instruction}
             </p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 p-8 md:p-16 rounded-[4rem] border border-gray-100 dark:border-slate-800 shadow-2xl animate-in zoom-in duration-500">
            <div className="text-center mb-16">
                <h3 className="text-3xl font-black dark:text-white uppercase tracking-tighter mb-2">
                    {badgeFormat === 'A4' ? t.assembly_a4 : t.assembly_dual}
                </h3>
                <p className="text-gray-500 dark:text-slate-400 font-medium">{t.pdf_font_tip}</p>
            </div>

            <div className={`grid gap-12 justify-center ${badgeFormat === 'A4' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
                <BadgeFace title={t.front_label} type="front" {...commonBadgeProps} />
                <BadgeFace title={t.back_label} type="back" {...commonBadgeProps} />
                
                {badgeFormat === 'A4' && (
                    <>
                        <BadgeFace title={t.inside_left} type="inside" {...commonBadgeProps} />
                        <BadgeFace title={t.inside_right} type="inside" {...commonBadgeProps} />
                    </>
                )}
            </div>

            <div className="mt-20 p-8 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-[2.5rem] border border-dashed border-indigo-200 dark:border-indigo-800 flex flex-wrap items-center justify-center gap-8">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest">
                    <Printer size={18} /> High Quality PDF (300 DPI)
                </div>
                <div className="hidden md:block w-px h-8 bg-indigo-200 dark:bg-indigo-800" />
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest">
                    <Star size={18} fill="currentColor" /> Format {badgeFormat}
                </div>
            </div>
        </div>
      )}
    </div>
  )
}