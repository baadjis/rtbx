// lib/events/validators.ts
import { z } from 'zod';

export const eventCreateSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères').max(150),
  description: z.string().max(1000).optional().nullable(),
  category: z.enum(['conference', 'workshop', 'meetup', 'party', 'other']).optional().nullable(),
  visibility: z.enum(['public', 'private', 'invite_only']),
  requires_registration: z.boolean().default(false),
  location: z.string().max(255).optional().nullable(),
  start_date: z.string().datetime({ message: 'Date de début invalide' }),
  end_date: z.string().datetime().optional().nullable(),
  max_capacity: z.number().int().positive().optional().nullable(),
  org_name: z.string().max(100).optional().nullable(),
});

export type EventCreateInput = z.infer<typeof eventCreateSchema>;