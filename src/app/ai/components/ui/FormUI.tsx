/* eslint-disable @typescript-eslint/no-explicit-any */
// app/ai/components/ui/FormUI.tsx
'use client';
import { useState } from 'react';
import {
  FileText, ExternalLink, Globe, Lock, ChevronLeft,
  ChevronRight, BarChart2, Mail, CheckCircle, Clock3, Eye
} from 'lucide-react';

const PAGE_SIZE = 5;

function Pagination({ page, total, pageSize, onChange }: {
  page: number; total: number; pageSize: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
      <span className="text-white/30 text-xs">{total} résultats</span>
      <div className="flex items-center gap-2">
        <button onClick={() => onChange(page - 1)} disabled={page === 0}
          className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] disabled:opacity-30 flex items-center justify-center text-white/50 transition-all">
          <ChevronLeft size={13} />
        </button>
        <span className="text-white/40 text-xs">{page + 1} / {totalPages}</span>
        <button onClick={() => onChange(page + 1)} disabled={page >= totalPages - 1}
          className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] disabled:opacity-30 flex items-center justify-center text-white/50 transition-all">
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

function formatDate(date: string) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function StatusBadge({ published, visibility }: { published?: boolean; visibility?: string }) {
  if (published) return (
    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <Globe size={9} /> Publié
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
      <Lock size={9} /> Brouillon
    </span>
  );
}

// =====================================================
// FORM LIST — getMyForms, searchForms
// =====================================================
export function FormList({ data }: { data: any }) {
  const [page, setPage] = useState(0);

  // Gérer les deux formats : { created, responded, invited } ou array direct
  let forms: any[] = [];
  let hasGroups = false;

  if (data?.created !== undefined) {
    hasGroups = true;
    forms = [
      ...data.created.map((f: any) => ({ ...f, _group: 'Créés' })),
      ...(data.responded || []).map((f: any) => ({ ...f, _group: 'Répondus' })),
      ...(data.invited || []).map((f: any) => ({ ...f, _group: 'Invités' })),
    ];
  } else if (Array.isArray(data)) {
    forms = data;
  } else if (data?.data) {
    forms = Array.isArray(data.data) ? data.data : [];
  }

  const paginated = forms.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (!forms.length) {
    return (
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 text-center">
        <FileText size={24} className="text-white/20 mx-auto mb-2" />
        <p className="text-white/30 text-sm">Aucun formulaire trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {paginated.map((form: any, i: number) => (
        <div key={i}
          className="group bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] hover:border-pink-500/20 rounded-2xl px-4 py-3.5 transition-all">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {hasGroups && form._group && (
                  <span className="text-[10px] text-white/25">{form._group}</span>
                )}
                <StatusBadge published={form.is_published} visibility={form.visibility} />
                {form.category && (
                  <span className="text-[10px] text-white/25 bg-white/[0.04] px-1.5 py-0.5 rounded-full">
                    {form.category}
                  </span>
                )}
              </div>
              <p className="text-white text-sm font-semibold truncate">{form.title}</p>
              {form.description && (
                <p className="text-white/30 text-xs mt-0.5 truncate">{form.description}</p>
              )}
            </div>
            <a
              href={`/dashboard/forms/${form.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/40 hover:text-white transition-all flex-shrink-0"
            >
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white/25 text-xs">{formatDate(form.created_at)}</span>
            {form.org_name && (
              <span className="text-white/25 text-xs">par {form.org_name}</span>
            )}
          </div>
        </div>
      ))}
      <Pagination page={page} total={forms.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}

// =====================================================
// FORM RESPONSES TABLE — getFormResponses
// =====================================================
export function FormResponsesTable({ data }: { data: any }) {
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);

  const responses: any[] = Array.isArray(data) ? data : data?.data ?? [];
  const paginated = responses.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (!responses.length) {
    return (
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 text-center">
        <BarChart2 size={24} className="text-white/20 mx-auto mb-2" />
        <p className="text-white/30 text-sm">Aucune réponse pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Summary */}
      <div className="flex items-center gap-3 px-1 pb-1">
        <div className="flex items-center gap-1.5 text-white/40 text-xs">
          <BarChart2 size={12} className="text-pink-400" />
          <span>{responses.length} réponse{responses.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Rows */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        {paginated.map((r: any, i: number) => (
          <div key={i}
            className={`transition-colors ${i < paginated.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
            {/* Row header */}
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/[0.04] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] text-pink-400 font-bold">{page * PAGE_SIZE + i + 1}</span>
                </div>
                <div>
                  <p className="text-white/70 text-xs font-medium">
                    {r.respondent_name || r.respondent_email || 'Anonyme'}
                  </p>
                  <p className="text-white/25 text-[10px]">
                    {formatDate(r.created_at)} · {r.origin || 'direct'}
                  </p>
                </div>
              </div>
              <Eye size={12} className={`text-white/20 transition-transform ${expanded === i ? 'rotate-180' : ''}`} />
            </button>

            {/* Expanded answers */}
            {expanded === i && r.answers_json && (
              <div className="px-4 pb-3 space-y-2 bg-white/[0.02]">
                {Object.entries(r.answers_json).map(([key, value]: [string, any], ki: number) => (
                  <div key={ki} className="flex gap-2">
                    <span className="text-white/30 text-xs min-w-[80px] truncate">{key}:</span>
                    <span className="text-white/60 text-xs flex-1">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Pagination page={page} total={responses.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}

// =====================================================
// FORM CARD — createForm, getFormById
// =====================================================
export function FormCard({ data }: { data: any }) {
  const form = data?.data ?? data;
  if (!form?.id) return null;

  return (
    <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge published={form.is_published} />
            {form.category && (
              <span className="text-[10px] text-white/25 bg-white/[0.04] px-1.5 py-0.5 rounded-full">
                {form.category}
              </span>
            )}
          </div>
          <p className="text-white font-semibold text-sm">{form.title}</p>
          {form.description && (
            <p className="text-white/40 text-xs mt-1">{form.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <a
          href={`/dashboard/forms/${form.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 rounded-xl text-pink-400 text-xs font-medium transition-all"
        >
          <ExternalLink size={12} /> Ouvrir
        </a>
        {form.is_published && (
          <a
            href={`/f/${form.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] rounded-xl text-white/50 hover:text-white text-xs transition-all"
          >
            <Globe size={12} /> Voir public
          </a>
        )}
      </div>
    </div>
  );
}