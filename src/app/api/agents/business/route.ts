/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { runBusinessAgent } from '@/app/mcp/agents/business-agent';
import { mcpConfig } from '@/app/mcp/core/config';
import { createClient } from '@/utils/supabase/server';
import { LangType } from '@/lib/lang/types';

const Messages = {
  fr: {
    rate_limit: "⏳ Limite de tokens atteinte. Veuillez réessayer dans quelques secondes.",
    connect_hint: "Veuillez vous connecter pour utiliser l'assistant.",
    internal_error: "Désolé, une erreur interne est survenue.",
  },
  en: {
    rate_limit: "⏳ Token limit reached. Please try again in a few seconds.",
    connect_hint: "Please log in to use the assistant.",
    internal_error: "Sorry, an internal error occurred.",
  },
};

export async function POST(request: Request) {
  let lang: LangType = 'fr';
  try {
    const body = await request.json();
    lang = body.lang || 'fr';
    const t = Messages[lang];

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json({ success: false, error: 'Messages array is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: { session } } = await supabase.auth.getSession();

    if (!user) {
      return NextResponse.json({ success: false, text: t.connect_hint }, { status: 401 });
    }

    const result = await runBusinessAgent(body.messages, {
      temperature: body.temperature || mcpConfig.temperature,
      maxSteps: body.maxSteps || mcpConfig.maxSteps,
      accessToken: session?.access_token,
      userId: user.id,
      businessId: body.businessId, // ← optionnel depuis le dashboard business
      mode: body.mode || 'ui'
    });

    if (!result.success) throw result.error;

    return NextResponse.json({
      success: true,
      text: result.text,
      ui: result.ui,
      toolCalls: result.toolCalls,
    });

  } catch (error: any) {
    console.error('Business Agent Server Error:', error);
    const t = Messages[lang];
    const errorStr = JSON.stringify(error).toLowerCase();

    if (errorStr.includes('rate limit') || errorStr.includes('429') || errorStr.includes('rate_limit_exceeded')) {
      return NextResponse.json({ success: false, error: 'rate_limit', text: t.rate_limit }, { status: 429 });
    }

    return NextResponse.json({ success: false, error: 'Internal server error', text: t.internal_error }, { status: 500 });
  }
}