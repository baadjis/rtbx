import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import "./globals.css";

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
      title: "RetailBox | Votre Identité Digitale & Outils Pro",
      description: "Outils professionnels pour commerçants et entrepreneurs. Générez des QR Codes, Barcodes et gérez vos liens RetailLink.",
    },
    en: {
      title: "RetailBox | Your Digital Identity & Pro Tools",
      description: "Professional tools for retailers and entrepreneurs. Generate QR Codes, Barcodes, and manage your RetailLinks.",
    },
  };

  const t = translations[lang];

  return {
    title: t.title,
    description: t.description,
    other:{
      "google-adsense-account" :"ca-pub-4081303157053373"
    },
    // On peut aussi traduire les balises pour les réseaux sociaux (OpenGraph) ici
    openGraph: {
      title: t.title,
      description: t.description,
      url: 'https://rtbx.space',
      siteName: 'RetailBox',
      images: [
        {
          url: 'https://baadjis-utilitybox.hf.space/og-banner.png?v=4',
          width: 1200,
          height: 630,
        },
      ],
      locale: lang === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.description,
    },
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
