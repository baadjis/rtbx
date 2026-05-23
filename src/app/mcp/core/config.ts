// app/mcp/core/config.ts
/**
 * =========================================================
 * MCP CONFIGURATION
 * =========================================================
 *
 * Configuration centrale du MCP (Multi-Capability Agent)
 * Centralise tous les paramètres du LLM et du comportement de l'agent.
 *
 * Utilisé par :
 * - main-agent.ts
 * - mcp-server.ts
 * =========================================================
 */

// app/mcp/core/config.ts

// app/mcp/core/config.ts
export const mcpConfig = {
  temperature: 0.7,
  maxTokens: 8000,
  maxSteps: 12,
  maxMessages: 30,

  rateLimit: {
    maxRequestsPerMinute: 20,
    maxRequestsPerHour: 200,
  },

  logging: {
    enabled: true,
    logTools: true,
  },
} as const;

export default mcpConfig;