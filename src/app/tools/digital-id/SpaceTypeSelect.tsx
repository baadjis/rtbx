/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Building2, Globe, User } from "lucide-react"

export default function SpaceTypeSelect({setAccountType,accountType,t}:{setAccountType:any,accountType:any,t:any}){
    return(
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
              </div>)
}