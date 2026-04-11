/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Save, Loader2, UserCircle2, Building2, Type, QrCode, ShieldCheck } from 'lucide-react'
import BadgeBuilder from '@/components/shared/BadgeBuilder'
import Image from 'next/image';

export default function BadgesTab({ 
  lang, t, 
  badgeFormat, setBadgeFormat, 
  badgeSettings, setBadgeSettings,
  themeColor, setThemeColor,
  orgName, orgLogo, eventTitle,
  handleSave,
  loading 
}: any) {

  // Définition des ratios pour l'aperçu visuel (CSS)
  const getBadgeStyle = () => {
    switch (badgeFormat) {
      case 'CR80': return "w-[340px] h-[210px]"; // Format carte
      case 'A4': return "w-[300px] h-[420px]";   // Format affiche pliée
      default: return "w-[280px] h-[380px]";      // Format A6 vertical
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start animate-in slide-in-from-right-8 duration-500">
      
      {/* --- COLONNE GAUCHE : CONFIGURATION --- */}
      <div className="space-y-8">
        <BadgeBuilder 
            t={t}
            badgeFormat={badgeFormat}
            setBadgeFormat={setBadgeFormat}
            badgeSettings={badgeSettings}
            setBadgeSettings={setBadgeSettings}
            themeColor={themeColor}
            setThemeColor={setThemeColor}
        />

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl">
            <button 
                onClick={handleSave} 
                disabled={loading}
                className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 border-none cursor-pointer uppercase text-xs tracking-widest"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {t.btn_save_branding}
            </button>
        </div>
      </div>

      {/* --- COLONNE DROITE : APERÇU HD (PREVIEW) --- */}
      <div className="lg:sticky lg:top-24 flex flex-col items-center">
        <div className="mb-6 text-center">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Aperçu du rendu final</span>
        </div>

        {/* CONTENEUR DU BADGE RÉEL */}
        <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden border-4 transition-all duration-500 flex flex-col ${getBadgeStyle()}`}
             style={{ borderColor: themeColor }}>
            
            {/* Header de rôle (Couleur dynamique) */}
            <div className="h-16 flex items-center justify-center text-white font-black uppercase tracking-widest text-sm shadow-md"
                 style={{ backgroundColor: themeColor }}>
                PARTICIPANT
            </div>

            <div className="flex-1 p-6 flex flex-col items-center justify-between text-center relative">
                {/* Logo Organisateur */}
                <div className="h-12 w-full flex items-center justify-center opacity-80">
                    {orgLogo ? (
                       <Image 
  src={orgLogo} 
  alt="Logo" 
  width={120} 
  height={48} 
  className="object-contain max-h-full w-auto"
  unoptimized={orgLogo.startsWith('data:')} 
/>
                    ) : (
                        <span className="text-[10px] font-bold text-gray-300 uppercase">{orgName || 'RetailBox'}</span>
                    )}
                </div>

                {/* Nom du Participant */}
                <div className="space-y-2 py-4">
                    {badgeSettings.showPhoto && (
                        <div className="w-20 h-20 bg-gray-50 rounded-full mx-auto mb-4 border-2 border-dashed border-gray-200 flex items-center justify-center">
                            <UserCircle2 className="text-gray-300" size={40} />
                        </div>
                    )}
                    <h4 className="text-2xl font-black text-gray-900 leading-tight">Jean Dupont</h4>
                    <div className="space-y-1">
                        {badgeSettings.showCompany && (
                            <p className="text-sm font-bold text-gray-400 flex items-center justify-center gap-1">
                                <Building2 size={12} /> Ma Boutique SAS
                            </p>
                        )}
                        {badgeSettings.showRole && (
                            <p className="text-xs font-black text-indigo-600 uppercase tracking-wider flex items-center justify-center gap-1">
                                <Type size={12} /> Directeur Marketing
                            </p>
                        )}
                    </div>
                </div>

                {/* QR Code Placeholder */}
                <div className="p-4 bg-white border-2 border-gray-50 rounded-2xl shadow-inner mb-2">
                    <QrCode size={badgeFormat === 'CR80' ? 60 : 80} className="text-gray-900" />
                </div>

                {/* Branding discret au pied du badge */}
                <div className="w-full pt-4 border-t border-gray-50">
                   <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest leading-none">
                     Généré par rtbx.space • {eventTitle || 'Event'}
                   </p>
                </div>
            </div>

            {/* Simulation de la ligne de pliage pour A4 */}
            {badgeFormat === 'A4' && (
                <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-gray-200 z-20 pointer-events-none">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-100 px-2 text-[8px] text-gray-400 rounded-full font-bold">LIGNE DE PLIAGE</span>
                </div>
            )}
        </div>

        {/* INFO TECHNIQUE */}
        <div className="mt-10 max-w-[340px]">
            <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex gap-3">
                <ShieldCheck className="text-indigo-600 dark:text-indigo-400 w-5 h-5 flex-shrink-0" />
                <p className="text-xs text-indigo-900 dark:text-indigo-200 font-medium leading-relaxed italic">
                   {t.pdf_font_tip}
                </p>
            </div>
        </div>
      </div>

    </div>
  )
}