/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-keys/service';
import { AgentOptions, Message } from '@/app/mcp/agents/run-agent';

type AgentRunner = (messages: Message[], options: AgentOptions) => Promise<any>;

export function createPublicAgentHandler(runAgent: AgentRunner) {
  return async function POST(request: Request) {
    try {
      // Valider l'API key
      const apiKey = request.headers.get('X-API-Key');
      if (!apiKey) {
        return NextResponse.json({ success: false, error: 'X-API-Key header required' }, { status: 401 });
      }

      const { valid, keyData, error: keyError } = await validateApiKey(apiKey);
      if (!valid) {
        return NextResponse.json({ success: false, error: keyError }, { status: 401 });
      }

      const body = await request.json();

      if (!body.messages || !Array.isArray(body.messages)) {
        return NextResponse.json({ success: false, error: 'Messages array is required' }, { status: 400 });
      }

      const result = await runAgent(body.messages, {
        mode: 'text', // ← toujours text pour les clients externes
        contextId: body.contextId || body.eventId,
        lang:body.lang||'en'
        // Pas d'accessToken — les clients externes n'ont pas de session Supabase
      });

      if (!result.success) throw result.error;

      return NextResponse.json({
        success: true,
        text: result.text,
        toolCalls: result.toolCalls,
        usage: result.usage,
        // ui toujours null en mode text
      });

    } catch (error: any) {
      console.error('Public Agent Error:', error);
      const errorStr = JSON.stringify(error).toLowerCase();

      if (errorStr.includes('rate limit') || errorStr.includes('429')) {
        return NextResponse.json({
          success: false,
          error: 'rate_limit',
          text: 'Token limit reached. Please try again later.',
        }, { status: 429 });
      }

      return NextResponse.json({
        success: false,
        error: 'Internal server error',
      }, { status: 500 });
    }
  };
}