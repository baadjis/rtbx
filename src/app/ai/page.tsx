import { getLang } from "@/lib/lang/lang-getter"
import AIPageClient from "./chat/[id]/AiPageClient"
import { LangType } from "@/lib/lang/types"

export default async function AiPage(){

    const lang= (await getLang() ) as LangType
    return( 
        <AIPageClient  lang={lang}/>
    )
}