// app/api/v1/agents/business/route.ts
import { createPublicAgentHandler } from '@/app/mcp/server/create-public-handler';
import { runBusinessAgent } from '@/app/mcp/agents/business-agent';
export const POST = createPublicAgentHandler(runBusinessAgent);