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
  defaultModel: 'claude-3-5-sonnet-20240620',
  fastModel: 'llama-3.1-70b-versatile',

  temperature: 0.7,
  maxTokens: 8000,

  // Limites de sécurité
  maxSteps: 12,                    // Nombre maximum d'actions par conversation
  maxMessages: 30,                 // Historique max gardé

  // Rate limiting (basique)
  rateLimit: {
    maxRequestsPerMinute: 20,
    maxRequestsPerHour: 200,
  },

  logging: {
    enabled: true,
    logTools: true,
  },
} as const;