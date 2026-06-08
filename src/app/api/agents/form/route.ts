
// app/api/agents/form/route.ts
import { createAgentHandler } from '@/app/mcp/server/create-agent-handler';
import { runFormAgent } from '@/app/mcp/agents/form-agent';
export const POST = createAgentHandler(runFormAgent);