// app/mcp/tools/index.ts

import * as businessTools from './businesses';
import * as spaceTools from './spaces';

export const tools = {
  ...businessTools,
  ...spaceTools,
};

// Export all tools as array (utile pour certains agents)
export const allTools = Object.values(tools);