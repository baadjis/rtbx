/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { User, Share2, Award, Contact2, ShieldCheck } from 'lucide-react';

const DICT = {
  fr: {
    title: "Mon Portefeuille Digital",
    tab_loyalty: "Fidélité", tab_vcard: "Contact", tab_social: "Réseaux",
    id_label: "Identifiant Client", vcard_label: "Carte de Visite", social_label: "Social Card",
    tip: "Présentez ce code pour vos points ou partages."
  },
  en: {
    title: "Digital Wallet",
    tab_loyalty: "Loyalty", tab_vcard: "Contact", tab_social: "Social",
    id_label: "Customer ID", vcard_label: "Business Card", social_label: "Social Card",
    tip: "Show this code for points or sharing."
  }
};

export default function WalletSwitcher({ user, profile, lang }: { user: any, profile: any, lang: 'fr' | 'en' }) {
  const [activeTab, setActiveTab] = useState<'loyalty' | 'vcard' | 'social'>('loyalty');
  const t = DICT[lang];

  const getQRValue = () => {
    if (activeTab === 'loyalty') return user.id;
    if (activeTab === 'vcard' && profile) {
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${profile.first_name} ${profile.last_name}\nORG:${profile.company}\nTEL:${profile.phone}\nEND:VCARD`;
    }
    if (activeTab === 'social' && profile?.social_data) {
      return typeof profile.social_data === 'string' ? profile.social_data : JSON.stringify(profile.social_data);
    }
    return "RetailBox User";
  };

  return (
    <div className="w-full max-w-md space-y-8 flex flex-col items-center">
      <h1 className="text-3xl font-black tracking-tight">{t.title}</h1>

      {/* TABS COMPACTES STYLE DOCK */}
      <div className="flex bg-gray-100 dark:bg-slate-900 p-1 rounded-2xl w-full border border-gray-100 dark:border-slate-800">
        {[
          {id: 'loyalty', label: t.tab_loyalty, icon: Award},
          {id: 'vcard', label: t.tab_vcard, icon: Contact2},
          {id: 'social', label: t.tab_social, icon: Share2}
        ].map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all ${
              activeTab === tab.id ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md' : 'text-gray-400'
            }`}
          >
            <tab.icon size={18} />
            <span className="text-[10px] font-black uppercase mt-1 tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* CARTE DYNAMIQUE */}
      <div className={`w-full rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden text-center transition-all duration-500 ${
        activeTab === 'loyalty' ? 'bg-gradient-to-br from-indigo-600 to-violet-700' :
        activeTab === 'vcard' ? 'bg-gradient-to-br from-emerald-600 to-teal-700' :
        'bg-gradient-to-br from-rose-600 to-orange-600'
      }`}>
        <div className="flex justify-between items-center mb-6 opacity-70">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            {activeTab === 'loyalty' ? t.id_label : activeTab === 'vcard' ? t.vcard_label : t.social_label}
          </span>
          <ShieldCheck size={16} />
        </div>

        <div className="bg-white p-5 rounded-[2.5rem] inline-block mb-6 shadow-2xl border-4 border-white/20">
          <QRCodeCanvas value={getQRValue()} size={200} level="H" />
        </div>

        <h2 className="text-xl font-black truncate">{user.email}</h2>
        <p className="text-xs font-medium text-white/70 mt-2">{t.tip}</p>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}