/* eslint-disable @typescript-eslint/no-explicit-any */
export const getAgentRelevantTools = (
  allTools: any,
  writeKeywords: RegExp,
  readKeywords: RegExp,
  writeTools: string[],
  readOnlyTools: string[],
  lastMessage: string
) => {
  const lowerMessage = lastMessage.toLowerCase().trim();

  if (writeKeywords.test(lowerMessage)) {
    console.log('🔧 WRITE mode → WRITE tools');
    return Object.fromEntries(
      Object.entries(allTools).filter(([key]) => writeTools.includes(key))
    );
  }

  if (readKeywords.test(lowerMessage)) {
    console.log('🔧 READ mode → READ tools');
    return Object.fromEntries(
      Object.entries(allTools).filter(([key]) => readOnlyTools.includes(key))
    );
  }

  console.log('🔧 DEFAULT mode → Tous les tools');
  return allTools;
};