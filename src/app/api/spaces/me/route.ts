/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * =========================================================
 * GET /api/spaces/me
 * =========================================================
 *
 * Returns all spaces belonging to the authenticated user.
 *
 * Responsibilities:
 *
 * - requires authenticated user
 * - excludes soft-deleted spaces
 * - returns essential fields only (id, slug, entity_name,
 *   space_type, edit_token, avatar_url, theme_color)
 * - ordered by created_at desc
 *
 * This route is safe to expose to:
 *
 * - frontend dashboard
 * - MCP tools (getMySpaces)
 * - mobile applications
 *
 * =========================================================
 */
import { NextResponse } from 'next/server';
import { getMySpaces } from '@/lib/spaces/service';
import { requireUser } from '@/lib/auth/get-user';

export async function GET(request: Request) {
  try {
    const { user, error: authError } = await requireUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: authError }, { status: 401 });
    }

    const { data, error } = await getMySpaces(user.id);
    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('SPACES_ME_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}