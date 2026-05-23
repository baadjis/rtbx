/* eslint-disable @typescript-eslint/no-explicit-any */
import { Award, TrendingUp, Users } from "lucide-react";

export default function Kpi ({loyaltyStats,googleMeta,t}:{loyaltyStats:any,googleMeta:any,t:any}){


    return(<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm group">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users size={24} />
            </div>
            <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.total_customers}</p>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{loyaltyStats.totalCustomers}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm group">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award size={24} />
            </div>
            <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.total_points}</p>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{loyaltyStats.totalPoints}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm group">
            <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
            </div>
            <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Note Google</p>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                {googleMeta ? googleMeta.rating : '--'} <span className="text-sm text-gray-400">({googleMeta?.total || 0})</span>
            </h3>
        </div>
      </div>)
}