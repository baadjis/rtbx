/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/events/send-invites/route.ts
import { NextResponse } from 'next/server';
import { sendInvite } from '@/lib/events/service';
import { requireUser } from '@/lib/auth/get-user';

export async function POST(request: Request) {
  try {
    const { user, error: authError } = await requireUser();
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const body = await request.json();
    const { data, error } = await sendInvite({ ...body, organizer_id: user.id });

    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('EVENT_SEND_INVITE_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}