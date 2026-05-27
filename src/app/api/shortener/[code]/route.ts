/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/shortener/[code]/route.ts
import { NextResponse } from 'next/server';
import {
  getLinkByCode,
  deleteLink,
  incrementClicks,
  updateLink
} from '@/lib/shortener/service';
import { requireUser } from '@/lib/auth/get-user';

/**
 * =========================================================
 * GET /api/shortener/[code]
 * =========================================================
 *
 * Retrieves a shortened link by its short code.
 *
 * Responsibilities:
 *
 * - public endpoint (no auth required)
 * - increments click counter on each access
 * - returns full link data including long_url
 * - returns 404 if link not found or soft-deleted
 *
 * This route is safe to expose to:
 *
 * - redirect middleware
 * - MCP tools (getShortLinkStats)
 * - public link preview pages
 *
 * =========================================================
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;

    await incrementClicks(code);

    const { data, error } = await getLinkByCode(code);
    if (error || !data) {
      return NextResponse.json({ success: false, error: 'Link not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('SHORTENER_GET_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * =========================================================
 * PATCH /api/shortener/[code]
 * =========================================================
 *
 * Updates title and description of an existing shortened link.
 *
 * Responsibilities:
 *
 * - requires authenticated user (owner of the link)
 * - validates partial update payload via linkUpdateSchema
 * - only title and description are editable
 * - returns updated link data
 *
 * This route is safe to expose to:
 *
 * - frontend link management dashboard
 * - MCP tools (updateShortLink)
 * - automation flows
 *
 * =========================================================
 */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;

    const { user, error: authError } = await requireUser();
    if (!user) {
      return NextResponse.json({ success: false, error: authError }, { status: 401 });
    }

    const body = await request.json();
    const { data, error } = await updateLink(code, body);

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('SHORTENER_UPDATE_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * =========================================================
 * DELETE /api/shortener/[code]
 * =========================================================
 *
 * Soft deletes a shortened link by setting deleted_at timestamp.
 *
 * Responsibilities:
 *
 * - requires authenticated user (owner of the link)
 * - soft delete only — sets deleted_at, does not remove the row
 * - link becomes inaccessible after deletion
 * - returns success confirmation
 *
 * This route is safe to expose to:
 *
 * - frontend link management dashboard
 * - MCP tools
 *
 * =========================================================
 */
export async function DELETE(
  request: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;

    const { user, error: authError } = await requireUser();
    if (!user) {
      return NextResponse.json({ success: false, error: authError }, { status: 401 });
    }

    const { error } = await deleteLink(code);
    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Link deleted successfully' });
  } catch (err: any) {
    console.error('SHORTENER_DELETE_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}