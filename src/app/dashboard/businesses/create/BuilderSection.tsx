/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
export default function BuilderSection({
  icon,
  title,
  subtitle,
  children
}: any) {

  const Icon = icon

  return (
    <div className="
  bg-white dark:bg-slate-900
  rounded-[2.5rem]
  p-6 md:p-8
  border border-gray-100 dark:border-slate-800
  shadow-sm
">

  {/* HEADER */}
  <div className="flex items-start gap-4">

    <div className="
      w-14 h-14 rounded-2xl
      bg-indigo-50 dark:bg-indigo-500/10
      flex items-center justify-center
      text-indigo-600
      shrink-0
    ">
      <Icon size={24} />
    </div>

    <div>
      <h3 className="
        text-lg font-black
        text-gray-900 dark:text-white
      ">
        {title}
      </h3>

      <p className="
        text-sm text-gray-500
        mt-1 leading-relaxed
      ">
        {subtitle}
      </p>
    </div>

  </div>

  {/* CONTENT */}
  <div className="mt-8">
    {children}
  </div>

</div>
  )
}