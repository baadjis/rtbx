// app/api/agents/space/route.ts
import { createAgentHandler } from '@/app/mcp/server/create-agent-handler';
import { runSpaceAgent } from '@/app/mcp/agents/space-agent';
export const POST = createAgentHandler(runSpaceAgent);