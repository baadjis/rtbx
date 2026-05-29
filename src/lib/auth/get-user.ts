import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function requireUser(request?: Request) {
  // Cas MCP — token Bearer dans le header Authorization
  if (request) {
    const authHeader = request.headers.get('Authorization');
    console.log('Auth header:', authHeader?.slice(0, 20));
    console.log('All headers:', Object.fromEntries(request.headers.entries()));
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { user }, error } = await supabase.auth.getUser(token);
      console.log('Bearer user:', user?.email, 'error:', error?.message);
      if (!user || error) return { user: null, error: 'Unauthorized' };
      return { user, error: null };
    }
  }

  // Cas normal — cookies session
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, error: 'Unauthorized' };
  return { user, error: null };
}