/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { LangType } from "@/lib/lang/types";
import { formatSocialUrl, get_social_config } from '@/utils/social-config';
import Image from 'next/image';


function getBrightness(color: string) {
  const c = color.replace("#", "");

  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);

  return (r * 299 + g * 587 + b * 114) / 1000;
}

function getAdaptiveGradient(color: string) {
  const brightness = getBrightness(color);

  const opacity = brightness > 140 ? "22" : "55";

  return `linear-gradient(
    135deg,
    ${color}${opacity},
    transparent 50%,
    ${color}${opacity}
  )`;
}

function getAdaptiveGlow(color: string) {
  const brightness = getBrightness(color);

  return brightness > 140
    ? `${color}33`
    : `${color}66`;
}

 export default function RenderSocialLink({ link ,themeColor,lang}: { link: any,themeColor:any,lang:LangType }) {
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
          bg-black/30 md:bg-white/5
          group-hover:bg-black/40 md:group-hover:bg-white/10
          border border-white/10
          rounded-[2rem]
          backdrop-blur-xl
          transition-all duration-300
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