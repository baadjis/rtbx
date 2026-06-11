// app/api/v1/agents/event/route.ts
import { createPublicAgentHandler } from '@/app/mcp/server/create-public-handler';
import { runEventAgent } from '@/app/mcp/agents/event-agent';
export const POST = createPublicAgentHandler(runEventAgent);