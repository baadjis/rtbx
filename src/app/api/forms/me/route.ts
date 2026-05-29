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
import { getMyForms } from '@/lib/forms/service';
import { requireUser } from '@/lib/auth/get-user';

export async function GET(request: Request) {
  try {
    const { user, error: authError } = await requireUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: authError }, { status: 401 });
    }

    const { data, error } = await getMyForms(user.id);
    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('FORMS_ME_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}