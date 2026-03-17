import { cookies } from 'next/headers';
import WhatsAppForm from './WhatsAppForm';

export default async function WhatsAppPage() {
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  const lang = (langValue === 'en' ? 'en' : 'fr') as 'en' | 'fr';

  return <WhatsAppForm lang={lang} />;
}