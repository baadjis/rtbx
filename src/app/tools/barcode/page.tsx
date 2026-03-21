import { cookies } from 'next/headers';
import BarcodeForm from './BarcodeForm';

export default async function BarcodePage() {
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  const lang = (langValue === 'fr' ? 'fr' : 'en') as 'en' | 'fr';

  return <BarcodeForm lang={lang} />;
}