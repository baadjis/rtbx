import { cookies } from 'next/headers';
import { BrandLogo } from '@/components/BrandLogo';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Store, Utensils, Users, ShieldCheck, Zap, Globe, Heart, Sparkles, BarChart3, Star } from 'lucide-react';

export default async function AboutPage() {
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  const lang = (langValue === 'en' ? 'en' : 'fr') as 'en' | 'fr';

  const content = {
    fr: {
      title: "L'Univers RetailBox",
      intro: "Chez RetailBox, nous bâtissons les ponts technologiques de demain entre vos espaces physiques et votre présence digitale. Nous croyons fermement que chaque commerçant, artisan et créateur possède un talent unique qui mérite une visibilité à sa juste mesure. Notre ambition est de démocratiser le SEO local et l'intelligence artificielle pour simplifier votre logistique quotidienne. Nous nous engageons dans un développement continu pour offrir une suite d'outils performants, sécurisés et accessibles, permettant à votre expertise de briller là où vos clients vous cherchent.",
      
      philosophy_h: "Notre Philosophie : Le Phygital accessible",
      philosophy_p: "RetailBox est né d'un constat simple : le monde physique et le monde numérique ne doivent plus être deux univers séparés. Nous croyons fermement que chaque talent, chaque petit commerçant et chaque créateur mérite une visibilité à la hauteur de son excellence. Notre mission est de démocratiser les outils de haute technologie pour que la complexité technique ne soit plus un frein à votre succès. Nous créons des outils qui transforment un simple scan ou une photo en une opportunité de croissance réelle.",

      ambition_h: "Maximiser la visibilité de proximité",
      ambition_p: "Notre ambition est de devenir le partenaire de référence pour votre réputation locale. En optimisant votre présence là où vos futurs clients effectuent leurs recherches, nous aidons les commerces à s'imposer naturellement dans leur zone de chalandise. Une entreprise facilement repérable est une entreprise qui prospère, et nous travaillons sans relâche à créer des solutions innovantes pour garantir que votre savoir-faire soit toujours le premier choix de votre communauté.",
      mission_h: "Accompagner la croissance",
      mission_p: "Nous centralisons les ressources critiques pour les entrepreneurs. De la boutique de quartier au site e-commerce international, nous fournissons les standards technologiques indispensables pour rester compétitifs dans une économie de plus en plus dématérialisée.",
      
      services: [
  {
    h: "Gestion Logistique & Stocks",
    p: "Nous simplifions la logistique commerciale avec des générateurs de codes-barres conformes aux standards internationaux (EAN-13, Code 128). Nous permettons aux commerçants d'automatiser leur inventaire et d'assurer une traçabilité parfaite de leurs produits, de l'entrepôt jusqu'au passage en caisse.",
    icon: Store
  },
  {
    h: "Marketing & Analytics Digital",
    p: "Nous optimisons vos campagnes via RetailLink, notre réducteur d'URL professionnel. Nous intégrons un suivi statistique en temps réel permettant d'analyser l'engagement de vos clients. Vous mesurez précisément l'impact de vos liens sur les réseaux sociaux grâce à un tableau de bord analytique complet et conforme au RGPD.",
    icon: BarChart3
  },
  {
    h: "Solutions pour la Restauration",
    p: "Nous modernisons l'expérience client avec des QR Codes de menu fluides et haute définition. Nous facilitons l'accès instantané à vos cartes PDF ou sites web, permettant une mise à jour dynamique de vos tarifs et une réduction drastique de vos coûts d'impression papier.",
    icon: Utensils
  },
  {
    h: "Gestion de Contacts & Identité",
    p: "Nous révolutionnons votre networking avec nos solutions de VCard et de Social Cards. Nous centralisons la gestion de vos coordonnées et de vos réseaux sociaux dans un point d'entrée unique, permettant à vos prospects d'enregistrer votre profil complet dans leur smartphone en un seul scan.",
    icon: Users
  },
  {
    h: "Optimisation de l'Image Produit",
    p: "Nous valorisons vos articles de vente grâce à notre moteur d'intelligence artificielle. Nous transformons vos photos brutes en visuels de qualité studio via un détourage haute précision, garantissant une présentation professionnelle indispensable pour vos fiches de vente et catalogues e-commerce.",
    icon: ShieldCheck
  },
  {
  h: "Réputation & SEO Local",
  p: "Nous renforçons votre autorité locale avec des outils de récolte d'avis simplifiés. En supprimant la friction entre le client et votre fiche d'établissement, nous vous aidons à dominer les résultats de recherche de proximité et à transformer chaque client satisfait en un levier de visibilité sur les moteurs de recherche.",
  icon: Star
}
],

      vision_h: "Innovation Continue",
      vision_p: "RetailBox n'est pas un projet figé. Notre équipe de développement s'engage à produire continuellement de nouveaux outils pour les business et les créateurs. Que vous soyez un artisan local ou un influenceur digital, nous évoluons avec vos besoins pour vous offrir le meilleur de l'IA et de l'automatisation marketing.",

      privacy_h: "Sécurité et Transparence",
      privacy_p: "Nous appliquons une politique de confidentialité rigoureuse. Les processus techniques (IA, génération de codes) sont exécutés exclusivement en mémoire vive (RAM) et vos fichiers ne sont jamais stockés de manière permanente. Pour votre Espace Pro, nous sécurisons uniquement les données essentielles (e-mail, statistiques de clics). Vous gardez le contrôle total sur votre propriété intellectuelle (UGC).",
    },
    en: {
      title: "The RetailBox Universe",
      intro: "At RetailBox, we are building tomorrow's technological bridges between your physical spaces and your digital presence. We firmly believe that every merchant, artisan, and creator possesses a unique talent that deserves visibility proportional to its excellence. Our ambition is to democratize local SEO and artificial intelligence to simplify your daily logistics and operations. We are committed to continuous development, offering a suite of high-performance, secure, and accessible tools designed to let your expertise shine exactly where your customers are looking.",
      philosophy_h: "Our Philosophy: Accessible Phygital",
      philosophy_p: "RetailBox was born from a simple observation: the physical and digital worlds should no longer be separate universes. We firmly believe that every talent, every small merchant, and every creator deserves visibility that matches their excellence. Our mission is to democratize high-tech tools so that technical complexity is no longer a barrier to your success. We create tools that transform a simple scan or photo into a real growth opportunity.",
      
      ambition_h: "Maximizing Local Reach",
      ambition_p: "Our ambition is to become the leading partner for your local reputation. By optimizing your presence exactly where customers are searching, we help businesses establish themselves as the natural choice in their area. A discoverable business is a thriving business, and we are continuously working on innovative solutions to ensure your expertise is the first thing your community sees.",
     
      mission_h: "Supporting Growth",
      mission_p: "We centralize critical resources for entrepreneurs. From neighborhood shops to international e-commerce sites, we provide the essential technological standards to stay competitive in an increasingly digital economy.",
      
      services: [
  {
    h: "Inventory & Logistics Management",
    p: "We simplify commercial logistics with barcode generators compliant with international standards (EAN-13, Code 128). We enable merchants to automate their inventory and ensure perfect product traceability, from the warehouse to the point of sale.",
    icon: Store
  },
  {
    h: "Digital Marketing & Analytics",
    p: "We optimize your campaigns via RetailLink, our professional URL shortener. We integrate real-time statistical tracking to analyze customer engagement. You accurately measure the impact of your links on social media through a comprehensive, GDPR-compliant analytical dashboard.",
    icon: BarChart3
  },
  {
    h: "Solutions for Restaurants",
    p: "We modernize the customer experience with fluid, high-definition menu QR Codes. We facilitate instant access to your PDF menus or websites, allowing for dynamic price updates and a drastic reduction in paper printing costs.",
    icon: Utensils
  },
  {
    h: "Contact & Identity Management",
    p: "We revolutionize your networking with our VCard and Social Card solutions. We centralize the management of your contact details and social media into a single point of entry, allowing prospects to save your full profile to their smartphone with a single scan.",
    icon: Users
  },
  {
    h: "Product Image Optimization",
    p: "We enhance your sales items through our AI engine. We transform raw photos into studio-quality visuals via high-precision background removal, ensuring the professional presentation essential for your e-commerce listings and catalogs.",
    icon: ShieldCheck
  },
  {
  h: "Local SEO & Reputation",
  p: "We strengthen your local authority with streamlined review collection tools. By removing friction between the customer and your business profile, we help you dominate local search results and transform every satisfied customer into a powerful visibility driver on search engines.",
  icon: Star
}

  
],

      vision_h: "Continuous Innovation",
      vision_p: "RetailBox is not a static project. Our development team is committed to continuously producing new tools for businesses and creators. Whether you are a local artisan or a digital influencer, we evolve with your needs to offer you the best in AI and marketing automation.",

      privacy_h: "Security & Transparency",
      privacy_p: "We apply a rigorous privacy policy. Technical processes (AI, code generation) are executed exclusively in random access memory (RAM), and your files are never permanently stored. For your Pro Space, we only secure essential data (email, click analytics). You maintain full control over your intellectual property (UGC).",
    }
  }[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300" 
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      <Header/>

      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24 w-full relative z-10">
        
        {/* HERO SECTION */}
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic tracking-tight">
            {content.title}
          </h1>
        <p className="text-xl md:text-2xl text-gray-500 dark:text-slate-400 max-w-4xl mx-auto font-medium leading-relaxed">
            {content.intro}
          </p>
        </div>

        {/* PHILOSOPHY & AMBITION - TWO COLUMNS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-100 dark:border-slate-800">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <Heart className="text-rose-500 w-6 h-6" /> {content.philosophy_h}
            </h2>
            <p className="text-gray-600 dark:text-slate-300 text-lg leading-relaxed font-medium">
              {content.philosophy_p}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-100 dark:border-slate-800">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <Globe className="text-indigo-600 w-6 h-6" /> {content.ambition_h}
            </h2>
            <p className="text-gray-600 dark:text-slate-300 text-lg leading-relaxed font-medium">
              {content.ambition_p}
            </p>
          </div>
        </div>

        {/* MISSION CARD (WIDE) */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-8 md:p-16 rounded-[3rem] border border-gray-100 dark:border-slate-800 mb-16">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
                <Zap className="text-indigo-600 dark:text-indigo-400 w-7 h-7" />
            </div>
            {content.mission_h}
          </h2>
          <p className="text-gray-600 dark:text-slate-300 text-xl leading-relaxed font-medium">
            {content.mission_p}
          </p>
        </div>

        {/* SERVICES GRID (MAPPING DYNAMIQUE) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {content.services.map((service, index) => (
            <div key={index} className="group bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <service.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{service.h}</h3>
              </div>
              <p className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed font-medium">{service.p}</p>
            </div>
          ))}
        </div>

        {/* VISION & INNOVATION CARD */}
        <div className="bg-white dark:bg-slate-900 p-8 md:p-16 rounded-[3rem] border-2 border-dashed border-indigo-100 dark:border-indigo-900/30 mb-16 text-center">
            <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">{content.vision_h}</h2>
            <p className="text-gray-600 dark:text-slate-300 text-xl leading-relaxed font-medium max-w-4xl mx-auto">
                {content.vision_p}
            </p>
        </div>

        {/* PRIVACY COMMITMENT */}
        <div className="bg-indigo-600 dark:bg-indigo-700 p-10 md:p-16 rounded-[4rem] text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-8 tracking-tight">{content.privacy_h}</h2>
            <p className="text-indigo-100 text-xl leading-relaxed opacity-90 font-medium">
                {content.privacy_p}
            </p>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
        </div>
      </main>

      <Footer />
    </div>
  );
}