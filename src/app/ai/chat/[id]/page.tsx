// app/ai/chat/[id]/page.tsx
import { getLang } from '@/lib/lang/lang-getter';
import { LangType } from '@/lib/lang/types';
import MCPChatClient from '@/app/ai/chat/[id]/McpChatClient';

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lang = (await getLang()) as LangType;
  

  return ( 
         <MCPChatClient lang={lang} chatId={id} />
 ) 

 
}