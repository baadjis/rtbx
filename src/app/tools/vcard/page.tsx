import { cookies } from 'next/headers';
import VCardForm from './VCardForm';

export default async function VCardPage() {
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  const lang = (langValue === 'en' ? 'en' : 'fr') as 'en' | 'fr';

  return <VCardForm lang={lang} />;
}