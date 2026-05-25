/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExternalLink, MapPin, QrCode, Star } from "lucide-react";
import Link from "next/link";

 export default function BusinessHeader({business,t}:{business:any,t:any}){

 return(
 
 <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-colors">
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Star className="text-white w-6 h-6 fill-current" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">{business.name}</h1>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 font-medium pl-1">
                <MapPin size={18} className="text-indigo-600" />
                <span className="text-sm md:text-base">{business.address}</span>
            </div>
        </div>
        <div className="flex flex-wrap gap-3">
            <Link href="/scan" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all no-underline text-sm">
                <QrCode size={18} /> {t.scan_customer}
            </Link>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${business.place_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-all no-underline text-sm border border-gray-100 dark:border-slate-700"
            >
              <ExternalLink size={16} /> {t.view_on_maps}
            </a>
        </div>
      </div>
      
    )

}