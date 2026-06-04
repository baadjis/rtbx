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


export const mcpConfig = {
  temperature: 0.3,
  maxTokens: 1500, // gardé comme ça, c'est juste le nom de la prop generateText qui change
  maxSteps: 3,
  maxMessages: 20,
  rateLimit: {
    maxRequestsPerMinute: 20,
    maxRequestsPerHour: 200,
  },
  logging: {
    enabled: true,
    logTools: true,
  },
} as const;