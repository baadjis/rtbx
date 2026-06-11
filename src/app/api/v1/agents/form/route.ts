// app/api/v1/agents/form/route.ts
import { createPublicAgentHandler } from '@/app/mcp/server/create-public-handler';
import { runFormAgent } from '@/app/mcp/agents/form-agent';
export const POST = createPublicAgentHandler(runFormAgent);