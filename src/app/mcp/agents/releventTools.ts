/* eslint-disable @typescript-eslint/no-explicit-any */
export const getAgentRelevantTools = (
  allTools: any,
  writeKeywords: RegExp,
  readKeywords: RegExp,
  writeTools: string[],
  readOnlyTools: string[],
  lastMessage: string,
  defaultTools?: string[] // ← nouveau, optionnel
) => {
  const lowerMessage = lastMessage.toLowerCase().trim();

  if (readKeywords.test(lowerMessage)) {
    console.log('🔧 READ mode → READ tools');
    return Object.fromEntries(
      Object.entries(allTools).filter(([key]) => readOnlyTools.includes(key))
    );
  }

  if (writeKeywords.test(lowerMessage)) {
    console.log('🔧 WRITE mode → ALL tools');
    return allTools;
  }

  // DEFAULT — si defaultTools défini, filtrer, sinon tous
  if (defaultTools?.length) {
    console.log('🔧 DEFAULT mode → defaultTools');
    return Object.fromEntries(
      Object.entries(allTools).filter(([key]) => defaultTools.includes(key))
    );
  }

  console.log('🔧 DEFAULT mode → Tous les tools');
  return allTools;
};