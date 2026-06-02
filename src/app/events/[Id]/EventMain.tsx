/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calendar, Clock, MapPin, ShieldCheck, Users } from "lucide-react";
import RegistrationForm from "./RegistrationForm";
import { LangType } from "@/lib/lang/types";

export default function EventMain({
    event,formatDate,formatDateShort,lang,t,
    origin

}:{event:any, formatDate:any, formatDateShort:any,lang:LangType,t:any

    origin:any
}){

    return(<div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* LEFT — Info */}
          <div className="lg:col-span-3 space-y-10">

            {/* Meta chips */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl border border-gray-100 shadow-sm text-sm text-gray-700 font-medium">
                <Calendar size={14} className="text-indigo-500" />
                {formatDate(event.start_date)}
              </div>
              {event.location && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl border border-gray-100 shadow-sm text-sm text-gray-700 font-medium">
                  <MapPin size={14} className="text-indigo-500" />
                  {event.location}
                </div>
              )}
              {event.max_capacity && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl border border-gray-100 shadow-sm text-sm text-gray-700 font-medium">
                  <Users size={14} className="text-indigo-500" />
                  {event.max_capacity} places
                </div>
              )}
              {event.end_date && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl border border-gray-100 shadow-sm text-sm text-gray-700 font-medium">
                  <Clock size={14} className="text-indigo-500" />
                  {lang === 'fr' ? "Jusqu'au" : 'Until'} {formatDateShort(event.end_date)}
                </div>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-5">
                  {lang === 'fr' ? "À propos de l'événement" : 'About this event'}
                </h2>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  {event.description.split('\n').map((para: string, i: number) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Security note */}
            <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-xs font-medium">
              <ShieldCheck size={16} className="flex-shrink-0" />
              {lang === 'fr'
                ? 'Événement vérifié — vos données sont protégées'
                : 'Verified event — your data is protected'}
            </div>
          </div>

          {/* RIGHT — Registration form */}
          <div className="lg:col-span-2 lg:sticky lg:top-8">
            <RegistrationForm
              eventId={event.id}
              lang={lang}
              t={t}
              origin={origin}
              eventConfig={{
                ask_company: event.ask_company,
                ask_professional_role: event.ask_professional_role,
                form_config: event.form_config,
                visibility: event.visibility,
              }}
            />
          </div>
        </div>)
}