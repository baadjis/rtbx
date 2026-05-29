/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/shortener/[code]/stats/route.ts
import { requireUser } from '@/lib/auth/get-user';
import { getLinkStats } from '@/lib/shortener/service';
import { NextResponse } from 'next/server';

/**
 * =========================================================
 * GET /api/shortener/[code]/stats
 * =========================================================
 *
 * Retrieves statistics for a specific shortened link.
 *
 * Responsibilities:
 *
 * - requires authenticated user (owner of the link)
 * - returns clicks, last_clicked_at, created_at, long_url, title, description
 * - returns 404 if link not found or soft-deleted
 *
 * This route is safe to expose to:
 *
 * - frontend link analytics dashboard
 * - MCP tools (getShortLinkStats)
 *
 * =========================================================
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;

    const { user, error: authError } = await requireUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: authError }, { status: 401 });
    }

    const { data, error } = await getLinkStats(code);
    if (error || !data) {
      return NextResponse.json({ success: false, error: 'Link not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('SHORTENER_STATS_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}