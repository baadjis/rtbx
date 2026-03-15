import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function Footer() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr';

  const t = {
    fr: { about: "À Propos", terms: "Conditions", privacy: "Vie Privée", ugc: "UGC", contact: "Contact" },
    en: { about: "About", terms: "Terms", privacy: "Privacy", ugc: "UGC", contact: "Contact" }
  }[lang];

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h4 className="font-bold text-gray-900 mb-4">🚀 RetailBox</h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              {lang === 'fr' ? "Suite d'outils professionnels pour optimiser votre commerce et votre présence digitale." : "Professional toolkit to optimize your business and digital presence."}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">🛡️ {lang === 'fr' ? "Sécurité" : "Security"}</h4>
            <p className="text-gray-500 text-sm">
              {lang === 'fr' ? "Traitement en mémoire vive. Zéro stockage de vos fichiers." : "RAM-based processing. Zero file storage on our servers."}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">🔗 {lang === 'fr' ? "Navigation" : "Links"}</h4>
            <div className="flex flex-col gap-2 text-sm text-indigo-600 font-medium">
              <Link href="/contact">{t.contact}</Link>
              <a href="https://baadjis-utilitybox.hf.space">{lang === 'fr' ? "Outils Gratuits" : "Free Tools"}</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-50 pt-8 flex flex-wrap justify-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <Link href="/terms">{t.terms}</Link>
          <Link href="/privacy">{t.privacy}</Link>
          <Link href="/ugc">{t.ugc}</Link>
          <Link href="/about">{t.about}</Link>
          <Link href="/about">{t.contact}</Link>
          <span>© {new Date().getFullYear()} RetailBox</span>
        </div>
      </div>
    </footer>
  );
}