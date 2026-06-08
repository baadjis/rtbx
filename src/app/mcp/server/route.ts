// app/mcp/server/route.ts
import { createAgentHandler } from '@/app/mcp/server/create-agent-handler';
import { runMainAgent } from '@/app/mcp/agents/main-agent';
export const POST = createAgentHandler(runMainAgent);