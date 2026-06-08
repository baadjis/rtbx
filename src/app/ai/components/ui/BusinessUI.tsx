/* eslint-disable @typescript-eslint/no-explicit-any */
// app/ai/components/ui/BusinessUI.tsx
'use client';
import { useState } from 'react';
import { Building2, ExternalLink, MapPin, Phone, Mail, Globe } from 'lucide-react';
import Pagination  from '../shared/Pagination';
import { formatDate } from '../shared/DateFormatter';
import { LangType } from '@/lib/lang/types';

// =====================================================
// BUSINESS LIST — getUserBusinesses
// =====================================================
export function BusinessList({ data, lang = 'en' }: { data: any; lang?: LangType }) {
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 5;

  const businesses: any[] = Array.isArray(data) ? data : data?.data ?? [];
  const paginated = businesses.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const t = {
    fr: {
      empty: 'Aucun business trouvé',
      open: 'Ouvrir',
      created: 'Créé le',
    },
    en: {
      empty: 'No business found',
      open: 'Open',
      created: 'Created',
    },
  }[lang];

  if (!businesses.length) {
    return (
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 text-center">
        <Building2 size={24} className="text-white/20 mx-auto mb-2" />
        <p className="text-white/30 text-sm">{t.empty}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {paginated.map((biz: any, i: number) => (
        <div key={i}
          className="group bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] hover:border-amber-500/20 rounded-2xl px-4 py-3.5 transition-all">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{biz.name}</p>
              {biz.category && (
                <span className="text-[10px] text-white/25 bg-white/[0.04] px-1.5 py-0.5 rounded-full mt-1 inline-block">
                  {biz.category}
                </span>
              )}
            </div>
            
             <a href={`/dashboard/businesses/${biz.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/40 hover:text-white transition-all flex-shrink-0"
            >
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {biz.address && (
              <div className="flex items-center gap-1.5 text-white/35 text-xs">
                <MapPin size={11} className="text-amber-400" />
                <span className="truncate max-w-[160px]">{biz.address}</span>
              </div>
            )}
            {biz.phone && (
              <div className="flex items-center gap-1.5 text-white/35 text-xs">
                <Phone size={11} className="text-amber-400" />
                {biz.phone}
              </div>
            )}
            {biz.email && (
              <div className="flex items-center gap-1.5 text-white/35 text-xs">
                <Mail size={11} className="text-amber-400" />
                <span className="truncate max-w-[140px]">{biz.email}</span>
              </div>
            )}
            {biz.website && (
              
               <a href={biz.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-white/35 hover:text-amber-400 text-xs transition-colors"
              >
                <Globe size={11} className="text-amber-400" />
                {biz.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>

          {biz.created_at && (
            <p className="text-white/20 text-[10px] mt-2">
              {t.created} {formatDate(biz.created_at)}
            </p>
          )}
        </div>
      ))}

      <Pagination
        page={page}
        total={businesses.length}
        pageSize={PAGE_SIZE}
        onChange={setPage}
        lang={lang}
      />
    </div>
  );
}

// =====================================================
// BUSINESS CARD — createBusiness, updateBusiness
// =====================================================
export function BusinessCard({ data, lang = 'en' }: { data: any; lang?: LangType }) {
  const biz = data?.data ?? data;
  if (!biz?.id) return null;

  const t = {
    fr: { open: 'Ouvrir', website: 'Site web' },
    en: { open: 'Open', website: 'Website' },
  }[lang];

  return (
    <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Building2 size={18} className="text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm">{biz.name}</p>
          {biz.category && (
            <span className="text-[10px] text-white/30">{biz.category}</span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1.5">
        {biz.address && (
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <MapPin size={11} className="text-amber-400 flex-shrink-0" />
            {biz.address}
          </div>
        )}
        {biz.phone && (
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Phone size={11} className="text-amber-400 flex-shrink-0" />
            {biz.phone}
          </div>
        )}
        {biz.email && (
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Mail size={11} className="text-amber-400 flex-shrink-0" />
            {biz.email}
          </div>
        )}
        {biz.website && (
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Globe size={11} className="text-amber-400 flex-shrink-0" />
            <a href={biz.website} target="_blank" rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors truncate">
              {biz.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
      </div>

      {/* Action */}
      
       <a href={`/dashboard/businesses/${biz.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl text-amber-400 text-xs font-medium transition-all w-fit"
      >
        <ExternalLink size={12} /> {t.open}
      </a>
    </div>
  );
}