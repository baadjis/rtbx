export function getBrightness(color: string) {
  const c = color.replace("#", "");

  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);

  return (r * 299 + g * 587 + b * 114) / 1000;
}

export function getAdaptiveGradient(color: string) {
  const brightness = getBrightness(color);

  const opacity = brightness > 140 ? "22" : "55";

  return `linear-gradient(
    135deg,
    ${color}${opacity},
    transparent 50%,
    ${color}${opacity}
  )`;
}

export function getAdaptiveGlow(color: string) {
  const brightness = getBrightness(color);

  return brightness > 140
    ? `${color}33`
    : `${color}66`;
}