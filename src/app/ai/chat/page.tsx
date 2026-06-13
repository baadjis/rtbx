import { getLang } from "@/lib/lang/lang-getter";
import ChatListPage from "./ChatListClient";
import { LangType } from "@/lib/lang/types";

export default  async function ChatPage(){
     const lang =(await getLang()) as LangType
    return(

        
            <ChatListPage  lang ={lang}/>
       
    )
}