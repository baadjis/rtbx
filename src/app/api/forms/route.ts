/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * =========================================================
 * GET /api/forms
 * =========================================================
 * Returns all forms for the authenticated user.
 * - requires auth
 * - ordered by created_at desc
 * - MCP tools (getMyForms)
 * =========================================================
 */
import { NextResponse } from 'next/server';
import { createForm, getMyForms } from '@/lib/forms/service';
import { requireUser } from '@/lib/auth/get-user';

export async function GET(request: Request) {
  try {
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const { data, error } = await getMyForms(user.id);
    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('FORMS_GET_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * =========================================================
 *  POST /api/forms
 * =========================================================
 * Creates a new form for the authenticated user.
 * - requires auth
 * - assigns user_id automatically
 * - MCP tools (createForm)
 * =========================================================
 */

export async function POST(request: Request) {
  try {
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const body = await request.json();
    const { data, error } = await createForm({ ...body, user_id: user.id });
    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('FORMS_CREATE_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}