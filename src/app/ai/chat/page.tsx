import { getLang } from "@/lib/lang/lang-getter";
import Layout from "../layout";
import ChatListPage from "./ChatListClient";
import { LangType } from "@/lib/lang/types";

export default  async function ChatPage(){
     const lang = await getLang() as LangType
    return(

        <Layout lang={lang}>
            <ChatListPage  lang ={lang}/>
        </Layout>
    )
}