// app/ai/settings/page.tsx
import { getLang } from '@/lib/lang/lang-getter';
import { LangType } from '@/lib/lang/types';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
  const lang = await getLang() as LangType;
  return <SettingsClient lang={lang} />;
}