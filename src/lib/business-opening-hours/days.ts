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


export const DEFAULT_OPENING_HOURS = [

  0, 1, 2, 3, 4, 5, 6

].map(day => ({

  day_of_week: day,

  is_closed: true,

  open_time: null,

  close_time: null

}))