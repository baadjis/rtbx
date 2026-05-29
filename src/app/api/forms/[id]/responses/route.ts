/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * =========================================================
 * GET /api/forms/[id]/responses
 * =========================================================
 * Returns all responses for a specific form.
 * - requires auth (must be owner)
 * - ordered by created_at desc
 * - MCP tools (getFormResponses)
 * =========================================================
 */
import { NextResponse } from 'next/server';
import { getFormResponses } from '@/lib/forms/service';
import { requireUser } from '@/lib/auth/get-user';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const { data, error } = await getFormResponses(id, user.id);
    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('FORM_RESPONSES_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}