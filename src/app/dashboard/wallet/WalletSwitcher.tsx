/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client'
import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { User, Share2, Award, Contact2, ShieldCheck, ChevronDown, Linkedin, Building2, Settings2 } from 'lucide-react';
import { LangType } from '@/lib/lang/types';
import { DATA } from './data';


export default function WalletSwitcher({ user, profile, spaces, lang }: any) {
  const [activeTab, setActiveTab] = useState<'loyalty' | 'vcard' | 'social'>('loyalty');
  const [selectedSpaceIndex, setSelectedSpaceIndex] = useState(0); // 0 = Perso, 1+ = Spaces
  const t = DATA[lang as LangType];

  const fullName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || "Utilisateur RetailBox";

  // --- GÉNÉRATION DES DONNÉES DU QR ---
  const getQRValue = () => {
    switch (activeTab) {
      case 'loyalty': 
        return user.id; // UUID pour le scan marchand
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${fullName}\nORG:${profile?.company || ''}\nTITLE:${profile?.job_title || ''}\nTEL:${profile?.phone || ''}\nURL:${profile?.linkedin_url || ''}\nEND:VCARD`;
      case 'social':
        if (selectedSpaceIndex === 0) return `https://www.rtbx.space/u/${profile?.slug || user.id}`;
        const space = spaces[selectedSpaceIndex - 1];
        return `https://www.rtbx.space/u/${space.slug || space.id}`;
    }
  };

  // --- LOGIQUE DE COULEUR ET TEXTE ---
  const config = {
    loyalty: { 
        gradient: "from-indigo-600 to-violet-700", 
        label: t.label_loyalty, 
        sub: t.sub_loyalty, 
        icon: <Award size={18}/>,
        display: fullName
    },
    vcard: { 
        gradient: "from-emerald-600 to-teal-700", 
        label: t.label_vcard, 
        sub: t.sub_vcard, 
        icon: <Contact2 size={18}/>,
        display: fullName 
    },
    social: { 
        gradient: "from-rose-600 to-orange-600", 
        label: t.label_social, 
        sub: t.sub_social, 
        icon: <Share2 size={18}/>,
        display: selectedSpaceIndex === 0 ? fullName : spaces[selectedSpaceIndex - 1]?.organization_name || spaces[selectedSpaceIndex - 1]?.slug
    }
  }[activeTab];

  return (
    <div className="w-full max-w-md space-y-8 flex flex-col items-center animate-in fade-in duration-500">
      
      {/* 1. SELECTEUR D'ONGLET (TABS) */}
      <div className="flex bg-gray-100 dark:bg-slate-900 p-1.5 rounded-[2rem] w-full border border-gray-100 dark:border-slate-800 shadow-inner">
        {[
          { id: 'loyalty', icon: Award, label: t.tab_loyalty },
          { id: 'vcard', icon: Contact2, label: t.tab_vcard },
          { id: 'social', icon: Share2, label: t.tab_social }
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 flex flex-col items-center py-2.5 rounded-2xl transition-all border-none cursor-pointer ${activeTab === tab.id ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md scale-105' : 'text-gray-400 opacity-60'}`}>
            <tab.icon size={20} />
            <span className="text-[9px] font-black uppercase mt-1 tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 2. LA CARTE MAGIQUE */}
      <div className={`w-full rounded-[3.5rem] p-8 text-white shadow-2xl relative overflow-hidden text-center transition-all duration-500 bg-gradient-to-br ${config.gradient}`}>
        
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/10">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            <span className="text-[9px] font-black uppercase tracking-widest">{config.label}</span>
          </div>
          {config.icon}
        </div>

        {/* ZONE QR CODE */}
        <div className="bg-white p-5 rounded-[2.5rem] inline-block mb-8 shadow-2xl border-[6px] border-white/20">
          <QRCodeCanvas value={getQRValue()} size={200} level="H" />
        </div>

        <h2 className="text-2xl font-black truncate px-4 tracking-tight leading-none uppercase">
            {config.display}
        </h2>
        <p className="text-xs font-bold text-white/70 mt-3 italic tracking-wide">
            {config.sub}
        </p>

        {/* Déco fond de carte */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
      </div>

      {/* 3. SELECTEUR DE SPACE (Uniquement pour Digital ID) */}
      {activeTab === 'social' && spaces.length > 0 && (
        <div className="w-full space-y-3 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2 ml-4">
                <Settings2 size={14} className="text-indigo-600" />
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t.switch_space}</label>
            </div>
            <div className="relative group">
                <select 
                    value={selectedSpaceIndex}
                    onChange={(e) => setSelectedSpaceIndex(parseInt(e.target.value))}
                    className="w-full p-5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl font-bold text-gray-900 dark:text-white appearance-none shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                    <option value={0}>👤 {t.personal_space}</option>
                    {spaces.map((s: any, i: number) => (
                        <option key={s.id} value={i + 1}>
                            🏢 {s.organization_name || s.slug}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-indigo-600 group-hover:translate-y-[-40%] transition-transform" size={20} />
            </div>
        </div>
      )}

      {/* FOOTER INFO SECURITY */}
      <div className="flex items-center gap-3 p-5 bg-gray-50 dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-800 w-full">
         <ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={20} />
         <p className="text-[10px] text-gray-500 dark:text-slate-400 font-medium leading-relaxed italic">
            RetailBox Secured Passage. {t.data_is_protected}
         </p>
      </div>
    </div>
  );
}