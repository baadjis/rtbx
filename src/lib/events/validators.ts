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
  email: z.string().email('Email invalide'),
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
  email: z.string().email('Email invalide'),
  eventId: z.string().min(1, 'eventId requis'),
  lang: z.enum(['fr', 'en']).default('fr'),
});

export type SendInviteInput = z.infer<typeof sendInviteSchema>;

export type RegisterEventInput = z.infer<typeof registerEventSchema>;
export type SendBadgesInput = z.infer<typeof sendBadgesSchema>;

export type EventCreateInput = z.infer<typeof eventCreateSchema>;
export type EventPublishInput = z.infer<typeof eventPublishSchema>;