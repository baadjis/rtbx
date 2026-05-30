/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { runMCPAgent } from '../agents/main-agent';
import { mcpConfig } from '../core/config';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  let lang = 'fr';
  try {
    const body = await request.json();
    lang = body.lang || 'fr';

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
    text: lang === 'fr' 
      ? "Veuillez vous connecter pour utiliser l'assistant."
      : "Please log in to use the assistant.",
  }, { status: 401 });
}
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    

    const result = await runMCPAgent(body.messages, {
      temperature: body.temperature || mcpConfig.temperature,
      maxSteps: body.maxSteps || mcpConfig.maxSteps,
      accessToken, // ← injecté
      userId: user?.id,
    });

    if (!result.success) throw result.error;

    return NextResponse.json({ success: true, 
      text: result.text ,
      toolCalls: result.toolCalls?.map(tc => tc.toolName) ?? [],

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
        text: lang === 'fr'
          ? "⏳ Limite de tokens atteinte. Veuillez réessayer dans quelques secondes."
          : "⏳ Token limit reached. Please try again in a few seconds."
      }, { status: 429 });
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      text: lang === 'fr'
        ? "Désolé, une erreur interne est survenue. Réessaie plus tard."
        : "Sorry, an internal error occurred. Please try again later."
    }, { status: 500 });
  }
}