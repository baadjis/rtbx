// app/api/agents/business/route.ts
import { createAgentHandler } from '@/app/mcp/server/create-agent-handler';
import { runBusinessAgent } from '@/app/mcp/agents/business-agent';
export const POST = createAgentHandler(runBusinessAgent);