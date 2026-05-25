/* eslint-disable @typescript-eslint/no-explicit-any */
// app/mcp/mcp-server.ts
import { NextResponse } from 'next/server';
import { runMCPAgent } from '../agents/main-agent';
import mcpConfig from '../core/config';

export async function POST(request: Request) {
  const { messages, lang = 'fr', temperature, maxSteps } = await request.json();

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({
      success: false,
      error: 'Messages array is required'
    }, { status: 400 });
  }

  let attempts = 0;
  const maxAttempts = 2;

  while (attempts < maxAttempts) {
    try {
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
      attempts++;
      const errorMsg = error.message?.toLowerCase() || '';

      // Rate Limit détecté
      if (errorMsg.includes('rate limit') || errorMsg.includes('429') || errorMsg.includes('too many')) {
        if (attempts < maxAttempts) {
          // Attente avant retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1500 * attempts));
          continue;
        }

        // Après 2 tentatives échouées
        return NextResponse.json({
          success: false,
          error: 'rate_limit',
          text: lang === 'fr' 
            ? "⏳ Nous avons atteint la limite de requêtes pour le moment.\n\nVeuillez attendre 10 secondes avant de réessayer."
            : "⏳ We have reached the request limit for now.\n\nPlease wait 10 seconds before trying again."
        }, { status: 429 });
      }

      // Autre erreur
      if (attempts >= maxAttempts) {
        return NextResponse.json({
          success: false,
          error: 'Internal server error',
          text: lang === 'fr' 
            ? "Désolé, une erreur interne est survenue. Réessaie plus tard."
            : "Sorry, an internal error occurred. Please try again later."
        }, { status: 500 });
      }
    }
  }
}