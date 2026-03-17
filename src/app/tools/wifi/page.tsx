import { cookies } from 'next/headers';
import WifiForm from './WifiForm';

export default async function WifiPage() {
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  const lang = (langValue === 'en' ? 'en' : 'fr') as 'en' | 'fr';

  return <WifiForm lang={lang} />;
}