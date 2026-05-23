// app/mcp/page.tsx
import { getLang } from '@/lib/lang/lang-getter';
import MCPChatClient from './McpChatClient';
import { LangType } from '@/lib/lang/types';


export default async function MCPPage() {
  const lang =  await getLang() as LangType;

  return <MCPChatClient lang={lang} />;
}