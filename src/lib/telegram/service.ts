/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/telegram/service.ts

// lib/telegram/service.ts
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ENCRYPTION_KEY = Buffer.from(process.env.TELEGRAM_TOKEN_ENCRYPTION_KEY!, 'hex'); // 32 bytes hex
const ALGORITHM =  'aes-256-gcm';
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

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

function getEncryptionKey(): Buffer {
  const key = process.env.TELEGRAM_TOKEN_ENCRYPTION_KEY;
  if (!key) throw new Error('TELEGRAM_TOKEN_ENCRYPTION_KEY is not set');
  return Buffer.from(key, 'hex');
}

function encryptToken(token: string): string {
  const ENCRYPTION_KEY = getEncryptionKey(); // ← ici
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

function decryptToken(encryptedBase64: string): string | null {
  try {
    const ENCRYPTION_KEY = getEncryptionKey(); // ← ici
    const buffer = Buffer.from(encryptedBase64, 'base64');
    const iv = buffer.subarray(0, 12);
    const authTag = buffer.subarray(12, 28);
    const encrypted = buffer.subarray(28);
    const decipher = createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
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
    encryptedToken = await encryptToken(payload.refresh_token as string);
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
  const newRefreshToken = data.session.refresh_token as string;
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