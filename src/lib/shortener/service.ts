// lib/links/services.ts
import { linkCreateSchema, linkUpdateSchema } from './validators';
import type { LinkCreateInput, LinkUpdateInput } from './validators';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient(
 
);

/* =========================================================
   CREATE LINK
========================================================= */
export async function createLink(payload: LinkCreateInput & { user_id?: string | null }) {
  const parsed = linkCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return { data: null, error: parsed.error.flatten() };
  }

  let shortCode = payload.custom_alias 
    ? payload.custom_alias.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '')
    : Math.random().toString(36).substring(2, 8);

  const { data: existing } = await supabase
    .from('links')
    .select('short_code')
    .eq('short_code', shortCode)
    .maybeSingle();

  if (existing) {
    shortCode = Math.random().toString(36).substring(2, 8);
  }

  const { data, error } = await supabase
    .from('links')
    .insert([{
      short_code: shortCode,
      long_url: parsed.data.long_url,
      user_id: payload.user_id || null,
      title: payload.title || null,
      description: payload.description || null,
      clicks: 0,
    }])
    .select()
    .single();

  return { data, error };
}

/* =========================================================
   UPDATE LINK (title + description only)
========================================================= */
export async function updateLink(shortCode: string, payload: LinkUpdateInput) {
  const parsed = linkUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return { data: null, error: parsed.error.flatten() };
  }

  const { data, error } = await supabase
    .from('links')
    .update({
      title: parsed.data.title,
      description: parsed.data.description,
      updated_at: new Date().toISOString()
    })
    .eq('short_code', shortCode)
    .select()
    .single();

  return { data, error };
}

/* =========================================================
   GET LINK BY CODE
========================================================= */
export async function getLinkByCode(shortCode: string) {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('short_code', shortCode)
    .is('deleted_at', null)
    .single();

  return { data, error };
}

/* =========================================================
   INCREMENT CLICKS
========================================================= */
export async function incrementClicks(shortCode: string) {
  const { error } = await supabase
    .from('links')
    .update({
      clicks: supabase.rpc('increment_clicks', { code: shortCode }),
      last_clicked_at: new Date().toISOString()
    })
    .eq('short_code', shortCode)
    .is('deleted_at', null);

  return { error };
}

/* =========================================================
   GET USER LINKS
========================================================= */
export async function getUserLinks(userId: string) {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  return { data, error };
}

/* =========================================================
   DELETE LINK (SOFT DELETE)
========================================================= */
export async function deleteLink(shortCode: string) {
  const { error } = await supabase
    .from('links')
    .update({ 
      deleted_at: new Date().toISOString() 
    })
    .eq('short_code', shortCode);

  return { error };
}

/* =========================================================
   GET LINK STATS
========================================================= */
export async function getLinkStats(shortCode: string) {
  const { data, error } = await supabase
    .from('links')
    .select('clicks, last_clicked_at, created_at, long_url, title, description')
    .eq('short_code', shortCode)
    .is('deleted_at', null)
    .single();

  return { data, error };
}

export default {
  createLink,
  updateLink,
  getLinkByCode,
  incrementClicks,
  getUserLinks,
  deleteLink,
  getLinkStats,
};