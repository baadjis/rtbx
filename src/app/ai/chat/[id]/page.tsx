// app/ai/chat/[id]/page.tsx
import { getLang } from '@/lib/lang/lang-getter';
import { LangType } from '@/lib/lang/types';
import MCPChatClient from '@/app/ai/McpChatClient';
import Layout from '../../layout';

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lang = await getLang() as LangType;

  return ( <Layout lang={lang}>
         <MCPChatClient lang={lang} chatId={id} />
  </Layout>) 

 
}