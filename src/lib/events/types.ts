/* eslint-disable @typescript-eslint/no-explicit-any */
import { LangType } from "../lang/types";

// lib/events/types.ts
export type EventVisibility = 'public' | 'private' | 'invite_only';
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export type EventEntity = {
  id: string;
  organizer_id: string;
  title: string;
  description?: string | null;
  category: string;                    // ex: 'sales', 'training', etc.
  visibility: EventVisibility;
  is_published: boolean;
  requires_registration: boolean;
  location?: string | null;
  start_date: string;
  end_date?: string | null;
  max_capacity?: number | null;
  org_name?: string | null;
  created_at: string;
  updated_at?: string | null;
  status?: EventStatus;
};

export type EventCreatePayload = {
  title: string;
  description?: string | null;
  category: string;
  visibility?: EventVisibility;
  requires_registration?: boolean;
  location?: string | null;
  start_date: string;
  end_date?: string | null;
  max_capacity?: number | null;
  org_name?: string | null;
};

export type EventPublishPayload = {
  eventId: string;
  lang?: LangType
};


// lib/events/types.ts — ajouts
export type EventRegistration = {
  id: number;
  event_id: number;
  user_id?: string | null;
  email: string;
  full_name: string;
  company_name?: string | null;
  professional_role?: string | null;
  custom_data?: Record<string, any>;
  created_at: string;
  source_campaign?: string;
  status_at_registration?: string;
  opt_in_merchant?: boolean;
};

export type EventBadge = {
  id: number;
  registration_id: number;
  event_id: number;
  ticket_code: string;
  access_level: string;
  badge_sent?: boolean;
  created_at?: string;
};

export type RegisterEventPayload = {
  eventId: string;
  name: string;
  email: string;
  lang?: 'fr' | 'en';
  origin?: string;
  company_name?: string | null;
  professional_role?: string | null;
  custom_data?: Record<string, any>;
  opt_in_discovery?: boolean;
  opt_in_merchant?: boolean;
};

export type SendBadgesPayload = {
  eventId: string;
  lang?: LangType
};

export type EventInvitation = {
  id: number;
  event_id: number;
  email: string;
  token: string;
  status: 'pending' | 'sent' | 'accepted';
  created_at?: string;
};

export type SendInvitePayload = {
  email: string;
  eventId: string;
  lang?: LangType
};