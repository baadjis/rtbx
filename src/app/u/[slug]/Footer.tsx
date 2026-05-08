/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { BrandLogo } from "@/components/BrandLogo";
import Link from "next/link";

export default function Footer({t}:{t:any}){

    return(<div className="pt-4 pb-24 md:pb-10 space-y-4 flex flex-col items-center">
  <Link
    href="/"
    className="
      inline-flex flex-col items-start gap-2
      px-5 py-4
      rounded-[2rem]
      bg-white/10
      hover:bg-white/15
      border border-white/10
      backdrop-blur-xl
      transition-all duration-300
      hover:scale-[1.02]
      hover:shadow-lg
      no-underline
      max-w-full
    "
  >
    {/* Logo + domain */}
    <div className="flex items-center gap-3">
      <div className="-mb-6">
        <BrandLogo />
      </div>

      <p className="text-sm font-bold text-white leading-none -translate-y-[1px]">
        rtbx.space
      </p>
    </div>

    {/* CTA */}
    <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 leading-tight text-center">
      Your modern social space
    </p>
  </Link>

  {/* Footer text */}
  <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] text-center px-4">
    {t.footer_text}
  </p>
</div>)
}