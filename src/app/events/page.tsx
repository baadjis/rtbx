// app/events/page.tsx

import { getLang } from "@/lib/lang/lang-getter";
import EventsPageClient from "./EventsClient";
import { LangType } from "@/lib/lang/types";



export default  async function EventsPage() {
    const lang = await getLang() as LangType
    return(
      <EventsPageClient  lang={lang}/>
    )
}