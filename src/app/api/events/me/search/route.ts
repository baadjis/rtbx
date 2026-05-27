/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * =========================================================
 * GET /api/events/me/search
 * =========================================================
 *
 * Authenticated search for the organizer's own events.
 *
 * Responsibilities:
 *
 * - requires authenticated user (organizer)
 * - filters by title (q), category, org_name, status, date range
 * - always restricts to organizer_id = authenticated user
 * - supports limit/offset pagination
 * - returns events list and total count
 *
 * This route is safe to expose to:
 *
 * - organizer dashboard search/filter UI
 * - MCP tools (searchOrganizerEvents)
 * - automation flows
 *
 * =========================================================
 */
import { NextResponse } from 'next/server';
import { searchOrganizerEvents } from '@/lib/events/service';
import { requireUser } from '@/lib/auth/get-user';

export async function GET(request: Request) {
  try {
    const { user, error: authError } = await requireUser();
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const { searchParams } = new URL(request.url);

    const payload = {
      q: searchParams.get('q') ?? undefined,
      category: searchParams.get('category') ?? undefined,
      org_name: searchParams.get('org_name') ?? undefined,
      status: (searchParams.get('status') as any) ?? undefined,
      start_date: searchParams.get('start_date') ?? undefined,
      end_date: searchParams.get('end_date') ?? undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    };

    const { data, count, error } = await searchOrganizerEvents(payload, user.id);

    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data, count });
  } catch (err: any) {
    console.error('EVENT_ORGANIZER_SEARCH_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}