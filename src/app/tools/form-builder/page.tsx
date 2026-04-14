import { cookies } from 'next/headers';
import FormBuilderClient from './FormBuilderClient';

export default async function FormBuilderPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'en' | 'fr';
  return <FormBuilderClient lang={lang} />;
}