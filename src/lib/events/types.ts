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