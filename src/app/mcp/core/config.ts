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
  temperature: 0.7,
  maxTokens: 4000,  // ← réduit de 8000 à 4000
  maxSteps: 5,      // ← réduit de 12 à 5
  maxMessages: 20,  // ← réduit de 30 à 20
  rateLimit: {
    maxRequestsPerMinute: 20,
    maxRequestsPerHour: 200,
  },
  logging: {
    enabled: true,
    logTools: true,
  },
} as const;