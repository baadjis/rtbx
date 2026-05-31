import { getLang } from "@/lib/lang/lang-getter"
import AIPageClient from "./chat/[id]/AiPageClient"
import { LangType } from "@/lib/lang/types"
import Layout from "./layout"

export default async function AiPage(){

    const lang= (await getLang() ) as LangType
    return( <Layout lang={lang}>
        <AIPageClient  lang={lang}/>
    </Layout> )
}