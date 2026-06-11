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
} from '@/lib/telegram/service';
import { runEventAgent } from '@/app/mcp/agents/event-agent';
import { runShortenerAgent } from '@/app/mcp/agents/shortener-agent';
import { runSpaceAgent } from '@/app/mcp/agents/space-agent';
import { runBusinessAgent } from '@/app/mcp/agents/business-agent';
import { runFormAgent } from '@/app/mcp/agents/form-agent';
import { runMainAgent } from '@/app/mcp/agents/main-agent';

// Router vers le bon agent
const AGENT_MAP: Record<string, any> = {
  event: runEventAgent,
  shortener: runShortenerAgent,
  space: runSpaceAgent,
  business: runBusinessAgent,
  form: runFormAgent,
  general: runMainAgent,
};

export async function POST(request: Request) {
  try {
    // Vérifier le secret Telegram
    const secretToken = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
    if (secretToken !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const body = await request.json();
    const message = body?.message;

    // Ignorer si pas de message texte
    if (!message?.text) return NextResponse.json({ ok: true });

    const chatId = String(message.chat.id);
    const userText = message.text;

    // Commandes spéciales
    if (userText === '/start') {
      await sendTelegramMessage(chatId,
        '👋 Bonjour ! Je suis RTBX AI.\n\nCe chat n\'est pas encore configuré. Connectez-vous sur rtbx.space pour configurer votre assistant.'
      );
      return NextResponse.json({ ok: true });
    }

    if (userText === '/help') {
      await sendTelegramMessage(chatId,
        '📚 *Commandes disponibles*\n\n/start — Démarrer\n/help — Aide\n/status — Statut de la configuration\n\nPosez vos questions directement !'
      );
      return NextResponse.json({ ok: true });
    }

    if (userText === '/status') {
      const config = await getTelegramConfig(chatId);
      if (config) {
        await sendTelegramMessage(chatId,
          `✅ *Configuré*\nAgent: ${config.agent_type}\n${config.context_id ? `Contexte: ${config.context_id}` : ''}`
        );
      } else {
        await sendTelegramMessage(chatId,
          '❌ Ce chat n\'est pas configuré. Rendez-vous sur rtbx.space/dashboard/integrations'
        );
      }
      return NextResponse.json({ ok: true });
    }

    // Charger la config du chat
    const config = await getTelegramConfig(chatId);

    // Si pas de config → agent général sans auth
    const agentType = config?.agent_type || 'general';
    const agentRunner = AGENT_MAP[agentType] || runMainAgent;

    // Charger l'historique
    const history = await getTelegramHistory(chatId);

    // Ajouter le message user à l'historique
    const newHistory = [
      ...history,
      { role: 'user', content: userText },
    ];

    // Indiquer que le bot écrit
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendChatAction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
    });

    // Appeler l'agent
    const result = await agentRunner(newHistory, {
      mode: 'text',
      contextId: config?.context_id || undefined,
      // Pas d'accessToken — Telegram utilise les API keys publiques
    });

    const responseText = result.success
      ? result.text
      : '❌ Une erreur est survenue. Veuillez réessayer.';

    // Envoyer la réponse
    await sendTelegramMessage(chatId, responseText);

    // Sauvegarder l'historique avec la réponse
    await saveTelegramHistory(chatId, [
      ...newHistory,
      { role: 'assistant', content: responseText },
    ]);

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error('Telegram Webhook Error:', err);
    return NextResponse.json({ ok: true }); // Toujours 200 pour Telegram
  }
}