/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api-keys/service.ts
import { createClient as createAdminClient } from '@supabase/supabase-js';

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateKey(): string {
  const prefix = 'rtbx_live_';
  const random = Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `${prefix}${random}`;
}

/* =========================================================
   CREATE API KEY
========================================================= */
export async function createApiKey(payload: {
  user_id: string;
  name: string;
  agent_type?: string;
  mode?: string;
  daily_limit?: number;
}) {
  const key = generateKey();

  const { data, error } = await supabaseAdmin
    .from('api_keys')
    .insert([{
      user_id: payload.user_id,
      key,
      name: payload.name,
      agent_type: payload.agent_type || 'all',
      mode: payload.mode || 'text',
      daily_limit: payload.daily_limit || 100,
    }])
    .select('id, name, key, agent_type, mode, daily_limit, created_at')
    .single();

  if (error) return { data: null, error };
  return { data, error: null };
}

/* =========================================================
   GET USER API KEYS
========================================================= */
export async function getUserApiKeys(user_id: string) {
  const { data, error } = await supabaseAdmin
    .from('api_keys')
    .select('id, name, agent_type, mode, daily_limit, requests_today, requests_total, last_used_at, created_at, is_active')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });

  if (error) return { data: null, error };
  return { data, error: null };
}

/* =========================================================
   REVOKE API KEY
========================================================= */
export async function revokeApiKey(keyId: string, user_id: string) {
  const { error } = await supabaseAdmin
    .from('api_keys')
    .update({ is_active: false })
    .eq('id', keyId)
    .eq('user_id', user_id);

  if (error) return { error };
  return { error: null };
}

/* =========================================================
   VALIDATE API KEY + RATE LIMIT
========================================================= */
export async function validateApiKey(key: string): Promise<{
  valid: boolean;
  keyData?: any;
  error?: string;
}> {
  const { data, error } = await supabaseAdmin
    .from('api_keys')
    .select('*')
    .eq('key', key)
    .eq('is_active', true)
    .single();

  if (error || !data) return { valid: false, error: 'Invalid API key' };

  if (data.requests_today >= data.daily_limit) {
    return { valid: false, error: `Daily limit reached (${data.daily_limit} req/day)` };
  }

  // Incrémenter les compteurs
  await supabaseAdmin
    .from('api_keys')
    .update({
      requests_today: data.requests_today + 1,
      requests_total: data.requests_total + 1,
      last_used_at: new Date().toISOString(),
    })
    .eq('id', data.id);

  return { valid: true, keyData: data };
}