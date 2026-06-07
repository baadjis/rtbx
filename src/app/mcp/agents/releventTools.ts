/* eslint-disable @typescript-eslint/no-explicit-any */
export const getAgentRelevantTools = (allTools: any, WRITE_KEYWORDS:any,READ_KEYWORDS:any,WRITE_TOOLS:string[],READ_ONLY_TOOLS:string[], lastMessage: string) => {
  const lowerMessage = lastMessage.toLowerCase().trim();

  if (WRITE_KEYWORDS.test(lowerMessage)) {
    console.log('🔧 WRITE mode → WRITE tools');
    return Object.fromEntries(
      Object.entries(allTools).filter(([key]) => WRITE_TOOLS.includes(key))
    );
  }
  if (READ_KEYWORDS.test(lowerMessage)) {
    console.log('🔧 READ mode → READ tools');
    return Object.fromEntries(
      Object.entries(allTools).filter(([key]) => READ_ONLY_TOOLS.includes(key))
    );
  }
  console.log('🔧 DEFAULT mode → Tous les tools');
  return allTools;
};
