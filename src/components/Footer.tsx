import Link from 'next/link';
import { cookies } from 'next/headers';
import { Newspaper, BookOpen, HelpCircle, Info, Mail, Shield, UserCheck, Lock } from 'lucide-react';

export default async function Footer() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';

  const t = {
    fr: { 
        about: "À Propos", terms: "Conditions", privacy: "Vie Privée", 
        ugc: "Droits UGC", contact: "Contact", blog: "Blog", 
        faq: "FAQ", guide: "Guide Complet",
        safety: "Sécurité", safety_desc: "Traitement en mémoire vive. Zéro stockage de vos fichiers.",
        nav_title: "Navigation Rapide"
    },
    en: { 
        about: "About Us", terms: "Terms", privacy: "Privacy Policy", 
        ugc: "UGC Rights", contact: "Contact", blog: "Blog", 
        faq: "FAQ", guide: "Full Guide",
        safety: "Security", safety_desc: "RAM-based processing. Zero file storage on our servers.",
        nav_title: "Quick Links"
    }
  }[lang];

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-900 pt-20 pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* TOP SECTION: 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          <div>
            <h4 className="font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-indigo-600 rounded-full"></span> RetailBox
            </h4>
            <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
              {lang === 'fr' ? "Plateforme d'outils techniques pour Small Business. Nous simplifions votre logistique et votre marketing digital." : "Technical toolkit for Small Businesses. We simplify your logistics and digital marketing."}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" /> {t.safety}
            </h4>
            <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
              {t.safety_desc}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-indigo-600" /> {t.nav_title}
            </h4>
            <div className="grid grid-cols-2 gap-y-3 text-sm font-bold">
              <Link href="/blog" className="text-gray-400 hover:text-indigo-600 transition-colors">{t.blog}</Link>
              <Link href="/guide" className="text-gray-400 hover:text-indigo-600 transition-colors">{t.guide}</Link>
              <Link href="/faq" className="text-gray-400 hover:text-indigo-600 transition-colors">{t.faq}</Link>
              <Link href="/contact" className="text-gray-400 hover:text-indigo-600 transition-colors">{t.contact}</Link>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Legal Links */}
        <div className="pt-10 border-t border-gray-50 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            <Link href="/terms" className="hover:text-indigo-600 transition-colors">{t.terms}</Link>
            <Link href="/privacy" className="hover:text-indigo-600 transition-colors">{t.privacy}</Link>
            <Link href="/ugc" className="hover:text-indigo-600 transition-colors">{t.ugc}</Link>
            <Link href="/about" className="hover:text-indigo-600 transition-colors">{t.about}</Link>
          </div>
          <p className="text-xs font-bold text-gray-400">
            © {new Date().getFullYear()} RETAILBOX • {lang.toUpperCase()}
          </p>
        </div>

      </div>
    </footer>
  );
}