// app/api/agents/shortener/route.ts
import { createAgentHandler } from '@/app/mcp/server/create-agent-handler';
import { runShortenerAgent } from '@/app/mcp/agents/shortener-agent';
export const POST = createAgentHandler(runShortenerAgent);