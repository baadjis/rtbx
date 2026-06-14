/* eslint-disable @typescript-eslint/no-explicit-any */
// api/integrations/telegram/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@/utils/supabase/admin';
import { createTelegramConfig } from '@/lib/telegram/service';



export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
      .from('telegram_configs')
      .select('id, chat_id, agent_type, context_id, role, is_active, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: { session } } = await supabase.auth.getSession();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    if (!body.chat_id) {
      return NextResponse.json({ success: false, error: 'chat_id required' }, { status: 400 });
    }

    const { data, error } = await createTelegramConfig({
      user_id: user.id,
      chat_id: body.chat_id,
      agent_type: body.agent_type || 'general',
      context_id: body.context_id || null,
      role: body.role || 'owner',
      refresh_token: session?.refresh_token || null,
    });

    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}