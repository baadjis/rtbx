export function getProviderAsset(
  provider?: {
    folder?: string
  }
) {

  if (!provider?.folder) {
    return null
  }

  return `/provider_assets/${provider.folder}`

}

export function getProviderGlyph(
  provider?: {
    folder?: string
  }
) {

  const asset =
    getProviderAsset(provider)

  if (!asset) {
    return null
  }

  return `${asset}/glyph/png/full.png`

}