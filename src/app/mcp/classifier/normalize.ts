const NEGATIONS = new Set([
  'ne', 'pas', 'non', 'jamais', 'plus', 'aucun', 'aucune',
  'not', "don't", "doesn't", 'no', 'never', 'without', 'sans',
]);

export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // supprime accents
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')        // ponctuation → espace
    .replace(/\s+/g, ' ')            // espaces multiples → un seul
    .trim();
}

export function wordMatch(keyword: string, text: string): boolean {
  const k = normalize(keyword);
  const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`).test(text);
}

export function hasNegation(text: string, keyword: string): boolean {
  const words = text.split(' ');
  const kNorm = normalize(keyword);
  for (let i = 0; i < words.length; i++) {
    if (words[i] === kNorm || words[i].startsWith(kNorm)) {
      const window = words.slice(Math.max(0, i - 3), i);
      if (window.some(w => NEGATIONS.has(w))) return true;
    }
  }
  return false;
}