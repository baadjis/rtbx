/* eslint-disable @typescript-eslint/no-explicit-any */
// app/ai/components/ui/ShortLinkUI.tsx
'use client';
import { useState } from 'react';
import { Copy, Check, ExternalLink, BarChart2, QrCode, Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { LangType } from '@/lib/lang/types';

const BASE_URL = 'https://www.rtbx.space/s/';
const DATA={
  fr:{copied_it:"copié",
    copy_it:"copier",
    download:"Téléchaarger",
    open:"Ouvrir",
    close:"Fermer",
    no_link_found:"Aucun lien trouvé",
    last_clic:"Dernier clic",
    total_clics:"total clics",
    short_link:"lien court"
  },
  en:{
    copied_it:"copied",
    copy_it:"copy",
    download:"Download",
    open:"Open",
    close:"Close",
    no_link_found:"No link found",
    last_clic:"last clic",
    total_clics:"total clic",
    short_link:"short link"

  }
}

// =====================================================
// COPY BUTTON
// =====================================================
function CopyButton({ text,lang }: { text: string ,lang:LangType}) {
  const [copied, setCopied] = useState(false);
  const t=DATA[lang]
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/60 hover:text-white text-xs transition-all">
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
      {copied ? t.copied_it : t.copy_it}
    </button>
  );
}

// =====================================================
// QR MODAL
// =====================================================
function QRModal({ url, code, onClose,lang }: { url: string; code: string; onClose: () => void ;lang:LangType}) {
  const t=DATA[lang]
  const download = () => {
    const canvas = document.getElementById(`qr-${code}`) as HTMLCanvasElement;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `qr-${code}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-[#1a1a1f] border border-white/[0.08] rounded-3xl p-6 flex flex-col items-center gap-4 shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <p className="text-white font-semibold text-sm">{url}</p>
        <div className="bg-white p-4 rounded-2xl">
          <QRCodeCanvas id={`qr-${code}`} value={url} size={200} level="H" />
        </div>
        <div className="flex gap-3">
          <button onClick={download}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-xs font-medium transition-all">
            <Download size={13} /> {t.download}
          </button>
          <button onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] rounded-xl text-white/60 text-xs transition-all">
          {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// SHORT LINK CARD — création ou update
// =====================================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ShortLinkCard({ data ,lang='en'}: { data: any,lang:LangType }) {
  const [showQR, setShowQR] = useState(false);
  const shortUrl = `${BASE_URL}${data.short_code}`;
  const t= DATA[lang]

  return (
    <>
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {data.title || data.long_url}
            </p>
            <p className="text-white/40 text-xs truncate mt-0.5">{data.long_url}</p>
          </div>
          <span className="flex-shrink-0 text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full font-mono">
            {data.short_code}
          </span>
        </div>

        <div className="flex items-center gap-2 p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.06]">
          <span className="flex-1 text-indigo-300 text-xs font-mono truncate">{shortUrl}</span>
          <CopyButton text={shortUrl}  lang={lang}/>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/40 hover:text-white transition-all">
            <ExternalLink size={12} />
          </a>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white/40 text-xs">
            <BarChart2 size={12} />
            <span>{data.clicks ?? 0} clics</span>
          </div>
          <button onClick={() => setShowQR(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] rounded-xl text-white/60 hover:text-white text-xs transition-all">
            <QrCode size={12} /> QR Code
          </button>
        </div>
      </div>

      {showQR && <QRModal url={shortUrl} code={data.short_code} onClose={() => setShowQR(false)}  lang={lang}/>}
    </>
  );
}

// =====================================================
// SHORT LINK LIST — liste des liens
// =====================================================
export function ShortLinkList({ data,lang='en' }: { data: any ,lang:LangType}) {
  const [showQR, setShowQR] = useState<string | null>(null);
  const links = data?.links ?? (Array.isArray(data) ? data : []);
  const t=DATA[lang]
  if (!links.length) {
    return (
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 text-center text-white/30 text-sm">
        {t.no_link_found}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {links.map((link: any, i: number) => {
          const shortUrl = `${BASE_URL}${link.short_code}`;
          return (
            <div key={i}
              className="flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.1] rounded-2xl px-4 py-3 transition-all group">

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">
                  {link.title || link.long_url}
                </p>
                <p className="text-indigo-400 text-xs font-mono mt-0.5">{shortUrl}</p>
              </div>

              {/* Clics */}
              <div className="flex items-center gap-1 text-white/30 text-xs flex-shrink-0">
                <BarChart2 size={11} />
                {link.clicks ?? 0}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton text={shortUrl}  lang={lang}/>
                <button onClick={() => setShowQR(link.short_code)}
                  className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/40 hover:text-white transition-all">
                  <QrCode size={12} />
                </button>
                <a href={shortUrl} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/40 hover:text-white transition-all">
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {showQR && (
        <QRModal
          url={`${BASE_URL}${showQR}`}
          code={showQR}
          onClose={() => setShowQR(null)}
          lang={lang}
        />
      )}
    </>
  );
}

// =====================================================
// SHORT LINK STATS
// =====================================================
export function ShortLinkStats({ data ,lang}: { data: any ,lang:LangType}) {
  const [showQR, setShowQR] = useState(false);
  const shortUrl = `${BASE_URL}${data.short_code || ''}`;
  const t=DATA[lang]

  return (
    <>
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white font-semibold text-sm">{data.title || t.short_link}</p>
            <p className="text-white/40 text-xs mt-0.5 truncate max-w-[200px]">{data.long_url}</p>
          </div>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full font-mono">
            {data.short_code}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">{t.total_clics}</p>
            <p className="text-white text-2xl font-bold">{data.clicks ?? 0}</p>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">{t.last_clic}</p>
            <p className="text-white text-xs font-medium">
              {data.last_clicked_at
                ? new Date(data.last_clicked_at).toLocaleDateString('fr-FR')
                : '—'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <CopyButton text={shortUrl} lang={lang}/>
          <button onClick={() => setShowQR(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] rounded-xl text-white/60 hover:text-white text-xs transition-all">
            <QrCode size={12} /> QR Code
          </button>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] rounded-xl text-white/60 hover:text-white text-xs transition-all">
            <ExternalLink size={12} /> {t.open}
          </a>
        </div>
      </div>

      {showQR && (
        <QRModal url={shortUrl} code={data.short_code} onClose={() => setShowQR(false)} lang={lang}/>
      )}
    </>
  );
}