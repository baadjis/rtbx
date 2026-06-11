// app/api/v1/agents/space/route.ts
import { createPublicAgentHandler } from '@/app/mcp/server/create-public-handler';
import { runSpaceAgent } from '@/app/mcp/agents/space-agent';
export const POST = createPublicAgentHandler(runSpaceAgent);