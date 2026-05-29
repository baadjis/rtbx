// lib/forms/validators.ts
import { z } from 'zod';

export const formCreateSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(200),
  description: z.string().max(1000).optional().nullable(),
  category: z.string().default('survey'),
  visibility: z.enum(['public', 'private', 'invite_only']).default('public'),
  org_name: z.string().max(100).optional().nullable(),
  fields_json: z.array(z.any()).default([]),
  settings: z.record(z.string(), z.any()).default({ theme: 'indigo', active: true }),
});

export const formUpdateSchema = formCreateSchema.partial().extend({
  is_published: z.boolean().optional(),
});

export const formPublishSchema = z.object({
  formId: z.string().uuid('formId invalide'),
  lang: z.enum(['fr', 'en']).default('fr'),
});

export const sendFormInviteSchema = z.object({
  formId: z.string().uuid('formId invalide'),
  emails: z.array(z.string().email()).min(1, 'Au moins un email requis'),
  lang: z.enum(['fr', 'en']).default('fr'),
});

export const formSubmitSchema = z.object({
  answers: z.record(z.string(), z.any()),
  metadata: z.record(z.string(), z.any()).optional().default({}),
  origin: z.string().optional().default('direct'),
});

export const formSearchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export type FormCreateInput = z.infer<typeof formCreateSchema>;
export type FormUpdateInput = z.infer<typeof formUpdateSchema>;
export type FormPublishInput = z.infer<typeof formPublishSchema>;
export type SendFormInviteInput = z.infer<typeof sendFormInviteSchema>;
export type FormSubmitInput = z.infer<typeof formSubmitSchema>;
export type FormSearchInput = z.infer<typeof formSearchSchema>;