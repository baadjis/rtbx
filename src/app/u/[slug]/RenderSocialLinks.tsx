/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { LangType } from "@/lib/lang/types";
import { formatSocialUrl, get_social_config } from '@/utils/social-config';
import { getAdaptiveGlow, getAdaptiveGradient } from "@/utils/styles-utils";
import Image from 'next/image';


 export function RenderSocialLink({ link ,themeColor,lang}: { link: any,themeColor:any,lang:LangType }) {
      const SOCIAL_CONFIG = get_social_config(lang);

    const config = SOCIAL_CONFIG[link.network];
  if (!config) return null;

  const finalUrl = formatSocialUrl(link.network, link.handle, lang);

  return (
    <a
      href={finalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-[2rem] p-[1px] transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: getAdaptiveGradient(themeColor)
      }}
    >
      <div
        className="
    flex items-center gap-5 p-4
    
    group-hover:bg-white/15
    border border-white/15
    rounded-[2rem]
    
    transition-all duration-300
    shadow-[0_8px_32px_rgba(0,0,0,0.12)]
    bg-white/10
    backdrop-blur-xl
  "
        style={{
          boxShadow: `0 0 0px transparent`
        }}
      >
        <div
  className="rounded-2xl p-[1px] transition-all duration-300 group-hover:scale-105"
  style={{
    background: `linear-gradient(135deg, ${themeColor}55, rgba(255,255,255,0.08))`
  }}
>
  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 p-2.5 shadow-inner">
    <Image
      src={`/social_assets/${config.folder}/glyph/digital/png/full.png`}
      alt={link.network}
      width={30}
      height={30}
      className="object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
    />
  </div>
</div>

        <div className="text-left">
          <span className="block text-lg font-bold text-white">
            {link.network}
          </span>

          <span
            className="block text-[10px] font-black uppercase tracking-widest transition-colors duration-300"
            style={{
              color: "rgba(255,255,255,0.6)"
            }}
          >
            {config.action}
          </span>
        </div>

        <div className="ml-auto opacity-0 group-hover:opacity-40 transition-all pr-2 translate-x-2 group-hover:translate-x-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path d="M5 12h14m-7-7 7 7-7 7" />
          </svg>
        </div>

        {/* Glow */}
        <div
          className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: `0 0 25px ${getAdaptiveGlow(themeColor)}`
          }}
        />
      </div>
    </a>
  );
}


export default function RenderSocialLinks({themeColor,lang,socialLinks}:{themeColor:any,socialLinks:any[],lang:LangType}){
     return(
      <div className="space-y-4 w-full px-1 md:px-0">
                  {socialLinks.length > 0 ? socialLinks.map((link: any, i: number) => {
                     return <RenderSocialLink link={link} themeColor={themeColor} 
                     lang={lang}
                       key={i} />
                      
      
                  }) : (
                    <div className="py-10 opacity-30 italic font-medium">No links available</div>
                  )}
              </div>
     )
}