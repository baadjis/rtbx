import { cookies } from 'next/headers';
import DigitalIDForm from './DigitalIdForm';
import { LangType } from '@/lib/lang/types';

export default async function DigitalIDPage() {
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  const lang = (langValue === 'fr' ? 'fr' : 'en') as LangType;

  return <DigitalIDForm lang={lang} />;
}