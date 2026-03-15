import { cookies } from 'next/headers';
import { BrandLogo } from '@/components/BrandLogo';
import Footer from '@/components/Footer';

export default async function UgcPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr') as 'en' | 'fr';

  const content = {
    fr: {
      title: "Propriété des Contenus (UGC)",
      sub: "User Generated Content : Vos créations vous appartiennent.",
      s1: "1. Propriété exclusive",
      p1: "Vous êtes le propriétaire unique de 100% des fichiers générés sur RetailBox (QR Codes, Barcodes, Photos détourées).",
      s2: "2. Usage Commercial",
      p2: "RetailBox vous accorde un droit d'utilisation commerciale illimité et gratuit. Nous ne revendiquons aucun droit d'auteur sur votre travail.",
      s3: "3. Responsabilité",
      p3: "Vous certifiez posséder les droits sur les logos importés. RetailBox n'est qu'un prestataire technique passif.",
    },
    en: {
      title: "UGC Rights & Ownership",
      sub: "User Generated Content: Your creations belong to you.",
      s1: "1. Exclusive Ownership",
      p1: "You are the sole owner of 100% of the files generated on RetailBox (QR Codes, Barcodes, Processed images).",
      s2: "2. Commercial Usage",
      p2: "RetailBox grants you unlimited and free commercial usage rights. We do not claim any copyright on your work.",
      s3: "3. Responsibility",
      p3: "You certify that you own the rights to any uploaded logos. RetailBox acts only as a passive technical provider.",
    }
  }[lang];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full">
        <BrandLogo />
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h1 className="text-4xl font-black mb-4 text-gray-900">{content.title}</h1>
          <p className="text-indigo-600 font-bold mb-10">{content.sub}</p>
          
          <div className="space-y-8">
            <section>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{content.s1}</h4>
              <p className="text-gray-600 leading-relaxed">{content.p1}</p>
            </section>
            <section>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{content.s2}</h4>
              <p className="text-gray-600 leading-relaxed">{content.p2}</p>
            </section>
            <section>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{content.s3}</h4>
              <p className="text-gray-600 leading-relaxed">{content.p3}</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}