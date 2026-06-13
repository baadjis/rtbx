// app/ai/settings/api-keys/page.tsx
import { getLang } from '@/lib/lang/lang-getter';
import { LangType } from '@/lib/lang/types';
import ApiKeysClient from './ApiKeysClient';

export default async function ApiKeysPage() {
  const lang = await getLang() as LangType;
  return <ApiKeysClient lang={lang} />;
}