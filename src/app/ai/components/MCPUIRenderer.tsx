/* eslint-disable @typescript-eslint/no-explicit-any */
// app/ai/components/MCPUIRenderer.tsx
'use client';
import { ShortLinkCard, ShortLinkList, ShortLinkStats } from './ui/ShortLinkUI';

type UIPayload = {
  type: string;
  data: any;
} | null;

export default function MCPUIRenderer({ ui }: { ui: UIPayload }) {
  if (!ui) return null;

  switch (ui.type) {
    // ── Shortener ──
    case 'short_link_list':
      return <ShortLinkList data={ui.data} />;
    case 'short_link_card':
      return <ShortLinkCard data={ui.data} />;
    case 'short_link_stats':
      return <ShortLinkStats data={ui.data} />;

    // ── À venir ──
    // case 'event_list':       return <EventList data={ui.data} />;
    // case 'participants_table': return <ParticipantsTable data={ui.data} />;
    // case 'agenda_list':      return <AgendaList data={ui.data} />;
    // case 'form_list':        return <FormList data={ui.data} />;

    default:
      return null;
  }
}