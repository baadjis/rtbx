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
    watch: "regarder",
    follow_channel:"suivre la chaine",
    invalid_url:"Invalid URL"
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
    watch: "watch",
    follow_channel:"Follow channel",
    invalid_url:"Le lien est invalide"


  }
}
 

 export function get_social_config(
  lang: LangType
): Record<
  string,
  {
    folder?: string
    baseUrl: string
    ph: string
    action: string

    /**
     * Accepted domains / aliases
     * used for validation
     */
    aliases?: string[]
  }
> {

  const t = data[lang]

  return {

    "Instagram": {
      folder: "instagram",
      baseUrl: "https://instagram.com/",
      ph: t.pseudo,
      action: t.follow,

      aliases: [
        "instagram.com",
        "www.instagram.com"
      ]
    },

    "TikTok": {
      folder: "tiktok",
      baseUrl: "https://tiktok.com/@",
      ph: t.pseudo,
      action: t.follow,

      aliases: [
        "tiktok.com",
        "www.tiktok.com"
      ]
    },

    "WhatsApp": {
      folder: "whatsapp",
      baseUrl: "https://whatsapp.com/channel/",
      ph: t.channel_id,
      action: t.follow_channel,

      aliases: [
        "whatsapp.com",
        "www.whatsapp.com",
        "chat.whatsapp.com"
      ]
    },

    "YouTube": {
      folder: "youtube",
      baseUrl: "https://youtube.com/@",
      ph: t.channel,
      action: t.visit_subscribe,

      aliases: [
        "youtube.com",
        "www.youtube.com",
        "youtu.be"
      ]
    },

    "LinkedIn": {
      folder: "linkedin",
      baseUrl: "https://linkedin.com/in/",
      ph: t.profil_id,
      action: t.visit_profile,

      aliases: [
        "linkedin.com",
        "www.linkedin.com"
      ]
    },

    "X (Twitter)": {
      folder: "x",
      baseUrl: "https://x.com/",
      ph: t.pseudo,
      action: t.follow,

      aliases: [
        "x.com",
        "www.x.com",
        "twitter.com",
        "www.twitter.com"
      ]
    },

    "Facebook": {
      folder: "facebook",
      baseUrl: "https://facebook.com/",
      ph: t.profil_id,
      action: t.visit_profile,

      aliases: [
        "facebook.com",
        "www.facebook.com",
        "fb.com",
        "m.facebook.com"
      ]
    },

    "Threads": {
      folder: "threads",
      baseUrl: "https://threads.net/@",
      ph: t.pseudo,
      action: t.follow,

      aliases: [
        "threads.net",
        "www.threads.net"
      ]
    },

    "Pinterest": {
      folder: "pinterest",
      baseUrl: "https://pinterest.com/",
      ph: t.pseudo,
      action: t.follow,

      aliases: [
        "pinterest.com",
        "www.pinterest.com"
      ]
    },

    "Twitch": {
      folder: "twitch",
      baseUrl: "https://twitch.tv/",
      ph: t.pseudo,
      action: t.watch,

      aliases: [
        "twitch.tv",
        "www.twitch.tv"
      ]
    },

    "Spotify": {
      folder: "spotify",
      baseUrl: "https://open.spotify.com/user/",
      ph: t.user_id,
      action: t.listen,

      aliases: [
        "spotify.com",
        "open.spotify.com"
      ]
    },

    "Website": {
      folder: "website",
      baseUrl: "",
      ph: t.my_website,
      action: t.visit,

      aliases: []
    }
  }
}




export function validateSocialInput(
  network: string,
  value: string,
  lang: LangType
) {

  const SOCIAL_CONFIG =
    get_social_config(lang)

  const config =
    SOCIAL_CONFIG[
      network as keyof typeof SOCIAL_CONFIG
    ]

  if (!config) {

    return {
      valid: false,
      error: 'Unknown network'
    }

  }

  const clean =
    value.trim()

  /**
   * Empty
   */

  if (!clean) {

    return {
      valid: false,
      error: 'Empty value'
    }

  }

  /**
   * WEBSITE
   */

  if (network === 'Website') {

    try {

      const url =
        clean.startsWith('http')
          ? clean
          : `https://${clean}`

      new URL(url)

      return {
        valid: true
      }

    } catch {

      return {
        valid: false,
        error: 'Invalid website URL'
      }

    }

  }

  /**
   * HANDLE MODE
   *
   * Example:
   * johndoe
   * @johndoe
   */

  const isUrl =

    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.includes('.com/') ||
    clean.includes('.tv/') ||
    clean.includes('.net/')

  if (!isUrl) {

    return {
      valid: true
    }

  }

  /**
   * URL MODE
   */

  try {

    const parsedUrl =
      new URL(clean)

    const hostname =
      parsedUrl.hostname.toLowerCase()

    const allowedDomains =
      config.aliases || []

    const matches =
      allowedDomains.some(
        (domain) =>

          hostname === domain ||

          hostname.endsWith(`.${domain}`)
      )

    if (!matches) {

      return {
        valid: false,
        error: `This is not a valid ${network} URL`
      }

    }

    return {
      valid: true
    }

  } catch {

    return {
      valid: false,
      error: 'Invalid URL'
    }

  }
}


export const formatSocialUrl = (network: string, handle: string,lang:LangType) => {
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