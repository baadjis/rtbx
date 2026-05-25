/* eslint-disable @typescript-eslint/no-explicit-any */
// app/mcp/mcp-server.ts
import { NextResponse } from 'next/server';
import { runMCPAgent } from '../agents/main-agent';
import mcpConfig from '../core/config';

/**
 * =========================================================
 * MCP SERVER ENDPOINT
 * =========================================================
 */

export async function POST(request: Request) {
 const { messages, lang , temperature, maxSteps } = await request.json();

  try {

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({
        success: false,
        error: 'Messages array is required'
      }, { status: 400 });
    }

    const result = await runMCPAgent(messages, {
      temperature: temperature || mcpConfig.temperature,
      maxSteps: maxSteps || 12,
    });

    return NextResponse.json({
      success: result.success,
      text: result.text,
      ...(result.error && { error: result.error })
    });

  } catch (error: any) {
    console.error('MCP Server Error:', error);

    const errorMessage = error.message?.toLowerCase() || '';

    // === RATE LIMIT DETECTION (Groq & autres) ===
    if (
      errorMessage.includes('rate limit') ||
      errorMessage.includes('429') ||
      errorMessage.includes('tokens per day') ||
      errorMessage.includes('rate_limit_exceeded')
    ) {
      return NextResponse.json({
        success: false,
        error: 'rate_limit',
        text: lang === 'fr'
          ? "⏳ Nous avons atteint la limite quotidienne de Groq.\n\nVeuillez réessayer demain ou contacter le support pour augmenter la limite."
          : "⏳ We have reached Groq's daily limit.\n\nPlease try again tomorrow or contact support to increase the limit."
      }, { status: 429 });
    }

    // Autres erreurs
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      text: lang === 'fr'
        ? "Désolé, une erreur interne est survenue. Réessaie plus tard."
        : "Sorry, an internal error occurred. Please try again later."
    }, { status: 500 });
  }
}