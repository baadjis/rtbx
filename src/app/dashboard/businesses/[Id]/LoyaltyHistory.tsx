/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowRight, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function LoyaltyHistory({t,history}:{t:any,history:any[]}){


    return(<div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl transition-colors">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                    <Zap size={20} className="text-indigo-600" /> {t.recent_activity}
                </h3>
                <div className="space-y-6">
                    {history.length > 0 ? history.map((log, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                                <Users size={16} className="text-gray-400 group-hover:text-indigo-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Client #{log.user_id.slice(0, 5)}</p>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">
                                    {new Date(log.created_at).toLocaleDateString()} • +{log.points_added} point
                                </p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-sm text-gray-400 italic text-center py-4">{ t.non_recent_scan ||"Aucun scan récent."}</p>
                    )}
                </div>
                <Link href="/scan" className="w-full mt-8 py-4 bg-gray-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all no-underline border-none">
                   {t.new_scan ||"Nouveau Scan "} <ArrowRight size={14} />
                </Link>
            </div>
        </div>)
}