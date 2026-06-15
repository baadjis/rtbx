/* eslint-disable @typescript-eslint/no-explicit-any */
export const getAgentRelevantTools = (
  allTools: any,
  writeKeywords: RegExp,
  readKeywords: RegExp,
  writeTools: string[],
  readOnlyTools: string[],
  lastMessage: string,
  defaultTools?: string[],
  getDefaultTools?: (lastMessage: string) => string[],
) => {
  const lowerMessage = lastMessage.toLowerCase().trim();

  // WRITE détecté → tous les tools
  if (writeKeywords.test(lowerMessage)) {
    console.log('🔧 WRITE mode → ALL tools');
    return allTools;
  }

  // Calculer les tools READ à utiliser
  // getDefaultTools a priorité sur readOnlyTools (détection de domaine)
  const relevantReadTools = getDefaultTools
    ? getDefaultTools(lowerMessage)
    : readOnlyTools;

  // READ détecté → READ tools filtrés par domaine
  if (readKeywords.test(lowerMessage)) {
    console.log('🔧 READ mode → domain READ tools');
    return Object.fromEntries(
      Object.entries(allTools).filter(([key]) => relevantReadTools.includes(key))
    );
  }

  // DEFAULT → domain tools ou defaultTools
  const fallback = defaultTools ?? relevantReadTools;
  console.log('🔧 DEFAULT mode → fallback tools');
  return Object.fromEntries(
    Object.entries(allTools).filter(([key]) => fallback.includes(key))
  );
};