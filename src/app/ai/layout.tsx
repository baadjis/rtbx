import { getLang } from "@/lib/lang/lang-getter";
import AILayoutClient from "./LayoutClient";
import { LangType } from "@/lib/lang/types";
import React from "react";

export default  async function AiLayout ({children}:{children:React.ReactNode}){
    const lang= await getLang() as LangType

    return(<AILayoutClient lang={lang}>
        {children}
    </AILayoutClient>)
    
}