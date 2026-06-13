/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createTelegramConfig } from '@/lib/telegram/service';
import { requireUser } from '@/lib/auth/get-user';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
   console.log('session refresh_token:', session?.refresh_token?.slice(0, 20));
   console.log('session access_token:', session?.access_token?.slice(0, 20));

    const body = await request.json();
    if (!body.chat_id) {
      return NextResponse.json({ success: false, error: 'chat_id required' }, { status: 400 });
    }
   console.log(body.chat_id)
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