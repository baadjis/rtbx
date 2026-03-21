import { cookies } from 'next/headers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from './ContactForm';

export default async function ContactPage() {
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  const lang = (langValue === 'fr' ? 'fr' : 'en') as 'en' | 'fr';

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300"
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
        <ContactForm lang={lang} formId={process.env.FORMSPREE_ID || ""} />
      </main>

      <Footer />
    </div>
  );
}