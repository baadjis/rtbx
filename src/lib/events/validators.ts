// lib/events/validators.ts
import { z } from 'zod';

export const eventCreateSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères').max(150),
  description: z.string().max(1000).optional().nullable(),
  category: z.string().min(1, 'La catégorie est requise'),
  visibility: z.enum(['public', 'private', 'invite_only']).default('public'),
  requires_registration: z.boolean().default(false),
  location: z.string().max(255).optional().nullable(),
  start_date: z.string().datetime({ message: 'Date de début invalide' }),
  end_date: z.string().datetime().optional().nullable(),
  max_capacity: z.number().int().positive().optional().nullable(),
  org_name: z.string().max(100).optional().nullable(),
});

export const eventPublishSchema = z.object({
  eventId: z.string().uuid('ID d\'événement invalide'),
  lang: z.enum(['fr', 'en']).default('fr'),
});


// lib/events/validators.ts — ajouts
export const registerEventSchema = z.object({
  eventId: z.string().min(1, 'eventId requis'),
  name: z.string().min(2, 'Nom requis'),
  email: z.string(),
  lang: z.enum(['fr', 'en']).default('fr'),
  origin: z.string().optional(),
  company_name: z.string().max(150).optional().nullable(),
  professional_role: z.string().max(100).optional().nullable(),
  custom_data: z.record(z.string(), z.any()).optional().default({}),
  opt_in_discovery: z.boolean().default(false),
  opt_in_merchant: z.boolean().default(false),
});

export const sendBadgesSchema = z.object({
  eventId: z.string().min(1, 'eventId requis'),
  lang: z.enum(['fr', 'en']).default('fr'),
});

export const sendInviteSchema = z.object({
  email: z.string(),
  eventId: z.string().min(1, 'eventId requis'),
  lang: z.enum(['fr', 'en']).default('fr'),
});
 export const eventUpdateSchema = z.object({
  title: z.string().min(3).max(150).optional(),
  description: z.string().max(1000).optional().nullable(),
  category: z.string().min(1).optional(),
  visibility: z.enum(['public', 'private', 'invite_only']).optional(),
  requires_registration: z.boolean().optional(),
  location: z.string().max(255).optional().nullable(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional().nullable(),
  max_capacity: z.number().int().positive().optional().nullable(),
});

export const agendaItemSchema = z.object({
  start_time: z.string().datetime('start_time invalide'),
  end_time: z.string().datetime().optional().nullable(),
  label: z.string().min(1, 'Label requis').max(200),
  room_name: z.string().max(100).optional().nullable(),
  speakers: z.array(z.any()).optional().default([]),
  description: z.string().max(1000).optional().nullable(),
});
export const eventCancelSchema = z.object({
  eventId: z.string().min(1, 'eventId requis'),
  reason: z.string().max(500).optional(),
  lang: z.enum(['fr', 'en']).default('fr'),
});
export const eventPublicSearchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  org_name: z.string().optional(),
  start_date: z.string().datetime().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const eventOrganizerSearchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  org_name: z.string().optional(),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']).optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export type EventPublicSearchInput = z.infer<typeof eventPublicSearchSchema>;
export type EventOrganizerSearchInput = z.infer<typeof eventOrganizerSearchSchema>;

export type EventCancelInput = z.infer<typeof eventCancelSchema>;

export const agendaUpdateSchema = agendaItemSchema.partial();

export type AgendaItemInput = z.infer<typeof agendaItemSchema>;
export type AgendaUpdateInput = z.infer<typeof agendaUpdateSchema>;

export type EventUpdateInput = z.infer<typeof eventUpdateSchema>;

export type SendInviteInput = z.infer<typeof sendInviteSchema>;

export type RegisterEventInput = z.infer<typeof registerEventSchema>;
export type SendBadgesInput = z.infer<typeof sendBadgesSchema>;

export type EventCreateInput = z.infer<typeof eventCreateSchema>;
export type EventPublishInput = z.infer<typeof eventPublishSchema>;