/* eslint-disable @typescript-eslint/no-explicit-any */
// app/mcp/server/route.ts
import { NextResponse } from 'next/server';
import { runMCPAgent } from '../agents/main-agent';
import mcpConfig from '../core/config';

/**
 * =========================================================
 * MCP SERVER ENDPOINT
 * =========================================================
 */

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

    const result = await runMCPAgent(body.messages, {
      temperature: body.temperature || mcpConfig.temperature,
      maxSteps: body.maxSteps || 12,
    });

    return NextResponse.json({
      success: result.success,
      text: result.text,
      ...(result.error && { error: result.error })
    });

  } catch (error: any) {
    console.error('MCP Server Error:', error);

    const errorStr = JSON.stringify(error).toLowerCase();

    // Détection améliorée du Rate Limit Groq
    if (
      errorStr.includes('rate limit') ||
      errorStr.includes('429') ||
      errorStr.includes('tokens per day') ||
      errorStr.includes('rate_limit_exceeded') ||
      errorStr.includes('ai_retryerror')
    ) {
      return NextResponse.json({
        success: false,
        error: 'rate_limit',
        text: lang === 'fr'
          ? "⏳ Nous avons atteint la limite quotidienne de Groq.\n\nVeuillez réessayer demain ou contacter le support pour augmenter la limite."
          : "⏳ We have reached Groq's daily limit.\n\nPlease try again tomorrow."
      }, { status: 429 });
    }

    // Erreur générique
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      text: lang === 'fr'
        ? "Désolé, une erreur interne est survenue. Réessaie plus tard."
        : "Sorry, an internal error occurred. Please try again later."
    }, { status: 500 });
  }
}