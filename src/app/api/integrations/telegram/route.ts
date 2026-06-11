/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createTelegramConfig } from '@/lib/telegram/service';
import { requireUser } from '@/lib/auth/get-user';

export async function POST(request: Request) {
  try {
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const body = await request.json();

    if (!body.chat_id) {
      return NextResponse.json({ success: false, error: 'chat_id required' }, { status: 400 });
    }

    const { data, error } = await createTelegramConfig({
      user_id: user.id,
      chat_id: body.chat_id,
      agent_type: body.agent_type || 'general',
      context_id: body.context_id || null,
      api_key_id: body.api_key_id || null,
    });

    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}