/* eslint-disable @typescript-eslint/no-explicit-any */
/*export const getAgentRelevantTools = (
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
};*/


// Au lieu de tester WRITE puis READ séparément
// On teste d'abord si c'est clairement un READ
// Puis si c'est clairement un WRITE
// Sinon DEFAULT (tous les tools)

export const getAgentRelevantTools = (
  allTools: any,
  writeKeywords: RegExp,
  readKeywords: RegExp,
  writeTools: string[],
  readOnlyTools: string[],
  lastMessage: string
) => {
  const lowerMessage = lastMessage.toLowerCase().trim();

  // READ en priorité — si l'utilisateur demande à voir quelque chose
  if (readKeywords.test(lowerMessage)) {
    console.log('🔧 READ mode → READ tools');
    return Object.fromEntries(
      Object.entries(allTools).filter(([key]) => readOnlyTools.includes(key))
    );
  }

  // WRITE seulement si clairement une action
  if (writeKeywords.test(lowerMessage)) {
    console.log('🔧 WRITE mode → ALL tools');
    return allTools; // ← tous les tools, pas juste WRITE
  }

  console.log('🔧 DEFAULT mode → Tous les tools');
  return allTools;
};