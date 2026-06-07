/* eslint-disable @typescript-eslint/no-explicit-any */
// app/ai/components/ui/EventUI.tsx
'use client';
import { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Mail, CheckCircle, XCircle, Clock3, ChevronLeft, ChevronRight, ExternalLink, Tag } from 'lucide-react';

const PAGE_SIZE = 5;

function Pagination({ page, total, pageSize, onChange }: {
  page: number; total: number; pageSize: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
      <span className="text-white/30 text-xs">{total} résultats</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 0}
          className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] disabled:opacity-30 flex items-center justify-center text-white/50 transition-all"
        >
          <ChevronLeft size={13} />
        </button>
        <span className="text-white/40 text-xs">{page + 1} / {totalPages}</span>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] disabled:opacity-30 flex items-center justify-center text-white/50 transition-all"
        >
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

function formatDate(date: string) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function formatTime(date: string) {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit',
  });
}

// =====================================================
// STATUS BADGE
// =====================================================
function StatusBadge({ published, status }: { published?: boolean; status?: string }) {
  if (status === 'cancelled') return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Annulé</span>
  );
  if (published) return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Publié</span>
  );
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Brouillon</span>
  );
}

// =====================================================
// EVENT LIST — getMyEvents, searchPublicEvents, searchOrganizerEvents
// =====================================================
export function EventList({ data }: { data: any }) {
  const [page, setPage] = useState(0);

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
        Aucun événement trouvé
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
      <Pagination page={page} total={events.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}

// =====================================================
// PARTICIPANTS TABLE — getEventRegistrations
// =====================================================
export function ParticipantsTable({ data }: { data: any }) {
  const [page, setPage] = useState(0);
  const participants: any[] = Array.isArray(data) ? data : data?.data ?? [];
  const paginated = participants.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (!participants.length) {
    return (
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 text-center">
        <Users size={24} className="text-white/20 mx-auto mb-2" />
        <p className="text-white/30 text-sm">Aucun participant</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid grid-cols-3 gap-2 px-3 pb-1">
        <span className="text-[10px] text-white/25 uppercase tracking-wider">Nom</span>
        <span className="text-[10px] text-white/25 uppercase tracking-wider">Email</span>
        <span className="text-[10px] text-white/25 uppercase tracking-wider">Entreprise</span>
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

      <Pagination page={page} total={participants.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}

// =====================================================
// INVITATIONS TABLE — getEventInvitations
// =====================================================
function InviteStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'accepted': return (
      <span className="flex items-center gap-1 text-[10px] text-emerald-400">
        <CheckCircle size={10} /> Accepté
      </span>
    );
    case 'sent': return (
      <span className="flex items-center gap-1 text-[10px] text-blue-400">
        <Mail size={10} /> Envoyé
      </span>
    );
    default: return (
      <span className="flex items-center gap-1 text-[10px] text-white/30">
        <Clock3 size={10} /> En attente
      </span>
    );
  }
}

export function InvitationsTable({ data }: { data: any }) {
  const [page, setPage] = useState(0);
  const invitations: any[] = Array.isArray(data) ? data : data?.data ?? [];
  const paginated = invitations.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (!invitations.length) {
    return (
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 text-center">
        <Mail size={24} className="text-white/20 mx-auto mb-2" />
        <p className="text-white/30 text-sm">Aucune invitation</p>
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
            <InviteStatusBadge status={inv.status} />
            <span className="text-white/30">{formatDate(inv.created_at)}</span>
          </div>
        ))}
      </div>

      <Pagination page={page} total={invitations.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}

// =====================================================
// AGENDA LIST — getEventAgenda
// =====================================================
export function AgendaList({ data }: { data: any }) {
  const [page, setPage] = useState(0);
  const items: any[] = Array.isArray(data) ? data : data?.data ?? [];
  const paginated = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (!items.length) {
    return (
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 text-center">
        <Calendar size={24} className="text-white/20 mx-auto mb-2" />
        <p className="text-white/30 text-sm">Agenda vide</p>
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

      <Pagination page={page} total={items.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}