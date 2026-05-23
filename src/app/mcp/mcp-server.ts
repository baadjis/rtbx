/* eslint-disable @typescript-eslint/no-explicit-any */
// app/mcp/mcp-server.ts
import { NextResponse } from 'next/server';
import { runMCPAgent } from './agents/main-agent';
import {mcpConfig} from './core/config';

/**
 * =========================================================
 * MCP SERVER ENDPOINT
 * =========================================================
 *
 * Main API endpoint for the MCP Agent.
 * Allows the frontend or external tools to chat with the agent.
 *
 * POST /api/mcp/chat
 * =========================================================
 */


export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('MCP Request received:', { 
      messageCount: body.messages?.length,
      hasGroqKey: !!process.env.GROQ_API_KEY 
    });

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
    console.error('MCP Server Critical Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
      text: "Désolé, une erreur interne est survenue. Réessaie plus tard."
    }, { status: 500 });
  }
}