'use client'

import { Save, Plus, Download } from 'lucide-react'

type Props = {
  onSave: () => void
  onNew: () => void
  onExportPNG?: () => void
  title?: string
  loading?: boolean
}

export default function BuilderHeader({
  onSave,
  onNew,
  onExportPNG,
  title = 'Builder',
  loading
}: Props) {
  return (
    <div className="
      w-full flex items-center justify-between
      px-4 py-3 rounded-xl border
      bg-white dark:bg-neutral-900
      border-gray-200 dark:border-neutral-700
    ">

      {/* LEFT */}
      <div className="flex items-center gap-2">
        <button
          onClick={onNew}
          className="px-3 py-2 rounded-lg text-sm
          bg-gray-100 dark:bg-neutral-800"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* CENTER */}
      <div className="font-semibold text-sm text-gray-800 dark:text-white">
        {title}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        <button
          onClick={onSave}
          className="px-3 py-2 rounded-lg text-sm
          bg-indigo-600 text-white"
        >
          <Save size={14} />
        </button>

        {onExportPNG && (
          <button
            onClick={onExportPNG}
            className="px-3 py-2 rounded-lg text-sm
            bg-gray-900 text-white
            dark:bg-white dark:text-black
          "
          >
            <Download size={14} />
          </button>
        )}

      </div>
    </div>
  )
}