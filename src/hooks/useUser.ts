// hooks/useUser.ts
'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type UserInfo = {
  initials: string;
  email: string | null;
};

export function useUser() {
  const [userInfo, setUserInfo] = useState<UserInfo>({ initials: '?', email: null });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      const email = user.email || '';
      const initials = email.slice(0, 2).toUpperCase();
      setUserInfo({ initials, email });
    });
  }, []);

  return userInfo;
}