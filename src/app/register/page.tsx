import { cookies } from 'next/headers';
import RegisterForm from './RegisterForm';

export default async function RegisterPage() {
  // On lit le cookie directement sur le serveur
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  const lang = (langValue === 'en' ? 'en' : 'fr') as 'en' | 'fr';

  return <RegisterForm lang={lang} />;
}