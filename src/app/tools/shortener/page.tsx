import { cookies } from 'next/headers';
import ShortenerForm from './ShortenerForm';

export default async function ShortenerPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr') as 'en' | 'fr';
  return <ShortenerForm lang={lang} />;
}