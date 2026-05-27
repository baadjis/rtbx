/* eslint-disable @typescript-eslint/no-explicit-any */
// app/mcp/server/route.ts
import { NextResponse } from 'next/server';
import { runMCPAgent } from '../agents/main-agent';
import {mcpConfig} from '../core/config';

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
      maxSteps: body.maxSteps || mcpConfig.maxSteps,
    });

    if (!result.success) {
      throw result.error;
    }

    return NextResponse.json({
      success: true,
      text: result.text,
    });

  } catch (error: any) {
    console.error('MCP Server Error:', error);

    const errorStr = JSON.stringify(error).toLowerCase();

    if (
      errorStr.includes('rate limit') ||
      errorStr.includes('429') ||
      errorStr.includes('tokens per day') ||
      errorStr.includes('rate_limit_exceeded')
    ) {
      return NextResponse.json({
        success: false,
        error: 'rate_limit',
        text: lang === 'fr'
          ? "⏳ Nous avons atteint la limite de tokens quotidienne .\n\nVeuillez réessayer demain."
          : "⏳ We have reached daily limit of tokens.\n\nPlease try again tomorrow."
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