// app/ai/settings/integrations/page.tsx
import { getLang } from '@/lib/lang/lang-getter';
import { LangType } from '@/lib/lang/types';
import IntegrationsClient from './IntegrationsClient';

export default async function IntegrationsPage() {
  const lang = await getLang() as LangType;
  return <IntegrationsClient lang={lang} />;
}