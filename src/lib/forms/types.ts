/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/forms/types.ts
export type FormVisibility = 'public' | 'private' | 'invite_only';

export type FormEntity = {
  id: string;
  user_id?: string | null;
  title: string;
  description?: string | null;
  category?: string;
  fields_json?: any[];
  settings?: Record<string, any>;
  is_published: boolean;
  visibility?: FormVisibility;
  org_name?: string | null;
  created_at: string;
  updated_at?: string | null;
};

export type FormInvitation = {
  id: number;
  form_id: string;
  email: string;
  token: string;
  status: 'pending' | 'sent' | 'opened';
  created_at: string;
};

export type FormResponse = {
  id: number;
  form_id: string;
  answers_json: Record<string, any>;
  metadata?: Record<string, any>;
  origin?: string;
  created_at: string;
};

export type FormCreatePayload = {
  title: string;
  description?: string | null;
  category?: string;
  visibility?: FormVisibility;
  org_name?: string | null;
  fields_json?: any[];
  settings?: Record<string, any>;
};

export type FormUpdatePayload = Partial<FormCreatePayload> & {
  is_published?: boolean;
};

export type FormPublishPayload = {
  formId: string;
  lang?: 'fr' | 'en';
};

export type SendFormInvitePayload = {
  formId: string;
  emails: string[];
  lang?: 'fr' | 'en';
};

export type FormSubmitPayload = {
  answers: Record<string, any>;
  metadata?: Record<string, any>;
  origin?: string;
};