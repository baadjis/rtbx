/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * =========================================================
 * GET /api/events/search
 * =========================================================
 *
 * Public search for published events.
 *
 * Responsibilities:
 *
 * - public endpoint (no auth required)
 * - filters by title (q), category, location, org_name, start_date
 * - always restricts to visibility=public and is_published=true
 * - supports limit/offset pagination
 * - returns events list and total count
 *
 * This route is safe to expose to:
 *
 * - public events discovery page
 * - searchbox with filters
 * - MCP tools (searchPublicEvents)
 * - mobile applications
 *
 * =========================================================
 */
import { NextResponse } from 'next/server';
import { searchPublicEvents } from '@/lib/events/service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const payload = {
      q: searchParams.get('q') ?? undefined,
      category: searchParams.get('category') ?? undefined,
      location: searchParams.get('location') ?? undefined,
      org_name: searchParams.get('org_name') ?? undefined,
      start_date: searchParams.get('start_date') ?? undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    };

    const { data, count, error } = await searchPublicEvents(payload);

    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data, count });
  } catch (err: any) {
    console.error('EVENT_PUBLIC_SEARCH_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}