import { cookies } from 'next/headers';
import SoldesForm from './SoldesForm';

export default async function SoldesPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  return <SoldesForm lang={lang} />;
}