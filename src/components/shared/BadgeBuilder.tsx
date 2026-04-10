/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { 
  FileText, CalendarRange, CreditCard, Layout, 
  CheckCircle2, UserCircle2, Building2, ShieldCheck,
  Palette, MousePointer2, Type
} from 'lucide-react'

interface BadgeBuilderProps {
  t: any;
  badgeFormat: string;
  setBadgeFormat: (val: string) => void;
  badgeSettings: any;
  setBadgeSettings: (settings: any) => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
}

export default function BadgeBuilder({ 
  t, badgeFormat, setBadgeFormat, 
  badgeSettings, setBadgeSettings,
  themeColor, setThemeColor 
}: BadgeBuilderProps) {

  const toggleSetting = (key: string) => {
    setBadgeSettings({ ...badgeSettings, [key]: !badgeSettings[key] });
  };

  const formats = [
    { id: 'A6', label: t.opt_a6, desc: t.format_desc_a6, icon: FileText },
    { id: 'A4', label: t.opt_a4, desc: t.format_desc_a4, icon: CalendarRange },
    { id: 'CR80', label: t.opt_cr80, desc: t.format_desc_cr80, icon: CreditCard },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* --- SECTION 1 : FORMAT PHYSIQUE --- */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-900 dark:text-white uppercase tracking-tight">
          <Layout className="text-indigo-600" /> {t.label_badge_format}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formats.map((f) => (
            <button 
              key={f.id}
              onClick={() => setBadgeFormat(f.id)}
              className={`flex flex-col items-start p-6 rounded-[2rem] border-2 transition-all bg-transparent cursor-pointer relative overflow-hidden group ${
                badgeFormat === f.id 
                ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-900/20' 
                : 'border-gray-50 dark:border-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              <div className={`p-3 rounded-xl mb-4 transition-colors ${badgeFormat === f.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                <f.icon size={24} />
              </div>
              <p className="font-black text-sm dark:text-white mb-1">{f.label}</p>
              <p className="text-[10px] text-gray-400 font-bold leading-tight">{f.desc}</p>
              
              {badgeFormat === f.id && (
                <CheckCircle2 size={18} className="absolute top-4 right-4 text-indigo-600 animate-in zoom-in" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* --- SECTION 2 : CONFIGURATION VISUELLE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Toggle des éléments */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-900 dark:text-white uppercase tracking-tight text-sm">
                {t.badge_elements}
            </h3>
            
            <div className="space-y-3">
                <OptionToggle 
                  active={badgeSettings.showPhoto} 
                  onClick={() => toggleSetting('showPhoto')}
                  label={t.label_show_photo}
                  icon={UserCircle2}
                />
                <OptionToggle 
                  active={badgeSettings.showCompany} 
                  onClick={() => toggleSetting('showCompany')}
                  label={t.label_show_company}
                  icon={Building2}
                />
                <OptionToggle 
                  active={badgeSettings.showRole} 
                  onClick={() => toggleSetting('showRole')}
                  label={t.label_show_role}
                  icon={Type}
                />
            </div>
        </div>

        {/* Couleur et Thème */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-900 dark:text-white uppercase tracking-tight text-sm">
                <Palette className="text-indigo-600" /> {t.label_color_theme}
            </h3>
            
            <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-[1.5rem] border border-gray-100 dark:border-slate-700">
                    <input 
                      type="color" 
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="w-14 h-14 rounded-xl cursor-pointer border-none bg-transparent"
                    />
                    <div>
                        <p className="font-black text-gray-900 dark:text-white text-sm uppercase">{themeColor}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Hex Code</p>
                    </div>
                </div>

                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex gap-3">
                    <ShieldCheck className="text-indigo-600 w-5 h-5 flex-shrink-0" />
                    <p className="text-[10px] text-indigo-900 dark:text-indigo-300 font-bold leading-relaxed italic">
                       {t.theme_explain}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANT TOGGLE ---
function OptionToggle({ active, onClick, label, icon: Icon }: any) {
    return (
      <button 
        type="button"
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all bg-transparent cursor-pointer ${
          active 
          ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-900/20' 
          : 'border-gray-50 dark:border-slate-800 opacity-60'
        }`}
      >
          <div className="flex items-center gap-3">
              <Icon size={18} className={active ? "text-indigo-600" : "text-gray-400"} />
              <span className={`text-sm font-bold ${active ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>{label}</span>
          </div>
          <div className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-700'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${active ? 'right-1' : 'left-1'}`}></div>
          </div>
      </button>
    )
}