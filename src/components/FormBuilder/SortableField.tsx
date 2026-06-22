/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import {
  GripVertical, Trash2, Plus, X, Star,
  Upload, Loader2, Globe
} from 'lucide-react';
import { useState } from 'react';
import CountrySelect from '../CountrySelect';

const TYPE_BADGE_COLOR: Record<string, string> = {
  text: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
  number: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
  email: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
  phone: 'text-teal-500 bg-teal-50 dark:bg-teal-900/20',
  date: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
  select: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
  multiselect: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20',
  range: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20',
  stars: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  nps: 'text-red-500 bg-red-50 dark:bg-red-900/20',
  image_choice: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20',
};

export function SortableField({ field, index, onRemove, onUpdate, t, lang = 'fr' }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const typeLabel = (t.types as any)?.[field.type] || field.type;
  const badgeColor = TYPE_BADGE_COLOR[field.type] || 'text-gray-500 bg-gray-50 dark:bg-slate-800';

  // Upload d'image pour image_choice → Supabase storage forms/image_choice
  const handleImageUpload = async (file: File, optIndex: number) => {
    setUploadingIdx(optIndex);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'forms/image_choice');

      const res = await fetch('/api/storage/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.url) {
        const newOpts = [...field.options];
        newOpts[optIndex] = { ...newOpts[optIndex], image_url: data.url };
        onUpdate(field.id, { options: newOpts });
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploadingIdx(null);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm mb-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab p-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-gray-400">
            <GripVertical size={18} />
          </div>
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
            {lang === 'fr' ? 'Question' : 'Question'} {index + 1}
          </span>
          <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${badgeColor}`}>
            {typeLabel}
          </span>
        </div>
        <button onClick={() => onRemove(field.id)} className="p-2 text-gray-300 hover:text-red-500 bg-transparent border-none cursor-pointer">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Label + required */}
        <input
          value={field.label}
          onChange={(e) => onUpdate(field.id, { label: e.target.value })}
          placeholder={t.placeholder_q}
          className="w-full text-lg font-bold bg-transparent border-none focus:ring-0 p-0 dark:text-white"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Placeholder seulement pour les champs texte */}
          {['text', 'number', 'email'].includes(field.type) ? (
            <input
              value={field.placeholder || ''}
              onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
              placeholder={t.placeholder_help}
              className="text-xs bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 dark:text-slate-300"
            />
          ) : <div />}

          <button
            type="button"
            onClick={() => onUpdate(field.id, { required: !field.required })}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${field.required ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}
          >
            {t.label_required}
          </button>
        </div>

        {/* ===== CONFIG SPÉCIFIQUE PAR TYPE ===== */}

        {/* RANGE */}
        {field.type === 'range' && (
          <div className="p-4 bg-pink-50/50 dark:bg-pink-900/10 rounded-2xl border border-pink-100 dark:border-pink-900/30 space-y-3">
            <p className="text-[9px] font-black text-pink-600 uppercase tracking-widest">{t.label_range_config}</p>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder={t.min_label} value={field.range_settings?.min_label || ''}
                onChange={e => onUpdate(field.id, { range_settings: { ...field.range_settings, min_label: e.target.value } })}
                className="p-2 bg-white dark:bg-slate-800 border-none rounded-lg text-xs font-bold" />
              <input placeholder={t.max_label} value={field.range_settings?.max_label || ''}
                onChange={e => onUpdate(field.id, { range_settings: { ...field.range_settings, max_label: e.target.value } })}
                className="p-2 bg-white dark:bg-slate-800 border-none rounded-lg text-xs font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="Min" value={field.range_settings?.min ?? 0}
                onChange={e => onUpdate(field.id, { range_settings: { ...field.range_settings, min: Number(e.target.value) } })}
                className="p-2 bg-white dark:bg-slate-800 border-none rounded-lg text-xs font-bold" />
              <input type="number" placeholder="Max" value={field.range_settings?.max ?? 10}
                onChange={e => onUpdate(field.id, { range_settings: { ...field.range_settings, max: Number(e.target.value) } })}
                className="p-2 bg-white dark:bg-slate-800 border-none rounded-lg text-xs font-bold" />
            </div>
          </div>
        )}

        {/* STARS */}
        {field.type === 'stars' && (
          <div className="p-4 bg-yellow-50/50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100 dark:border-yellow-900/30 space-y-3">
            <p className="text-[9px] font-black text-yellow-600 uppercase tracking-widest">{t.label_stars_config}</p>
            <div className="flex items-center gap-3">
              {[3, 5, 7, 10].map(n => (
                <button key={n} type="button"
                  onClick={() => onUpdate(field.id, { star_settings: { max_stars: n } })}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    (field.star_settings?.max_stars || 5) === n
                      ? 'bg-yellow-500 text-white'
                      : 'bg-white dark:bg-slate-800 text-gray-400'
                  }`}>
                  <Star size={12} /> {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* NPS — pas de config, juste un aperçu info */}
        {field.type === 'nps' && (
          <div className="p-4 bg-red-50/50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
            <p className="text-[11px] text-red-700 dark:text-red-300 font-medium italic">
              {lang === 'fr'
                ? 'Échelle fixe de 0 à 10 (Net Promoter Score)'
                : 'Fixed scale from 0 to 10 (Net Promoter Score)'}
            </p>
          </div>
        )}

        {/* SELECT / MULTISELECT */}
        {(field.type === 'select' || field.type === 'multiselect') && (
          <div className="space-y-2">
            {(field.options || []).map((opt: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={opt}
                  onChange={e => {
                    const newOpts = [...field.options]; newOpts[i] = e.target.value;
                    onUpdate(field.id, { options: newOpts })
                  }}
                  className="flex-1 p-2 bg-gray-50 dark:bg-slate-800 border-none rounded-lg text-xs"
                />
                <button onClick={() => onUpdate(field.id, { options: field.options.filter((_: any, idx: number) => idx !== i) })} className="p-2 text-red-400 bg-transparent border-none cursor-pointer">
                  <X size={14} />
                </button>
              </div>
            ))}
            <button onClick={() => onUpdate(field.id, { options: [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`] })}
              className="text-[10px] font-bold text-indigo-600 uppercase bg-transparent border-none cursor-pointer flex items-center gap-1">
              <Plus size={12} /> {t.btn_add_option}
            </button>
          </div>
        )}

        {/* IMAGE_CHOICE */}
        {field.type === 'image_choice' && (
          <div className="space-y-3">
            {(field.options || []).map((opt: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-cyan-50/50 dark:bg-cyan-900/10 rounded-2xl border border-cyan-100 dark:border-cyan-900/30">
                {/* Preview / upload */}
                <label className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 flex-shrink-0 cursor-pointer group">
                  {uploadingIdx === i ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader2 size={16} className="animate-spin text-cyan-500" />
                    </div>
                  ) : opt.image_url ? (
                    <Image src={opt.image_url} alt={opt.label} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Upload size={16} className="text-gray-300 group-hover:text-cyan-500" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, i);
                    }}
                  />
                </label>

                <div className="flex-1 space-y-1.5">
                  <input
                    value={opt.label}
                    onChange={e => {
                      const newOpts = [...field.options]; newOpts[i] = { ...opt, label: e.target.value };
                      onUpdate(field.id, { options: newOpts });
                    }}
                    placeholder={lang === 'fr' ? "Nom de l'option" : 'Option name'}
                    className="w-full p-2 bg-white dark:bg-slate-800 border-none rounded-lg text-xs font-bold"
                  />
                  <input
                    value={opt.image_url || ''}
                    onChange={e => {
                      const newOpts = [...field.options]; newOpts[i] = { ...opt, image_url: e.target.value };
                      onUpdate(field.id, { options: newOpts });
                    }}
                    placeholder="https://... ou uploadez"
                    className="w-full p-2 bg-white dark:bg-slate-800 border-none rounded-lg text-[10px] text-gray-400"
                  />
                </div>

                <button onClick={() => onUpdate(field.id, { options: field.options.filter((_: any, idx: number) => idx !== i) })}
                  className="p-2 text-red-400 bg-transparent border-none cursor-pointer flex-shrink-0">
                  <X size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={() => onUpdate(field.id, { options: [...(field.options || []), { label: `Option ${(field.options?.length || 0) + 1}`, image_url: '' }] })}
              className="text-[10px] font-bold text-cyan-600 uppercase bg-transparent border-none cursor-pointer flex items-center gap-1">
              <Plus size={12} /> {t.btn_add_option}
            </button>
          </div>
        )}

        {/* PHONE */}
        {field.type === 'phone' && (
  <div className="p-4 bg-teal-50/50 dark:bg-teal-900/10 rounded-2xl border border-teal-100 dark:border-teal-900/30">
    <CountrySelect
      country={field.phone_settings?.default_country || 'FR'}
      setCountry={(value) => onUpdate(field.id, { phone_settings: { default_country: value } })}
      label={t.label_phone_config}
    />
  </div>
)}
      </div>
    </div>
  );
}