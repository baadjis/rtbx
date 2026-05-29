/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * =========================================================
 * GET /api/events/me
 * =========================================================
 *
 * Returns all events related to the authenticated user.
 *
 * Responsibilities:
 *
 * - requires authenticated user
 * - returns events organized by the user
 * - returns events the user registered to (matched by email)
 * - returns events the user was invited to (matched by email)
 * - all fetched in parallel for performance
 *
 * This route is safe to expose to:
 *
 * - frontend user dashboard
 * - MCP tools (getMyEvents)
 * - mobile applications
 *
 * =========================================================
 */
import { NextResponse } from 'next/server';
import { getMyEvents } from '@/lib/events/service';
import { requireUser } from '@/lib/auth/get-user';

export async function GET(request:Request) {
  try {
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const { data, error } = await getMyEvents(user.id, user.email!);

    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('EVENT_ME_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}