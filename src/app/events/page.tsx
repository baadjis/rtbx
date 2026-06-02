// app/events/page.tsx

import { getLang } from "@/lib/lang/lang-getter";
import EventsPageClient from "./EventsClient";
import { LangType } from "@/lib/lang/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";



export default  async function EventsPage() {
    const lang = await getLang() as LangType
    return(
      <div className="min-h-screen bg-[#fafaf8]">
            <Header />
      <EventsPageClient  lang={lang}/>
      <Footer />
      
      </div>
    )
}