/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * =========================================================
 * GET /api/spaces/search
 * =========================================================
 *
 * Public search for spaces.
 *
 * Responsibilities:
 *
 * - public endpoint (no auth required)
 * - filters by q (entity_name or slug), space_type, space_subtype
 * - excludes soft-deleted spaces
 * - supports limit/offset pagination
 * - returns spaces list and total count
 *
 * This route is safe to expose to:
 *
 * - public discovery pages
 * - searchbox with filters
 * - MCP tools (searchSpaces)
 * - mobile applications
 *
 * =========================================================
 */
import { NextResponse } from 'next/server';
import { searchSpaces } from '@/lib/spaces/service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const payload = {
      q: searchParams.get('q') ?? undefined,
      space_type: searchParams.get('space_type') ?? undefined,
      space_subtype: searchParams.get('space_subtype') ?? undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    };

    const { data, count, error } = await searchSpaces(payload);

    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data, count });
  } catch (err: any) {
    console.error('SPACES_SEARCH_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}