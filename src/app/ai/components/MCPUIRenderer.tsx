/* eslint-disable @typescript-eslint/no-explicit-any */
// app/ai/components/MCPUIRenderer.tsx
'use client';
import { ShortLinkCard, ShortLinkList, ShortLinkStats } from './ui/ShortLinkUI';
import { EventList, ParticipantsTable, InvitationsTable, AgendaList, EventCard } from './ui/EventUI';
import { SpaceCard, SpaceList, SpaceSocialLinks } from './ui/SpaceUI';
import { FormList, FormResponsesTable, FormCard } from './ui/FormUI';
import { BusinessAppLinks, BusinessCard, BusinessList, BusinessLoyaltyHistory, BusinessLoyaltyRewards, BusinessOpeningHours, BusinessProviderLinks } from './ui/BusinessUI';
import { LangType } from '@/lib/lang/types';

type UIPayload = {
  type: string;
  data: any;
} | null;

export default function MCPUIRenderer({ ui ,lang='en'}: { ui: UIPayload,lang:LangType }) {
  if (!ui) return null;

  switch (ui.type) {
    // ── Shortener ──
    case 'short_link_list':
      return <ShortLinkList data={ui.data} lang={lang}/>;
    case 'short_link_card':
      return <ShortLinkCard data={ui.data} lang={lang}/>;
    case 'short_link_stats':
      return <ShortLinkStats data={ui.data}  lang={lang}/>;

    // ── Events ──
    case 'event_list':
      return <EventList data={ui.data} lang={lang}/>;
    case 'participants_table':
      return <ParticipantsTable data={ui.data} lang={lang}/>;
    case 'invitations_table':
      return <InvitationsTable data={ui.data} lang={lang} />;
    case 'agenda_list':
      return <AgendaList data={ui.data} lang={lang}/>;

    // ── Spaces ──
case 'space_list':
  return <SpaceList data={ui.data} lang={lang} />;
case 'space_social_links':
  return <SpaceSocialLinks data={ui.data}  lang={lang}/>;

case 'form_list':
  return <FormList data={ui.data} lang={lang}/>;
case 'form_responses_table':
  return <FormResponsesTable data={ui.data} lang={lang}/>;
case 'form_card':
  return <FormCard data={ui.data}  lang={lang}/>;

  case 'business_list':
  return <BusinessList data={ui.data} lang={lang} />;
case 'business_card':
  return <BusinessCard data={ui.data} lang={lang} />;

case 'business_provider_links':
  return <BusinessProviderLinks data={ui.data} lang={lang} />;
case 'business_opening_hours':
  return <BusinessOpeningHours data={ui.data} lang={lang} />;
case 'business_loyalty_rewards':
  return <BusinessLoyaltyRewards data={ui.data} lang={lang}/>;
case 'business_loyalty_history':
  return <BusinessLoyaltyHistory data={ui.data}  lang={lang}/>;


case 'event_card':
  return <EventCard data={ui.data}  lang={lang}/>;
case 'space_card':
  return <SpaceCard data={ui.data} lang={lang}/>;
case 'business_app_links':
  return <BusinessAppLinks data={ui.data} lang={lang}/>;

    default:
      return null;
  }
}