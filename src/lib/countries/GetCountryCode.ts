// lib/countries/countries.ts

import { CountryCode } from "libphonenumber-js/core"

export type CountryItem = {

  name: string

  code: CountryCode

  dial_code: string

}

export const COUNTRIES: CountryItem[] = [

  {
    name: 'France',
    code: 'FR',
    dial_code: '+33'
  },

  {
    name: 'United States',
    code: 'US',
    dial_code: '+1'
  },

  {
    name: 'United Kingdom',
    code: 'GB',
    dial_code: '+44'
  },

  {
    name: 'Canada',
    code: 'CA',
    dial_code: '+1'
  },

  {
    name: 'Germany',
    code: 'DE',
    dial_code: '+49'
  },

  {
    name: 'Spain',
    code: 'ES',
    dial_code: '+34'
  },

  {
    name: 'Italy',
    code: 'IT',
    dial_code: '+39'
  },

  {
    name: 'Belgium',
    code: 'BE',
    dial_code: '+32'
  },

  {
    name: 'Switzerland',
    code: 'CH',
    dial_code: '+41'
  },

  {
    name: 'Netherlands',
    code: 'NL',
    dial_code: '+31'
  },

  {
    name: 'Portugal',
    code: 'PT',
    dial_code: '+351'
  },

  {
    name: 'Luxembourg',
    code: 'LU',
    dial_code: '+352'
  },

  {
    name: 'Ireland',
    code: 'IE',
    dial_code: '+353'
  },

  {
    name: 'Austria',
    code: 'AT',
    dial_code: '+43'
  },

  {
    name: 'Sweden',
    code: 'SE',
    dial_code: '+46'
  },

  {
    name: 'Norway',
    code: 'NO',
    dial_code: '+47'
  },

  {
    name: 'Denmark',
    code: 'DK',
    dial_code: '+45'
  },

  {
    name: 'Finland',
    code: 'FI',
    dial_code: '+358'
  },

  {
    name: 'Poland',
    code: 'PL',
    dial_code: '+48'
  },

  {
    name: 'Czech Republic',
    code: 'CZ',
    dial_code: '+420'
  },

  {
    name: 'Greece',
    code: 'GR',
    dial_code: '+30'
  },

  {
    name: 'Turkey',
    code: 'TR',
    dial_code: '+90'
  },

  {
    name: 'Russia',
    code: 'RU',
    dial_code: '+7'
  },

  {
    name: 'Ukraine',
    code: 'UA',
    dial_code: '+380'
  },

  {
    name: 'Romania',
    code: 'RO',
    dial_code: '+40'
  },

  {
    name: 'Bulgaria',
    code: 'BG',
    dial_code: '+359'
  },

  {
    name: 'Croatia',
    code: 'HR',
    dial_code: '+385'
  },

  {
    name: 'Serbia',
    code: 'RS',
    dial_code: '+381'
  },

  {
    name: 'Morocco',
    code: 'MA',
    dial_code: '+212'
  },

  {
    name: 'Algeria',
    code: 'DZ',
    dial_code: '+213'
  },

  {
    name: 'Tunisia',
    code: 'TN',
    dial_code: '+216'
  },

  {
    name: 'Egypt',
    code: 'EG',
    dial_code: '+20'
  },

  {
    name: 'Senegal',
    code: 'SN',
    dial_code: '+221'
  },

  {
    name: 'Ivory Coast',
    code: 'CI',
    dial_code: '+225'
  },

  {
    name: 'Mali',
    code: 'ML',
    dial_code: '+223'
  },

  {
    name: 'Nigeria',
    code: 'NG',
    dial_code: '+234'
  },

  {
    name: 'South Africa',
    code: 'ZA',
    dial_code: '+27'
  },

  {
    name: 'Cameroon',
    code: 'CM',
    dial_code: '+237'
  },

  {
    name: 'India',
    code: 'IN',
    dial_code: '+91'
  },

  {
    name: 'China',
    code: 'CN',
    dial_code: '+86'
  },

  {
    name: 'Japan',
    code: 'JP',
    dial_code: '+81'
  },

  {
    name: 'South Korea',
    code: 'KR',
    dial_code: '+82'
  },

  {
    name: 'Thailand',
    code: 'TH',
    dial_code: '+66'
  },

  {
    name: 'Vietnam',
    code: 'VN',
    dial_code: '+84'
  },

  {
    name: 'Indonesia',
    code: 'ID',
    dial_code: '+62'
  },

  {
    name: 'Philippines',
    code: 'PH',
    dial_code: '+63'
  },

  {
    name: 'Singapore',
    code: 'SG',
    dial_code: '+65'
  },

  {
    name: 'Malaysia',
    code: 'MY',
    dial_code: '+60'
  },

  {
    name: 'Australia',
    code: 'AU',
    dial_code: '+61'
  },

  {
    name: 'New Zealand',
    code: 'NZ',
    dial_code: '+64'
  },

  {
    name: 'Brazil',
    code: 'BR',
    dial_code: '+55'
  },

  {
    name: 'Argentina',
    code: 'AR',
    dial_code: '+54'
  },

  {
    name: 'Mexico',
    code: 'MX',
    dial_code: '+52'
  },

  {
    name: 'Chile',
    code: 'CL',
    dial_code: '+56'
  },

  {
    name: 'Colombia',
    code: 'CO',
    dial_code: '+57'
  },

  {
    name: 'Peru',
    code: 'PE',
    dial_code: '+51'
  },

  {
    name: 'Saudi Arabia',
    code: 'SA',
    dial_code: '+966'
  },

  {
    name: 'United Arab Emirates',
    code: 'AE',
    dial_code: '+971'
  },

  {
    name: 'Qatar',
    code: 'QA',
    dial_code: '+974'
  },

  {
    name: 'Israel',
    code: 'IL',
    dial_code: '+972'
  }

]

export function getCountryCode(
  country?: string
) {

  if (!country)
    return 'FR'

  return (
    COUNTRIES.find((c:CountryItem)=>c.name==country)?.code
    || 'FR'
  )

}