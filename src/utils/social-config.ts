export const SOCIAL_CONFIG: Record<string, { folder?: string, baseUrl: string, pattern: string }> = {
  "Instagram": { folder: "instagram", baseUrl: "https://instagram.com/", pattern: "username" },
  "TikTok": { folder: "tiktok", baseUrl: "https://tiktok.com/@", pattern: "username" },
  "WhatsApp": { folder: "whatsapp", baseUrl: "https://whatsapp.com/channel/", pattern: "channel_id" },
  "YouTube": { folder: "youtube", baseUrl: "https://youtube.com/@", pattern: "channel_handle" },
  "LinkedIn": { folder: "linkedin", baseUrl: "https://linkedin.com/in/", pattern: "profile_id" },
  "X (Twitter)": { folder: "x", baseUrl: "https://x.com/", pattern: "username" },
  "Facebook": { folder: "facebook", baseUrl: "https://facebook.com/", pattern: "profile_id" },
  "Threads": { folder: "threads", baseUrl: "https://threads.net/@", pattern: "username" },
  "Pinterest": { folder: "pinterest", baseUrl: "https://pinterest.com/", pattern: "username" },
  "Twitch": { folder: "twitch", baseUrl: "https://twitch.tv/", pattern: "username" },
  "Spotify": { folder: "spotify", baseUrl: "https://open.spotify.com/user/", pattern: "user_id" },
  "Website": { baseUrl: "", pattern: "full_url" } // Pas de folder ici
};

export const formatSocialUrl = (network: string, handle: string) => {
  const config = SOCIAL_CONFIG[network];
  if (!config) return handle;
  
  const val = handle.trim();
  if (!val) return "";

  // 1. Si l'utilisateur a déjà mis l'URL complète, on la nettoie juste
  if (val.startsWith('http')) return val;
  
  // 2. Nettoyage du '@' si l'utilisateur l'a mis par habitude
  const cleanHandle = val.replace('@', '');
  
  // 3. Construction propre selon la base du réseau
  return `${config.baseUrl}${cleanHandle}`;
};