// app/api/v1/agents/shortener/route.ts
import { createPublicAgentHandler } from '@/app/mcp/server/create-public-handler';
import { runShortenerAgent } from '@/app/mcp/agents/shortener-agent';
export const POST = createPublicAgentHandler(runShortenerAgent);