/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/telegram/service.ts
import { createClient as createAdminClient } from '@supabase/supabase-js';

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

/* =========================================================
   SEND MESSAGE
========================================================= */
export async function sendTelegramMessage(chatId: string, text: string) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
    }),
  });
}

/* =========================================================
   GET TELEGRAM CONFIG BY CHAT ID
========================================================= */
export async function getTelegramConfig(chatId: string) {
  const { data, error } = await supabaseAdmin
    .from('telegram_configs')
    .select('*, api_keys(*)')
    .eq('chat_id', chatId)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return data;
}

/* =========================================================
   SAVE CHAT HISTORY IN MEMORY (per chat_id)
   On utilise la table telegram_configs pour stocker
   un historique court des derniers messages
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
  // Garder seulement les 10 derniers messages
  const trimmed = history.slice(-10);
  await supabaseAdmin
    .from('telegram_configs')
    .update({ history: trimmed })
    .eq('chat_id', chatId);
}

/* =========================================================
   CREATE TELEGRAM CONFIG
========================================================= */
export async function createTelegramConfig(payload: {
  user_id: string;
  chat_id: string;
  agent_type?: string;
  context_id?: string;
  api_key_id?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('telegram_configs')
    .upsert([{
      user_id: payload.user_id,
      chat_id: payload.chat_id,
      agent_type: payload.agent_type || 'general',
      context_id: payload.context_id || null,
      api_key_id: payload.api_key_id || null,
      is_active: true,
    }], { onConflict: 'chat_id' })
    .select()
    .single();

  if (error) return { data: null, error };
  return { data, error: null };
}