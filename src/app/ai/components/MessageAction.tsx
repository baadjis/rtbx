/* eslint-disable @typescript-eslint/no-explicit-any */
// app/ai/components/MessageActions.tsx
'use client';
import { useState } from 'react';
import { Copy, CheckCheck, RotateCcw, Pencil } from 'lucide-react';

type Props = {
  content: string;
  onRetry?: () => void;
  suggestions?: string[];
  onSuggestionClick?: (s: string) => void;
  t:any
};

type UserActionsProps = {
  content: string;
  onRetry?: () => void;
  onEdit?: () => void;
  t:any
};

export default function MessageActions({
  content,
  onRetry,
  suggestions = [],
  onSuggestionClick,
  t
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2 mt-1">
      {/* Suggestions chips */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onSuggestionClick?.(s)}
              className="px-3 py-1.5 bg-white/[0.05] hover:bg-indigo-500/20 border border-white/[0.08] hover:border-indigo-500/30 rounded-xl text-white/50 hover:text-indigo-300 text-xs font-medium transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Actions — toujours visibles, pas seulement au hover */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/30 hover:text-white/70 transition-all"
          title="Copier"
        >
          {copied
            ? <CheckCheck size={13} className="text-emerald-400" />
            : <Copy size={13} />
          }
        </button>

        {onRetry && (
          <button
            onClick={onRetry}
            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/30 hover:text-white/70 transition-all"
            title={t.retry}
          >
            <RotateCcw size={13} />
          </button>
        )}
      </div>
    </div>
  );
}


export function UserMessageActions({ content, onRetry, onEdit ,t}: UserActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1 mt-0.5">
      {/* Copy */}
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/25 hover:text-white/60 transition-all"
        title={t.copy}
      >
        {copied
          ? <CheckCheck size={12} className="text-emerald-400" />
          : <Copy size={12} />
        }
      </button>

      {/* Retry — renvoyer ce message */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/25 hover:text-white/60 transition-all"
          title={t.retry}
        >
          <RotateCcw size={12} />
        </button>
      )}

      {/* Edit — remettre dans l'input pour modifier */}
      {onEdit && (
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/25 hover:text-white/60 transition-all"
          title={t.edit}
        >
          <Pencil size={12} />
        </button>
      )}
    </div>
  );
}