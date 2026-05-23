
import { getLang } from "@/lib/lang/lang-getter";
import BusinessCreateForm from "./createFormClient";
import { LangType } from "@/lib/lang/types";

export default async function CreateBusinessPage(){
   
    const lang= await getLang() as LangType;
    return(<BusinessCreateForm 
        lang={lang}
    
    />)



}