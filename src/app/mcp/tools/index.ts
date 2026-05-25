// app/mcp/tools/index.ts
import * as businessTools from './businesses';
import * as spaceTools from './spaces';
import * as shortenerTools from './shortener';

export const tools = {
  ...businessTools,
  ...spaceTools,
  ...shortenerTools,
};

export const allTools = Object.values(tools);