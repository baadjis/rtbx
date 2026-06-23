/* eslint-disable @typescript-eslint/no-explicit-any */
// app/ai/components/ui/EventUI.tsx
'use client';
import { useState } from 'react';
import { Calendar, MapPin, Users, Mail, CheckCircle, Clock3, ExternalLink, Tag } from 'lucide-react';
import Pagination from '../shared/Pagination';
import { formatDate, formatTime } from '../shared/DateFormatter';
import { LangType } from '@/lib/lang/types';

const PAGE_SIZE = 5;

const DATA={

  fr:{
    published:"Publié",
    canceled:"Annulé",
    draft:"Brouillon",
    no_participant:"Aucun participant",
    no_event_found:"Acun événement trouvé",
    accepted:"Accepté",
    sent:"Envoyé",
    pending:"En attente",
    name:"Nom",
    email:"Email",
    statatut:"Statut",
    company:"Entreprise",
    no_invitation:"Aucune invitation",
    empty_agenda:"Agenda vide",
    open_dashboard:"Ouvrir le dashboard"

  },
  en:{
    published:"Published",
    canceled:"Canceled",
    draft:"Draft",
    no_participant:"No participant ",
    no_event_found:"No  event found",
     accepted:"Accepted",
    sent:"Sent",
    pending:"Pending",
    name:"Name",
    email:"Email",
    company:"Company",
    no_invitation:"No invitation",
    empty_agenda:"Empty agenda",
    open_dashboard:"Open dashboard"



  }
}
// =====================================================
// STATUS BADGE
// =====================================================
function StatusBadge({ published, status ,lang="en"}: { published?: boolean; status?: string ,lang?:LangType}) {
  const t=DATA[lang]
  if (status === 'cancelled') return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">{t.canceled}</span>
  );
  if (published) return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{t.published}</span>
  );
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">{t.draft}</span>
  );
}

// =====================================================
// EVENT LIST — getMyEvents, searchPublicEvents, searchOrganizerEvents
// =====================================================
export function EventList({ data ,lang='en'}: { data: any,lang:LangType }) {
  const [page, setPage] = useState(0);
  const t=DATA[lang]
  // Gérer les deux formats : { organized, registered, invited } ou array direct
  let events: any[] = [];
  let hasGroups = false;

  if (data?.organized !== undefined) {
    hasGroups = true;
    events = [
      ...data.organized.map((e: any) => ({ ...e, _group: 'Organisés' })),
      ...data.registered.map((e: any) => ({ ...e, _group: 'Inscrits' })),
      ...data.invited.map((e: any) => ({ ...e, _group: 'Invités' })),
    ];
  } else if (Array.isArray(data)) {
    events = data;
  } else if (data?.data) {
    events = data.data;
  }

  const paginated = events.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (!events.length) {
    return (
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 text-center text-white/30 text-sm">
        {t.no_event_found}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {paginated.map((event: any, i: number) => (
        <div key={i}
          className="group bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] hover:border-indigo-500/20 rounded-2xl px-4 py-3.5 transition-all">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {hasGroups && event._group && (
                  <span className="text-[10px] text-white/25 font-medium">{event._group}</span>
                )}
                <StatusBadge published={event.is_published} status={event.status} />
              </div>
              <p className="text-white text-sm font-semibold truncate">{event.title}</p>
            </div>
            <a
              href={`/dashboard/events/${event.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/40 hover:text-white transition-all"
            >
              <ExternalLink size={12} />
            </a>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <Calendar size={11} className="text-indigo-400" />
              {formatDate(event.start_date)}
            </div>
            {event.location && (
              <div className="flex items-center gap-1.5 text-white/40 text-xs">
                <MapPin size={11} className="text-indigo-400" />
                <span className="truncate max-w-[150px]">{event.location}</span>
              </div>
            )}
            {event.category && (
              <div className="flex items-center gap-1.5 text-white/40 text-xs">
                <Tag size={11} className="text-indigo-400" />
                {event.category}
              </div>
            )}
          </div>
        </div>
      ))}
      <Pagination page={page} total={events.length} pageSize={PAGE_SIZE} onChange={setPage} lang={lang} />
    </div>
  );
}

// =====================================================
// PARTICIPANTS TABLE — getEventRegistrations
// =====================================================
export function ParticipantsTable({ data ,lang="en"}: { data: any ,lang:LangType}) {
  const [page, setPage] = useState(0);
  const participants: any[] = Array.isArray(data) ? data : data?.data ?? [];
  const paginated = participants.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const t= DATA[lang]
  if (!participants.length) {
    return (
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 text-center">
        <Users size={24} className="text-white/20 mx-auto mb-2" />
        <p className="text-white/30 text-sm">{t.no_participant}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid grid-cols-3 gap-2 px-3 pb-1">
        <span className="text-[10px] text-white/25 uppercase tracking-wider">{t.name}</span>
        <span className="text-[10px] text-white/25 uppercase tracking-wider">{t.email}</span>
        <span className="text-[10px] text-white/25 uppercase tracking-wider">{t.company}</span>
      </div>

      {/* Rows */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        {paginated.map((p: any, i: number) => (
          <div key={i}
            className={`grid grid-cols-3 gap-2 px-3 py-2.5 text-xs transition-colors hover:bg-white/[0.04] ${
              i < paginated.length - 1 ? 'border-b border-white/[0.04]' : ''
            }`}>
            <span className="text-white/80 font-medium truncate">{p.full_name}</span>
            <span className="text-white/40 truncate">{p.email}</span>
            <span className="text-white/40 truncate">{p.company_name || '—'}</span>
          </div>
        ))}
      </div>

      <Pagination page={page} total={participants.length} pageSize={PAGE_SIZE} onChange={setPage}  lang={lang}/>
    </div>
  );
}

// =====================================================
// INVITATIONS TABLE — getEventInvitations
// =====================================================
function InviteStatusBadge({ status ,lang}: { status: string,lang:LangType }) {
  const t=DATA[lang];
  switch (status) {
    case 'accepted': return (
      <span className="flex items-center gap-1 text-[10px] text-emerald-400">
        <CheckCircle size={10} /> {t.accepted}
      </span>
    );
    case 'sent': return (
      <span className="flex items-center gap-1 text-[10px] text-blue-400">
        <Mail size={10} /> {t.sent}
      </span>
    );
    default: return (
      <span className="flex items-center gap-1 text-[10px] text-white/30">
        <Clock3 size={10} /> {t.pending}
      </span>
    );
  }
}

export function InvitationsTable({ data,lang='en' }: { data: any,lang:LangType }) {
  const [page, setPage] = useState(0);
  const invitations: any[] = Array.isArray(data) ? data : data?.data ?? [];
  const paginated = invitations.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const t= DATA[lang]

  if (!invitations.length) {
    return (
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 text-center">
        <Mail size={24} className="text-white/20 mx-auto mb-2" />
        <p className="text-white/30 text-sm">{t.no_invitation}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2 px-3 pb-1">
        <span className="text-[10px] text-white/25 uppercase tracking-wider">Email</span>
        <span className="text-[10px] text-white/25 uppercase tracking-wider">Statut</span>
        <span className="text-[10px] text-white/25 uppercase tracking-wider">Date</span>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        {paginated.map((inv: any, i: number) => (
          <div key={i}
            className={`grid grid-cols-3 gap-2 px-3 py-2.5 text-xs hover:bg-white/[0.04] transition-colors ${
              i < paginated.length - 1 ? 'border-b border-white/[0.04]' : ''
            }`}>
            <span className="text-white/70 truncate">{inv.email}</span>
            <InviteStatusBadge status={inv.status} lang={lang} />
            <span className="text-white/30">{formatDate(inv.created_at)}</span>
          </div>
        ))}
      </div>

      <Pagination page={page} total={invitations.length} pageSize={PAGE_SIZE} onChange={setPage} lang={lang}/>
    </div>
  );
}

// =====================================================
// AGENDA LIST — getEventAgenda
// =====================================================
export function AgendaList({ data ,lang='en'}: { data: any,lang?:LangType }) {
  const [page, setPage] = useState(0);
  const items: any[] = Array.isArray(data) ? data : data?.data ?? [];
  const paginated = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const t= DATA[lang]
  if (!items.length) {
    return (
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 text-center">
        <Calendar size={24} className="text-white/20 mx-auto mb-2" />
        <p className="text-white/30 text-sm">{t.empty_agenda}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {paginated.map((item: any, i: number) => (
        <div key={i} className="flex gap-3 bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] rounded-2xl px-4 py-3 transition-all">
          {/* Timeline dot */}
          <div className="flex flex-col items-center pt-1 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
            {i < paginated.length - 1 && (
              <div className="w-px flex-1 bg-white/[0.06] mt-1" />
            )}
          </div>

          <div className="flex-1 min-w-0 pb-2">
            {/* Time */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-indigo-400 text-xs font-mono font-medium">
                {formatTime(item.start_time)}
                {item.end_time && ` → ${formatTime(item.end_time)}`}
              </span>
              {item.room_name && (
                <span className="text-[10px] text-white/25 bg-white/[0.04] px-2 py-0.5 rounded-full">
                  {item.room_name}
                </span>
              )}
            </div>

            {/* Label */}
            <p className="text-white text-sm font-medium">{item.label}</p>

            {/* Description */}
            {item.description && (
              <p className="text-white/40 text-xs mt-1 leading-relaxed">{item.description}</p>
            )}

            {/* Speakers */}
            {item.speakers && item.speakers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {item.speakers.map((s: any, si: number) => (
                  <span key={si}
                    className="text-[10px] text-white/50 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">
                    {typeof s === 'string' ? s : s.name || JSON.stringify(s)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      <Pagination page={page} total={items.length} pageSize={PAGE_SIZE} onChange={setPage}  lang={lang}/>
    </div>
  );
}


// app/ai/components/ui/EventUI.tsx — ajouter ce composant
export function EventCard({ data,lang }: { data: any,lang:LangType }) {
  const event = data?.data ?? data;
  if (!event?.id) return null;

  const formatDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const t=DATA[lang]
  return (
    <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {event.is_published
              ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Publié</span>
              : <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Brouillon</span>
            }
            {event.category && (
              <span className="text-[10px] text-white/25 bg-white/[0.04] px-1.5 py-0.5 rounded-full">{event.category}</span>
            )}
          </div>
          <p className="text-white font-semibold text-sm">{event.title}</p>
        </div>
        <a href={`/dashboard/events/${event.id}`} target="_blank" rel="noopener noreferrer"
          className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/40 hover:text-white transition-all flex-shrink-0">
          <ExternalLink size={12} />
        </a>
      </div>

      <div className="flex flex-wrap gap-2">
        {event.start_date && (
          <div className="flex items-center gap-1.5 text-white/40 text-xs">
            <Calendar size={11} className="text-indigo-400" />
            {formatDate(event.start_date)}
          </div>
        )}
        {event.location && (
          <div className="flex items-center gap-1.5 text-white/40 text-xs">
            <MapPin size={11} className="text-indigo-400" />
            <span className="truncate max-w-[150px]">{event.location}</span>
          </div>
        )}
      </div>

      <a href={`/dashboard/events/${event.id}`} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-medium transition-all w-fit">
        <ExternalLink size={12} /> {t.open_dashboard}
      </a>
    </div>
  );
}