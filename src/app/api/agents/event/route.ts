import { createAgentHandler } from '@/app/mcp/server/create-agent-handler';
import { runEventAgent } from '@/app/mcp/agents/event-agent';
export const POST = createAgentHandler(runEventAgent);