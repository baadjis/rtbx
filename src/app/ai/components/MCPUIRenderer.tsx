/* eslint-disable @typescript-eslint/no-explicit-any */
// app/ai/components/MCPUIRenderer.tsx
'use client';
import { ShortLinkCard, ShortLinkList, ShortLinkStats } from './ui/ShortLinkUI';
import { EventList, ParticipantsTable, InvitationsTable, AgendaList } from './ui/EventUI';
import { SpaceList, SpaceSocialLinks } from './ui/SpaceUI';
import { FormList, FormResponsesTable, FormCard } from './ui/FormUI';

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

    // ── Events ──
    case 'event_list':
      return <EventList data={ui.data} />;
    case 'participants_table':
      return <ParticipantsTable data={ui.data} />;
    case 'invitations_table':
      return <InvitationsTable data={ui.data} />;
    case 'agenda_list':
      return <AgendaList data={ui.data} />;

    // ── Spaces ──
case 'space_list':
  return <SpaceList data={ui.data} />;
case 'space_social_links':
  return <SpaceSocialLinks data={ui.data} />;

case 'form_list':
  return <FormList data={ui.data} />;
case 'form_responses_table':
  return <FormResponsesTable data={ui.data} />;
case 'form_card':
  return <FormCard data={ui.data} />;

    // ── À ──
    // case 'space_list':           return <SpaceList data={ui.data} />;
    // case 'form_list':            return <FormList data={ui.data} />;
    // case 'form_responses_table': return <FormResponsesTable data={ui.data} />;

    default:
      return null;
  }
}