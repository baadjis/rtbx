import { LangType } from "@/lib/lang/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
const DATA={
  fr:{results:"resultats"},
  en:{results:"results"}
}
export default function Pagination({ page, total,lang, pageSize, onChange }: {
  page: number; total: number; lang:LangType; pageSize: number; onChange: (p: number) => void;
}) {
  const t= DATA[lang]
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
      <span className="text-white/30 text-xs">{total} {t.results}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 0}
          className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] disabled:opacity-30 flex items-center justify-center text-white/50 transition-all"
        >
          <ChevronLeft size={13} />
        </button>
        <span className="text-white/40 text-xs">{page + 1} / {totalPages}</span>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] disabled:opacity-30 flex items-center justify-center text-white/50 transition-all"
        >
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}