/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * =========================================================
 * GET /api/forms/me
 * =========================================================
 *
 * Returns all forms created by the authenticated user.
 *
 * Responsibilities:
 *
 * - requires authenticated user
 * - returns forms ordered by created_at desc
 * - returns essential fields only
 *
 * This route is safe to expose to:
 *
 * - frontend user dashboard
 * - MCP tools (getMyForms)
 * - mobile applications
 *
 * =========================================================
 */
import { NextResponse } from 'next/server';
import { getMyFormActivity, getMyForms } from '@/lib/forms/service';
import { requireUser } from '@/lib/auth/get-user';

export async function GET(request: Request) {
  try {
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });
     
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 20);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const [created, activity] = await Promise.all([
      getMyForms(user.id,limit,offset),
      getMyFormActivity(user.id, user.email!,limit,offset),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        created: created.data ?? [],
        responded: activity.data?.responded ?? [],
        invited: activity.data?.invited ?? [],
      }
    });
  } catch (err: any) {
    console.error('FORMS_ME_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}