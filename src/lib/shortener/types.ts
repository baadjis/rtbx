// lib/links/types.ts
export type LinkSource = 'manual' | 'api' | 'extension';

export type LinkEntity = {
  id: string;
  short_code: string;
  long_url: string;
  clicks: number;
  user_id?: string | null;
  created_at: string;
  updated_at?: string | null;
  last_clicked_at?: string | null;
  title?: string | null;
  description?: string | null;
  deleted_at?: string | null;
};

export type LinkCreatePayload = {
  long_url: string;
  custom_alias?: string | null;
  user_id?: string | null;
  title?: string | null;
  description?: string | null;
};

// Nouveau type pour update (seulement title et description)
export type LinkUpdatePayload = {
  title?: string | null;
  description?: string | null;
};