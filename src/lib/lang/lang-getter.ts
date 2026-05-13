// lib/server/get-lang.ts

import { cookies } from 'next/headers'
import { LangType } from './types'

export async function getLang() {

  const cookieStore = await cookies()

  return cookieStore.get('lang')?.value || 'en' as LangType
}