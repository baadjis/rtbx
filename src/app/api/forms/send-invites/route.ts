/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * =========================================================
 * POST /api/forms/send-invites
 * =========================================================
 * Sends invitation emails to a list of recipients.
 * - requires auth (must be owner)
 * - accepts array of emails
 * - sends via Resend bulk send
 * - MCP tools (sendFormInvites)
 * =========================================================
 */
import { NextResponse } from 'next/server';
import { sendFormInvites } from '@/lib/forms/service';
import { requireUser } from '@/lib/auth/get-user';

export async function POST(request: Request) {
  try {
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const body = await request.json();
    const { data, error } = await sendFormInvites({ ...body, user_id: user.id });
    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('FORM_SEND_INVITES_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}