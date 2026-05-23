/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/mcp/server/route.ts
import { NextResponse } from 'next/server';
import { runMCPAgent } from '@/app/mcp/agents/main-agent';
import mcpConfig from '@/app/mcp/core/config';

/**
 * =========================================================
 * MCP SERVER ENDPOINT
 * =========================================================
 * Route: POST /api/mcp/server
 * =========================================================
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();

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
    console.log('MCP Server Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
      text: "Désolé, une erreur interne est survenue. Réessaie plus tard."
    }, { status: 500 });
  }
}