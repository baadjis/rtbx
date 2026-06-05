/*import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function requireUser(request?: Request) {
  // Cas MCP — token Bearer dans le header Authorization
  if (request) {
    const authHeader = request.headers.get('Authorization');
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!user || error) return { user: null, error: 'Unauthorized' };
      return { user, error: null };
    }
  }




  // Cas normal — cookies session
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, error: 'Unauthorized' };
  return { user, error: null };
}*/




import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function requireUser(request?: Request) {
  try {
    // === CAS AGENT / MCP : Bearer Token ===
    if (request) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        
        // Meilleure méthode : utiliser le server client avec le token
        const supabase = await createClient(); // ton server client
        
        // On set manuellement le token pour ce call
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
          console.log("❌ Bearer token invalid via server client:", error?.message);
          return { user: null, error: 'Unauthorized' };
        }

        console.log("✅ Bearer token OK via server client - User:", user.email);
        return { user, error: null };
      }
    }

    // === CAS NORMAL (cookies) ===
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { user: null, error: 'Unauthorized' };
    }

    return { user, error: null };

  } catch (err) {
    console.error("requireUser error:", err);
    return { user: null, error: 'Unauthorized' };
  }
}