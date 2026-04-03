/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { QRCodeCanvas } from 'qrcode.react'
import { BrandLogo } from './BrandLogo'
import { getQrIcon } from '@/utils/qr-utils'

interface PosterProps {
  innerRef: any;
  title: string;
  displayValue: string;
  qrValue: string;
  iconPath: string;
  themeColor: string;
  footerLabel: string;
}

export const MarketingPoster = ({ innerRef, title, displayValue, qrValue, iconPath, themeColor, footerLabel }: PosterProps) => (
  <div style={{ position: 'absolute', top: '300%', left: 0, pointerEvents: 'none' }}>
    <div ref={innerRef} className="p-16 bg-white text-center flex flex-col items-center justify-between border-[20px] rounded-[5rem]" 
         style={{ width: '800px', height: '1200px', borderColor: themeColor }}>
        <div className="flex flex-col items-center gap-4">
           <div className="scale-150 mb-10 mt-10"><BrandLogo /></div>
           <h1 className="text-6xl font-black text-gray-900 uppercase tracking-tighter mt-12">{title}</h1>
        </div>
        <div className="bg-white p-10 rounded-[4rem] shadow-2xl border-[15px] border-gray-50">
          <QRCodeCanvas value={qrValue} size={450} level="H" marginSize={4} 
            imageSettings={{ src: getQrIcon(iconPath, themeColor), height: 80, width: 80, excavate: true }} 
          />
        </div>
        <div className="space-y-6 mb-10">
            <div className="flex items-center justify-center gap-4 bg-indigo-50 px-10 py-6 rounded-[2rem]">
                <span className="text-5xl font-black text-indigo-600">{displayValue}</span>
            </div>
            <p className="text-3xl font-bold text-gray-400 uppercase tracking-[0.3em]">{footerLabel}</p>
        </div>
        <p className="text-sm font-black text-gray-200 uppercase tracking-widest pb-10">RetailBox • www.rtbx.space</p>
    </div>
  </div>
);