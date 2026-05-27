/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/shortener/[code]/logs/route.ts
import { NextResponse } from 'next/server';
import { getLinkLogs } from '@/lib/shortener/service';
import { requireUser } from '@/lib/auth/get-user';

/**
 * =========================================================
 * GET /api/shortener/[code]/logs
 * =========================================================
 *
 * Retrieves paginated click logs for a shortened link.
 *
 * Responsibilities:
 *
 * - requires authenticated user (owner of the link)
 * - supports limit query param (default 50)
 * - returns click logs with country, referrer, device, browser
 * - resolves short_code to link id before querying logs
 * - returns 400 if link not found or query fails
 *
 * Query params:
 * - limit: number (optional, default 50)
 *
 * This route is safe to expose to:
 *
 * - frontend link analytics dashboard
 * - MCP tools
 *
 * =========================================================
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;

    const { user, error: authError } = await requireUser();
    if (!user) {
      return NextResponse.json({ success: false, error: authError }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') ?? '50');

    const { data, error } = await getLinkLogs(code, limit);
    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('SHORTENER_LOGS_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}