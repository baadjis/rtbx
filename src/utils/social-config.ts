export const SOCIAL_CONFIG: Record<string, { folder?: string, baseUrl: string, ph: string }> = {
  "Instagram": { folder: "instagram", baseUrl: "https://instagram.com/", ph: "Ex: mon_pseudo" },
  "TikTok": { folder: "tiktok", baseUrl: "https://tiktok.com/@", ph: "Ex: mon_pseudo" },
  "WhatsApp": { folder: "whatsapp", baseUrl: "https://whatsapp.com/channel/", ph: "ID de la chaîne" },
  "YouTube": { folder: "youtube", baseUrl: "https://youtube.com/@", ph: "Ex: ma_chaine" },
  "LinkedIn": { folder: "linkedin", baseUrl: "https://linkedin.com/in/", ph: "Lien profil ou ID" },
  "X (Twitter)": { folder: "x", baseUrl: "https://x.com/", ph: "Ex: mon_pseudo" },
  "Facebook": { folder: "facebook", baseUrl: "https://facebook.com/", ph: "Lien profil ou ID" },
  "Threads": { folder: "threads", baseUrl: "https://threads.net/@", ph: "Ex: mon_pseudo" },
  "Pinterest": { folder: "pinterest", baseUrl: "https://pinterest.com/", ph: "Ex: mon_pseudo" },
  "Twitch": { folder: "twitch", baseUrl: "https://twitch.tv/", ph: "Ex: mon_pseudo" },
  "Spotify": { folder: "spotify", baseUrl: "https://open.spotify.com/user/", ph: "ID utilisateur" },
  "Website": { baseUrl: "", ph: "https://mon-site.com" } // Pas de préfixe
};

export const formatSocialUrl = (network: string, handle: string) => {
  const config = SOCIAL_CONFIG[network];
  if (!config) return handle;
  
  const val = handle.trim();
  if (!val) return "";

  // Si l'utilisateur a déjà mis l'URL complète (commence par http), on la garde telle quelle
  if (val.startsWith('http')) return val;
  
  // On nettoie le @ uniquement ici pour la construction de l'URL
  const cleanHandle = val.replace('@', '');
  
  return `${config.baseUrl}${cleanHandle}`;
};