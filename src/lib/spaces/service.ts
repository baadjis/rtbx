/* eslint-disable @typescript-eslint/no-explicit-any */

import crypto from 'crypto'

import { createClient } from '@supabase/supabase-js'

import {
  SpaceAddSchema,
  SpaceUpdateSchema
} from './validators'

import type {
  SpaceAddPayload,
  SpaceUpdatePayload,
  SpaceEntity
} from './types'

/* =========================================================
   ADMIN CLIENT
========================================================= */

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/* =========================================================
   HELPERS
========================================================= */

function normalizeSlug(slug: string) {

  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '')

}

function generateEditToken() {

  return crypto.randomUUID()

}

/* =========================================================
   GET SPACE BY SLUG
========================================================= */

export async function getSpaceBySlug(
  slug: string
): Promise<SpaceEntity | null> {

  const cleanSlug =
    normalizeSlug(slug)

  const { data, error } =
    await supabaseAdmin
      .from('spaces')
      .select('*')
      .eq('slug', cleanSlug)
      .is('deleted_at', null)
      .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data

}

/* =========================================================
   GET SPACE BY TOKEN
========================================================= */

export async function getSpaceByToken(
  token: string
): Promise<SpaceEntity | null> {

  const { data, error } =
    await supabaseAdmin
      .from('spaces')
      .select('*')
      .eq('edit_token', token)
      .is('deleted_at', null)
      .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data

}

/* =========================================================
   CREATE SPACE
========================================================= */

export async function createSpace(
  payload: SpaceAddPayload
): Promise<SpaceEntity> {

  /* VALIDATION */

  const parsed =
    SpaceAddSchema.parse(payload)

  /* SLUG */

  const cleanSlug =
    normalizeSlug(parsed.slug)

  /* CHECK SLUG */

  const existing =
    await getSpaceBySlug(cleanSlug)

  if (existing) {
    throw new Error(
      'Slug already exists'
    )
  }

  /* INSERT */

  const insertPayload = {

    ...parsed,

    slug: cleanSlug,

    edit_token:
      parsed.edit_token ||
      generateEditToken(),

    social_data:
      parsed.social_data || [],

    theme_color:
      parsed.theme_color ||
      '#4f46e5',

    bg_color:
      parsed.bg_color ||
      '#0f172a'

  }

  const { data, error } =
    await supabaseAdmin
      .from('spaces')
      .insert(insertPayload)
      .select()
      .single()

  if (error) {
    throw new Error(error.message)
  }

  return data

}

/* =========================================================
   UPDATE SPACE
========================================================= */

export async function updateSpace(
  token: string,
  payload: SpaceUpdatePayload
): Promise<SpaceEntity> {

  /* VALIDATION */

  const parsed =
    SpaceUpdateSchema.parse(payload)

  /* EXISTENCE */

  const existing =
    await getSpaceByToken(token)

  if (!existing) {
    throw new Error(
      'Space not found'
    )
  }

  /* UPDATE */

  const updatePayload = {

    ...parsed,

    updated_at:
      new Date().toISOString()

  }

  const { data, error } =
    await supabaseAdmin
      .from('spaces')
      .update(updatePayload)
      .eq('edit_token', token)
      .select()
      .single()

  if (error) {
    console.log(error)
    throw new Error(error.message)
  }

  return data

}

/* =========================================================
   DELETE SPACE (SOFT DELETE)
========================================================= */

export async function deleteSpace(
  token: string
): Promise<boolean> {

  const existing =
    await getSpaceByToken(token)

  if (!existing) {
    throw new Error(
      'Space not found'
    )
  }

  const { error } =
    await supabaseAdmin
      .from('spaces')
      .update({
        deleted_at:
          new Date().toISOString()
      })
      .eq('edit_token', token)

  if (error) {
    throw new Error(error.message)
  }

  return true

}


export async function getMySpaces(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('spaces')
    .select('id, slug, entity_name, space_type, edit_token, avatar_url, theme_color, created_at')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) return { data: null, error };
  return { data, error: null };
}

export async function searchSpaces(payload: {
  q?: string;
  space_type?: string;
  space_subtype?: string;
  limit?: number;
  offset?: number;
}) {
  const { q, space_type, space_subtype, limit = 20, offset = 0 } = payload;

  let query = supabaseAdmin
    .from('spaces')
    .select('id, slug, entity_name, space_type, space_subtype, avatar_url, theme_color', { count: 'exact' })
    .is('deleted_at', null);

  if (q) query = query.or(`entity_name.ilike.%${q}%,slug.ilike.%${q}%`);
  if (space_type) query = query.eq('space_type', space_type);
  if (space_subtype) query = query.eq('space_subtype', space_subtype);

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return { data: null, error };
  return { data, count, error: null };
}