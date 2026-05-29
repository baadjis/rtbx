/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * =========================================================
 * GET /api/forms/search
 * =========================================================
 * Public search for published forms.
 * - public endpoint (no auth required)
 * - filters by q (title), category
 * - always restricts to is_published=true and visibility=public
 * - supports limit/offset pagination
 * - MCP tools (searchForms)
 * =========================================================
 */
import { NextResponse } from 'next/server';
import { searchForms } from '@/lib/forms/service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const payload = {
      q: searchParams.get('q') ?? undefined,
      category: searchParams.get('category') ?? undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    };

    const { data, count, error } = await searchForms(payload);
    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data, count });
  } catch (err: any) {
    console.error('FORMS_SEARCH_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}