import { cookies } from 'next/headers';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  // Lecture du cookie sur le serveur (Next.js 15 requiert le await)
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  
  // On définit la langue par défaut si le cookie n'existe pas encore
  const lang = (langValue === 'en' ? 'en' : 'fr') as 'en' | 'fr';

  return <LoginForm lang={lang} />;
}