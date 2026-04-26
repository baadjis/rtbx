// app/studios/qr/page.tsx
import QRStudioBuilder from '@/components/QRCodeBuilder/QRStudioBuilder';
import { cookies } from 'next/headers';

export default async function FlyerPage() {
    const cookieStore = await cookies();
      const langValue = cookieStore.get('lang')?.value;
      const lang = (langValue === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  return <QRStudioBuilder  lang={lang}/>;
}