/* eslint-disable @typescript-eslint/no-explicit-any */
/*export const getAgentRelevantTools = (
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
      Object.entries(allTools).filter(([key]) => (defaultTools||readOnlyTools).includes(key))
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
};*/



// app/mcp/agents/releventTools.ts
import { classifier } from '../classifier';

export const getAgentRelevantTools = (
  allTools: any,
  writeKeywords: RegExp,
  readKeywords: RegExp,
  writeTools: string[],
  readOnlyTools: string[],
  lastMessage: string,
  defaultTools?: string[],
  agentName?: string, // ← nouveau
) => {
  // Si on a un agentName → utiliser le classifier
  if (agentName) {
    const result = classifier.predict(lastMessage, agentName);
    console.log(`🧠 Classifier [${agentName}]: ${result.intent} (${result.confidence}) → ${result.tools}`);

    if (result.confidence >= 0.65 && result.tools.length > 0) {
      // Confidence suffisante → filtrer allTools avec les tools du classifier
      const filtered = Object.fromEntries(
        Object.entries(allTools).filter(([key]) => result.tools.includes(key))
      );
      // Si aucun tool trouvé (tool pas encore implémenté) → fallback
      if (Object.keys(filtered).length > 0) return filtered;
    }

    // Confidence faible → fallback sur defaultTools ou readOnlyTools
    console.log(`⚠️ Classifier confidence faible (${result.confidence}) → fallback`);
  }

  // Fallback regex (comportement original)
  const lowerMessage = lastMessage.toLowerCase().trim();

  if (readKeywords.test(lowerMessage)) {
    return Object.fromEntries(
      Object.entries(allTools).filter(([key]) =>
        (defaultTools || readOnlyTools).includes(key)
      )
    );
  }

  if (writeKeywords.test(lowerMessage)) {
    return allTools;
  }

  if (defaultTools?.length) {
    return Object.fromEntries(
      Object.entries(allTools).filter(([key]) => defaultTools.includes(key))
    );
  }

  return allTools;
};