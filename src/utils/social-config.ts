import { LangType } from "@/lib/lang/types";

const data = {
  fr: {
    pseudo: "Ex: mon_pseudo",
    profil_id: "Lien profil ou ID",
    channel: "Ex: ma chaine",
    channel_id: "ID de la chaîne",
    user_id: "ID utilisateur",
    my_website: "https://mon-site.com",

    follow: "suivre",
    visit: "visiter",
    visit_profile: "voir le profil",
    visit_subscribe: "voir et s’abonner",

    listen: "écouter",
    watch: "regarder"
  },
  en: {
    pseudo: "Ex: user_name",
    profil_id: "profil link or ID",
    channel: "Ex: my_channel",
    channel_id: "Channel ID",
    user_id: "User ID",
    my_website: "https://my-website.com",

    follow: "follow",
    visit: "visit",
    visit_profile: "view profile",
    visit_subscribe: "view & subscribe",

    listen: "listen",
    watch: "watch"
  }
}
 

 export function get_social_config(lang: LangType):Record<string, { folder?: string, baseUrl: string, ph: string ,action:string}> {
  const t = data[lang]

  return {
    "Instagram": { folder: "instagram", baseUrl: "https://instagram.com/", ph: t.pseudo, action: t.follow },

    "TikTok": { folder: "tiktok", baseUrl: "https://tiktok.com/@", ph: t.pseudo, action: t.follow },

    "WhatsApp": { folder: "whatsapp", baseUrl: "https://whatsapp.com/channel/", ph: t.channel_id, action: t.follow },

    "YouTube": { folder: "youtube", baseUrl: "https://youtube.com/@", ph: t.channel, action: t.visit_subscribe },

    "LinkedIn": { folder: "linkedin", baseUrl: "https://linkedin.com/in/", ph: t.profil_id, action: t.visit_profile },

    "X (Twitter)": { folder: "x", baseUrl: "https://x.com/", ph: t.pseudo, action: t.follow },

    "Facebook": { folder: "facebook", baseUrl: "https://facebook.com/", ph: t.profil_id, action: t.visit_profile },

    // 🔥 AJOUTS PROPRES
    "Threads": { folder: "threads", baseUrl: "https://threads.net/@", ph: t.pseudo, action: t.follow },

    "Pinterest": { folder: "pinterest", baseUrl: "https://pinterest.com/", ph: t.pseudo, action: t.follow },

    "Twitch": { folder: "twitch", baseUrl: "https://twitch.tv/", ph: t.pseudo, action: t.watch },

    "Spotify": { folder: "spotify", baseUrl: "https://open.spotify.com/user/", ph: t.user_id, action: t.listen },

    "Website": { folder: "website", baseUrl: "", ph: t.my_website, action: t.visit }
  }
}

export const formatSocialUrl = (network: string, handle: string,lang:'fr'|'en') => {
  const SOCIAL_CONFIG=get_social_config(lang)
  const config = SOCIAL_CONFIG[network];
  if (!config) return handle;
  
  const val = handle.trim();
  if (!val) return "";

  // Si l'utilisateur a déjà mis l'URL complète (commence par http), on la garde telle quelle
  if (val.startsWith('http')) return val;
  
  // On nettoie le @ uniquement ici pour la construction de l'URL
  const cleanHandle = val.replace('@', '');
  if (network === "Facebook") {
  

  // si c’est un nombre → profil
  if (/^\d+$/.test(cleanHandle)) {
    return `https://www.facebook.com/profile.php?id=${cleanHandle}`
  }

  // sinon → username (page OU profil)
  return `https://www.facebook.com/${cleanHandle}`
}

  
  return `${config.baseUrl}${cleanHandle}`;
};