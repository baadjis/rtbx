
const data= {
fr:{
 pseudo:"Ex: mon_pseudo",
 profil_id:  "Lien profil ou ID",
 channel:"Ex: ma chaine",
 channel_id:"ID de la chaîne",
 user_id:"ID utilisateur",
 my_website: "https://mon-site.com"

},
en:{

   pseudo:"Ex: user_name",
 profil_id:  "profil link or ID",
 channel:"Ex: my_channel",
 channel_id:"Chanel ID",
 user_id:"user Id",
 my_website: "https://my-website.com"

}

}

export function get_social_config(lang:'fr'|'en'): Record<string, { folder?: string, baseUrl: string, ph: string }>  {
  const t= data[lang]
  return({
  "Instagram": { folder: "instagram", baseUrl: "https://instagram.com/", ph: t.pseudo },
  "TikTok": { folder: "tiktok", baseUrl: "https://tiktok.com/@", ph: t.pseudo },
  "WhatsApp": { folder: "whatsapp", baseUrl: "https://whatsapp.com/channel/", ph: t.channel_id },
  "YouTube": { folder: "youtube", baseUrl: "https://youtube.com/@", ph: t.channel },
  "LinkedIn": { folder: "linkedin", baseUrl: "https://linkedin.com/in/", ph:t.profil_id },
  "X (Twitter)": { folder: "x", baseUrl: "https://x.com/", ph: t.pseudo},
  "Facebook": { folder: "facebook", baseUrl: "https://facebook.com/", ph: t.profil_id },
  "Threads": { folder: "threads", baseUrl: "https://threads.net/@", ph: t.pseudo },
  "Pinterest": { folder: "pinterest", baseUrl: "https://pinterest.com/", ph: t.pseudo },
  "Twitch": { folder: "twitch", baseUrl: "https://twitch.tv/", ph: t.pseudo},
  "Spotify": { folder: "spotify", baseUrl: "https://open.spotify.com/user/", ph: t.user_id },
  "Website": { baseUrl: "",folder:"website", ph: t.my_website } // Pas de préfixe
});
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
  
  return `${config.baseUrl}${cleanHandle}`;
};