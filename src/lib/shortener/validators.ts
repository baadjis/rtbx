// lib/links/validators.ts
import { z } from 'zod';

export const linkCreateSchema = z.object({
  user_id: z
    .string()
    .nullable()
    .optional(),
  long_url: z.string().url({ message: 'URL invalide' }),
  custom_alias: z.string()
    .min(3, 'L\'alias doit contenir au moins 3 caractères')
    .max(20, 'L\'alias est trop long (max 20 caractères)')
    .regex(/^[a-z0-9-_]+$/, 'L\'alias ne peut contenir que des lettres, chiffres, - et _')
    .optional()
    .nullable(),
  title: z.string().max(150).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
});

// Validator spécifique pour update (seulement title et description)
export const linkUpdateSchema = z.object({
  title: z.string().max(150).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
});

export type LinkCreateInput = z.infer<typeof linkCreateSchema>;
export type LinkUpdateInput = z.infer<typeof linkUpdateSchema>;