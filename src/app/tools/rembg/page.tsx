import { cookies } from 'next/headers';
import RemBgForm from './RemBgForm';

export default async function RemBgPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  return <RemBgForm lang={lang} />;
}