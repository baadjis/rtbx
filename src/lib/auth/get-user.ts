import { createClient } from '@/utils/supabase/server';
import { createClient as createClientBrowser } from '@supabase/supabase-js';

export async function requireUser(accessToken?: string) {
  // Cas MCP — token Bearer passé directement
   console.log('requireUser called with token:', !!accessToken);
  
  if (accessToken) {
    console.log('Using Bearer token path');
    const supabase = createClientBrowser(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    console.log('Bearer user:', user?.email, 'error:', error?.message);
    if (!user || error) return { user: null, error: 'Unauthorized' };
    return { user, error: null };
  }

  // Cas normal — cookies session
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, error: 'Unauthorized' };
  return { user, error: null };
}