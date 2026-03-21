import { cookies } from 'next/headers';
import QRCodeForm from './QRCodeForm';

export default async function QRCodePage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  return <QRCodeForm lang={lang} />;
}