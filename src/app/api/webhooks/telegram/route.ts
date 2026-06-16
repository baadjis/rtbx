/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * =========================================================
 * POST /api/webhooks/telegram
 * =========================================================
 *
 * Telegram webhook — reçoit les messages et répond via l'agent.
 *
 * Responsibilities:
 * - valide le secret token Telegram
 * - identifie le chat et charge sa config
 * - charge l'historique de conversation
 * - route vers le bon agent
 * - répond via Telegram API
 * - sauvegarde l'historique
 *
 * =========================================================
 */
import { NextResponse } from 'next/server';
import {
  sendTelegramMessage,
  getTelegramConfig,
  getTelegramHistory,
  saveTelegramHistory,
  getAccessTokenFromConfig,
} from '@/lib/telegram/service';
import { runEventAgent } from '@/app/mcp/agents/event-agent';
import { runShortenerAgent } from '@/app/mcp/agents/shortener-agent';
import { runSpaceAgent } from '@/app/mcp/agents/space-agent';
import { runBusinessAgent } from '@/app/mcp/agents/business-agent';
import { runFormAgent } from '@/app/mcp/agents/form-agent';
import { runMainAgent } from '@/app/mcp/agents/main-agent';
import { LangType } from '@/lib/lang/types';
//import { getAccessTokenFromRefreshToken } from '@/lib/telegram/service';

// Router vers le bon agent
const AGENT_MAP: Record<string, any> = {
  event: runEventAgent,
  shortener: runShortenerAgent,
  space: runSpaceAgent,
  business: runBusinessAgent,
  form: runFormAgent,
  general: runMainAgent,
};
const sessionExpiredMsg = {
    fr: '⚠️ Votre session a expiré. Reconnectez votre compte sur rtbx.space/ai/settings/integrations.',
    en: '⚠️ Your session expired. Please reconnect your account at rtbx.space/ai/settings/integrations.',
  };

const  ERRMsg={
  fr:{
    rate_limit:'⏳ Limite de tokens atteinte. Veuillez réessayer dans quelques secondes.',
    session_expired:'🔐 Session expirée. Reconnectez votre compte sur rtbx.space/ai/settings/integrations'

},en:{

    rate_limit:'⏳ Token limit reached. Please try again in a few seconds.',
    session_expired:'🔐 Session expired. Please reconnect your account at rtbx.space/ai/settings/integrations'
}}

const MESSAGES = {
      fr: {
        start: '👋 Bonjour ! Je suis RTBX AI.\n\nCe chat n\'est pas encore configuré. Connectez-vous sur rtbx.space pour configurer votre assistant.',
        help: '📚 *Commandes disponibles*\n\n/start — Démarrer\n/help — Aide\n/status — Statut de la configuration\n\nPosez vos questions directement !',
        status_ok: (agentType: string, contextId?: string) =>
          `✅ *Configuré*\nAgent: ${agentType}\n${contextId ? `Contexte: ${contextId}` : ''}`,
        status_none: '❌ Ce chat n\'est pas configuré. Rendez-vous sur rtbx.space/ai/settings/integrations',
        error: '❌ Une erreur est survenue. Veuillez réessayer.',
      },
      en: {
        start: '👋 Hello! I\'m RTBX AI.\n\nThis chat is not configured yet. Log in to rtbx.space to configure your assistant.',
        help: '📚 *Available commands*\n\n/start — Start\n/help — Help\n/status — Configuration status\n\nAsk your questions directly!',
        status_ok: (agentType: string, contextId?: string) =>
          `✅ *Configured*\nAgent: ${agentType}\n${contextId ? `Context: ${contextId}` : ''}`,
        status_none: '❌ This chat is not configured. Go to rtbx.space/ai/settings/integrations',
        error: '❌ An error occurred. Please try again.',
      },
    };

// app/api/webhooks/telegram/route.ts — extrait modifié

export async function POST(request: Request) {
  try {
    const secretToken = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
    if (secretToken !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const body = await request.json();
    const message = body?.message;

    if (!message?.text) return NextResponse.json({ ok: true });

    const chatId = String(message.chat.id);
    const userText = message.text;

    // Détection de la langue depuis Telegram
    const userLang: LangType = message.from?.language_code || 'en';

    

    const t = MESSAGES[userLang];

    if (userText === '/start') {
      await sendTelegramMessage(chatId, t.start);
      return NextResponse.json({ ok: true });
    }

    if (userText === '/help') {
      await sendTelegramMessage(chatId, t.help);
      return NextResponse.json({ ok: true });
    }

    if (userText === '/status') {
      const config = await getTelegramConfig(chatId);
      if (config) {
        await sendTelegramMessage(chatId, t.status_ok(config.agent_type, config.context_id));
      } else {
        await sendTelegramMessage(chatId, t.status_none);
      }
      return NextResponse.json({ ok: true });
    }

//const chatId = String(message.chat.id);
console.log('webhook chatId:', chatId);
console.log('webhook chatId type:', typeof chatId);
const config = await getTelegramConfig(chatId);
const agentType = config?.agent_type || 'general';
const agentRunner = AGENT_MAP[agentType] || runMainAgent;

const { accessToken, userId, userEmail } = await getAccessTokenFromConfig(config);
if (config?.refresh_token_encrypted && !accessToken) {
  
  await sendTelegramMessage(chatId, sessionExpiredMsg[userLang]);
  return NextResponse.json({ ok: true });
}


    const history = await getTelegramHistory(chatId);
    const newHistory = [...history, { role: 'user', content: userText }];

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendChatAction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
    });

    const result = await agentRunner(newHistory, {
  mode: 'text',
  contextId: config?.context_id || undefined,
  lang: userLang,
  accessToken, // ← nouveau
  userId,      // ← nouveau
   userEmail,
});

    //const responseText = result.success ? result.text : t.error;

    let responseText: string;

if (result.success) {
  responseText = result.text;
} else {
  const errorStr = JSON.stringify(result.error).toLowerCase();

  if (errorStr.includes('rate limit') || errorStr.includes('429') || errorStr.includes('rate_limit_exceeded')) {
    responseText = ERRMsg[userLang].rate_limit
  } else if (!accessToken) {
    responseText = ERRMsg[userLang].session_expired
  } else {
    responseText = t.error;
  }
}


    await sendTelegramMessage(chatId, responseText);
    await saveTelegramHistory(chatId, [...newHistory, { role: 'assistant', content: responseText }]);

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error('Telegram Webhook Error:', err);
    return NextResponse.json({ ok: true });
  }
}