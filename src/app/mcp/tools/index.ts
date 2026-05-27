// app/mcp/tools/index.ts
import * as businessTools from './businesses';
import * as spaceTools from './spaces';
import * as shortenerTools from './shortener';
import * as eventTools from './events'

export const tools = {
  ...businessTools,
  ...spaceTools,
  ...shortenerTools,
  ...eventTools
};

export const allTools = Object.values(tools);