/* eslint-disable @typescript-eslint/no-explicit-any */
// app/ai/components/ui/SpaceUI.tsx
'use client';
import { useState } from 'react';
import { Globe, ExternalLink, Link2} from 'lucide-react';
import Pagination from '../shared/Pagination';
import { LangType } from '@/lib/lang/types';

const PAGE_SIZE = 5;
const DATA={
  fr:{no_space_found:"Aucun space trouvé",
    no_link_found:"Aucun lien social"
  },
  en:{no_space_found:"No space found",
    no_link_found: "No social link found"
  }
}

// =====================================================
// SPACE LIST — getMySpaces, searchSpaces
// =====================================================
export function SpaceList({ data ,lang}: { data: any,lang:LangType }) {
  const [page, setPage] = useState(0);
  const spaces: any[] = Array.isArray(data) ? data : data?.data ?? [];
  const paginated = spaces.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const t=DATA[lang]

  if (!spaces.length) {
    return (
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 text-center">
        <Globe size={24} className="text-white/20 mx-auto mb-2" />
        <p className="text-white/30 text-sm">{t.no_space_found}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {paginated.map((space: any, i: number) => (
        <div key={i}
          className="group flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] hover:border-violet-500/20 rounded-2xl px-4 py-3 transition-all">

          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl flex-shrink-0 overflow-hidden"
            style={{ background: space.theme_color || '#4f46e5' }}>
            {space.avatar_url
              ? <img src={space.avatar_url} alt="" className="w-full h-full object-cover" />
              : <Globe size={16} className="text-white/60 m-auto mt-2.5" />
            }
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">
              {space.entity_name || space.slug}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-white/30 text-xs font-mono">rtbx.space/u/{space.slug}</span>
              {space.space_type && (
                <span className="text-[10px] text-white/20 bg-white/[0.04] px-1.5 py-0.5 rounded-full">
                  {space.space_type}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <a href={`/u/${space.slug}`} target="_blank" rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/40 hover:text-white transition-all">
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      ))}
      <Pagination page={page} total={spaces.length} pageSize={PAGE_SIZE} onChange={setPage}  lang={lang}/>
    </div>
  );
}

// =====================================================
// SPACE SOCIAL LINKS — getSpaceSocialLinks
// =====================================================
const NETWORK_COLORS: Record<string, string> = {
  Instagram: 'from-pink-500 to-orange-400',
  TikTok: 'from-slate-800 to-slate-600',
  YouTube: 'from-red-500 to-red-600',
  LinkedIn: 'from-blue-600 to-blue-700',
  'X (Twitter)': 'from-slate-700 to-slate-800',
  Facebook: 'from-blue-500 to-blue-600',
  Website: 'from-indigo-500 to-violet-600',
};

export function SpaceSocialLinks({ data,lang }: { data: any,lang:LangType }) {
  const links: any[] = Array.isArray(data) ? data : data?.data ?? [];
  const t=DATA[lang]
  if (!links.length) {
    return (
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 text-center">
        <Link2 size={24} className="text-white/20 mx-auto mb-2" />
        <p className="text-white/30 text-sm">{t.no_link_found}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link: any, i: number) => {
        const gradient = NETWORK_COLORS[link.network] || 'from-indigo-500 to-violet-600';
        return (
          <div key={i}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r ${gradient} bg-opacity-10 border border-white/[0.08]`}>
            <span className="text-white text-xs font-medium">{link.network}</span>
            <span className="text-white/50 text-xs">@{link.handle}</span>
          </div>
        );
      })}
    </div>
  );
}