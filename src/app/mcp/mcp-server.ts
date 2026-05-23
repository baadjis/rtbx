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
    const { messages, temperature, maxSteps } = await request.json();

    // Validation de base
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Messages array is required and cannot be empty'
      }, { status: 400 });
    }

    // Exécution de l'agent
    const result = await runMCPAgent(messages, {
      temperature: temperature || mcpConfig.temperature,
      maxSteps: maxSteps || mcpConfig.maxSteps,
    });

    return NextResponse.json({
      success: result.success,
      text: result.text,
      steps: result.steps,
      toolCalls: result.toolCalls,
      usage: result.usage,
      ...(result.error && { error: result.error }),
    });

  } catch (error: any) {
    console.error('MCP Server Error:', error);

    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
      text: "Sorry, an internal error occurred. Please try again later."
    }, { status: 500 });
  }
}