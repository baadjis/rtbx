import { cookies } from 'next/headers';
import ReviewForm from './ReviewForm';

export default async function ReviewPage() {
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  const lang = (langValue === 'fr' ? 'fr' : 'en') as 'en' | 'fr';

  return <ReviewForm lang={lang} />;
}