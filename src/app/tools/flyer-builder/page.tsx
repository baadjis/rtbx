import { cookies } from 'next/headers';
import FlyerBuilder from '@/components/Builders/Flyer/FlyerBuilder';

export default async function DigitalIDPage() {
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  const lang = (langValue === 'fr' ? 'fr' : 'en') as 'en' | 'fr';

  return <FlyerBuilder  />
}