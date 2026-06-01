/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { runMCPAgent } from '../agents/main-agent';
import { mcpConfig } from '../core/config';
import { createClient } from '@/utils/supabase/server';
import { LangType } from '@/lib/lang/types';
const Data={
  fr:{
    connect_hint:"Veuillez vous connecter pour utiliser l'assistant.",
    error_try_later:"Désolé, une erreur interne est survenue. Réessaie plus tard.",
  },
  en:{
    connect_hint:"Please log in to use the assistant.",
    error_try_later:"Sorry, an internal error occurred. Please try again later.",

  }
}

export async function POST(request: Request) {
  let lang = 'fr';
  let t= Data[lang as LangType]
  try {
    const body = await request.json();
    lang = body.lang || 'fr';
    t= Data[lang as LangType]

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json({
        success: false,
        error: 'Messages array is required'
      }, { status: 400 });
    }

    // Récupérer le token de session pour les tools internes
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
  return NextResponse.json({
    success: false,
    text: t.connect_hint
  }, { status: 401 });
}
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    

    const result = await runMCPAgent(body.messages, {
      temperature: body.temperature || mcpConfig.temperature,
      maxSteps: body.maxSteps || mcpConfig.maxSteps,
      accessToken, // ← injecté
      userId: user?.id,
      userEmail:user.email
    });

    if (!result.success) throw result.error;
   // Extraire tous les toolNames depuis les steps
const toolNames = result.steps
  ?.flatMap(step => step.toolCalls ?? [])
  .map(tc => tc.toolName) ?? [];

return NextResponse.json({
  success: true,
  text: result.text,
  toolCalls: toolNames, // ← ["getUserShortLinks"]
});

  } catch (error: any) {
    console.error('MCP Server Error:', error);
    const errorStr = JSON.stringify(error).toLowerCase();

    if (
      errorStr.includes('rate limit') ||
      errorStr.includes('429') ||
      errorStr.includes('tokens per day') ||
      errorStr.includes('tokens per minute') ||
      errorStr.includes('rate_limit_exceeded')
    ) {
      return NextResponse.json({
        success: false,
        error: 'rate_limit',
        text: t.connect_hint
      }, { status: 429 });
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      text: t.error_try_later
    }, { status: 500 });
  }
}