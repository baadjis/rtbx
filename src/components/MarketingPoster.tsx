/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client'
import { QRCodeCanvas } from 'qrcode.react'
import { BrandLogo } from './BrandLogo'
import { getQrIcon } from '@/utils/qr-utils'

interface PosterProps {
  innerRef: any;
  title: string;
  subtitle?: string;
  displayValue: string;
  qrValue: string;
  iconPath: string;
  themeColor: string;
  footerLabel: string;
  // Nouvelles options de personnalisation
  userLogo?: string | null;     // URL ou Base64 de l'image
  businessName?: string | null;  // Texte du nom du commerce
}

export const MarketingPoster = ({ 
  innerRef, 
  title, 
  subtitle, 
  displayValue, 
  qrValue, 
  iconPath, 
  themeColor, 
  footerLabel,
  userLogo,
  businessName
}: PosterProps) => (
  <div style={{ position: 'absolute', top: '300%', left: 0, pointerEvents: 'none' }}>
    <div ref={innerRef} className="p-16 bg-white text-center flex flex-col items-center justify-between border-[20px] rounded-[5rem]" 
         style={{ width: '800px', height: '1200px', borderColor: themeColor }}>
        
        {/* HEADER : Logo Utilisateur > Nom Business > Logo RetailBox */}
        <div className="flex flex-col items-center gap-2 mt-8">
           <div className="mb-10 flex items-center justify-center min-h-[120px]">
              {userLogo ? (
                /* Utilisation de img standard pour garantir la capture html-to-image */
                <img 
                  src={userLogo} 
                  alt="Business Logo" 
                  style={{ maxHeight: '120px', maxWidth: '300px', objectFit: 'contain' }} 
                />
              ) : businessName ? (
                <span className="text-6xl font-black text-gray-900 tracking-tighter italic">
                    {businessName}
                </span>
              ) : (
                <div className="scale-[2]">
                    <BrandLogo />
                </div>
              )}
           </div>

           <h1 className="text-6xl font-black text-gray-900 uppercase tracking-tighter mt-8 leading-tight">
             {title}
           </h1>
           {subtitle && (
             <p className="text-3xl font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">
               {subtitle}
             </p>
           )}
        </div>

        {/* QR CODE : Centré avec zone de respiration */}
        <div className="flex flex-col items-center my-10">
            <div className="bg-white p-10 rounded-[4rem] shadow-2xl border-[15px] border-gray-50">
              <QRCodeCanvas 
                value={qrValue} 
                size={450} 
                level="H" 
                marginSize={2} 
                imageSettings={{ 
                    src: getQrIcon(iconPath, themeColor), 
                    height: 90, 
                    width: 90, 
                    excavate: true 
                }} 
              />
            </div>
        </div>

        {/* FOOTER : Valeur affichée (SSID, Numéro, etc.) */}
        <div className="space-y-8 mb-10 w-full px-20">
            <div className="flex items-center justify-center gap-4 bg-indigo-50 px-10 py-8 rounded-[2.5rem]">
                <span className="text-5xl font-black text-indigo-600 truncate max-w-full">
                    {displayValue}
                </span>
            </div>
            <p className="text-3xl font-extrabold text-gray-400 uppercase tracking-[0.25em]">
                {footerLabel}
            </p>
        </div>

        {/* Branding Discret RetailBox en bas pour le SEO/Crédibilité */}
        <p className="text-sm font-black text-gray-200 uppercase tracking-[0.4em] pb-6">
            RetailBox • www.rtbx.space
        </p>
    </div>
  </div>
);