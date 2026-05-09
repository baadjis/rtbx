/* eslint-disable @typescript-eslint/no-explicit-any */
import { LangType } from "@/lib/lang/types"
import { get_social_config } from "@/utils/social-config"
import { Link2, Plus, Trash2 } from "lucide-react"

export default function SocialLinksAdd({links,setLinks,updateLink,t,lang}:
    {links:any[],setLinks:any,updateLink:any,t:any,lang:LangType}){

      const SOCIAL_CONFIG = get_social_config(lang)


            return(
    
              <div className="space-y-4">

                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">

                  <Link2 size={14} />

                  {t.label_socials || 'Réseaux sociaux'}

                </label>

                {links.map((link, i) => {

                  const networkConfig =
                    SOCIAL_CONFIG[
                      link.network as keyof typeof SOCIAL_CONFIG
                    ]

                  return (

                    <div
                      key={link.id}
                      className="
                        flex flex-col
                        p-5
                        bg-gray-50 dark:bg-slate-800/50
                        rounded-[2rem]
                        border border-gray-100 dark:border-slate-700
                        gap-3
                      "
                    >

                      <div className="flex gap-2">

                        <select
                          value={link.network}
                          onChange={(e) =>
                            updateLink(
                              i,
                              'network',
                              e.target.value
                            )
                          }
                          className="
                            flex-1 p-3
                            bg-white dark:bg-slate-800
                            border-none rounded-xl
                            font-bold text-sm
                            dark:text-white
                          "
                        >

                          {Object.keys(SOCIAL_CONFIG).map(net => (
                            <option
                              key={net}
                              value={net}
                            >
                              {net}
                            </option>
                          ))}

                        </select>

                        <button
                          onClick={() =>
                            setLinks(
                              links.filter(
                                (_, idx) => idx !== i
                              )
                            )
                          }
                          className="
                            p-3
                            text-red-500
                            bg-red-50
                            dark:bg-red-900/20
                            rounded-xl
                            border-none
                            cursor-pointer
                          "
                        >

                          <Trash2 size={18} />

                        </button>

                      </div>

                      <input
                        value={link.handle}
                        onChange={(e) =>
                          updateLink(
                            i,
                            'handle',
                            e.target.value
                          )
                        }
                        placeholder={
                          networkConfig.ph ||
                          t.ph_handle
                        }
                        className="
                          w-full p-4
                          bg-white dark:bg-slate-800
                          border-none rounded-xl
                          font-bold text-sm
                          dark:text-white
                          focus:ring-2 focus:ring-indigo-500
                        "
                      />

                    </div>
                  )
                })}

                <button
                  onClick={() =>
                    setLinks([
                      ...links,
                      {
                        id: crypto.randomUUID(),
                        network: 'Instagram',
                        handle: ''
                      }
                    ])
                  }
                  className="
                    w-full py-4
                    border-2 border-dashed
                    border-gray-200 dark:border-slate-700
                    rounded-3xl
                    text-gray-400
                    font-bold
                    hover:border-indigo-400
                    transition-all
                    bg-transparent
                    cursor-pointer
                    flex items-center justify-center gap-2
                  "
                >

                  <Plus size={18} />

                  {t.btn_add_net}

                </button>

              </div>
            )


}