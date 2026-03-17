import { cookies } from 'next/headers';
import QRCodeForm from './QRCodeForm';

export default async function QRCodePage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr') as 'en' | 'fr';
  return <QRCodeForm lang={lang} />;
}