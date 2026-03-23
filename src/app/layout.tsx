import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const langValue = cookieStore.get("lang")?.value;
  const lang = (langValue === "en" ? "en" : "fr") as "en" | "fr";

  const translations = {
    fr: {
      title: "RetailBox | Outils Pro : QR Code, Barcode, Détourage IA & Avis Google",
      desc: "La boîte à outils n°1 pour commerçants : Générateur de QR Code menu, étiquettes de soldes prix barré, codes-barres EAN-13, détourage photo produit par IA et booster d'avis Google.",
      keywords: "générateur qr code gratuit, créer code barre ean13, étiquette prix barré, enlever fond image ia, qr code wifi, qr code whatsapp, vcard qr code, réducteur de lien rgpd, booster avis google maps, identité digitale commerçant, retailbox"
    },
    en: {
      title: "RetailBox | Pro Tools: QR Code, Barcode, AI Background Removal & Google Reviews",
      desc: "The #1 toolkit for retailers: Professional QR Code generator, sale labels with crossed prices, EAN-13 barcodes, AI product photo background removal, and Google review booster.",
      keywords: "free qr code generator, create ean13 barcode, sale price tags, ai background remover, wifi qr code, whatsapp qr link, vcard qr, gdpr link shortener, google reviews booster, digital identity for sellers, retailbox"
    },
  };

  const t = translations[lang];

  return {
    title: t.title,
    description: t.desc,
    keywords: t.keywords,
    
    // --- SEO TECHNIQUE AVANCÉ ---
    alternates: {
      canonical: 'https://www.rtbx.space',
      languages: {
        'fr-FR': 'https://www.rtbx.space/?lang=fr',
        'en-US': 'https://www.rtbx.space/?lang=en',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // --- OPEN GRAPH (FACEBOOK / WHATSAPP / LINKEDIN) ---
    openGraph: {
      title: t.title,
      description: t.desc,
      url: 'https://rtbx.space',
      siteName: 'RetailBox',
      images: [
        {
          url: 'https://www.rtbx.space/og-banner.png?v=6', // Mise à jour de version pour forcer le refresh
          width: 1200,
          height: 630,
          alt: 'RetailBox Professional Tools Dashboard',
        },
      ],
      locale: lang === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
    },

    // --- TWITTER / X ---
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.desc,
      images: ['https://www.rtbx.space/og-banner.png?v=6'],
      creator: '@RetailBox',
    },

    // --- VÉRIFICATION & THEME ---
    verification: {
      google: "ca-pub-4081303157053373", // Ton ID Adsense
    },
    other: {
      "google-adsense-account": "ca-pub-4081303157053373",
      "apple-mobile-web-app-title": "RetailBox",
    },
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    ],
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     
      
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GA_ID || ''} />
        {children}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4081303157053373"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
