// app/mcp/agents/domain-detection.ts — nouveau fichier, séparé pour rester propre

export const DOMAIN_KEYWORDS: Record<string, RegExp> = {
  shortener: /raccourcir|shorten|short link|lien court|url courte|clics|clicks|stats|slug court/i,
  business: /business|entreprise|société|company|horaires|opening hours|fidélité|loyalty|provider|app link|lien app|lien provider/i,
  form: /formulaire|form|réponse|response|sondage|survey/i,
  space: /space|profil public|slug|instagram|tiktok|réseaux sociaux|social links/i,
  event: /événement|evenement|event|agenda|participant|badge|inscrire à|register for/i,
};

// Ordre du plus spécifique au plus générique — évite les faux positifs
const DOMAIN_ORDER = ['shortener', 'business', 'form', 'space', 'event'];

export function detectDomain(message: string): string | string[] | null {
  const matches = DOMAIN_ORDER.filter(domain => DOMAIN_KEYWORDS[domain].test(message));
  
  if (matches.length === 0) return null; // aucun domaine clair → fallback total
  if (matches.length === 1) return matches[0]; // cas clair
  return matches; // ambiguïté → retourner tous les domaines matchés, pas un seul choix risqué
}