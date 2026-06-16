/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/telegram/service.ts

// lib/telegram/service.ts
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

//const ENCRYPTION_KEY = Buffer.from(process.env.TELEGRAM_TOKEN_ENCRYPTION_KEY!, 'hex'); // 32 bytes hex
const ALGORITHM =  'aes-256-gcm';
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
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
  console.log("getTelegramConfig",chatId==chatId.trim())
  const { data, error } = await supabaseAdmin
    .from('telegram_configs')
    .select('*')
    .eq('chat_id', chatId.trim())
    .eq('is_active', true)
    .single();
  console.error(error)
  console.log("data",data)
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
    encryptedToken = encryptToken(payload.refresh_token as string);
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
// Mutex simple par chat_id
const refreshLocks = new Map<string, Promise<any>>();

export async function getAccessTokenFromConfig(config: any): Promise<{
  accessToken?: string;
  userId?: string;
  userEmail?: string;
}> {

  console.log('=== getAccessTokenFromConfig ===');
  console.log('chat_id:', config?.chat_id);
  console.log('has encrypted token:', !!config?.refresh_token_encrypted);
  if (!config?.refresh_token_encrypted) return {};

  // Si un refresh est déjà en cours pour ce chat_id, attendre
  const existingLock = refreshLocks.get(config.chat_id);
  if (existingLock) {
    await existingLock;
    // Recharger la config depuis DB après le refresh
    const freshConfig = await getTelegramConfig(config.chat_id);
    if (!freshConfig?.refresh_token_encrypted) return {};
    config = freshConfig;
  }

  // Créer un nouveau lock
  const refreshPromise = (async () => {
    const refreshToken =  decryptToken(config.refresh_token_encrypted);
    console.log('decrypted token:', refreshToken?.slice(0, 10) ?? 'NULL');
    if (!refreshToken) return {};

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });
    console.log('refresh error:', error?.message ?? 'none');
    console.log('new session:', !!data?.session);

    if (error || !data.session) {
      console.error('Failed to refresh Telegram session:', error);
      await supabaseAdmin
        .from('telegram_configs')
        .update({ is_active: false })
        .eq('chat_id', config.chat_id);
      return {};
    }

    // Sauvegarder le nouveau refresh_token
    const newEncrypted = encryptToken(data.session.refresh_token);
    await supabaseAdmin
      .from('telegram_configs')
      .update({ refresh_token_encrypted: newEncrypted })
      .eq('chat_id', config.chat_id);

    return {
      accessToken: data.session.access_token,
      userId: data.session.user.id,
      userEmail: data.session.user.email ?? undefined,
    };
  })();

  refreshLocks.set(config.chat_id, refreshPromise);

  try {
    const result = await refreshPromise;
    return result;
  } finally {
    refreshLocks.delete(config.chat_id);
  }
}
