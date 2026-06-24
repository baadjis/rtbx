// lib/business-app-links/app-providers.ts

import { LangType } from '@/lib/lang/types'

export const APP_PROVIDERS = {

  app_store: {

    id: 'app_store',

    folder: 'app-store',

    label: {

      en: 'App Store',

      fr: 'App Store'

    }

  },

  google_play: {

    id: 'google_play',

    folder: 'google-play',

    label: {

      en: 'Google Play',

      fr: 'Google Play'

    }

  },

  app_gallery: {

    id: 'app_gallery',

    folder: 'app-gallery',

    label: {

      en: 'AppGallery',

      fr: 'AppGallery'

    }

  },

  amazon_appstore: {

    id: 'amazon_appstore',

    folder: 'amazon-appstore',

    label: {

      en: 'Amazon Appstore',

      fr: 'Amazon Appstore'

    }

  },

  samsung_galaxy_store: {

    id: 'samsung_galaxy_store',

    folder: 'samsung-galaxy-store',

    label: {

      en: 'Galaxy Store',

      fr: 'Galaxy Store'

    }

  },

  microsoft_store: {

    id: 'microsoft_store',

    folder: 'microsoft-store',

    label: {

      en: 'Microsoft Store',

      fr: 'Microsoft Store'

    }

  }

} as const

export type AppProviderId =
  keyof typeof APP_PROVIDERS




  

export function getAppProviderLabel(
  providerId: string,
  lang: LangType = 'en'
) {

  const provider =
    APP_PROVIDERS[
      providerId as AppProviderId
    ]

  if (!provider)
    return providerId

  return (
    provider.label[lang] ||
    provider.label.en
  )

}