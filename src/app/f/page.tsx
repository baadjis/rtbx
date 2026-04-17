import { cookies } from 'next/headers';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, CheckCircle2, QrCode, BarChart3, ArrowRight, Star, Heart ,Lock} from 'lucide-react';

export default async function FormsLandingPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'en' | 'fr';

const t = {
  fr: {
    title: "RetailBox Forms",
    sub: "Recueillez des avis, des opinions et des données en un clin d'œil.",
    desc: `RetailBox Forms vous offre une liberté totale pour concevoir des expériences interactives qui captent l'attention. 
           Que vous souhaitiez recueillir des avis clients pour valoriser votre expertise, sonder votre audience sur les réseaux sociaux, 
           ou organiser des votes privés pour vos projets personnels, notre interface intuitive vous permet de bâtir des formulaires 
           robustes et élégants. 
           
           L'outil s'adapte à chaque besoin : du simple sondage d'opinion à l'enquête de satisfaction approfondie. 
           Diffusez vos créations instantanément grâce à nos QR Codes intelligents, compatibles avec tous les supports physiques 
           et digitaux. Analysez ensuite chaque réponse en temps réel, visualisez les tendances et prenez des décisions basées 
           sur des données concrètes, tout en garantissant une confidentialité absolue à vos répondants.`,
    cta: "Créer mon formulaire maintenant",
    feat1: "QR Code de diffusion",
    feat2: "Analyses & Statistiques",
    feat3: "Sondages Publics ou Privés"
  },
  en: {
    title: "RetailBox Forms",
    sub: "Collect reviews, opinions, and data in a heartbeat.",
    desc: `RetailBox Forms gives you total freedom to design interactive experiences that capture attention. 
           Whether you want to gather customer reviews to showcase your expertise, poll your audience on social media, 
           or organize private votes for your personal projects, our intuitive interface allows you to build robust 
           and elegant forms. 
           
           The tool adapts to every need: from simple opinion polls to in-depth satisfaction surveys. 
           Distribute your creations instantly with our smart QR Codes, compatible with all physical and digital media. 
           Then analyze each response in real-time, visualize trends, and make data-driven decisions, 
           all while ensuring absolute privacy for your respondents.`,
    cta: "Create my form now",
    feat1: "Distribution QR Code",
    feat2: "Analytics & Insights",
    feat3: "Public or Private Polls"
  }
}[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center">
            
            <div className="flex justify-center mb-8">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-[2.5rem] text-indigo-600 dark:text-indigo-400 shadow-sm">
                    <FileText size={48} />
                </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tight mb-6 leading-tight italic bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {t.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-500 dark:text-slate-400 font-medium mb-12 max-w-3xl mx-auto leading-relaxed">
                {t.sub}
            </p>

            <div className="bg-white dark:bg-slate-900 p-8 md:p-16 rounded-[4rem] border border-gray-100 dark:border-slate-800 shadow-2xl mb-16 transition-colors">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed mb-12 font-medium text-left">
                        {t.desc}
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-gray-50 dark:border-slate-800 pt-10">
                    <div className="flex flex-col gap-3">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600"><QrCode size={22} /></div>
                        <span className="font-black text-xs uppercase tracking-widest dark:text-white">{t.feat1}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600"><BarChart3 size={22} /></div>
                        <span className="font-black text-xs uppercase tracking-widest dark:text-white">{t.feat2}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600"><Lock size={22} /></div>
                        <span className="font-black text-xs uppercase tracking-widest dark:text-white">{t.feat3}</span>
                    </div>
                </div>
            </div>

            {/* SECTION CAS D'USAGE (VITAL POUR ADSENSE) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 text-left">
                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-transparent hover:border-indigo-100 transition-all">
                    <Star className="text-yellow-500 mb-4" />
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">{lang === 'fr' ? 'Avis & Recommandations' : 'Reviews & Feedback'}</h4>
                    <p className="text-sm text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
                        {lang === 'fr' ? 'Collectez des témoignages pour renforcer votre crédibilité et améliorer vos services en continu.' : 'Collect testimonials to strengthen your credibility and continuously improve your services.'}
                    </p>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-transparent hover:border-indigo-100 transition-all">
                    <Heart className="text-rose-500 mb-4" />
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">{lang === 'fr' ? 'Sondages Communautaires' : 'Community Polls'}</h4>
                    <p className="text-sm text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
                        {lang === 'fr' ? 'Engagez votre audience en lui permettant de voter pour vos prochaines idées ou produits.' : 'Engage your audience by letting them vote on your upcoming ideas or products.'}
                    </p>
                </div>
            </div>

            <Link href="/dashboard/forms/new" className="inline-flex items-center gap-4 px-12 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all no-underline">
                {t.cta} <ArrowRight />
            </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}