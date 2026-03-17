import { cookies } from 'next/headers';
import DigitalIDForm from './DigitalIdForm';

export default async function DigitalIDPage() {
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  const lang = (langValue === 'en' ? 'en' : 'fr') as 'en' | 'fr';

  return <DigitalIDForm lang={lang} />;
}