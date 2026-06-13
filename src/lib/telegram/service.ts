/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/telegram/service.ts

// lib/telegram/service.ts
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/* =========================================================
   GET FRESH ACCESS TOKEN FROM REFRESH TOKEN
========================================================= */

export async function getAccessTokenFromRefreshToken(refreshToken: string): Promise<string | null> {
  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

  if (error || !data.session) {
    console.error('Failed to refresh Telegram session:', error);
    return null;
  }

  return data.session.access_token;
}








const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ENCRYPTION_KEY = process.env.TELEGRAM_TOKEN_ENCRYPTION_KEY!;
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

/* =========================================================
   SEND MESSAGE
========================================================= */
export async function sendTelegramMessage(chatId: string, text: string) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  });
}

/* =========================================================
   ENCRYPT / DECRYPT via pgcrypto (pgp_sym_encrypt / decrypt)
========================================================= */
async function encryptToken(token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.rpc('encrypt_token', {
    token_text: token,
    encryption_key: ENCRYPTION_KEY,
  });
  if (error) {
    console.error('Encrypt error:', error);
    return null;
  }
  return data;
}

async function decryptToken(encrypted: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.rpc('decrypt_token', {
    encrypted_text: encrypted,
    encryption_key: ENCRYPTION_KEY,
  });
  if (error) {
    console.error('Decrypt error:', error);
    return null;
  }
  return data;
}

/* =========================================================
   GET TELEGRAM CONFIG BY CHAT ID
========================================================= */
export async function getTelegramConfig(chatId: string) {
  const { data, error } = await supabaseAdmin
    .from('telegram_configs')
    .select('*')
    .eq('chat_id', chatId)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return data;
}

/* =========================================================
   HISTORY
========================================================= */
export async function getTelegramHistory(chatId: string): Promise<any[]> {
  const { data } = await supabaseAdmin
    .from('telegram_configs')
    .select('history')
    .eq('chat_id', chatId)
    .single();
  return data?.history ?? [];
}

export async function saveTelegramHistory(chatId: string, history: any[]) {
  const trimmed = history.slice(-10);
  await supabaseAdmin
    .from('telegram_configs')
    .update({ history: trimmed })
    .eq('chat_id', chatId);
}

/* =========================================================
   CREATE TELEGRAM CONFIG — chiffre le refresh_token
========================================================= */
export async function createTelegramConfig(payload: {
  user_id: string;
  chat_id: string;
  agent_type?: string;
  context_id?: string;
  role?: string;
  refresh_token?: string | null;
}) {
  let encryptedToken: string | null = null;
  if (payload.refresh_token) {
    encryptedToken = await encryptToken(payload.refresh_token);
  }

  const { data, error } = await supabaseAdmin
    .from('telegram_configs')
    .upsert([{
      user_id: payload.user_id,
      chat_id: payload.chat_id,
      agent_type: payload.agent_type || 'general',
      context_id: payload.context_id || null,
      role: payload.role || 'owner',
      refresh_token_encrypted: encryptedToken,
      is_active: true,
    }], { onConflict: 'chat_id' })
    .select()
    .single();

  if (error) return { data: null, error };
  return { data, error: null };
}

/* =========================================================
   GET FRESH ACCESS TOKEN — déchiffre puis refresh la session
========================================================= */
/* =========================================================
   GET FRESH ACCESS TOKEN — déchiffre, refresh, RE-SAUVEGARDE
========================================================= */
export async function getAccessTokenFromConfig(config: any): Promise<{
  accessToken?: string;
  userId?: string;
  userEmail?: string;
}> {
  if (!config?.refresh_token_encrypted) return {};

  const refreshToken = await decryptToken(config.refresh_token_encrypted);
  if (!refreshToken) return {};

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

  if (error || !data.session) {
    console.error('Failed to refresh Telegram session:', error);
    // Marquer la config comme nécessitant une reconnexion
    await supabaseAdmin
      .from('telegram_configs')
      .update({ is_active: false })
      .eq('chat_id', config.chat_id);
    return {};
  }

  // Re-chiffrer et sauvegarder le NOUVEAU refresh_token
  const newRefreshToken = data.session.refresh_token;
  if (newRefreshToken) {
    const newEncrypted = await encryptToken(newRefreshToken);
    if (newEncrypted) {
      await supabaseAdmin
        .from('telegram_configs')
        .update({ refresh_token_encrypted: newEncrypted })
        .eq('chat_id', config.chat_id);
    }
  }

  return {
    accessToken: data.session.access_token,
    userId: data.session.user.id,
    userEmail: data.session.user.email ?? undefined,
  };
}