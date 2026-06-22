import { LangType }
from '@/lib/lang/types'

const DAYS = {

  en: [

    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'

  ],

  fr: [

    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
    'Dimanche'

  ]

}

export function getDayLabel(

  day: number,

  lang: LangType

) {

  return DAYS[
    lang
  ][day]

}