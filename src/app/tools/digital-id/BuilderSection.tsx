/* eslint-disable @typescript-eslint/no-explicit-any */
export default function BuilderSection({
  icon,
  title,
  subtitle,
  children
}: any) {

  const Icon = icon

  return (
    <div
      className="
  relative overflow-hidden
  bg-white dark:bg-slate-900
  border border-gray-100 dark:border-slate-800
  rounded-[2.5rem]
  p-6 md:p-8
  shadow-[0_10px_40px_rgba(0,0,0,0.04)]
"
    >

      {/* HEADER */}
      <div className="flex items-start gap-4">

        <div className="
          w-12 h-12
          rounded-2xl
          bg-indigo-500/10
          text-indigo-600
          flex items-center justify-center
          shrink-0
        ">
          <Icon size={22} />
        </div>

        <div>

          <h3 className="
            text-sm
            font-black
            uppercase
            tracking-widest
            text-gray-900 dark:text-white
          ">
            {title}
          </h3>

          {subtitle && (
            <p className="
              mt-1
              text-xs
              text-gray-400
              leading-relaxed
            ">
              {subtitle}
            </p>
          )}

        </div>

      </div>

      {children}

    </div>
  )
}