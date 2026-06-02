/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import EventMain from "./EventMain"
import { LangType } from "@/lib/lang/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";


export default function EventIdClient({lang,event,t,origin}:
    {lang:LangType,event:any,t:any,origin:any}){
    const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const formatDateShort = (date: string) =>
    new Date(date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric', month: 'short',
    });
   return(
      <>

      {/* HERO BANNER */}
      <section className="relative bg-[#0f0c29] overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: `radial-gradient(circle at 30% 50%, ${event.theme_color || '#4f46e5'} 0%, transparent 60%), radial-gradient(circle at 70% 20%, #7c3aed 0%, transparent 40%)` }} />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          <Link href="/events"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm font-medium mb-8 transition-colors no-underline">
            <ArrowLeft size={14} />
            {lang === 'fr' ? 'Tous les événements' : 'All events'}
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              {event.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/60 text-xs font-medium uppercase tracking-widest">
                  {event.category}
                </span>
              )}
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.05]">
                {event.title}
              </h1>
              <p className="text-white/50 text-base font-medium">
                {lang === 'fr' ? 'Organisé par' : 'Organized by'}{' '}
                <span className="text-white/80 font-bold">
                  {event.org_name || event.profiles?.company || 'RetailBox Partner'}
                </span>
              </p>
            </div>

            {/* Date badge */}
            <div className="flex-shrink-0">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-5 text-center min-w-[120px]">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">
                  {lang === 'fr' ? 'Date' : 'Date'}
                </p>
                <p className="text-white text-2xl font-black">
                  {formatDateShort(event.start_date)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <EventMain  formatDate={formatDate} 
        formatDateShort={formatDateShort} 
        lang={lang}
        t={t}
        event={event}
        origin={origin}
        />
      </main>

     </>

      
   )
}