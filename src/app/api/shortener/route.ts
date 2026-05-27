/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/shortener/route.ts
import { NextResponse } from 'next/server';
import { createLink, getUserLinks } from '@/lib/shortener/service';
import { requireUser } from '@/lib/auth/get-user';

/**
 * =========================================================
 * GET /api/shortener
 * =========================================================
 *
 * Retrieves paginated shortened links for the authenticated user.
 *
 * Responsibilities:
 *
 * - requires authenticated user
 * - supports limit (default 10, max 20) and offset for pagination
 * - returns only essential fields (short_code, title, long_url, clicks, created_at)
 * - excludes soft-deleted links
 * - returns total count for pagination
 *
 * Query params:
 * - limit: number (optional, default 10, max 20)
 * - offset: number (optional, default 0)
 *
 * This route is safe to expose to:
 *
 * - frontend links dashboard
 * - MCP tools (getUserShortLinks)
 *
 * =========================================================
 */
export async function GET(request: Request) {
  try {
    const { user, error: authError } = await requireUser();
    if (!user) {
      return NextResponse.json({ success: false, error: authError }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 20);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const { data, error, count } = await getUserLinks(user.id, limit, offset);

    if (error) {
      return NextResponse.json(
        { success: false, error: error || 'Failed to fetch links' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data, count });
  } catch (err: any) {
    console.error('SHORTENER_GET_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * =========================================================
 * POST /api/shortener
 * =========================================================
 *
 * Creates a new shortened URL for the authenticated user.
 *
 * Responsibilities:
 *
 * - requires authenticated user
 * - validates payload via linkCreateSchema
 * - generates short_code or uses custom_alias if provided
 * - checks short_code uniqueness before insert
 * - assigns user_id automatically
 * - returns created link
 *
 * This route is safe to expose to:
 *
 * - frontend link creation form
 * - MCP tools (createShortLink)
 * - automation flows
 *
 * =========================================================
 */
export async function POST(request: Request) {
  try {
    const { user, error: authError } = await requireUser();
    if (!user) {
      return NextResponse.json({ success: false, error: authError }, { status: 401 });
    }

    const body = await request.json();
    const { data, error } = await createLink({ ...body, user_id: user.id });

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('SHORTENER_CREATE_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}